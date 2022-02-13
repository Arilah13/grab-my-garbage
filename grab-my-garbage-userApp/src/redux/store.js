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
    retrievePendingPickupsReducer,
    retrieveAcceptedPickupsReducer,
    retrieveCompletedPickupsReducer,
    socketHolderReducer,
    ongoingPickupLocationReducer
} from './reducers/pickupReducers'

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
    retrievePendingPickups: retrievePendingPickupsReducer,
    retrieveAcceptedPickups: retrieveAcceptedPickupsReducer,
    retrieveCompletedPickups: retrieveCompletedPickupsReducer,
    socketHolder: socketHolderReducer,
    ongoingPickupLocation: ongoingPickupLocationReducer,

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