const { Expo } = require('expo-server-sdk')

let expo = new Expo({})

const notificationHelper = {
    notifySpecialPickup: async(pickup, type) => {
        let messages = []
    
        if(type === 'onProgress') {
            messages.push({
                to: pickup.customerId.pushId,
                sound: 'default',
                title: 'Special Pickup',
                body: 'Your special pickup is on-progress',
                data: { 
                    screen: 'pickupDetail',
                    item: pickup,
                }
            })    
        } else if(type === 'arrived') {
            messages.push({
                to: pickup.customerId.pushId,
                sound: 'default',
                title: 'Special Pickup',
                body: 'Hauler has arrived to pick your special pickup'
            }) 
        } else if(type === 'completed') {
            messages.push({
                to: pickup.customerId.pushId,
                sound: 'default',
                title: 'Special Pickup',
                body: 'Your special pickup has been completed',
                data: { 
                    screen: 'pickupDetail',
                    item: pickup,
                }
            })  
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
            messages.push({
                to: pickup.customerId.pushId,
                sound: 'default',
                title: 'Schedule Pickup',
                body: 'Your schedule pickup is on-progress',
                data: { 
                    screen: 'pickupDetail',
                    item: pickup,
                }
            })    
        } else if(type === 'arrived') {
            messages.push({
                to: pickup.customerId.pushId,
                sound: 'default',
                title: 'Schedule Pickup',
                body: 'Hauler has arrived to pick your schedule pickup'
            }) 
        } else if(type === 'completed') {
            messages.push({
                to: pickup.customerId.pushId,
                sound: 'default',
                title: 'Schedule Pickup',
                body: 'Your schedule pickup has been completed',
                data: { 
                    screen: 'pickupDetail',
                    item: pickup,
                }
            })  
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
    notifyMessages: async(receiver, senderid, receiverid) => {
        let result

        // if(conversationNotifications.length > 0) {
        //     const ongoing = await conversationNotifications.find((converse) => converse.senderid === senderid && converse.receiverid === receiverid)
        //     if(!ongoing) {
        //         conversationNotifications.push({
        //             senderid: senderid,
        //             receiverid: receiverid
        //         })
        //         result = false
        //     } else {
        //         result = true
        //     }
        // } else {
        //     conversationNotifications.push({
        //         senderid: senderid,
        //         receiverid: receiverid
        //     })
        //     result = false
        // }

        let messages = []
        
        messages.push({
            to: receiver.pushId,
            sound: 'default',
            title: 'Message',
            body: 'You have got new message',
            // data: { 
            //     screen: 'pickupDetail',
            // }
        })    
    
        let chunks = expo.chunkPushNotifications(messages)
        console.log(messages)
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