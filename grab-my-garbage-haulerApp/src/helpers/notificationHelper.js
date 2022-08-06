import * as Notifications from 'expo-notifications'

export const getPushToken = async() => {
    let experienceId = '@rilah/grab-my-garbage-driver'
    const token = (await Notifications.getExpoPushTokenAsync({experienceId})).data
    return token
}
 

