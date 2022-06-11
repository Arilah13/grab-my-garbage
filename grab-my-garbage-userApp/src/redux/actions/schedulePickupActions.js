import axios from 'axios'
import * as actionTypes from '../constants/scheduledPickupConstants'

export const getScheduledPickupInfo = ({pickupInfo, total, method}) => async (dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_ADD_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const id = userInfo._id

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/schedulepickup/', {pickupInfo, total, method, id}, config)

        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_ADD_SUCCESS,
            payload: data
        })

        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_RESET
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_ADD_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const storeScheduledPickupTemp = (info) => (dispatch) => {
    dispatch({
        type: actionTypes.SCHEDULED_PICKUP_STORE,
        payload: info
    })
}

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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/getPickup/${id}`, config)

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

export const addOngoingSchedulePickupLocation = ({latitude, longitude, heading, haulerid, pickupid, ongoingPickupid, time}) => async(dispatch) => {
    const data = {latitude, longitude, heading, haulerid, pickupid, ongoingPickupid, time}
    dispatch({
        type: actionTypes.ADD_ONGOING_SCHEDULED_PICKUP_LOCATION,
        payload: data
    })
}

export const removeOngoingSchedulePickup = (pickupid) => async(dispatch) => {
    dispatch({
        type: actionTypes.REMOVE_ONGOING_SCHEDULED_PICKUP_LOCATION,
        payload: pickupid
    })
}