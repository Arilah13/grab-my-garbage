import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { USER_LOGOUT } from './constants/userConstants'

import {
    mapReducer,
} from './reducers/mapReducers'

import {
    googleUserLoginReducer,
    userRegisterReducer,
    userLoginReducer,
    userDetailsReducer,
    userUpdateProfileReducer
} from './reducers/userReducers'

import {
    paymentIntentReducer,
    paymentSheetReducer,
} from './reducers/paymentReducers'

import {
    addSpecialPickupReducer,
    retrieveAllPickupsReducer
} from './reducers/pickupReducers'

const reducer = combineReducers({
    map: mapReducer,

    userLogin: googleUserLoginReducer,
    userRegister: userRegisterReducer,
    userLogin:  userLoginReducer,
    userDetail: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,

    paymentIntent: paymentIntentReducer,
    paymentSheet: paymentSheetReducer,

    specialPickup: addSpecialPickupReducer,
    retrieveAllPickups: retrieveAllPickupsReducer
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