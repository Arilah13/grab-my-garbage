import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { USER_LOGOUT } from './constants/userConstants'

import {
    mapReducer,
} from './reducers/mapReducers'

import {
    googleUserLoginReducer,
    userRegisterReducer,
    userLoginReducer,
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
    ongoingPickupLocationReducer,
} from './reducers/specialPickupReducers'

import {
    retrieveScheduledPickupReducer,
    addScheduledPickupReducer,
    ongoingScheduledPickupLocationReducer,
} from './reducers/scheduledPickupReducer'

import {
    socketHolderReducer
} from './reducers/socketReducer'

import {
    getConversationReducer,
    sendMessageReducer,
    getAllConversationReducer,
    updateReadMessageReducer,
    currentConvoReducer,
    receiveMessageReducer
} from './reducers/conversationReducer'

const reducer = combineReducers({
    map: mapReducer,

    userLogin: googleUserLoginReducer,
    userRegister: userRegisterReducer,
    userLogin:  userLoginReducer,
    userUpdateProfile: userUpdateProfileReducer,

    paymentIntent: paymentIntentReducer,
    paymentSheet: paymentSheetReducer,

    specialPickup: addSpecialPickupReducer,
    scheduledPickup: addScheduledPickupReducer,
    retrievePendingPickups: retrievePendingPickupsReducer,
    retrieveAcceptedPickups: retrieveAcceptedPickupsReducer,
    retrieveCompletedPickups: retrieveCompletedPickupsReducer,
    retrieveScheduledPickup: retrieveScheduledPickupReducer,
    ongoingPickupLocation: ongoingPickupLocationReducer,
    ongoingScheduledPickupLocation: ongoingScheduledPickupLocationReducer,

    socketHolder: socketHolderReducer,

    getConversation: getConversationReducer,
    sendMessage: sendMessageReducer,
    getAllConversation: getAllConversationReducer,
    updateReadMessage: updateReadMessageReducer,
    currentConvo: currentConvoReducer,
    receiveMessage: receiveMessageReducer
})

const rootReducer = (state, action) => {
    if(action.type === USER_LOGOUT) {
        state = undefined
    }
    return reducer(state, action)
}

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

export default store