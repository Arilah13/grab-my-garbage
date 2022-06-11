import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { addOrigin } from '../redux/actions/mapActions'
import { getScheduledPickups } from '../redux/actions/scheduleRequestActions'
import { getCompletedPickups, getPendingPickupsOffline, getUpcomingPickups } from '../redux/actions/specialRequestActions'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()

    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading } = userLogin

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket: skt } = socketHolder

    const completedPickups = useSelector((state) => state.completedPickups)
    const { loading: completed } = completedPickups

    const pendingPickups = useSelector((state) => state.pendingPickups)
    const { loading: pending } = pendingPickups

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading: upcoming } = upcomingPickups

    const scheduledPickups = useSelector((state) => state.retrieveSchedulePickup)
    const { loading: schedule } = scheduledPickups

    useEffect(async() => {
        const result = await AsyncStorage.getItem('haulerInfo')
        const location = await AsyncStorage.getItem('userLocation')
        
        if(result !== null) {
            const data = JSON.parse(result)
            dispatch(uploadDetails(data))
            dispatch(getCompletedPickups(data._id, data.token))
            dispatch(getPendingPickupsOffline(data._id, data.token))
            dispatch(getUpcomingPickups(data._id, data.token))
            dispatch(getScheduledPickups(data._id, data.token))
        } else if(result === null) {
            setFirst(false)
        }
        
        if(location) {
            const parse = await JSON.parse(location)
            dispatch(addOrigin(parse.latitude, parse.longitude, parse.heading))
        }
    }, [])

    useEffect(() => {
        if(loading === false) {
            setFirst(false)
        }
    }, [loading])

    return (
        <NavigationContainer>
            {
                first === true && (loading === true || loading === undefined || upcoming === true || 
                    pending === true || completed === true || schedule === true) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator
