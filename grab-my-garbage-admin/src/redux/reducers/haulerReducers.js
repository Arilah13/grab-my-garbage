import * as actionTypes from '../constants/haulerConstants'

export const haulerListReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_HAULER_LIST_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_HAULER_LIST_SUCCESS:
            return { loading: false, haulerList: action.payload }
        case actionTypes.RETRIEVE_HAULER_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const haulerAddReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.HAULER_ADD_REQUEST:
            return { loading: true }
        case actionTypes.HAULER_ADD_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.HAULER_ADD_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.HAULER_ADD_RESET:
            return {}
        default:
            return state
    }
}

export const haulerDeleteReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.HAULER_DELETE_SUCCESS:
            return { success: true }
        case actionTypes.HAULER_DELETE_FAIL:
            return { success: false, error: action.payload }
        case actionTypes.HAULER_DELETE_RESET:
            return {}
        default:
            return state
    }
}

export const haulerSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_HAULER_SCHEDULE_PICKUP_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_HAULER_SCHEDULE_PICKUP_SUCCESS:
            return { loading: false, haulerScheduleList: action.payload }
        case actionTypes.RETRIEVE_HAULER_SCHEDULE_PICKUP_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const haulerSpecialPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_HAULER_SPECIAL_PICKUP_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_HAULER_SPECIAL_PICKUP_SUCCESS:
            return { loading: false, haulerSpecialList: action.payload }
        case actionTypes.RETRIEVE_HAULER_SPECIAL_PICKUP_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const haulerDetailReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_HAULER_DETAIL_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_HAULER_DETAIL_SUCCESS:
            return { loading: false, haulerDetail: action.payload }
        case actionTypes.RETRIEVE_HAULER_DETAIL_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const haulerDetailUpdateReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.HAULER_DETAIL_UPDATE_REQUEST:
            return { loading: true }
        case actionTypes.HAULER_DETAIL_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.HAULER_DETAIL_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.HAULER_DETAIL_UPDATE_RESET:
            return {}
        default:
            return state
    }
}