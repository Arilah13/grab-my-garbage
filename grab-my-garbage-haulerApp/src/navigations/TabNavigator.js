import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'

import Accountscreen from '../screens/accountScreens/accountScreen'
import Homescreen from '../screens/homeScreen'
import Chatmenuscreen from '../screens/chatScreens/chatMenuScreen'
import Topnavigator from './TopNavigator'
import ScheduleTopNavigator from './ScheduleTopNavigator'

import { GET_ALL_CONVERSATIONS_SUCCESS } from '../redux/constants/conversationConstants'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    const [status, setStatus] = useState(false)
    const [first, setFirst] = useState(true)

    const dispatch = useDispatch()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const socketHolder = useSelector((state) => state.socketHolder)
    const { loading: socketLoading, socket } = socketHolder

    const currentConvo = useSelector((state) => state.currentConvo)

    useEffect(() => {
        if(socketLoading === false && first === true && conversation !== undefined) {
            setFirst(false)
            
            socket.on('getMessage', async({senderid, text, sender, createdAt}) => {
                const index = await conversation.findIndex((convo) => convo.conversation.userId._id === senderid)

                if(index >= 0) {
                    const element = await conversation.splice(index, 1)[0]
                    await element

                    element.message.text = text
                    element.message.created = createdAt

                    if(currentConvo.convo === undefined) {
                        element.conversation.receiverHaulerRead = false
                        setStatus(true)
                    } else if(currentConvo.convo !== undefined) {
                        if(currentConvo.convo === senderid) {
                            element.conversation.receiverHaulerRead = true
                        }
                        if(currentConvo.convo !== senderid) {
                            element.conversation.receiverHaulerRead = false
                            setStatus(true)
                        }
                    }

                    const message = {
                        _id: Date.now(),
                        conversationId: element.conversationId,
                        createdAt: createdAt,
                        created: createdAt,
                        sender: [
                            sender._id,
                            sender.name,
                            sender.avatar
                        ],
                        text: text
                    }

                    element.totalMessage.push(message)

                    await conversation.splice(0, 0, element)
                    dispatch({
                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                        payload: conversation
                    })
                }
                else if(index === -1) {
                    const element = {
                        conversation: {
                            _id: createdAt,
                            updatedAt: createdAt,
                            createdAt: createdAt,
                            userId: {
                                _id: sender._id,
                                image: sender.avatar,
                                name: sender.name
                            },
                            receiverHaulerRead: false
                        },
                        message: {
                            created: createdAt,
                            createdAt: createdAt,
                            text: text,
                            _id: Date.now(),
                            conversationId: element.conversationId,
                            sender: [
                                sender._id,
                                sender.name,
                                sender.avatar
                            ]
                        },
                        lastMessage: [{
                            created: createdAt,
                            createdAt: createdAt,
                            text: text,
                            _id: Date.now(),
                            conversationId: element.conversationId,
                            sender: [
                                sender._id,
                                sender.name,
                                sender.avatar
                            ]
                        }]
                    }
                    await conversation.splice(0, 0, element)
                    dispatch({
                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                        payload: conversation
                    })
                }
            }) 
        }
    }, [socket, conversation])

    useEffect(async() => {
        if(conversation !== undefined) {
            const read = await conversation.filter((convo) => {
                return convo.conversation.receiverHaulerRead === false
            })

            if(read.length > 0) {
                setStatus(true)
            } else {
                setStatus(false)
            }
        }
    }, [currentConvo])

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
                        <Icon
                            type = 'material-icons'
                            name = 'chat-bubble-outline'
                            color = {status === true ? 'red' :
                            (focused ? colors.darkBlue : colors.darkGrey) }
                            size = {26}
                        />
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

export default TabNavigator;
