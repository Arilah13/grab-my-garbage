import axios from 'axios'
import * as actionTypes from '../constants/scheduleRequestConstants'

export const getScheduledPickups = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/request/scheduledPickup/${userInfo._id}`, 
        config)

        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}