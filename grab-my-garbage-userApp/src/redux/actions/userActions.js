import axios from 'axios'
import * as actionTypes from '../constants/userConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const Login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: actionTypes.USER_LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }

        const { data } = await axios.post('http://192.168.13.1:5000/users/login', { email, password }, config )

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })

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
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }
        const registerrole = 'user'

        const { name, email, photoUrl } = info

        const { data } = await axios.post('http://192.168.13.1:5000/users/googleregister',
            {name, email, registerrole, photoUrl}, config, 
        ).catch((err) => console.log(err))

        dispatch({
            type: actionTypes.USER_LOGIN_SUCCESS,
            payload: data
        })

        AsyncStorage.setItem('userInfo', JSON.stringify(data))
    } catch (err) {
        dispatch({
            type: actionTypes.USER_REGISTER_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const register = ({name, email, password, image}) => async(dispatch) => {
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

        const { data } = await axios.post('http://192.168.13.1:5000/users/register',
            {name, email, password, registerrole, image}, config, 
        ).catch((err) => console.log(err))

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
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
        }

        const { email } = info

        const { data } = await axios.post('http://192.168.13.1:5000/users/get',
            {email}, config, 
        ).catch((err) => console.log(err))

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

export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.USER_DETAILS_REQUEST,
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`http://192.168.13.1:5000/users/profile/${id}`, config)

        dispatch({
            type: actionTypes.USER_DETAILS_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.USER_DETAILS_FAIL,
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
        
        const { data } = await axios.put(`http://192.168.13.1:5000/users/profile/${userInfo._id}`, user, config)

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

export const deleteUsers = (id) => async (dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.USER_DELETE_REQUEST
        })

        const { userLogin: { userInfo }} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.delete(`/users/${id}`, config)

        dispatch({
            type: actionTypes.USER_DELETE_SUCCESS
        })
    } catch (err) {
        dispatch({
            type: actionTypes.USER_DELETE_FAIL,
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

        const { data } = await axios.put(`http://192.168.13.1:5000/users/profile/password/${userInfo._id}`, {password}, config)

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
    AsyncStorage.removeItem('userInfo')

    dispatch({ type: actionTypes.USER_LOGOUT })
}