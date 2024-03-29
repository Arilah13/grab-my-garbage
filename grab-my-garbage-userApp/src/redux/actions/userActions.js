import axios from 'axios'
import * as actionTypes from '../constants/userConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AuthSession from 'expo-auth-session'

import { getScheduledPickups } from './schedulePickupActions'
import { getAcceptedPickups, getCompletedPickups, getPendingPickups } from './specialPickupActions'
import { getConversations } from './conversationActions'

import { getPushToken } from '../../helpers/notificationHelper'

export const Login = (email, password, notification_token) => async (dispatch) => {
    try {
        dispatch({
            type: actionTypes.USER_LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/users/login', { email, password, notification_token }, config )

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })

        dispatch(getScheduledPickups())
        dispatch(getAcceptedPickups())
        dispatch(getConversations())
        dispatch(getPendingPickups())
        dispatch(getCompletedPickups())

        AsyncStorage.setItem('userInfo', JSON.stringify(data))
    } catch (err) {
        dispatch({
            type: actionTypes.USER_LOGIN_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const specialLogin = (info) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.USER_LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }
        const registerrole = 'user'
        
        const { name, email, picture: photoUrl } = info.user
        const { notification_token } = info
        
        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/users/googleregister',
            {name, email, registerrole, photoUrl, notification_token}, config, 
        )

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })

        dispatch(getScheduledPickups())
        dispatch(getAcceptedPickups())
        dispatch(getConversations())
        dispatch(getPendingPickups())
        dispatch(getCompletedPickups())

        AsyncStorage.setItem('userInfo', JSON.stringify(data))
    } catch (err) {
        dispatch({
            type: actionTypes.USER_LOGIN_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const specialLoginFB = (email, name, notification_token) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.USER_LOGIN_REQUEST
        })
        
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }
        const registerrole = 'user'

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/users/facebookregister',
            {name, email, registerrole, notification_token}, config, 
        )

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })

        dispatch(getScheduledPickups())
        dispatch(getAcceptedPickups())
        dispatch(getConversations())
        dispatch(getPendingPickups())
        dispatch(getCompletedPickups())

        AsyncStorage.setItem('userInfo', JSON.stringify(data))
    } catch (err) {
        dispatch({
            type: actionTypes.USER_LOGIN_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const register = (info) => async(dispatch) => {
    try {
        dispatch({
            type: actionTypes.USER_REGISTER_REQUEST,
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }
        const registerrole = 'user'

        const { name, email, password, image } = info.values
        const { notification_token } = info

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/users/register',
            {name, email, password, registerrole, image, notification_token}, config, 
        )

        dispatch({
            type: actionTypes.USER_REGISTER_SUCCESS
        })

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })
        
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (err) {
        dispatch({
            type: actionTypes.USER_REGISTER_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const uploadDetails = (info) => async (dispatch) => {
    try{
        dispatch({
            type: actionTypes.USER_LOGIN_REQUEST
        })
        
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }

        const { email } = info

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/users/', {email}, config)

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })
        dispatch(getScheduledPickups())
        dispatch(getAcceptedPickups())
        dispatch(getConversations())
        dispatch(getPendingPickups())
        dispatch(getCompletedPickups())
    } catch (err){
        dispatch({
            type: actionTypes.USER_LOGIN_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        
        dispatch({
            type: actionTypes.USER_UPDATE_PROFILE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }
        
        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/users/${userInfo._id}`, user, config)

        dispatch({
            type: actionTypes.USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.USER_UPDATE_PROFILE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const updateUserPassword = (password) => async (dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.USER_UPDATE_PROFILE_REQUEST,
        })

        const { userLogin: { userInfo }} = getState()
        
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/users/password/${userInfo._id}`, {password}, config)

        dispatch({
            type: actionTypes.USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.USER_UPDATE_PROFILE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const logout = () => async (dispatch, getState) => {
    const { userLogin: { userInfo }} = getState()
    
    const token = await AsyncStorage.getItem('gmg:googleToken')
    
    if(token) {
        await AuthSession.revokeAsync({ token: JSON.parse(token) }, { revocationEndpoint: 'https://oauth2.googleapis.com/revoke' })
        await AsyncStorage.removeItem('googleToken')
    }

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        },
    }

    const pushId = await getPushToken()

    axios.put(`https://grab-my-garbage-server.herokuapp.com/users/pushtoken/${userInfo._id}`, {id: pushId}, config)

    AsyncStorage.removeItem('userInfo')

    dispatch({ type: actionTypes.USER_LOGOUT })
}