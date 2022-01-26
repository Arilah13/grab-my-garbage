import * as actionTypes from '../constants/pickupConstants'

export const addSpecialPickup = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SPECIAL_PICKUP_ADD_REQUEST:
            return { loading: true }
        case actionTypes.SPECIAL_PICKUP_ADD_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.SPECIAL_PICKUP_ADD_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }

}