import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { getUserDetails } from '../redux/actions/userActions'
import { getConversations } from '../redux/actions/conversationActions'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()
    
    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, userInfo } = userLogin

    const userDetail = useSelector((state) => state.userDetail)
    const { loading: userDetailLoading } = userDetail

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading: conversations } = getAllConversation

    useEffect(async() => {
        const result = await AsyncStorage.getItem('userInfo')
        if(result !== null) {
            const data = JSON.parse(result)
            dispatch(uploadDetails(data))
            dispatch(getConversations(data._id, data.token))
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
                    || loading === undefined ||  conversations === true) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator;
