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

export const ongoingScheduledPickupLocationReducer = (state = { ongoingPickups: [] }, action) => {
    switch(action.type) {
        case actionTypes.ADD_ONGOING_SCHEDULED_PICKUP_LOCATION:
            if(state.ongoingPickups.length > 0) {
                const ongoingPickup = state.ongoingPickups.find((ongoingPickup) => ongoingPickup.pickupid === action.payload.pickupid)
                if(ongoingPickup) {
                    state.ongoingPickups.splice(state.ongoingPickups.findIndex(ongoingPickup => ongoingPickup.pickupid === action.payload.pickupid), 1)
                    return { ...state, ongoingPickups: [...state.ongoingPickups, action.payload] }
                } else {
                    return { ...state, ongoingPickups: [...state.ongoingPickups, action.payload] }
                }
            } else {
                return { ...state, ongoingPickups: [action.payload] }
            }
        case actionTypes.REMOVE_ONGOING_SCHEDULED_PICKUP_LOCATION:
            state.ongoingPickups.splice(state.ongoingPickups.findIndex(ongoingPickup => ongoingPickup.pickupid === action.payload), 1)
        default:
            return state
    }
}