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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/pendingPickup/${latitude}/${longitude}`, 
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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/pendingPickup/${latitude}/${longitude}`, 
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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/pendingPickup/${latitude}/${longitude}`, 
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