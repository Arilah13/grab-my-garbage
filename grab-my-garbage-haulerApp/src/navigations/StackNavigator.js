import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import socketIO from 'socket.io-client'

import { addSocket } from '../redux/actions/socketActions'

import TabNavigator from './TabNavigator'
import Scheduledpickupdetail from '../screens/schedulePickupScreens/schedulePickupDetailScreen'
import Changepasswordscreen from '../screens/accountScreens/changePasswordScreen'
import Chatscreen from '../screens/chatScreens/chatScreen'
import NotificationScreen from '../screens/notificationScreen'

const Stack = createNativeStackNavigator()

const Stacknavigator = () => {
    const dispatch = useDispatch()

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket: skt } = socketHolder

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const map = useSelector((state) => state.map)
    const { origin } = map

    useEffect(() => {
        if(skt) {
            skt.emit('online', {haulerid: userInfo._id, 
                latitude: origin.latitude, longitude: origin.longitude,
                heading: origin.heading
            })
        }
    }, [origin])

    useEffect(async() => {   
        // const socket = await socketIO.connect('https://grab-my-garbage-socket.herokuapp.com/', {
        //     reconnection: true
        // })
        const socket = await socketIO.connect('http://192.168.13.1:5001', {
            reconnection: true
        })
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
                name = 'ScheduleDetail'
                component = {Scheduledpickupdetail}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Changepassword'
                component = {Changepasswordscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Message'
                component = {Chatscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Notifications'
                component = {NotificationScreen}
                options = {{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default Stacknavigator
