import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import {
    userListReducer,
    userSchedulePickupReducer,
    userSpecialPickupReducer,
    userDetailReducer,
    userDetailUpdateReducer,
    userDeleteReducer
} from './reducers/userReducers'

import {
    haulerListReducer,
    haulerAddReducer,
    haulerDeleteReducer,
    haulerSchedulePickupReducer,
    haulerSpecialPickupReducer,
    haulerDetailReducer,
    haulerDetailUpdateReducer
} from './reducers/haulerReducers'

import {
    schedulePickupListReducer,
    schedulePickupAddReducer,
    schedulePickupDeleteReducer,
    schedulePickupDetailReducer,
    schedulePickupDisableReducer,
    schedulePickupUpdateReducer
} from './reducers/schedulePickupReducers'

import {
    specialPickupListReducer,
    specialPickupDeleteReducer,
    specialPickupDetailReducer,
} from './reducers/specialPickupReducers'

const reducer = combineReducers({
    userList: userListReducer,
    userSchedulePickup: userSchedulePickupReducer,
    userSpecialPickup: userSpecialPickupReducer,
    userDetail: userDetailReducer,
    userDetailUpdate: userDetailUpdateReducer,
    userDelete: userDeleteReducer,

    haulerList: haulerListReducer,
    haulerAdd: haulerAddReducer,
    haulerDelete: haulerDeleteReducer,
    haulerSchedulePickup: haulerSchedulePickupReducer,
    haulerSpecialPickup: haulerSpecialPickupReducer,
    haulerDetail: haulerDetailReducer,
    haulerDetailUpdate: haulerDetailUpdateReducer,

    schedulePickupList: schedulePickupListReducer,
    schedulePickupAdd: schedulePickupAddReducer,
    schedulePickupDelete: schedulePickupDeleteReducer,
    schedulePickupDetail: schedulePickupDetailReducer,
    schedulePickupDisable: schedulePickupDisableReducer,
    schedulePickupUpdate: schedulePickupUpdateReducer,

    specialPickupList: specialPickupListReducer,
    specialPickupDelete: specialPickupDeleteReducer,
    specialPickupDetail: specialPickupDetailReducer,
})

const middleware = [thunk]

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store