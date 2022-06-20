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