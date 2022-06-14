import * as actionTypes from '../constants/specialRequestConstants'

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

export const sendSMSReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SEND_MESSAGE_SUCCESS:
            return { success: true }
        case actionTypes.SEND_MESSAGE_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const ongoingPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ONGOING_PICKUP_ADD:
            return { pickup: action.payload }
        case actionTypes.ONGOING_PICKUP_REMOVE:
            return { pickup: null }
        default:
            return state
    }
}

export const activeSpecialPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SET_PICKUP_ACTIVE_SUCCESS:
            return { success: true }
        case actionTypes.SET_PICKUP_ACTIVE_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const retrieveCollectSpecialPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.COLLECT_SPECIAL_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.COLLECT_SPECIAL_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.COLLECT_SPECIAL_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}