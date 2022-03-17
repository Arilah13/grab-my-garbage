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

export const getSchedulePickupInfo = (scheduleId) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_SCHEDULE_PICKUP_DETAIL_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/schedulepickup/${scheduleId}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_SCHEDULE_PICKUP_DETAIL_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_SCHEDULE_PICKUP_DETAIL_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const addSchedulePickup = (info) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.SCHEDULE_PICKUP_ADD_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(`https://grab-my-garbage-server.herokuapp.com/admin/schedulepickup`, config)
        dispatch({
            type: actionTypes.SCHEDULE_PICKUP_ADD_SUCCESS
        })
        dispatch(getSchedulePickups())
    } catch(err) {
        dispatch({
            type: actionTypes.SCHEDULE_PICKUP_ADD_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const disableSchedulePickup = () => async(dispatch, getState) => {
    try {
        
    } catch(err) {

    }
}

export const deleteSchedulePickup = (scheduleId) => async(dispatch, getState) => {
    try{
        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(`https://grab-my-garbage-server.herokuapp.com/admin/schedulepickup/${scheduleId}`, config)
        dispatch({
            type: actionTypes.SCHEDULE_PICKUP_DELETE_SUCCESS
        })
        dispatch(getSchedulePickups())
    } catch(err) {
        dispatch({
            type: actionTypes.SCHEDULE_PICKUP_DELETE_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const updateSchedulePickup = (info) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.SCHEDULE_PICKUP_UPDATE_REQUEST
        })
    } catch(err) {
        dispatch({
            type: actionTypes.SCHEDULE_PICKUP_UPDATE_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}