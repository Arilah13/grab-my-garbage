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

export const ongoingPickupLocationReducer = (state = { ongoingPickups: [] }, action) => {
    switch(action.type) {
        case actionTypes.ADD_ONGOING_PICKUP_LOCATION:
            const ongoingPickup = state.ongoingPickups.find((ongoingPickup) => ongoingPickup.pickupid === action.payload.pickupid)
            if(ongoingPickup) {
                state.ongoingPickups.splice(state.ongoingPickups.findIndex(ongoingPickup => ongoingPickup.pickupid === action.payload.pickupid), 1)
                return { ...state, ongoingPickups: [...state.ongoingPickups, action.payload] }
            } else {
                return { ...state, ongoingPickups: [...state.ongoingPickups, action.payload] }
            }
        case actionTypes.REMOVE_ONGOING_PICKUP_LOCATION:
            state.ongoingPickups.splice(state.ongoingPickups.findIndex(ongoingPickup => ongoingPickup.pickupid === action.payload.pickupid), 1)
            return { ...state, ongoingPickups: [...state.ongoingPickups]}
        default:
            return state
    }
}

export const hideComponentReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.HIDE_COMPONENT_ADD:
            return { hide: true }
        case actionTypes.HIDE_COMPONENT_REMOVE:
            return { hide: false }
        default: 
            return state
    }
}