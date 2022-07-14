import * as actionTypes from '../constants/notificationConstants'

export const addNotificationReducer = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.ADD_NOTIFICATION_SUCCESS:
            return { success: true }
        case actionTypes.ADD_NOTIFICATION_FAIL:
            return { success: false, error: action.payload }
        default:
            return state
    }
}