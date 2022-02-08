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
    completedPickupReducer
} from './reducers/requestReducers'

import {
    mapReducer,
    addLocationReducer
} from './reducers/mapReducers'

const reducer = combineReducers({
    userLogin: userLoginReducer,

    pendingPickups: retrievePendingPickupReducer,
    upcomingPickups: retrieveUpcomingPickupReducer,
    completedPickups: retrieveCompletedPickupReducer,
    declinePickup: declinePickupReducer,
    acceptPickup: acceptPickupReducer,
    completedPickup: completedPickupReducer,

    map: mapReducer,
    addLocation: addLocationReducer,
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