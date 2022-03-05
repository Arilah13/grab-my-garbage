import * as Notifications from 'expo-notifications'

export const getPushToken = async() => {
    const token = (await Notifications.getExpoPushTokenAsync()).data
    return token
}


