import axios from 'axios'
import * as actionTypes from '../constants/schedulePickupConstants'

export const getSchedulePickups = () => async (dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('https://grab-my-garbage-server.herokuapp.com/admin/schedulepickup', config)

        dispatch({
            type: actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_SCHEDULE_PICKUP_LIST_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}