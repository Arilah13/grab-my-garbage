import axios from 'axios'
import * as actionTypes from '../constants/userConstants'

export const getUsers = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_USER_LIST_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('https://grab-my-garbage-server.herokuapp.com/admin/users/list', config)

        dispatch({
            type: actionTypes.RETRIEVE_USER_LIST_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_USER_LIST_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const adminLogin = (values) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.ADMIN_LOGIN_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { email, password } = values

        const { data } = await axios.post(`https://grab-my-garbage-server.herokuapp.com/admin/users`,
        {email, password}, config)

        dispatch({
            type: actionTypes.ADMIN_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('admingarbage', JSON.stringify(values))
    } catch(err) {
        dispatch({
            type: actionTypes.ADMIN_LOGIN_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const logout = () => async(dispatch) => {
    localStorage.removeItem('admingarbage')

    dispatch({
        type: actionTypes.ADMIN_LOGOUT
    })
}