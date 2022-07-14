import * as actionTypes from '../constants/notificationConstants'

export const getPaymentSheet = (amount) => async(dispatch, getState) => {
    try {
        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const { data } = await axios.post('https://grab-my-garbage-server.herokuapp.com/payment/create', {amount, id}, config)
        
        dispatch({
            type: actionTypes.ADD_NOTIFICATION_SUCCESS,
        })
        
    } catch (err) {
        dispatch({
            type: actionTypes.ADD_NOTIFICATION_FAIL,
            payload: err.response.data.msg
        })
    }
}