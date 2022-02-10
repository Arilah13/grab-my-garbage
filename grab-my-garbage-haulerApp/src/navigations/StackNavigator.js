import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch } from 'react-redux'
import socketIO from 'socket.io-client'

import Mapscreen from '../screens/MapScreen'
import Topnavigator from './TopNavigator'
import TabNavigator from './TabNavigator'
import { addSocket } from '../redux/actions/requestActions'

const Stack = createNativeStackNavigator()

const Stacknavigator = () => {

    const dispatch = useDispatch()

    useEffect(async() => {   
        const socket = await socketIO.connect('https://grab-my-garbage-server.herokuapp.com')
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

        </Stack.Navigator>
    );
}

export default Stacknavigator
