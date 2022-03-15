import axios from 'axios'
import * as actionTypes from '../constants/haulerConstants'

export const getHaulers = () => async (dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_LIST_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('https://grab-my-garbage-server.herokuapp.com/admin/haulers', config)

        dispatch({
            type: actionTypes.RETRIEVE_HAULER_LIST_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_LIST_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const addHauler = (info) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.HAULER_ADD_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { name, email, password, phone, pic, service_city } = info

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/admin/haulers/', {email, name, phone, password, pic, service_city, role: 1}, config)

        dispatch({
            type: actionTypes.HAULER_ADD_SUCCESS
        })
        dispatch(getHaulers())
    } catch(err) {
        dispatch({
            type: actionTypes.HAULER_ADD_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}