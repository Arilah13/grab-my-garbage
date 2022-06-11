import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { getUserDetails } from '../redux/actions/userActions'
import { getAcceptedPickups, getCompletedPickups, getPendingPickups } from '../redux/actions/specialPickupActions'
import { getScheduledPickups } from '../redux/actions/schedulePickupActions'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()
    
    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, userInfo } = userLogin

    const userDetail = useSelector((state) => state.userDetail)
    const { loading: userDetailLoading, user } = userDetail

    const retrieveAcceptedPickups = useSelector(state => state.retrieveAcceptedPickups)
    const { loading: accepted } = retrieveAcceptedPickups

    const retrieveCompletedPickups = useSelector(state => state.retrieveCompletedPickups)
    const { loading: completed } = retrieveCompletedPickups

    const retrievePendingPickups = useSelector(state => state.retrievePendingPickups)
    const { loading: pending } = retrievePendingPickups

    const retrieveScheduledPickup = useSelector(state => state.retrieveScheduledPickup)
    const { loading: scheduled } = retrieveScheduledPickup

    useEffect(async() => {
        const result = await AsyncStorage.getItem('userInfo')
        if(result !== null) {
            const data = JSON.parse(result)
            dispatch(uploadDetails(data))
            dispatch(getAcceptedPickups(data._id, data.token))
            dispatch(getCompletedPickups(data._id, data.token))
            dispatch(getPendingPickups(data._id, data.token))
            dispatch(getScheduledPickups(data._id, data.token))
        } else if(result === null) {
            setFirst(false)
        }
    }, [])

    useEffect(() => {
        if(userInfo !== undefined) {
            dispatch(getUserDetails(userInfo._id))
        }
    }, [userInfo])

    useEffect(() => {
        if(userDetailLoading === false) {
            setFirst(false)
        }
    }, [userDetailLoading])

    return (
        <NavigationContainer>
            {
                first === true && (userDetailLoading === true || loading === true || userDetailLoading === undefined
                    || loading === undefined || accepted === true || completed === true || pending === true || loading === true) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator;
