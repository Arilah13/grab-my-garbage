import axios from 'axios'
import * as actionTypes from '../constants/specialPickupConstants'

export const getSpecialPickups = () => async (dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_SPECIAL_PICKUP_LIST_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('https://grab-my-garbage-server.herokuapp.com/admin/specialpickup', config)

        dispatch({
            type: actionTypes.RETRIEVE_SPECIAL_PICKUP_LIST_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_SPECIAL_PICKUP_LIST_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const getSpecialPickupInfo = (specialId) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_SPECIAL_PICKUP_DETAIL_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/specialpickup/${specialId}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_SPECIAL_PICKUP_DETAIL_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_SPECIAL_PICKUP_DETAIL_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const deleteSchedulePickup = (specialId) => async(dispatch, getState) => {
    try{
        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(`https://grab-my-garbage-server.herokuapp.com/admin/specialpickup/${specialId}`, config)
        dispatch({
            type: actionTypes.SPECIAL_PICKUP_DELETE_SUCCESS
        })
        dispatch(getSpecialPickups())
    } catch(err) {
        dispatch({
            type: actionTypes.SPECIAL_PICKUP_DELETE_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}