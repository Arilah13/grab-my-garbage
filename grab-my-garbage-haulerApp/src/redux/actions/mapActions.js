import * as actionTypes from '../constants/mapConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const addOrigin = (latitude, longitude, heading) => async(dispatch) => {
    dispatch({
        type: actionTypes.ADD_ORIGIN,
        payload: {
            latitude: latitude,
            longitude: longitude,
            heading: heading
        }
    })
    
    const location = {latitude, longitude, heading}

    AsyncStorage.setItem('userLocation', JSON.stringify(location))
}