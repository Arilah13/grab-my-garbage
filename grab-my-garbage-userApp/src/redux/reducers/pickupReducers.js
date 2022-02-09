import * as actionTypes from '../constants/pickupConstants'

export const addSpecialPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SPECIAL_PICKUP_ADD_REQUEST:
            return { loading: true }
        case actionTypes.SPECIAL_PICKUP_ADD_SUCCESS:
            return { loading: false, success: true }
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

export const retrievePendingPickupsReducer = (state = {}, action) => {
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

export const retrieveAcceptedPickupsReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ACCEPTED_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.ACCEPTED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.ACCEPTED_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const retrieveCompletedPickupsReducer = (state = {}, action) => {
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

export const socketHolderReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ADD_SOCKET_SUCCESS:
            return { socket: action.payload }
        case actionTypes.ADD_SOCKET_FAIL:
            return { error: action.payload }
        default:
            return state
    }
}