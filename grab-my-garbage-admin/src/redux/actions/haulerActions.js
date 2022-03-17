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

        const { name, email, password, phone, pic: image, service_city } = info

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/admin/haulers/', {email, name, phone, password, image, service_city, role: 1}, config)

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

export const deleteHauler = (id) => async(dispatch, getState) => {
    try{
        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(`https://grab-my-garbage-server.herokuapp.com/admin/haulers/${id}`)

        dispatch({
            type: actionTypes.HAULER_DELETE_SUCCESS
        })
    } catch (err) {
        dispatch({
            type: actionTypes.HAULER_DELETE_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const getHaulerScheduledPickups = (haulerid) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_SCHEDULE_PICKUP_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/schedulepickup/hauler/${haulerid}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_HAULER_SCHEDULE_PICKUP_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_SCHEDULE_PICKUP_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const getHaulerSpecialPickups = (haulerid) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_SPECIAL_PICKUP_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/specialpickup/hauler/${haulerid}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_HAULER_SPECIAL_PICKUP_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_SPECIAL_PICKUP_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const getHaulerInfo = (haulerid) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_DETAIL_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`https://grab-my-garbage-server.herokuapp.com/admin/haulers/${haulerid}`, config)

        dispatch({
            type: actionTypes.RETRIEVE_HAULER_DETAIL_SUCCESS,
            payload: data
        })
    } catch(err) {
        dispatch({
            type: actionTypes.RETRIEVE_HAULER_DETAIL_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}

export const updateHaulerDetail = (haulerid, values) => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.HAULER_DETAIL_UPDATE_REQUEST
        })

        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { email, name, phone, pic: image, password, service_city } = values

        const { data } = await axios.put(`https://grab-my-garbage-server.herokuapp.com/admin/haulers/${haulerid}`, 
        {email, name, phone, image, password, service_city}, config)
        
        dispatch({
            type: actionTypes.HAULER_DETAIL_UPDATE_SUCCESS
        })
        dispatch(getHaulerInfo(haulerid))
        dispatch(getHaulers())
    } catch(err) {
        dispatch({
            type: actionTypes.HAULER_DETAIL_UPDATE_FAIL,
            payload: err.response && err.response.data.msg
            ? err.response.data.msg
            : err
        })
    }
}