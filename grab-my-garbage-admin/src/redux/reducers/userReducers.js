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

export const adminLoginReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ADMIN_LOGIN_REQUEST:
            return { loading: true }
        case actionTypes.ADMIN_LOGIN_SUCCESS:
            return { loading: false, admin: action.payload }
        case actionTypes.ADMIN_LOGIN_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const adminDetailUpdateReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ADMIN_DETAIL_UPDATE_REQUEST:
            return { loading: true }
        case actionTypes.ADMIN_DETAIL_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.ADMIN_DETAIL_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case actionTypes.ADMIN_DETAIL_UPDATE_RESET:
            return {}
        default:
            return state
    }
}

export const adminDetailReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_ADMIN_DETAILS_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_ADMIN_DETAILS_SUCCESS:
            return { loading: false, admin: action.payload }
        case actionTypes.RETRIEVE_ADMIN_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}