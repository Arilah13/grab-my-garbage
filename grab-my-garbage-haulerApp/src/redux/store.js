import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { USER_LOGOUT } from './constants/userConstants'

import {
    userLoginReducer
} from './reducers/userReducer'

import { 
    retrievePendingPickupReducer
} from './reducers/requestReducers'

import {
    mapReducer,
} from './reducers/mapReducers'

const reducer = combineReducers({
    userLogin: userLoginReducer,

    pendingPickups: retrievePendingPickupReducer,

    map: mapReducer,
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