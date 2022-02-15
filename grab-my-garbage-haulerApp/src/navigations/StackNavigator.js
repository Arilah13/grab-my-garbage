import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch } from 'react-redux'
import socketIO from 'socket.io-client'

import Mapscreen from '../screens/MapScreen'
import Topnavigator from './TopNavigator'
import TabNavigator from './TabNavigator'
import Chatscreen from '../screens/ChatScreen'

import { addSocket } from '../redux/actions/socketActions'

const Stack = createNativeStackNavigator()

const Stacknavigator = () => {

    const dispatch = useDispatch()

    useEffect(async() => {   
        const socket = await socketIO.connect('http://192.168.13.1:5000')
        dispatch(addSocket(socket))
    }, [])

    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = 'HomeScreen' 
                component = {TabNavigator} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name = 'Pickup' 
                component = {Mapscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'History'
                component = {Topnavigator}
                options = {{
                    headerShown: false
                }}
            />  
            <Stack.Screen
                name = 'Chat'
                component = {Chatscreen}
                options = {{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    );
}

export default Stacknavigator
