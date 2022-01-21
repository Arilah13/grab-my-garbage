import axios from 'axios'
import * as actionTypes from '../constants/paymentConstants'

export const getPaymentIntent = () => async(dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.PAYMENT_INTENT_REQUEST,
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.get('http://192.168.13.1:5000/payment/paymentIntent', config, 
        )

        dispatch({
            type: actionTypes.PAYMENT_INTENT_SUCCESS,
            payload: data
        })
        
    } catch (err) {
        dispatch({
            type: actionTypes.PAYMENT_INTENT_FAIL,
            payload: err.response.data.msg
        })
    }
}

export const getPaymentSheet = () => async(dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.PAYMENT_SHEET_REQUEST,
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        console.log(config)

        const { data } = await axios.get(`http://192.168.13.1:5000/payment/create/${userInfo._id}`, config, 
        )
        
        dispatch({
            type: actionTypes.PAYMENT_SHEET_SUCCESS,
            payload: data
        })
        
    } catch (err) {
        dispatch({
            type: actionTypes.PAYMENT_SHEET_FAIL,
            payload: err.response.data.msg
        })
    }
}