import * as actionTypes from '../constants/socketConstants'

export const socketHolderReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ADD_SOCKET_SUCCESS:
            return { loading: false, socket: action.payload }
        case actionTypes.ADD_SOCKET_FAIL:
            return { error: action.payload }
        default:
            return state
    }
}