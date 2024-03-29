require('dotenv').config()
const express = require('express')
const http = require('http')
const SOCKET = require('socket.io')
const { Expo } = require('expo-server-sdk')

const pickupSocket = require('./socket/pickupSocket')
const chatSocket = require('./socket/chatSocket')
const notificationHelper = require('./helpers/notificationHelpers')

const app = express()

const PORT = process.env.PORT || 5001

const server = http.createServer(app)
const io = SOCKET(server)

let expo = new Expo({})

io.on('connection', socket => {
    socket.on('online', async({haulerid, latitude, longitude, heading}) => {
        const hauler = await pickupSocket.haulerJoin({id: socket.id, haulerid, latitude, longitude, heading})
        const ongoingPickup = await pickupSocket.findPickupOnProgress({haulerid})

        if(ongoingPickup) {
            const userSocketid = await pickupSocket.returnUserSocketid({userid: ongoingPickup.userid})
            const hauler = {latitude, longitude, heading}
            const location = {latitude: ongoingPickup.pickup.location[0].latitude, longitude: ongoingPickup.pickup.location[0].longitude}
            const time = await pickupSocket.returnTime(hauler, location)
            if(userSocketid)
                socket.to(userSocketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler, time: time})
        }
        
        const ongoingScheduledPickup = await pickupSocket.findScheduledPickupOnProgress({haulerid})
        
        if(ongoingScheduledPickup) {
            const userSocketid = await pickupSocket.returnUserSchedulePickupDetails({haulerid, hauler:{latitude, longitude}})
            
            userSocketid.map((user) => {
                if(user.socketId !== false)
                    socket.to(user.socketId).emit('userSchedulePickup', {hauler, time: user, ongoingPickup: user.ongoingPickup, pickupid: user.id})
            })
        }
    })

    socket.on('userJoined', async({userid}) => {
        await pickupSocket.userJoin({id: socket.id, userid})
        
        const ongoingPickup = await pickupSocket.checkOngoingPickup({userid})
        
        if(ongoingPickup) {
            const hauler = await pickupSocket.returnHaulerLocation({haulerid: ongoingPickup.haulerid})
            const location = {latitude: ongoingPickup.pickup.location[0].latitude, longitude: ongoingPickup.pickup.location[0].longitude}
            const time = await pickupSocket.returnTime({latitude: hauler.latitude, longitude: hauler.longitude}, location)
            
            socket.emit('userPickup', {pickup: ongoingPickup, hauler: hauler, time})
        }

        const ongoingScheduledPickup = await pickupSocket.checkOngoingScheduledPickup({userid})

        if(ongoingScheduledPickup) {
            ongoingScheduledPickup.map(async(ongoingScheduledPickup) => {
                ongoingScheduledPickup.pickup.map((pickup, index) => {

                    setTimeout(async() => {
                        const Time = await pickupSocket.returnDestinationtime({haulerid: pickup.pickerId, pickup: pickup})

                        if(pickup.customerId._id === userid) {
                            const hauler = await pickupSocket.returnHaulerLocation({haulerid: pickup.pickerId})
                            const detail = await pickupSocket.returnOngoingSchedulePickup({haulerid: pickup.pickerId})
                            const time = Time.id === pickup._id ? Time.time : null
                            socket.emit('userSchedulePickup', {hauler: hauler, time: {time: time, haulerid: pickup.pickerId}, ongoingPickup: detail._id, pickupid: pickup._id})
                        }
                    }, index * 2000) 

                })
            })
        }

        await chatSocket.userJoin({id: socket.id, userid})
    })

    socket.on('haulerJoined', async({haulerid}) => {
        await chatSocket.haulerJoin({id: socket.id, haulerid})
    })

    socket.on('adminJoined', async({adminid}) => {
        await pickupSocket.adminJoin({id: socket.id, adminid})
    })

    socket.on('specialPickupOnProgress', async({haulerid, pickupid, userid, pickup}) => {
        const ongoingPickup = await pickupSocket.pickupOnProgress({haulerid, pickupid, userid, pickup})
        const userSocketid = await pickupSocket.returnUserSocketid({userid})
        const hauler = await pickupSocket.returnHaulerLocation({haulerid})
        const location = {latitude: pickup.location[0].latitude, longitude: pickup.location[0].longitude}
        const time = await pickupSocket.returnTime({latitude: hauler.latitude, longitude: hauler.longitude}, location)

        const admin = await pickupSocket.findAdmin()

        notificationHelper.notifySpecialPickup(pickup, 'onProgress')
        
        if(userSocketid) {
            socket.to(userSocketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler, time: time})
        }
        if(admin) {
            admin.map(admin => {
                socket.to(admin).emit('userPickup', {pickup: ongoingPickup, hauler: hauler, time: time})
            })
        }
    })

    socket.on('specialPickupArrived', async({pickup}) => {
        notificationHelper.notifySpecialPickup(pickup, 'arrived')
    })

    socket.on('specialPickupCompleted', async({pickupid, pickup}) => {
        const userSocketid = await pickupSocket.completeSpecialPickup({pickupid})

        const admin = await pickupSocket.findAdmin()

        notificationHelper.notifySpecialPickup(pickup, 'completed')
    
        if(userSocketid) {
            socket.to(userSocketid.id).emit('pickupDone', {pickupid})
        }
        if(admin) {
            admin.map(admin => {
                socket.to(admin).emit('pickupDone', {pickupid})
            })
        }
    })

    socket.on('schedulePickupStarted', async({pickup}) => {
        let messages = []
        let notiPickups = []

        pickup.map(async(pickup) => {
            if(notiPickups.length > 0) {
                const available = await notiPickups.find(pick => pick.customerId._id === pickup.customerId._id)
                if(!available) {
                    notiPickups.push(pickup)
                }
            } else {
                notiPickups.push(pickup)
            }
        })

        pickup.map((pickup) => {
            const socketId = pickupSocket.returnUserSocketid({userid: pickup.customerId._id})
            
            pickup.customerId.pushId.map(push => {
                messages.push({
                    to: push,
                    sound: 'default',
                    title: 'Schedule Pickup',
                    body: 'Hauler has started collecting pickups',
                })   
            })
        })

        let chunks = expo.chunkPushNotifications(messages)
        
        for (let chunk of chunks) {
            try{
                await expo.sendPushNotificationsAsync(chunk)
            } catch (error) {
                console.log(error)
            }
        }
    })

    socket.on('scheduledPickupOnProgress', async({haulerid, ongoingPickup, pickup}) => {
        await pickupSocket.scheduledPickupOnProgress({haulerid, ongoingPickup, pickup})
        const hauler = await pickupSocket.returnHaulerLocation({haulerid})
        
        const userSchedulePickup = await pickupSocket.returnUserSchedulePickupDetails({haulerid, hauler})

        const admin = await pickupSocket.findAdmin()

        userSchedulePickup.map((user, index) => {
            setTimeout(() => {
                if(user.socketId !== false) {
                    socket.to(user.socketId).emit('userSchedulePickup', {hauler, time: user, ongoingPickup: ongoingPickup._id, pickupid: user.id})
                } 

                if(admin) {
                    admin.map(admin => {
                        socket.to(admin).emit('userSchedulePickup', {hauler, time: user, ongoingPickup: ongoingPickup._id, pickupid: user.id})
                    })
                }

                if(ongoingPickup.customerId._id === user.userid) {
                    notificationHelper.notifySchedulePickup(ongoingPickup, 'onProgress')
                }

            }, 2000*index)
        })
    })

    socket.on('schedulePickupArrived', async({pickup}) => {
        notificationHelper.notifySchedulePickup(pickup, 'arrived')
    })

    socket.on('schedulePickupCompleted', async({pickupid, userid, haulerid, pickup}) => {
        const userSocketid = await pickupSocket.returnUserSocketid({userid})
        await pickupSocket.completeSchedulePickup({haulerid})

        const admin = await pickupSocket.findAdmin()
        
        if(userSocketid) {
            socket.to(userSocketid).emit('schedulePickupDone', {pickupid})
        } 

        if(admin) {
            admin.map(admin => {
                socket.to(admin).emit('schedulePickupDone', {pickupid})
            })
        }

        notificationHelper.notifySchedulePickup(pickup, 'completed')
    })

    socket.on('haulerDisconnect', () => {
        pickupSocket.haulerDisconnect({id: socket.id})
    })

    socket.on('sendMessage', async({senderid, receiverid, text, sender, createdAt, senderRole, conversationId, image, receiver}) => {
        if(senderRole === 'hauler') {
            const user = await chatSocket.returnUserSocketid({userid: receiverid})
            
            if(user !== false) {
                const current = await chatSocket.checkUserCurrentChat({id: receiverid})

                await socket.to(user).emit('getMessage', {senderid, text, sender, createdAt, conversationId: conversationId, image: 'data:image/png;base64,' + image, current})
                await socket.emit('messageReceived', {conversationId: conversationId})
                if(current) {
                    socket.emit('messageSeen', {conversationId: conversationId})
                }
            } else {
                notificationHelper.notifyMessages(receiver)
            }
        } else {
            const hauler = await chatSocket.returnHaulerSocketid({haulerid: receiverid})

            if(hauler !== false) {
                const current = await chatSocket.checkHaulerCurrentChat({id: receiverid})

                await socket.to(hauler).emit('getMessage', {senderid, text, sender, createdAt, conversationId: conversationId, image: 'data:image/png;base64,' + image, current})
                await socket.emit('messageReceived', {conversationId: conversationId})
                if(current) {
                    socket.emit('messageSeen', {conversationId: conversationId})
                }
            } else {
                notificationHelper.notifyMessages(receiver)
            }
        }
        
    })

    socket.on('messageDelayReceived', async({id, receiverId, senderRole}) => {
        if(senderRole === 'hauler') {
            const user = await chatSocket.returnUserSocketid({userid: receiverId})
            if(user !== false) {
                socket.to(user).emit('messageReceived', {conversationId: id})
            }
        } else {
            const hauler = await chatSocket.returnHaulerSocketid({haulerid: receiverId})
            if(hauler !== false) {
                socket.to(hauler).emit('messageReceived', {conversationId: id})
            }
        }
    })

    socket.on('messageSeen', async({id, receiverRole, receiverId}) => {
        if(receiverRole === 'hauler') {
            const user = await chatSocket.returnUserSocketid({userid: receiverId})
            if(user !== false) {
                socket.to(user).emit('messageSeen', {conversationId: id})
            }
        } else {
            const hauler = await chatSocket.returnHaulerSocketid({haulerid: receiverId})
            if(hauler !== false) {
                socket.to(hauler).emit('messageSeen', {conversationId: id})
            }
        }
    })

    socket.on('currentMsg', async({userId, conversationId, senderRole}) => {
        if(senderRole === 'user') {
            chatSocket.userCurrentChat({userid: userId, conversationId: conversationId})
        } else {
            chatSocket.haulerCurrentChat({userid: userId, conversationId: conversationId})
        }
    })

    socket.on('removeCurrentMsg', async({userId, senderRole}) => {
        if(senderRole === 'user') {
            chatSocket.removeUserCurrentChat({id: userId})
        } else {
            chatSocket.removeHaulerCurrentChat({id: userId})
        }
    })

    socket.on('newNotification', async({user, id, description, userVisible, seen, data}) => {
        const user1 = await chatSocket.returnUserSocketid({ userid: user })
        if(user1 !== false) {
            socket.to(user1).emit('newNotification', {id, description, userVisible, seen, data})
        }
    })

    socket.on('reconnect', () => {
        console.log(socket)
    })

    socket.on('disconnect', () => {
        pickupSocket.removeUser({id: socket.id})
        chatSocket.removeUser({id: socket.id})
    })
})

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})