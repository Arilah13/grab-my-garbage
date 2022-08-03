import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'

import Accountscreen from '../screens/accountScreens/accountScreen'
import Homescreen from '../screens/homeScreen'
import Chatmenuscreen from '../screens/chatScreens/chatMenuScreen'
import Topnavigator from './TopNavigator'
import ScheduleTopNavigator from './ScheduleTopNavigator'

import { GET_ALL_CONVERSATIONS_SUCCESS } from '../redux/constants/conversationConstants'
import { conversationReceived } from '../redux/actions/conversationActions'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    const [number, setNumber] = useState(0)
    const [start, setStart] = useState(true)

    const dispatch = useDispatch()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const currentConvo = useSelector((state) => state.currentConvo)
    const { convo } = currentConvo

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(async() => {
        if(socket && start === true) {
            if(start === true) {
                setStart(false)
            }
            
            socket.on('getMessage', async({senderid, text, sender, createdAt, image, current, conversationId}) => {
                const index = await conversation.findIndex((convo) => convo.conversation.userId._id === senderid)
                
                if(index >= 0) {
                    const element = await conversation.splice(index, 1)[0]
                    element.conversation.haulerVisible = true

                    if(current && current === element.conversation._id) {
                        element.conversation.receiverHaulerRead = true

                        const message1 = {
                            _id: Date.now(),
                            conversationId: element.conversationId,
                            createdAt: createdAt,
                            created: createdAt,
                            sender: [
                                sender._id,
                                sender.name,
                                sender.avatar
                            ],
                            text: text && text,
                            image: image && image !== 'data:image/png;base64,undefined' && image,
                            userSeen: true,
                            haulerSeen: true,
                            received: true
                        }
                        await element.totalMessage.push(message1)
                    } else {
                        element.conversation.receiverHaulerRead = false

                        const message2 = {
                            _id: Date.now(),
                            conversationId: element.conversationId,
                            createdAt: createdAt,
                            created: createdAt,
                            sender: [
                                sender._id,
                                sender.name,
                                sender.avatar
                            ],
                            text: text && text,
                            image: image && image !== 'data:image/png;base64,undefined' && image,
                            userSeen: true,
                            haulerSeen: false,
                            received: true
                        }
                        await element.totalMessage.push(message2)
                    }          

                    await conversation.splice(0, 0, element)
                    dispatch({
                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                        payload: conversation
                    })

                    if(!current || current !== element.conversation._id) {
                        const read = await conversation.filter((convo) => {
                            return convo.conversation.receiverHaulerRead === false
                        })

                        setNumber(read.length)
                    }
                }
                else if(index === -1) {
                    const element = {
                        conversation: {
                            _id: conversationId,
                            updatedAt: createdAt,
                            createdAt: createdAt,
                            userId: {
                                _id: sender._id,
                                image: sender.avatar,
                                name: sender.name
                            },
                            receiverHaulerRead: false,
                            receiverUserRead: true,
                            userVisible: true,
                            haulerVisible: true
                        },
                        totalMessage: [{
                            created: createdAt,
                            createdAt: createdAt,
                            text: text && text,
                            image: image && image !== 'data:image/png;base64,undefined' && image,
                            _id: Date.now(),
                            conversationId: conversationId,
                            sender: [
                                sender._id,
                                sender.name,
                                sender.avatar
                            ],
                            userSeen: true,
                            haulerSeen: false,
                            received: true
                        }]
                    }
                    await conversation.splice(0, 0, element)
                    dispatch({
                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                        payload: conversation
                    })

                    const read = await conversation.filter((convo) => {
                        return convo.conversation.receiverHaulerRead === false
                    })

                    setNumber(read.length)
                }
            })

            socket.on('messageReceived', async({conversationId}) => {
                dispatch(conversationReceived(conversationId))
                const index = await conversation.findIndex((convo) => convo.conversation._id === conversationId)
                const element = await conversation.splice(index, 1)[0]
                await element.totalMessage.map(msg => {
                    msg.received = true
                })
                await conversation.splice(index, 0, element)
                dispatch({
                    type: GET_ALL_CONVERSATIONS_SUCCESS,
                    payload: conversation
                })
            }) 

            socket.on('messageSeen', async({conversationId}) => {
                const index = await conversation.findIndex((convo) => convo.conversation._id === conversationId)
                const element = await conversation.find(convo => convo.conversation._id === conversationId)
                if(element) {
                    await conversation.splice(index, 1)[0]
                    await element.totalMessage.map(msg => msg.userSeen = true)
                    await conversation.splice(index, 0, element)
                    dispatch({
                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                        payload: conversation
                    })
                }
            })

            const convo = await conversation.filter(convo => convo.totalMessage[convo.totalMessage.length - 1].received === false && convo.totalMessage[convo.totalMessage.length - 1].sender[0] !== userInfo._id)
            if(convo.length > 0) {
                await convo.map((con, index) => {
                    setTimeout(() => {
                        socket.emit('messageDelayReceived', {id: con.conversation._id, receiverId: con.conversation.userId._id, senderRole: 'hauler'})
                    }, 1000*index)
                })
            }
        }
    }, [socket])

    useEffect(async() => {
        const read = await conversation.filter((convo) => {
            return convo.conversation.receiverHaulerRead === false
        })

        setNumber(read.length)
    }, [convo])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.darkBlue,
                tabBarInactiveTintColor: colors.darkBlue,
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: colors.grey8,
                    height: 50
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    bottom: 4
                },
                tabBarShowLabel: false,
                headerShown: false,
            }}
            initialRouteName = 'Home'
        >
            <Tab.Screen
                name = 'Home'
                component = {Homescreen}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material'
                            name = 'explore'
                            color = {focused ? colors.darkBlue : colors.darkGrey }
                            size = {30}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name = 'Schedule'
                component = {ScheduleTopNavigator}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material'
                            name = 'departure-board'
                            color = {focused ? colors.darkBlue : colors.darkGrey }
                            size = {30}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name = 'Special'
                component = {Topnavigator}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material'
                            name = 'local-shipping'
                            color = {focused ? colors.darkBlue : colors.darkGrey }
                            size = {30}
                        />
                    )
                }}
            />

            <Tab.Screen
                name = 'Chat'
                component = {Chatmenuscreen}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <View style = {{flex:1, alignItems: 'center',  justifyContent:'center'}}>
                            <Icon
                                type = 'material-icons'
                                name = 'chat-bubble-outline'
                                color = {focused ? colors.darkBlue : colors.darkGrey}
                                size = {26}
                            />
                            {
                                number > 0 &&
                                <View style = {styles.unread}>
                                    <Text style = {styles.textUnread}>{number}</Text>
                                </View>
                            }
                        </View>
                    )
                }}
            />

            <Tab.Screen
                name = 'Account'
                component = {Accountscreen}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material-icons'
                            name = 'account-circle'
                            color = {focused ? colors.darkBlue : colors.darkGrey }
                            size = {30}
                        />
                    )
                }}
            /> 
        </Tab.Navigator>
    );
}

export default TabNavigator

const styles = StyleSheet.create({

    unread: {
        position: 'absolute',
        backgroundColor: 'red',
        width: 14,
        height: 14,
        borderRadius: 15 / 2,
        left: 15,
        top: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textUnread:{
        alignItems: 'center',
        justifyContent: 'center',
        color: "#FFFFFF",
        fontSize: 8,
    }

})
