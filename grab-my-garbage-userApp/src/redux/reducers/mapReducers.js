import * as actionTypes from '../constants/mapConstants'

export const mapReducer = (state = { origin: {}, destination: {} }, action) => {
    switch(action.type){
        case actionTypes.ADD_ORIGIN:
            return{
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
                address: action.payload.address,
                name: action.payload.name
            }
        case actionTypes.ADD_DESTINATION:
            return{
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
                address: action.payload.address,
                name: action.payload.name,
                city: action.payload.city
            }
        default:
            return state
    }
}