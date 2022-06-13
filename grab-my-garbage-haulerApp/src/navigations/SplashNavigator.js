import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { uploadDetails } from '../redux/actions/userActions'
import { addOrigin } from '../redux/actions/mapActions'
import { getConversations } from '../redux/actions/conversationActions'

import Splashscreen from '../screens/authScreens/splashScreen'
import Rootnavigator from './RootNavigator'

const Splashnavigator = () => {
    const dispatch = useDispatch()

    const [first, setFirst] = useState(true)

    const userLogin = useSelector((state) => state.userLogin)
    const { loading } = userLogin

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading: conversations } = getAllConversation

    useEffect(async() => {
        const result = await AsyncStorage.getItem('haulerInfo')
        const location = await AsyncStorage.getItem('userLocation')
        
        if(result !== null) {
            const data = JSON.parse(result)
            dispatch(uploadDetails(data))
            dispatch(getConversations(data._id, data.token))
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
                first === true && (loading === true || loading === undefined || conversations === true) ? (
                    <Splashscreen />
                ) : (
                    <Rootnavigator setFirst = {setFirst} first = {first} />
                )
            }
        </NavigationContainer>
    );
}

export default Splashnavigator
