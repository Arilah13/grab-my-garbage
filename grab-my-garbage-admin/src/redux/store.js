import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { ADMIN_LOGOUT } from './constants/userConstants'

import {
    userListReducer,
    adminLoginReducer,
} from './reducers/userReducers'

import {
    haulerListReducer,
} from './reducers/haulerReducers'

import {
    schedulePickupListReducer,
    addOngoingSchedulePickupReducer
} from './reducers/schedulePickupReducers'

import {
    specialPickupListReducer,
    addOngoingSpecialPickupReducer
} from './reducers/specialPickupReducers'

import {
    socketHolderReducer
} from './reducers/socketReducer'

const reducer = combineReducers({
    userList: userListReducer,
    adminLogin: adminLoginReducer,

    haulerList: haulerListReducer,

    socketHolder: socketHolderReducer,

    schedulePickupList: schedulePickupListReducer,
    addOngoingSchedulePickup: addOngoingSchedulePickupReducer,

    specialPickupList: specialPickupListReducer,
    addOngoingSpecialPickup: addOngoingSpecialPickupReducer
})

const middleware = [thunk]

const rootReducer = (state, action) => {
    if(action.type === ADMIN_LOGOUT) {
        state = undefined
    }
    return reducer(state, action)
}

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store