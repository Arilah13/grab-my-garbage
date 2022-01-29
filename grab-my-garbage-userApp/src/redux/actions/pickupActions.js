import axios from 'axios'
import * as actionTypes from '../constants/pickupConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const getSpecialPickupInfo = ({pickupInfo, total, method}) => async (dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const id = userInfo._id

        const { data } = await axios.post('http://192.168.13.1:5000/pickup/specialpickup', {pickupInfo, total, method, id}, config)

        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_SUCCESS,
            payload: data
        })

    } catch (err) {
        dispatch({
            type: actionTypes.SPECIAL_PICKUP_ADD_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const storeSpecialPickupTemp = (info) => (dispatch) => {
    dispatch({
        type: actionTypes.SPECIAL_PICKUP_STORE,
        payload: info
    })
}

export const getAllPickups = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: actionTypes.PICKUP_RETRIEVE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get(`http://192.168.13.1:5000/pickup/allPickups/${userInfo._id}`, config)

        dispatch({
            type: actionTypes.PICKUP_RETRIEVE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.PICKUP_RETRIEVE_FAIL,
            payload: err.response.data.msg
        })
    }
}