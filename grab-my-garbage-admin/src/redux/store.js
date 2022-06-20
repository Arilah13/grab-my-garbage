import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { ADMIN_LOGOUT } from './constants/userConstants'

import {
    userListReducer,
    adminDetailReducer,
    adminDetailUpdateReducer,
    adminLoginReducer,
} from './reducers/userReducers'

import {
    haulerListReducer,
} from './reducers/haulerReducers'

import {
    schedulePickupListReducer,
} from './reducers/schedulePickupReducers'

import {
    specialPickupListReducer,
} from './reducers/specialPickupReducers'

const reducer = combineReducers({
    userList: userListReducer,
    adminDetail: adminDetailReducer,
    adminDetailUpdate: adminDetailUpdateReducer,
    adminLogin: adminLoginReducer,

    haulerList: haulerListReducer,

    schedulePickupList: schedulePickupListReducer,

    specialPickupList: specialPickupListReducer,
})

const adminInfoFromStorage = localStorage.getItem('admingarbage')
    ? JSON.parse(localStorage.getItem('admingarbage'))
    : null

const initialState = {
    adminLogin: {
        admin: adminInfoFromStorage
    }
}

const middleware = [thunk]

const rootReducer = (state, action) => {
    if(action.type === ADMIN_LOGOUT) {
        state = undefined
    }
    return reducer(state, action)
}

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store