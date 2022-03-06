import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'

import { uploadDetails } from '../redux/actions/userActions'
import { TASK_FETCH_LOCATION } from '../redux/constants/mapConstants'
import { addOrigin } from '../redux/actions/mapActions'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()

    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, userInfo } = userLogin

    useEffect(async() => {
        const result = await AsyncStorage.getItem('haulerInfo')
        const location = await AsyncStorage.getItem('userLocation')
        
        if(result !== null) {
            dispatch(uploadDetails(JSON.parse(result)))
        } else if(result === null) {
            setFirst(false)
        }
        
        if(location === true) {
            const parse = await JSON.parse(location)
            dispatch(addOrigin(parse.latitude, parse.longitude, parse.heading))
        }

        Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
            if(value) {
                Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
            }
        })
    }, [])

    useEffect(() => {
        if(loading === false) {
            setFirst(false)
        }
    }, [loading])

    return (
        <NavigationContainer>
            {
                first === true && (loading === true) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator
