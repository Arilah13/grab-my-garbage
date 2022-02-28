import * as Location from 'expo-location'

export const checkPermission = async() => {
    const hasPermission = await Location.requestForegroundPermissionsAsync()
    if(hasPermission.status !== 'granted') {
        const permission = await askPermission()
        
        return permission
    }
    return true
};

const askPermission = async() => {
    const permission = await Location.requestForegroundPermissionsAsync()
    return permission.status === 'granted'
}