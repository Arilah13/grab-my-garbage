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

export const addOngoingSpecialPickupReducer = (state = { ongoing: [] }, action) => {
    switch(action.type) {
        case actionTypes.ADD_ONGOING_SPECIAL_PICKUP:
            const ongoingPickup = state.ongoing.find(pickup => pickup.pickup.pickupid === action.payload.pickup.pickupid)
            if(ongoingPickup) {
                state.ongoing.splice(state.ongoing.findIndex(pickup => pickup.pickup.pickupid === action.payload.pickup.pickupid))
                return { ...state, ongoing: [...state.ongoing, action.payload] }
            } else {
                return { ...state, ongoing: [...state.ongoing, action.payload] }
            }
        case actionTypes.REMOVE_ONGOING_SPECIAL_PICKUP:
            state.ongoing.splice(state.ongoing.findIndex(pickup => pickup.pickup.pickupid === action.payload))
            return { ...state, ongoing: [...state.ongoing] }
        default:
            return state
    }
}