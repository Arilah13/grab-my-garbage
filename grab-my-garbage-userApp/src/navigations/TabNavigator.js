import React, { useEffect, useState, useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import axios from 'axios'

import { colors } from '../global/styles'

import Accountscreen from '../screens/accountScreens/accountScreen'
import Homescreen from '../screens/homeScreen'
import Chatmenuscreen from '../screens/chatScreens/chatMenuScreen'
import NotificationScreen from '../screens/notificationScreen'

import { GET_ALL_CONVERSATIONS_SUCCESS } from '../redux/constants/conversationConstants'
import { USER_LOGIN_SUCCESS } from '../redux/constants/userConstants'
import { conversationReceived } from '../redux/actions/conversationActions'

const Tab = createBottomTabNavigator()

const TabNavigator = ({navigation, route}) => {
    const [number, setNumber] = useState(0)
    const [start, setStart] = useState(true)
    const [noti, setNoti] = useState(0)

    const dispatch = useDispatch()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const currentConvo = useSelector((state) => state.currentConvo)
    const { convo } = currentConvo

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const routeName = getFocusedRouteNameFromRoute(route)

    const checkNotification = async() => {
        let read = []
        await userInfo.notification.map((noti) => {
            noti.data.map(noti => {
                if(noti.seen === false) {
                    read.push(noti)
                }
            })
        })
        setNoti(read.length)
    }

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        },
    }

    const handleNotification = async() => {
        setNoti(0)
        await userInfo.notification.map(noti => {
            noti.data.map(noti => noti.seen = true)
        })
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        })
        await axios.put(`https://grab-my-garbage-server.herokuapp.com/users/notification/read/${userInfo._id}`, config)
    }

    useLayoutEffect(() => {
        if(routeName === 'Notification') {
            handleNotification()
        } 
    }, [route])

    useEffect(() => {
        checkNotification()
    }, [])

    useEffect(async() => {
        if(socket && start === true) {    
            if(start === true) {
                setStart(false)
            }   

            socket.on('getMessage', async({senderid, text, sender, createdAt, image, current, conversationId}) => {
                const index = await conversation.findIndex((convo) => convo.conversation.haulerId._id === senderid)
                
                if(index >= 0) {
                    const element = await conversation.splice(index, 1)[0]

                    element.conversation.userVisible = true
                
                    if(current && current === element.conversation._id) {
                        element.conversation.receiverUserRead = true

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
                        element.conversation.receiverUserRead = false 

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
                            userSeen: false,
                            haulerSeen: true,
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
                            return convo.conversation.receiverUserRead === false
                        })
    
                        setNumber(read.length)
                    } 
                }
                else {
                    const element = {
                        conversation: {
                            _id: conversationId,
                            updatedAt: createdAt,
                            createdAt: createdAt,
                            haulerId: {
                                _id: sender._id,
                                image: sender.avatar,
                                name: sender.name
                            },
                            receiverUserRead: false,
                            receiverHaulerRead: true,
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
                            userSeen: false,
                            haulerSeen: true,
                            received: true
                        }]
                    }
                    await conversation.splice(0, 0, element)
                    dispatch({
                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                        payload: conversation
                    })

                    const read = await conversation.filter((convo) => {
                        return convo.conversation.receiverUserRead === false
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
                    await element.totalMessage.map(msg => msg.haulerSeen = true)
                    await conversation.splice(index, 0, element)
                    dispatch({
                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                        payload: conversation
                    })
                }
            })

            socket.on('newNotification', async({description, userVisible, seen, data, id}) => {
                const result = {description, userVisible, seen, data, id}
                const noti = await userInfo.notification.find(noti => noti.date === new Date().toISOString().split('T')[0])
                if(noti) {
                    const index = await userInfo.notification.findIndex(noti => noti.date === new Date().toISOString().split('T')[0])
                    const element = await userInfo.notification.splice(index, 1)[0]
                    await element.data.push(result)
                    await userInfo.notification.splice(index, 0, element)
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        payload: userInfo
                    })
                    checkNotification()
                } else {
                    const notification = {
                        date: new Date().toISOString().split('T')[0],
                        data: [{description, userVisible, seen, data, id}]
                    }
                    await userInfo.notification.splice(0, 0, notification)
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        payload: userInfo
                    })
                    checkNotification()
                }
            })

            const convo = await conversation.filter(convo => convo.totalMessage[convo.totalMessage.length - 1].received === false && convo.totalMessage[convo.totalMessage.length - 1].sender[0] !== userInfo._id)
            if(convo.length > 0) {
                await convo.map((con, index) => {
                    setTimeout(() => {
                        socket.emit('messageDelayReceived', {id: con.conversation._id, receiverId: con.conversation.haulerId._id, senderRole: 'user'})
                        dispatch(conversationReceived(con.conversation._id))
                    }, 1000*index)
                })
            }
        }
    }, [socket])

    useEffect(async() => {
        const read = await conversation.filter((convo) => {
            return convo.conversation.receiverUserRead === false
        })

        setNumber(read.length)
    }, [convo])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.blue5,
                tabBarInactiveTintColor: colors.blue6,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: colors.grey8,
                    height: 50
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    bottom: 4
                },
                tabBarShowLabel: false,
                headerShown: false
            }}
            initialRouteName = 'Home'
        >
            <Tab.Screen
                name = 'HomeScreen'
                component = {Homescreen}
                options = {{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material-community'
                            name = 'home'
                            color = {focused ? colors.darkBlue : colors.darkGrey}
                            size = {30}
                        />
                    ),
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
                name = 'Notification'
                component = {NotificationScreen}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <View style = {{flex:1, alignItems: 'center',  justifyContent:'center'}}>
                            <Icon
                                type = 'material'
                                name = 'notifications'
                                color = {focused ? colors.darkBlue : colors.darkGrey}
                                size = {30}
                            />
                            {
                                noti > 0 &&
                                <View style = {styles.unread}>
                                    <Text style = {styles.textUnread}>{noti}</Text>
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
                            color = {focused ? colors.darkBlue : colors.darkGrey}
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
