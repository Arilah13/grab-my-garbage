import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { 
    retrievePendingPickupReducer
} from '../redux/reducers/requestReducers'

import {
    mapReducer,
} from './reducers/mapReducers'

const reducer = combineReducers({
    pendingPickups: retrievePendingPickupReducer,

    map: mapReducer,
})

const rootReducer = (state, action) => {
    return reducer(state, action)
}

const middleware = [thunk]

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store