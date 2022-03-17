import * as actionTypes from '../constants/schedulePickupConstants'

export const schedulePickupListReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_SUCCESS:
            return { loading: false, schedulePickupList: action.payload }
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const schedulePickupDetailReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_DETAIL_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_DETAIL_SUCCESS:
            return { loading: false, schedulePickupDetail: action.payload }
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_DETAIL_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const schedulePickupAddReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULE_PICKUP_ADD_REQUEST:
            return { loading: true }
        case actionTypes.SCHEDULE_PICKUP_ADD_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.SCHEDULE_PICKUP_ADD_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.SCHEDULE_PICKUP_ADD_RESET:
            return {}
        default:
            return state
    }
}

export const schedulePickupUpdateReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULE_PICKUP_UPDATE_REQUEST:
            return { loading: true }
        case actionTypes.SCHEDULE_PICKUP_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.SCHEDULE_PICKUP_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.SCHEDULE_PICKUP_UPDATE_RESET:
            return {}
        default:
            return state
    }
}

export const schedulePickupDisableReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULE_PICKUP_DISABLE_SUCCESS:
            return { success: true }
        case actionTypes.SCHEDULE_PICKUP_DISABLE_FAIL:
            return { success: false, error: action.payload }
        case actionTypes.SCHEDULE_PICKUP_DISABLE_RESET:
            return {}
        default:
            return state
    }
}

export const schedulePickupDeleteReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULE_PICKUP_DELETE_SUCCESS:
            return { success: true }
        case actionTypes.SCHEDULE_PICKUP_DELETE_FAIL:
            return { success: false, error: action.payload }
        case actionTypes.SCHEDULE_PICKUP_DELETE_RESET:
            return {}
        default:
            return state
    }
}