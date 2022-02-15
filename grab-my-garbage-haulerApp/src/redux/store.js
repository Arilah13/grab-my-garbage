import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { USER_LOGOUT } from './constants/userConstants'

import {
    userLoginReducer
} from './reducers/userReducer'

import { 
    retrievePendingPickupReducer,
    retrieveUpcomingPickupReducer,
    retrieveCompletedPickupReducer,
    declinePickupReducer,
    acceptPickupReducer,
    completedPickupReducer,
    hideComponentReducer,
    sendSMSReducer
} from './reducers/requestReducers'

import {
    socketHolderReducer,
} from './reducers/socketReducer'

import {
    mapReducer,
    addLocationReducer
} from './reducers/mapReducers'

import {
    getConversationReducer,
    getMessageReducer,
    sendMessageReducer
} from './reducers/conversationReducer'

const reducer = combineReducers({
    userLogin: userLoginReducer,

    pendingPickups: retrievePendingPickupReducer,
    upcomingPickups: retrieveUpcomingPickupReducer,
    completedPickups: retrieveCompletedPickupReducer,
    declinePickup: declinePickupReducer,
    acceptPickup: acceptPickupReducer,
    completedPickup: completedPickupReducer,
    hideComponent: hideComponentReducer,
    sendSMS: sendSMSReducer,

    socketHolder: socketHolderReducer,

    map: mapReducer,
    addLocation: addLocationReducer,

    getConversation: getConversationReducer,
    sendMessage: sendMessageReducer,
    getMessage: getMessageReducer,
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