import * as actionTypes from '../constants/requestConstants'

export const retrievePendingPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.PENDING_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.PENDING_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.PENDING_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const retrieveUpcomingPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.UPCOMING_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.UPCOMING_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.UPCOMING_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const retrieveCompletedPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.COMPLETED_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.COMPLETED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.COMPLETED_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const declinePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.DECLINE_PICKUP_SUCCESS:
            return { success: true }
        case actionTypes.DECLINE_PICKUP_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const acceptPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ACCEPT_PICKUP_SUCCESS:
            return { success: true }
        case actionTypes.ACCEPT_PICKUP_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const completedPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.PICKUP_COMPLETED_SUCCESS:
            return { success: true }
        case actionTypes.PICKUP_COMPLETED_FAIL:
            return { success: false, error: action.payload }
        default: 
            return state
    }
}