import axios from 'axios'
import * as actionTypes from '../constants/specialPickupConstants'

export const getSpecialPickupInfo = ({pickupInfo, total, method}) => async (dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_REQUEST
        })

        const { userLogin: { userInfo } } = getState()
        const { retrievePendingPickups: { pickupInfo: pick } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const id = userInfo._id

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/specialpickup/', {pickupInfo, total, method, id}, config)

        const Data = {
            _id: data._id,
            location: data.location,
            datetime: data.datetime,
            category: data.category,
            weight: data.weight,
            image: data.image,
            payment: data.payment,
            paymentMethod: data.paymentMethod,
            areaHaulers: data.areaHaulers,
            customerId: data.customerId,
            accepted: data.accepted,
            cancelled: data.cancelled,
            completed: data.completed,
            pickerId: data.pickerId,
            declinedHaulers: data.declinedHaulers,
            inactive: data.inactive,
            active: data.active,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            __v: data.__v
        }

        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_SUCCESS,
            payload: data
        })
        pick.push(Data)
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_SUCCESS,
            payload: pick
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