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

        const { data } = await axios.post('http://192.168.13.1:5000/haulers/login', { email, password }, config )

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