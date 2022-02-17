import * as actionTypes from '../constants/scheduledPickupConstants'

export const addScheduledPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULED_PICKUP_ADD_REQUEST:
            return { loading: true }
        case actionTypes.SCHEDULED_PICKUP_ADD_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.SCHEDULED_PICKUP_ADD_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.SCHEDULED_PICKUP_STORE:
            return { pickupInfo: action.payload }
        case actionTypes.SCHEDULED_PICKUP_RESET:
            return {}
        default:
            return state
    }
}

export const retrieveScheduledPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}