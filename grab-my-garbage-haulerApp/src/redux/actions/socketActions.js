import * as actionTypes from '../constants/socketConstants'

export const addSocket = (socket) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.ADD_SOCKET_SUCCESS,
            payload: socket
        })
    } catch(err) {
        dispatch({
            type: actionTypes.ADD_SOCKET_FAIL,
            payload: err
        })
    }
}