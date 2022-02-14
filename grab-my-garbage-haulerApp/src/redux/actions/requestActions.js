import axios from 'axios'
import * as actionTypes from '../constants/requestConstants'

export const getPendingPickups = (latitude, longitude) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/pendingPickup/${latitude}/${longitude}/${userInfo._id}`, 
        config)

        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const getPendingPickupsOffline = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/pendingOfflinePickup/${userInfo._id}`, 
        config)

        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const getUpcomingPickups = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.UPCOMING_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/upcomingPickup/${userInfo._id}`, 
        config)

        dispatch({
            type: actionTypes.UPCOMING_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.UPCOMING_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const getCompletedPickups = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.COMPLETED_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/completedPickup/${userInfo._id}`, 
        config)

        dispatch({
            type: actionTypes.COMPLETED_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.COMPLETED_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const declinePickup = (id) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/request/declinePickup/${id}`, {id: userInfo._id},
        config)

        dispatch({
            type: actionTypes.DECLINE_PICKUP_SUCCESS,
            payload: data
        })
        dispatch(getPendingPickupsOffline())
    } catch (err) {
        dispatch({
            type: actionTypes.DECLINE_PICKUP_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const acceptPickup = (id) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/request/acceptPickup/${id}`, {id: userInfo._id},
        config)

        dispatch({
            type: actionTypes.ACCEPT_PICKUP_SUCCESS,
            payload: data
        })
        dispatch(getPendingPickupsOffline())
        dispatch(getUpcomingPickups())
    } catch (err) {
        dispatch({
            type: actionTypes.ACCEPT_PICKUP_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const completedPickup = (id) => async(dispatch, getState) => {
    try {
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const date = new Date()

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/request/updateCompletedPickup/${id}`, {date},
        config)

        dispatch({
            type: actionTypes.PICKUP_COMPLETED_SUCCESS,
            payload: data
        })
        dispatch(getUpcomingPickups())
    } catch (err) {
        dispatch({
            type: actionTypes.PICKUP_COMPLETED_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const addSocket = (socket) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.ADD_SOCKET_SUCCESS,
            payload: socket
        })
    } catch(err) {
        dispatch({
            type: actionTypes.ADD_SOCKET_FAIL,
            payload: err
        })
    }
}

export const hideComponent = (value) => async(dispatch) => {
    if(value === true)
        dispatch({
            type: actionTypes.HIDE_COMPONENT_ADD
        })
    else if(value === false)
        dispatch({
            type: actionTypes.HIDE_COMPONENT_REMOVE
        })
}