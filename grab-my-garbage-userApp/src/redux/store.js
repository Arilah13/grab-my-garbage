import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { USER_LOGOUT } from './constants/userConstants'

import {
    mapReducer,
} from './reducers/mapReducers'

import {
    googleUserLoginReducer,
    userRegisterReducer,
    userLoginReducer,
    userDetailsReducer,
    userUpdateProfileReducer
} from './reducers/userReducers'

import {
    paymentIntentReducer,
    paymentSheetReducer,
} from './reducers/paymentReducers'

import {
    addSpecialPickupReducer,
    addScheduledPickupReducer,
    retrievePendingPickupsReducer,
    retrieveAcceptedPickupsReducer,
    retrieveCompletedPickupsReducer,
    ongoingPickupLocationReducer,
    hideComponentReducer,
} from './reducers/pickupReducers'

import {
    socketHolderReducer
} from './reducers/socketReducer'

import {
    getConversationReducer,
    sendMessageReducer,
    getMessageReducer
} from './reducers/conversationReducer'

const reducer = combineReducers({
    map: mapReducer,

    userLogin: googleUserLoginReducer,
    userRegister: userRegisterReducer,
    userLogin:  userLoginReducer,
    userDetail: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,

    paymentIntent: paymentIntentReducer,
    paymentSheet: paymentSheetReducer,

    specialPickup: addSpecialPickupReducer,
    scheduledPickup: addScheduledPickupReducer,
    retrievePendingPickups: retrievePendingPickupsReducer,
    retrieveAcceptedPickups: retrieveAcceptedPickupsReducer,
    retrieveCompletedPickups: retrieveCompletedPickupsReducer,
    ongoingPickupLocation: ongoingPickupLocationReducer,
    hideComponent: hideComponentReducer,

    socketHolder: socketHolderReducer,

    getConversation: getConversationReducer,
    sendMessage: sendMessageReducer,
    getMessage: getMessageReducer
})

const rootReducer = (state, action) => {
    if(action.type === USER_LOGOUT) {
        state = undefined
    }
    return reducer(state, action)
}

const middleware = [thunk]

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store