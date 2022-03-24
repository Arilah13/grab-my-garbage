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

import Topnavigator from './TopNavigator'
import TabNavigator from './TabNavigator'
import Schedulepickuprequestscreen from '../screens/schedulePickupScreens/schedulePickupRequestScreen'
import Scheduledpickupdetail from '../screens/schedulePickupScreens/schedulePickupDetailScreen'
import Locationscreen from '../screens/schedulePickupScreens/locationScreen'
import Prepickupscreen from '../screens/prePickupScreen'

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

    BackgroundFetch.registerTaskAsync(TASK_FETCH_LOCATION, {
        minimumInterval: 20,
        startOnBoot: false,
        stopOnTerminate: true
    })

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
                name = 'History'
                component = {Topnavigator}
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
