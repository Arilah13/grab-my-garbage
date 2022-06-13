import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import socketIO from 'socket.io-client'
import * as TaskManager from 'expo-task-manager'
import * as BackgroundFetch from 'expo-background-fetch'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { addSocket } from '../redux/actions/socketActions'
import { addOrigin } from '../redux/actions/mapActions'
import { TASK_FETCH_LOCATION } from '../redux/constants/mapConstants'

import TabNavigator from './TabNavigator'
import Scheduledpickupdetail from '../screens/schedulePickupScreens/schedulePickupDetailScreen'
import Prepickupscreen from '../screens/prePickupScreen'
import Changepasswordscreen from '../screens/accountScreens/changePasswordScreen'
import Chatscreen from '../screens/chatScreens/chatScreen'

const Stack = createNativeStackNavigator()

const Stacknavigator = () => {
    const dispatch = useDispatch()

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket: skt } = socketHolder

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    TaskManager.defineTask(TASK_FETCH_LOCATION, async({data, err}) => {
        if(err) {
            console.log(err)
            return
        }
        if(data) {
            const { locations } = data
            const [location] = await locations
            
            dispatch(addOrigin(location.coords.latitude, location.coords.longitude, location.coords.heading))
            AsyncStorage.setItem('userLocation', JSON.stringify(location.coords))
            skt.emit('online', {haulerid: userInfo._id, 
                latitude: location.coords.latitude, longitude: location.coords.longitude,
                heading: location.coords.heading
            })
        }
    })

    // BackgroundFetch.registerTaskAsync(TASK_FETCH_LOCATION, {
    //     minimumInterval: 20,
    //     startOnBoot: false,
    //     stopOnTerminate: true
    // })

    useEffect(async() => {   
        const socket = await socketIO.connect('https://grab-my-garbage-socket.herokuapp.com/', {
            reconnection: true
        })
        // const socket = await socketIO.connect('http://192.168.13.1:5001', {
        //     reconnection: true
        // })
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

        </Stack.Navigator>
    );
}

export default Stacknavigator
