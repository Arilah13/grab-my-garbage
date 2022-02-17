import * as actionTypes from '../constants/scheduleRequestConstants'

export const retrieveSchedulePickupReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_REQUEST:
            return { loading: true }
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, pickupInfo: action.payload, success: true }
        case actionTypes.SCHEDULED_PICKUP_RETRIEVE_SUCCESS:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}