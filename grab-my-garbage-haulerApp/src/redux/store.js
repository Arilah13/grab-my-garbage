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
    activeSpecialPickupReducer
} from './reducers/specialRequestReducers'

import {
    retrieveSchedulePickupReducer,
    completeSchedulePickupReducer,
    retrieveCollectSchedulePickupReducer,
    activeSchedulePickupReducer,
    inactiveSchedulePickupReducer
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
    sendMessageReducer,
    getAllConversationReducer,
    updateReadMessageReducer
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
    activeSpecialPickup: activeSpecialPickupReducer,

    retrieveSchedulePickup: retrieveSchedulePickupReducer,
    completeSchedulePickup: completeSchedulePickupReducer,
    retrieveCollectSchedulePickup: retrieveCollectSchedulePickupReducer,
    activeSchedulePickup: activeSchedulePickupReducer,
    inactiveSchedulePickup: inactiveSchedulePickupReducer,

    socketHolder: socketHolderReducer,

    map: mapReducer,
    addLocation: addLocationReducer,

    getConversation: getConversationReducer,
    sendMessage: sendMessageReducer,
    getMessage: getMessageReducer,
    getAllConversation: getAllConversationReducer,
    updateReadMessage: updateReadMessageReducer
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