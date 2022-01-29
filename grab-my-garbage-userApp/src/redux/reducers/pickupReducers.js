import * as actionTypes from '../constants/pickupConstants'

export const addSpecialPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SPECIAL_PICKUP_ADD_REQUEST:
            return { loading: true }
        case actionTypes.SPECIAL_PICKUP_ADD_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.SPECIAL_PICKUP_ADD_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.SPECIAL_PICKUP_STORE:
            return { pickupInfo: action.payload }
        case actionTypes.SPECIAL_PICKUP_RESET:
            return {}
        default:
            return state
    }
}

export const retrieveAllPickupsReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}