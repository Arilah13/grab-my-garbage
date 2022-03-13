import * as actionTypes from '../constants/schedulePickupConstants'

export const schedulePickupListReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_REQUEST:
            return { loading: true }
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_SUCCESS:
            return { loading: false, schedulePickupList: action.payload }
        case actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}