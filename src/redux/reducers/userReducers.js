import * as actionTypes from '../constants/userConstants'

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_REQUEST:
            return { loading: true }
        case actionTypes.USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload, success: true }
        case actionTypes.USER_LOGIN_FAIL:
            return { loading: false, error: action.payload}
        case actionTypes.USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export const googleUserLoginReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return { userInfo: action.payload }
        default:
            return state
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.USER_REGISTER_REQUEST:
            return { loading: true }
        case actionTypes.USER_REGISTER_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userDetailsReducer = (state = { user: [] }, action) => {
    switch (action.type) {
        case actionTypes.USER_DETAILS_REQUEST:
            return { ...state, loading: true }
        case actionTypes.USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload }
        case actionTypes.USER_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default: 
            return state
    }
}

export const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.USER_UPDATE_PROFILE_REQUEST:
            return { ...state, loading: true }
        case actionTypes.USER_UPDATE_PROFILE_SUCCESS:
            return { loading: false, success: true, userInfo: action.payload }
        case actionTypes.USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.USER_DELETE_REQUEST:
            return { loading: true }
        case actionTypes.USER_DELETE_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.USER_DELETE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.USER_UPDATE_REQUEST:
            return { loading: true }
        case actionTypes.USER_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.USER_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}