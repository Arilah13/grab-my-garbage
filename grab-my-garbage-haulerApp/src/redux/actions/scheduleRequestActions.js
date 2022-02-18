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

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/scheduledPickup/${userInfo._id}`, 
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

export const completeScheduledPickup = ({id, completedDate, completedHauler}) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_COMPLETE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/pickupToday/${id}`,
        { completedDate, completedHauler }, config)

        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_COMPLETE_SUCCESS,
            payload: data
        })
        dispatch(getScheduledPickupsToCollect())
    } catch (err) {
        dispatch({
            type: actionTypes.SCHEDULED_PICKUP_COMPLETE_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const getScheduledPickupsToCollect = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.COLLECT_PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/schedulerequest/${userInfo._id}`, 
        config)

        dispatch({
            type: actionTypes.COLLECT_PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.COLLECT_PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}