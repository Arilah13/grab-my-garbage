import * as actionTypes from '../constants/scheduleRequestConstants'

export const retrieveSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const completeSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULED_PICKUP_COMPLETE_REQUEST:
            return { loading: true }
        case actionTypes.SCHEDULED_PICKUP_COMPLETE_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.SCHEDULED_PICKUP_COMPLETE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const retrieveCollectSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.COLLECT_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.COLLECT_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.COLLECT_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const activeSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SET_PICKUP_ACTIVE_SUCCESS:
            return { success: true }
        case actionTypes.SET_PICKUP_ACTIVE_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const inactiveSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SET_PICKUP_INACTIVE_SUCCESS:
            return { success: true }
        case actionTypes.SET_PICKUP_INACTIVE_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}

export const allSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ALL_SCHEDULED_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.ALL_SCHEDULED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, allSchedule: action.payload }
        case actionTypes.ALL_SCHEDULED_PICKUP_RETRIEVE_FAIL:
            return { loading: false, error: action.payload }
        default: 
            return state
    }
}
