import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import AuthNavigator from './AuthNavigator'
import TabNavigator from './TabNavigator';

const Rootnavigator = () => {

    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(async() => {
        const result = await AsyncStorage.getItem('userInfo')
        //console.log(result)
        if(result !== null) {
            dispatch(uploadDetails(JSON.parse(result)))
        }
    }, [])

    return (
        <NavigationContainer>
            {
                userLogin.userInfo === undefined ? (
                    <AuthNavigator />
                ) : (
                    <TabNavigator />
                )
            }
        </NavigationContainer>
    );
}

export default Rootnavigator
