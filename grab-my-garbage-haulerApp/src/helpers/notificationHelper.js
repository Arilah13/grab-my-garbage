import * as Notifications from 'expo-notifications'
import { dateHelper, date1Helper, timeHelper } from './specialPickuphelper'

export const getPushToken = async() => {
    const token = (await Notifications.getExpoPushTokenAsync()).data
    return token
}

export const handleNotification = () => {
    Notifications.setNotificationHandler({
        handleNotification: async() => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true
        })
    })
}

export const notificationChecker = (responseListener) => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const {notification: {request: {content: {data: {screen, item}}}}} = response

        if(screen) {
            if(screen === 'PickupDetail') {
                navigation.navigate('HomeScreen', {
                    screen: 'Special',
                    params: {
                        screen: 'upcomingPickup',
                        params: {
                            screen: 'PickupDetail',
                            params: {item, time: timeHelper(item.datetime), date: dateHelper(item.datetime), date1: date1Helper(item.datetime), buttons: false, name: 'Upcoming Pickups'}
                        }
                    }
                })
            } else if(screen === 'Chat') {
                navigation.navigate('HomeScreen', {
                    screen: 'Chat'
                })
            } else {
                navigation.navigate(screen)
            }
        }
    })

    // notificationListener.current = Notifications.addNotificationReceivedListener(response => {
    //     const {notification: {request: {content: {data: {screen, item}}}}} = response

    //     if(screen) {
    //         navigation.navigate(screen)
    //         if(screen === 'PickupDetail') {
    //             navigation.navigate('Special', {
    //                 screen: 'upcomingPickup',
    //                 params: {
    //                     screen: 'PickupDetail',
    //                     params: {item, time: timeHelper(item.datetime), date: dateHelper(item.datetime), date1: date1Helper(item.datetime), buttons: false, name: 'Upcoming Pickups'}
    //                 }
    //             })
    //         }
    //     }
    // })

    return () => {
        Notifications.removeNotificationSubscription(responseListener.current)
    }
}
 

