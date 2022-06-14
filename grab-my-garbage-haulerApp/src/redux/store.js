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
    completedPickupReducer,
    sendSMSReducer,
    activeSpecialPickupReducer,
    retrieveCollectSpecialPickupReducer
} from './reducers/specialRequestReducers'

import {
    retrieveSchedulePickupReducer,
    completeSchedulePickupReducer,
    retrieveCollectSchedulePickupReducer,
    activeSchedulePickupReducer,
    inactiveSchedulePickupReducer,
    allSchedulePickupReducer
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
    sendMessageReducer,
    getAllConversationReducer,
    updateReadMessageReducer,
    currentConvoReducer
} from './reducers/conversationReducer'

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userUpdateProfile: userUpdateProfileReducer,

    pendingPickups: retrievePendingPickupReducer,
    upcomingPickups: retrieveUpcomingPickupReducer,
    completedPickups: retrieveCompletedPickupReducer,
    completedPickup: completedPickupReducer,
    sendSMS: sendSMSReducer,
    activeSpecialPickup: activeSpecialPickupReducer,
    retrieveCollectSpecialPickup: retrieveCollectSpecialPickupReducer,

    retrieveSchedulePickup: retrieveSchedulePickupReducer,
    completeSchedulePickup: completeSchedulePickupReducer,
    retrieveCollectSchedulePickup: retrieveCollectSchedulePickupReducer,
    activeSchedulePickup: activeSchedulePickupReducer,
    inactiveSchedulePickup: inactiveSchedulePickupReducer,
    allSchedulePickup: allSchedulePickupReducer,

    socketHolder: socketHolderReducer,

    map: mapReducer,
    addLocation: addLocationReducer,

    getConversation: getConversationReducer,
    sendMessage: sendMessageReducer,
    getAllConversation: getAllConversationReducer,
    updateReadMessage: updateReadMessageReducer,
    currentConvo: currentConvoReducer
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