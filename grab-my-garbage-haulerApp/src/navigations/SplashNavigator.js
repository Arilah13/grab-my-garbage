import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import * as TaskManager from 'expo-task-manager'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { addOrigin } from '../redux/actions/mapActions'
import { TASK_FETCH_LOCATION } from '../redux/constants/mapConstants'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()

    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading } = userLogin

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading: conversations } = getAllConversation

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading: upcomingLoading } = upcomingPickups

    const scheduledPickups = useSelector((state) => state.retrieveSchedulePickup)
    const { loading: scheduleLoading } = scheduledPickups

    useEffect(async() => {
        const result = await AsyncStorage.getItem('haulerInfo')
        const location = await AsyncStorage.getItem('userLocation')
        
        if(result !== null) {
            const data = JSON.parse(result)
            dispatch(uploadDetails(data))
        } else if(result === null) {
            setFirst(false)
        }
        
        if(location) {
            const parse = await JSON.parse(location)
            dispatch(addOrigin(parse.latitude, parse.longitude, parse.heading))
        }
    }, [])

    useEffect(() => {
        if(first === true && conversations === false) {
            setFirst(false)
        }
    }, [conversations])

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
        }
    })

    return (
        <NavigationContainer>
            {
                first === true && (loading === true || loading === undefined || conversations === true ||
                    scheduleLoading === true || upcomingLoading === true ||
                    conversations === undefined || upcomingLoading === undefined || scheduleLoading === undefined) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator
