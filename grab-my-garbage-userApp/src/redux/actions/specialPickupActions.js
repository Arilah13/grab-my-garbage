import axios from 'axios'
import * as actionTypes from '../constants/specialPickupConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

        dispatch({
            type: actionTypes.SPECIAL_PICKUP_RESET
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

export const getPendingPickups = () => async(dispatch, getState) => {
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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialpickup/pendingPickups/${userInfo._id}`, config)

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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialpickup/completedPickups/${userInfo._id}`, config)

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

export const getAcceptedPickups = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.ACCEPTED_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/specialpickup/acceptedPickups/${userInfo._id}`, config)

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


export const addOngoingPickupLocation = ({latitude, longitude, heading, haulerid, pickupid}) => async(dispatch) => {
    const data = {latitude, longitude, heading, haulerid, pickupid}
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