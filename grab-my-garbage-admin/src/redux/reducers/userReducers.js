import * as actionTypes from '../constants/userConstants'

export const userListReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_USER_LIST_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_USER_LIST_SUCCESS:
            return { loading: false, userList: action.payload }
        case actionTypes.RETRIEVE_USER_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
} 

export const userSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_USER_SCHEDULE_PICKUP_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_USER_SCHEDULE_PICKUP_SUCCESS:
            return { loading: false, userScheduleList: action.payload }
        case actionTypes.RETRIEVE_USER_SCHEDULE_PICKUP_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userSpecialPickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_USER_SPECIAL_PICKUP_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_USER_SPECIAL_PICKUP_SUCCESS:
            return { loading: false, userSpecialList: action.payload }
        case actionTypes.RETRIEVE_USER_SPECIAL_PICKUP_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userDetailReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_USER_DETAIL_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_USER_DETAIL_SUCCESS:
            return { loading: false, userDetail: action.payload }
        case actionTypes.RETRIEVE_USER_DETAIL_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userDetailUpdateReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.USER_DETAIL_UPDATE_REQUEST:
            return { loading: true }
        case actionTypes.USER_DETAIL_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.USER_DETAIL_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.USER_DETAIL_UPDATE_RESET:
            return {}
        default:
            return state
    }
}

export const userDeleteReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.USER_DELETE_SUCCESS:
            return { success: true }
        case actionTypes.USER_DELETE_FAIL:
            return { success: false, error: action.payload }
        case actionTypes.USER_DELETE_RESET:
            return {}
        default:
            return state
    }
}