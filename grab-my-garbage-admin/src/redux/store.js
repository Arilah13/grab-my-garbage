import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import {
    userListReducer,
    userSchedulePickupReducer,
    userSpecialPickupReducer,
    userDetailReducer,
    userDetailUpdateReducer
} from './reducers/userReducers'

import {
    haulerListReducer
} from './reducers/haulerReducers'

import {
    schedulePickupListReducer
} from './reducers/schedulePickupReducers'

import {
    specialPickupListReducer
} from './reducers/specialPickupReducers'

const reducer = combineReducers({
    userList: userListReducer,
    userSchedulePickup: userSchedulePickupReducer,
    userSpecialPickup: userSpecialPickupReducer,
    userDetail: userDetailReducer,
    userDetailUpdate: userDetailUpdateReducer,

    haulerList: haulerListReducer,

    schedulePickupList: schedulePickupListReducer,

    specialPickupList: specialPickupListReducer
})

const middleware = [thunk]

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store