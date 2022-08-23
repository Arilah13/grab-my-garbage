import axios from 'axios'
import * as actionTypes from '../constants/specialRequestConstants'

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

export const getUpcomingPickupsToCollect = (latitude, longitude) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.COLLECT_SPECIAL_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialrequest/${userInfo._id}/${latitude}/${longitude}`, 
        config)

        dispatch({
            type: actionTypes.COLLECT_SPECIAL_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.COLLECT_SPECIAL_PICKUP_RETRIEVE_FAIL,
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

        await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/updateCompletedPickup/${id}`, {date},
        config)

        dispatch({
            type: actionTypes.PICKUP_COMPLETED_SUCCESS,
        })
    } catch (err) {
        dispatch({
            type: actionTypes.PICKUP_COMPLETED_FAIL,
            payload: err.response.data.msg
        })
    }
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

        const { data } = await axios.post(`https://grab-my-garbage-server.herokuapp.com/message/send`, {receiver, message}, config)

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

export const activeSpecialPickup = (pickup) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/active/${pickup}`,
        config)

        dispatch({
            type: actionTypes.SET_PICKUP_ACTIVE_SUCCESS,
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SET_PICKUP_ACTIVE_FAIL,
            payload: err.response.data.msg
        })
    }
}