import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { getConversations } from '../redux/actions/conversationActions'
import { getScheduledPickups } from '../redux/actions/schedulePickupActions'
import { getAcceptedPickups, getCompletedPickups, getPendingPickups } from '../redux/actions/specialPickupActions'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()
    
    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, userInfo } = userLogin

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
        if(first === true && conversations === false) {
            setFirst(false)
        }
    }, [conversations])

    return (
        <NavigationContainer>
            {
                first === true && (loading === true || loading === undefined ||  conversations === true || 
                    scheduleLoading === true || acceptedLoading === true || conversations === undefined || 
                    scheduleLoading === undefined || acceptedLoading === undefined) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator;
