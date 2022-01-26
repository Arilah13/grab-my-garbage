import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import StackNavigator from './StackNavigator'
import { uploadDetails } from '../redux/actions/userActions'
import Authnavigator from './AuthNavigator'

const Rootnavigator = () => {
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(async() => {
        const result = await AsyncStorage.getItem('userInfo')
        if(result !== null) {
            dispatch(uploadDetails(JSON.parse(result)))
        }
    }, [])

    return (
        <NavigationContainer>
            {
                userLogin.userInfo === undefined ? (
                    <Authnavigator />
                ) : (
                    <StackNavigator />
                )
            }
        </NavigationContainer>
    );
}

export default Rootnavigator;
