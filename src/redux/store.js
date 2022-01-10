import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import {
    mapReducer,
} from './reducers/mapReducers'

import {
    googleUserLoginReducer,
    userRegisterReducer,
    userLoginReducer
} from './reducers/userReducers'

const reducer = combineReducers({
    map: mapReducer,

    userLogin: googleUserLoginReducer,
    userRegister: userRegisterReducer,
    userLogin:  userLoginReducer
})

const middleware = [thunk]

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store