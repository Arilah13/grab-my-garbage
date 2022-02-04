import axios from 'axios'
import * as actionTypes from '../constants/mapConstants'

export const addOrigin = (latitude, longitude) => async(dispatch) => {
    dispatch({
        type: actionTypes.ADD_ORIGIN,
        payload: {
            latitude: latitude,
            longitude: longitude
        }
    })
}

export const addDestination = (latitude, longitude, name, address) => async(dispatch) => {
    dispatch({
        type: actionTypes.ADD_DESTINATION,
        payload: {
            latitude: latitude,
            longitude: longitude,
            address: address,
            name: name
        }
    })
}

export const addLocation = (location) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.ADD_LOCATION_REQUEST
        })

        const { userLogin: { userInfo } } = getState()
        const haulerID = userInfo._id
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }
        
        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/haulers/location', {location, haulerID}, config)

        dispatch({
            type: actionTypes.ADD_LOCATION_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.ADD_LOCATION_FAIL,
            payload: err.response.data.msg
        })
    }
}