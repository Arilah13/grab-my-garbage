const { Expo } = require('expo-server-sdk')

let expo = new Expo({})

const notificationHelper = {
    notifySpecialPickup: async(pickup, type) => {
        let messages = []
        
        if(type === 'onProgress') {

            if(pickup.customerId.pushId.length > 0) {
                for(let i=0; i<pickup.customerId.pushId.length; i++) {
                    messages.push({
                        to: pickup.customerId.pushId[i],
                        sound: 'default',
                        title: 'Special Pickup',
                        body: 'Your special pickup is on-progress',
                        data: { 
                            screen: 'pickupDetail',
                            item: pickup,
                        }
                    })
                }
            }

        } else if(type === 'arrived') {

            if(pickup.customerId.pushId.length > 0) {
                for(let i=0; i<pickup.customerId.pushId.length; i++) {
                    messages.push({
                        to: pickup.customerId.pushId[i],
                        sound: 'default',
                        title: 'Special Pickup',
                        body: 'Hauler has arrived to pick your special pickup',
                        data: { 
                            screen: 'pickupDetail',
                            item: pickup,
                        }
                    })
                } 
            }

        } else if(type === 'completed') {

            if(pickup.customerId.pushId.length > 0) {
                for(let i=0; i<pickup.customerId.pushId.length; i++) {
                    messages.push({
                        to: pickup.customerId.pushId[i],
                        sound: 'default',
                        title: 'Special Pickup',
                        body: 'Your special pickup has been completed',
                        data: { 
                            screen: 'completedPickup',
                        }
                    })  
                }
            }

        }
    
        let chunks = expo.chunkPushNotifications(messages)
    
        for (let chunk of chunks) {
            try{
                await expo.sendPushNotificationsAsync(chunk)
            } catch (error) {
                console.log(error)
            }
        }
    },
    notifySchedulePickup: async(pickup, type) => {
        let messages = []
    
        if(type === 'onProgress') {

            if(pickup.customerId.pushId.length > 0) {
                for(let i=0; i<pickup.customerId.pushId.length; i++) {
                    messages.push({
                        to: pickup.customerId.pushId[i],
                        sound: 'default',
                        title: 'Schedule Pickup',
                        body: 'Your schedule pickup is on-progress',
                        data: { 
                            screen: 'PickupScheduleDetail',
                            item: pickup,
                        }
                    }) 
                }  
            }

        } else if(type === 'arrived') {

            if(pickup.customerId.pushId.length > 0) {
                for(let i=0; i<pickup.customerId.pushId.length; i++) {
                    messages.push({
                        to: pickup.customerId.pushId[i],
                        sound: 'default',
                        title: 'Schedule Pickup',
                        body: 'Hauler has arrived to pick your schedule pickup',
                        data: { 
                            screen: 'PickupScheduleDetail',
                            item: pickup,
                        }
                    }) 
                }
            }

        } else if(type === 'completed') {

            if(pickup.customerId.pushId.length > 0) {
                for(let i=0; i<pickup.customerId.pushId.length; i++) {
                    messages.push({
                        to: pickup.customerId.pushId[i],
                        sound: 'default',
                        title: 'Schedule Pickup',
                        body: 'Your schedule pickup has been completed',
                        data: { 
                            screen: 'ScheduleRequests'
                        }
                    }) 
                }
            }

        }
    
        let chunks = expo.chunkPushNotifications(messages)
    
        for (let chunk of chunks) {
            try{
                await expo.sendPushNotificationsAsync(chunk)
            } catch (error) {
                console.log(error)
            }
        }
    },
    notifyMessages: async(receiver) => {
        let messages = []
        
        if(receiver.pushId.length > 0) {
            for(let i=0; i<receiver.pushId.length; i++) {
                messages.push({
                    to: receiver.pushId[i],
                    sound: 'default',
                    title: 'Message',
                    body: 'You have got new message',
                    data: { 
                        screen: 'Chat',
                    }
                })    
            }
        }
    
        let chunks = expo.chunkPushNotifications(messages)

        for (let chunk of chunks) {
            try{
                await expo.sendPushNotificationsAsync(chunk)
            } catch (error) {
                console.log(error)
            }
        }
    }
}

module.exports = notificationHelper