import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { getUserDetails } from '../redux/actions/userActions'
import { getConversations } from '../redux/actions/conversationActions'
import { getScheduledPickups } from '../redux/actions/schedulePickupActions'
import { getAcceptedPickups } from '../redux/actions/specialPickupActions'

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

    const retrieveAcceptedPickups = useSelector(state => state.retrieveAcceptedPickups)
    const { loading: acceptedLoading } = retrieveAcceptedPickups

    const retrieveScheduledPickup = useSelector(state => state.retrieveScheduledPickup)
    const { loading: scheduleLoading } = retrieveScheduledPickup

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
            dispatch(getConversations())
            dispatch(getAcceptedPickups())
            dispatch(getScheduledPickups())
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
                    || loading === undefined ||  conversations === true || scheduleLoading === true ||
                    acceptedLoading === true || conversations === undefined || scheduleLoading === undefined || acceptedLoading === undefined) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator;
