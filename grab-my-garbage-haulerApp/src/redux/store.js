import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { USER_LOGOUT } from './constants/userConstants'

import {
    userLoginReducer,
    userUpdateProfileReducer
} from './reducers/userReducer'

import { 
    retrievePendingPickupReducer,
    retrieveUpcomingPickupReducer,
    retrieveCompletedPickupReducer,
    declinePickupReducer,
    acceptPickupReducer,
    completedPickupReducer,
    sendSMSReducer,
} from './reducers/specialRequestReducers'

import {
    retrieveSchedulePickupReducer,
    completeSchedulePickupReducer,
    retrieveCollectSchedulePickupReducer,
} from './reducers/scheduleRequestReducer'

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
    userUpdateProfile: userUpdateProfileReducer,

    pendingPickups: retrievePendingPickupReducer,
    upcomingPickups: retrieveUpcomingPickupReducer,
    completedPickups: retrieveCompletedPickupReducer,
    declinePickup: declinePickupReducer,
    acceptPickup: acceptPickupReducer,
    completedPickup: completedPickupReducer,
    sendSMS: sendSMSReducer,

    retrieveSchedulePickup: retrieveSchedulePickupReducer,
    completeSchedulePickup: completeSchedulePickupReducer,
    retrieveCollectSchedulePickup: retrieveCollectSchedulePickupReducer,

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