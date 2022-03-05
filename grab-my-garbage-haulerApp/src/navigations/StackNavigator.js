import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import socketIO from 'socket.io-client'
import * as TaskManager from 'expo-task-manager'

import Topnavigator from './TopNavigator'
import TabNavigator from './TabNavigator'
import Schedulepickuprequestscreen from '../screens/schedulePickupScreens/schedulePickupRequestScreen'
import Scheduledpickupdetail from '../screens/schedulePickupScreens/schedulePickupDetailScreen'
import Locationscreen from '../screens/schedulePickupScreens/LocationScreen'
import Prepickupscreen from '../screens/prePickupScreen'

import { addSocket } from '../redux/actions/socketActions'
import { addOrigin } from '../redux/actions/mapActions'
import { TASK_FETCH_LOCATION } from '../redux/constants/mapConstants'

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
            const [location] = locations
            //console.log(location)
            dispatch(addOrigin(location.coords.latitude, location.coords.longitude, location.coords.heading))
            skt.emit('online', {haulerid: userInfo._id, 
                latitude: location.coords.latitude, longitude: location.coords.longitude,
                heading: location.coords.heading
            })
        }
    })

    useEffect(async() => {   
        const socket = await socketIO.connect('http://192.168.13.1:5001')
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
