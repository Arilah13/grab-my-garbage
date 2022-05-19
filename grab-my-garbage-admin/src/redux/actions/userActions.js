import axios from 'axios'
import * as actionTypes from '../constants/userConstants'

export const getUsers = () => async (dispatch, getState) => {
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

export const getUserScheduledPickups = (userid) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_USER_SCHEDULE_PICKUP_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/schedulepickup/user/${userid}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_USER_SCHEDULE_PICKUP_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_USER_SCHEDULE_PICKUP_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const getUserSpecialPickups = (userid) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_USER_SPECIAL_PICKUP_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/specialpickup/user/${userid}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_USER_SPECIAL_PICKUP_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_USER_SPECIAL_PICKUP_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const getUserInfo = (userid) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_USER_DETAIL_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/users/${userid}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_USER_DETAIL_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_USER_DETAIL_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const updateUserDetail = (userid, values) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.USER_DETAIL_UPDATE_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { email, name, phone, pic: image } = values

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/admin/users/${userid}`, 
        {email, name, phone, image}, config)
        
        dispatch({
            type: actionTypes.USER_DETAIL_UPDATE_SUCCESS
        })
        dispatch(getUserInfo(userid))
        dispatch(getUsers())
    } catch(err) {
        dispatch({
            type: actionTypes.USER_DETAIL_UPDATE_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const deleteUser = (id) => async(dispatch, getState) => {
    try{
        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(`https://grab-my-garbage-server.herokuapp.com/admin/users/${id}`, config)

        dispatch({
            type: actionTypes.USER_DELETE_SUCCESS
        })
    } catch(err) {
        dispatch({
            type: actionTypes.USER_DELETE_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const getAdminDetails = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_ADMIN_DETAILS_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/users`, config)
        console.log(data)
        dispatch({
            type: actionTypes.RETRIEVE_ADMIN_DETAILS_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_ADMIN_DETAILS_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const updateAdminDetails = (values) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.ADMIN_DETAIL_UPDATE_REQUEST
        })

        const { email, password, pic: image } = values

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`http://192.168.13.1:5000/admin/users`,
        {email, password, image}, config)

        dispatch({
            type: actionTypes.ADMIN_DETAIL_UPDATE_SUCCESS,
        })

        dispatch({
            type: actionTypes.RETRIEVE_ADMIN_DETAILS_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.ADMIN_DETAIL_UPDATE_FAIL,
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

        dispatch({
            type: actionTypes.RETRIEVE_ADMIN_DETAILS_SUCCESS,
            payload: data
        })

        localStorage.setItem('admingarbage', JSON.stringify(data))
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