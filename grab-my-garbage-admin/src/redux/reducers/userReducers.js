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