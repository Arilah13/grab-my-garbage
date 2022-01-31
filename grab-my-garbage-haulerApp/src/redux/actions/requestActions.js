import axios from 'axios'
import * as actionTypes from '../constants/requestConstants'

export const getPendingPickups = (latitude, longitude) => async(dispatch) => {
    try{
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }

        const { data } = await axios.get(`http://192.168.13.1:5000/request/pendingPickup/${latitude}/${longitude}`, 
        config)

        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.PENDING_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}