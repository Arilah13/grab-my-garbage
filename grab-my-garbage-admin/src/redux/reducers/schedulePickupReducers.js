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

export const addOngoingSchedulePickupReducer = (state = { ongoing: [] }, action) => {
    switch(action.type) {
        case actionTypes.ADD_ONGOING_SCHEDULE_PICKUP:
            const ongoingPickup = state.ongoing.find(pickup => pickup.pickup.pickupid === action.payload.pickup.pickupid)
            if(ongoingPickup) {
                state.ongoing.splice(state.ongoing.findIndex(pickup => pickup.pickup.pickupid === action.payload.pickupid))
                return { ...state, ongoing: [...state.ongoing, action.payload] }
            } else {
                return { ...state, ongoing: [...state.ongoing, action.payload] }
            }
        case actionTypes.REMOVE_ONGOING_SCHEDULE_PICKUP:
            state.ongoing.splice(state.ongoing.findIndex(pickup => pickup.pickup.pickupid === action.payload))
            return { ...state, ongoing: [...state.ongoing] }
        default:
            return state
    }
}