import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { getUserDetails } from '../redux/actions/userActions'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()
    
    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, userInfo } = userLogin

    const userDetail = useSelector((state) => state.userDetail)
    const { loading: userDetailLoading, user } = userDetail

    useEffect(async() => {
        const result = await AsyncStorage.getItem('userInfo')
        if(result !== null) {
            dispatch(uploadDetails(JSON.parse(result)))
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
                first === true && (userDetailLoading === true || loading === true) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator;
