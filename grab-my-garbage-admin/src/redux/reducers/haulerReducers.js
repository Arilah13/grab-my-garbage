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
    }
}