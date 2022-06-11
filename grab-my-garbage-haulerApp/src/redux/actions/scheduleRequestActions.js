import axios from 'axios'
import * as actionTypes from '../constants/scheduleRequestConstants'

export const getScheduledPickups = (id, token) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_RETRIEVE_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/scheduledPickup/${id}`, 
        config)

        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const completeScheduledPickup = ({id, completedDate, completedHauler}) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_COMPLETE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/pickupToday/${id}`,
        { completedDate, completedHauler }, config)

        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_COMPLETE_SUCCESS,
            payload: data
        })
        dispatch(getScheduledPickupsToCollect())
    } catch (err) {
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_COMPLETE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const getScheduledPickupsToCollect = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.COLLECT_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/${userInfo._id}`, 
        config)

        dispatch({
            type: actionTypes.COLLECT_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.COLLECT_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const activeSchedulePickup = (pickup) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/active/${pickup}`,
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

export const inactiveSchedulePickup = (pickup) => async(dispatch, getState) => {
    try{
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/inactive/${pickup}`,
        config)

        dispatch({
            type: actionTypes.SET_PICKUP_INACTIVE_SUCCESS,
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SET_PICKUP_INACTIVE_FAIL,
            payload: err.response.data.msg
        })
    }
}
