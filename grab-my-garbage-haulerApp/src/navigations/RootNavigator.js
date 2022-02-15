import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'

import AuthNavigator from './AuthNavigator'
import Stacknavigator from './StackNavigator'

import { uploadDetails } from '../redux/actions/userActions'
import { TASK_FETCH_LOCATION } from '../redux/constants/mapConstants'

const Rootnavigator = () => {

    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(async() => {
        const result = await AsyncStorage.getItem('haulerInfo')
        //console.log(result)
        if(result !== null) {
            dispatch(uploadDetails(JSON.parse(result)))
        }

        Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
            if(value) {
                Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
            }
        })
    }, [])

    return (
        <NavigationContainer>
            {
                userLogin.userInfo === undefined ? (
                    <AuthNavigator />
                ) : (
                    <Stacknavigator />
                )
            }
        </NavigationContainer>
    );
}

export default Rootnavigator
