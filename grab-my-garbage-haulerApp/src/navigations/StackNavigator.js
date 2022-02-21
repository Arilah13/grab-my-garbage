import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch } from 'react-redux'
import socketIO from 'socket.io-client'

import specialpickupscreen from '../screens/specialPickupScreens/specialPickupScreen'
import Topnavigator from './TopNavigator'
import TabNavigator from './TabNavigator'
import Chatscreen from '../screens/ChatScreen'
import Prerequestscreen from '../screens/preRequestScreen'
import Schedulepickuprequestscreen from '../screens/schedulePickupScreens/schedulePickupRequestScreen'
import Scheduledpickupdetail from '../screens/schedulePickupScreens/schedulePickupDetailScreen'
import Locationscreen from '../screens/schedulePickupScreens/LocationScreen'
import Scheduledpickupscreen from '../screens/schedulePickupScreens/scheduledPickupScreen'
import Prepickupscreen from '../screens/prePickupScreen'

import { addSocket } from '../redux/actions/socketActions'

const Stack = createNativeStackNavigator()

const Stacknavigator = () => {

    const dispatch = useDispatch()

    useEffect(async() => {   
        const socket = await socketIO.connect('https://grab-my-garbage-socket.herokuapp.com/')
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
                name = 'PrePickup' 
                component = {Prepickupscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name = 'SpecialPickup' 
                component = {specialpickupscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name = 'SchedulePickup' 
                component = {Scheduledpickupscreen} 
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
            <Stack.Screen
                name = 'Request'
                component = {Prerequestscreen}
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'Schedule'
                component = {Schedulepickuprequestscreen}
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'ScheduleDetail'
                component = {Scheduledpickupdetail}
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'Location'
                component = {Locationscreen}
                options = {{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    );
}

export default Stacknavigator
