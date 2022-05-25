import React, { useRef, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'

import Accountscreen from '../screens/accountScreens/accountScreen'
import Homescreen from '../screens/homeScreen'
import Chatmenuscreen from '../screens/chatScreens/chatMenuScreen'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    //const status = useRef(false)
    const [status, setStatus] = useState(false)

    const dispatch = useDispatch()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation

    const currentConvo = useSelector((state) => state.currentConvo)

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const updateReadMessage = useSelector((state) => state.updateReadMessage)
    const { success } = updateReadMessage

    useEffect(async() => {
        if(loading === false) {
            const read = await conversation.filter((convo) => {
                return convo.conversation.receiverUserRead === false
            })

            if(read.length > 0) {
                setStatus(true)
            } else {
                setStatus(false)
            }
        }
    }, [conversation])

    useEffect(() => {
        if(socket) {
            if(currentConvo.convo === undefined) {
                socket.on('getMessage', async() => {
                    //status.current = true
                    setStatus(true)
                })
            } else if (currentConvo.convo !== undefined) {
                socket.on('getMessage', async({senderid}) => {
                    if(currentConvo.convo === senderid) {
                        setStatus(false)
                    }
                    if(currentConvo.convo !== senderid) {
                        setStatus(true)
                    }
                    //status.current = true
                    
                })
            }
        }
    }, [socket, currentConvo])

    // useEffect(() => {
    //     if(success && success === true) {
    //         setStatus(false)
    //     }
    // }, [updateReadMessage])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.blue5,
                tabBarInactiveTintColor: colors.blue6,
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: colors.grey8,
                    //borderRadius: 15,
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
                            color = {focused ? colors.darkBlue : colors.darkGrey }
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
