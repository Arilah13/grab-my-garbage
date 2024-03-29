import * as actionTypes from '../constants/mapConstants'

export const mapReducer = (state = {}, action) => {
    switch(action.type){
        case actionTypes.ADD_ORIGIN:
            return { origin: action.payload }
        default:
            return state
    }
}

export const addLocationReducer = (state = {}, action) => {
    switch(action.type){
        case actionTypes.ADD_LOCATION_REQUEST:
            return { loading: true }
        case actionTypes.ADD_LOCATION_SUCCESS:
            return { loading: false, success: true }
        case actionTypes.ADD_LOCATION_FAIL:
            return { loading: false, error: action.payload, success: false}
        default:
            return state
    }
}