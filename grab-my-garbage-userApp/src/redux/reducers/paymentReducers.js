import * as actionTypes from '../constants/paymentConstants'

export const paymentIntentReducer = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.PAYMENT_INTENT_REQUEST:
            return { loading: true }
        case actionTypes.PAYMENT_INTENT_SUCCESS:
            return { loading: false, paymentInfo: action.payload, success: true }
        case actionTypes.PAYMENT_INTENT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const paymentSheetReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.PAYMENT_SHEET_REQUEST:
            return { loading: true }
        case actionTypes.PAYMENT_SHEET_SUCCESS:
            return { loading: false, paymentSheet: action.payload, success: true }
        case actionTypes.PAYMENT_SHEET_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const paypalReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.PAYPAL_TOKEN_REQUEST:
            return { loading: true }
        case actionTypes.PAYPAL_TOKEN_SUCCESS:
            return { loading: false, paypal: action.payload, success: true }
        case actionTypes.PAYPAL_TOKEN_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}