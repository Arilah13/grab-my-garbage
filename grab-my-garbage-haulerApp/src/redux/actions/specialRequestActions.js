import axios from 'axios'
import * as actionTypes from '../constants/specialRequestConstants'

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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialrequest/pendingPickup/${latitude}/${longitude}/${userInfo._id}`, 
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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialrequest/pendingOfflinePickup/${userInfo._id}`, 
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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialrequest/upcomingPickup/${userInfo._id}`, 
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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialrequest/completedPickup/${userInfo._id}`, 
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

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/declinePickup/${id}`, {id: userInfo._id},
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

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/acceptPickup/${id}`, {id: userInfo._id},
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

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/updateCompletedPickup/${id}`, {date},
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

export const sendSMS = ({receiver, message}) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.post(`https://grab-my-garbage-server.herokuapp.com/message/send`, {receiver, message},
        config)

        dispatch({
            type: actionTypes.SEND_MESSAGE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SEND_MESSAGE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const ongoingPickup = (pickup) => async(dispatch, getState) => {
    try{
        
    } catch (err) {

    }
}