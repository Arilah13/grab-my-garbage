import * as actionTypes from '../constants/specialPickupConstants'

export const specialPickupListReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_SPECIAL_PICKUP_LIST_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_SPECIAL_PICKUP_LIST_SUCCESS:
            return { loading: false, specialPickupList: action.payload }
        case actionTypes.RETRIEVE_SPECIAL_PICKUP_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const specialPickupDetailReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_SPECIAL_PICKUP_DETAIL_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_SPECIAL_PICKUP_DETAIL_SUCCESS:
            return { loading: false, specialPickupDetail: action.payload }
        case actionTypes.RETRIEVE_SPECIAL_PICKUP_DETAIL_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const specialPickupDeleteReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SPECIAL_PICKUP_DELETE_SUCCESS:
            return { success: true }
        case actionTypes.SPECIAL_PICKUP_DELETE_FAIL:
            return { success: false, error: action.payload }
        case actionTypes.SPECIAL_PICKUP_DELETE_RESET:
            return {}
        default:
            return state
    }
}