import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'

import Accountscreen from '../screens/accountScreens/accountScreen'
import Homescreen from '../screens/homeScreen'
import Prerequestscreen from '../screens/preRequestScreen'
import Chatmenuscreen from '../screens/chatScreens/chatMenuScreen'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    const status = useRef(false)

    const dispatch = useDispatch()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    useEffect(async() => {
        if(loading === false) {
            const read = await conversation.map((convo) => {
                return convo.conversation.receiverRead
            })
            console.log(read)
            if(read.some(item => item !== true)) {
                status.current = true
            } else {
                status.current = false
            }
        }
    }, [conversation, dispatch])

    useEffect(() => {
        if(socket) {
            socket.on('getMessage', async() => {
                status.current = true
            })
        }
    }, [socket])
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
                name = 'Pickup'
                component = {Prerequestscreen}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material'
                            name = 'local-shipping'
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
                            color = {status.current === true ? (focused ? 'red' : 'red') :
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
