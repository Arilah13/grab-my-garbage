import * as actionTypes from '../constants/mapConstants'

export const addOrigin = (latitude, longitude, name, address) => async(dispatch) => {
    dispatch({
        type: actionTypes.ADD_ORIGIN,
        payload: {
            latitude: latitude,
            longitude: longitude,
            address: address,
            name: name
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