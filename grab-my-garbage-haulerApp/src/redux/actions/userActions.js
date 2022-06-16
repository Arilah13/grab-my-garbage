import axios from 'axios'
import * as actionTypes from '../constants/userConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getScheduledPickups } from './scheduleRequestActions'
import { getUpcomingPickups } from './specialRequestActions'
import { getConversations } from './conversationActions'

export const Login = ({email, password, pushId}) => async (dispatch) => {
    try {
        dispatch({
            type: actionTypes.USER_LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/haulers/login', { email, password, pushId }, config )

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })
        dispatch(getScheduledPickups())
        dispatch(getUpcomingPickups())
        dispatch(getConversations())

        AsyncStorage.setItem('haulerInfo', JSON.stringify(data))
    } catch (err) {
        dispatch({
            type: actionTypes.USER_LOGIN_FAIL,
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

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/haulers/',
            {email}, config, 
        )

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })
    } catch (err){
        dispatch({
            type: actionTypes.USER_LOGIN_FAIL,
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

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/haulers/password/${userInfo._id}`, {password}, config)

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

export const logout = () => async (dispatch) => {
    AsyncStorage.removeItem('haulerInfo')

    dispatch({ type: actionTypes.USER_LOGOUT })
}