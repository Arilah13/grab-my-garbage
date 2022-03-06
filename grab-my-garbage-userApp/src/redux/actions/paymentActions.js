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

        const { data } = await axios.get('https://grab-my-garbage-server.herokuapp.com/payment/paymentIntent', config, 
        )
        
        dispatch({
            type: actionTypes.PAYMENT_INTENT_SUCCESS,
            payload: data
        })
        
    } catch (err) {
        dispatch({
            type: actionTypes.PAYMENT_INTENT_FAIL,
            payload: err
        })
    }
}

export const getPaymentSheet = (amount) => async(dispatch, getState) => {
    try {
        dispatch({
            type: actionTypes.PAYMENT_SHEET_REQUEST,
        })

        const { userLogin: { userInfo } } = getState()
        const id = userInfo._id

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/payment/create', {amount, id}, config)
        
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