import axios from 'axios'
import * as actionTypes from '../constants/specialPickupConstants'

export const getSpecialPickupInfo = ({pickupInfo, total, method}) => async (dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const id = userInfo._id

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/specialpickup/', {pickupInfo, total, method, id}, config)

        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const storeSpecialPickupTemp = (info) => (dispatch) => {
    dispatch({
        type: actionTypes.SPECIAL_PICKUP_STORE,
        payload: info
    })
}

export const getPendingPickups = (id, token) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialpickup/pendingPickups/${id}`, config)

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

export const getCompletedPickups = (id, token) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.COMPLETED_PICKUP_RETRIEVE_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialpickup/completedPickups/${id}`, config)

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

export const getAcceptedPickups = (id, token) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.ACCEPTED_PICKUP_RETRIEVE_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialpickup/acceptedPickups/${id}`, config)

        dispatch({
            type: actionTypes.ACCEPTED_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.ACCEPTED_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}


export const addOngoingPickupLocation = ({latitude, longitude, heading, haulerid, pickupid, time}) => async(dispatch) => {
    const data = {latitude, longitude, heading, haulerid, pickupid, time}
    dispatch({
        type: actionTypes.ADD_ONGOING_PICKUP_LOCATION,
        payload: data
    })
}

export const removeOngoingPickup = (pickupid) => async(dispatch) => {
    dispatch({
        type: actionTypes.REMOVE_ONGOING_PICKUP_LOCATION,
        payload: pickupid
    })
}