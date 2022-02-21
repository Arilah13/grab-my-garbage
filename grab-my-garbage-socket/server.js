const express = require('express')
const http = require('http')
const SOCKET = require('socket.io')

const pickupSocket = require('./socket/pickupSocket')
const chatSocket = require('./socket/chatSocket')

const app = express()

const PORT = process.env.PORT || 5001

const server = http.createServer(app)
const io = SOCKET(server)

io.on('connection', socket => {
    socket.on('online', async({haulerid, latitude, longitude}) => {
        const hauler = await pickupSocket.haulerJoin({id: socket.id, haulerid, latitude, longitude})
        const ongoingPickup = await pickupSocket.findPickupOnProgress({haulerid})
        
        if(ongoingPickup) {
            const userSocketid = await pickupSocket.returnUserSocketid({userid: ongoingPickup.userid})
            
            if(userSocketid)
                socket.to(userSocketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
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
            
            socket.emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
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
                    }, index * 1000) 

                })
            })
        }

        await chatSocket.userJoin({id: socket.id, userid})
    })

    socket.on('haulerJoined', async({haulerid}) => {
        await chatSocket.haulerJoin({id: socket.id, haulerid})
    })

    socket.on('lookingPickup', async({latitude, longitude}) => {
        let haulers = []
        
        haulers = await pickupSocket.findHaulers({latitude, longitude})
        
        if(haulers.length > 0) {
            haulers.map((hauler) => {
                socket.to(hauler).emit('newOrder')
            })
        } 
    })

    socket.on('pickupOnProgress', async({haulerid, pickupid, userid}) => {
        const ongoingPickup = await pickupSocket.pickupOnProgress({haulerid, pickupid, userid})
        const userSocketid = await pickupSocket.returnUserSocketid({userid})
        const hauler = await pickupSocket.returnHaulerLocation({haulerid})
        
        if(userSocketid)
            socket.to(userSocketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
    })

    socket.on('pickupCompleted', async({pickupid}) => {
        const userSocketid = await pickupSocket.completePickup({pickupid})

        if(userSocketid)
            socket.to(userSocketid.id).emit('pickupDone', {pickupid: pickupid})
    })

    socket.on('schedulePickupCompleted', async({pickupid, userid}) => {
        const userSocketid = await pickupSocket.returnUserSocketid({userid})

        if(userSocketid)
            socket.to(userSocketid).emit('pickupDone', {pickupid: pickupid})
    })

    socket.on('scheduledPickupOnProgress', async({haulerid, ongoingPickup, pickup}) => {
        await pickupSocket.scheduledPickupOnProgress({haulerid, ongoingPickup, pickup})
        const hauler = await pickupSocket.returnHaulerLocation({haulerid})
        const userSchedulePickup = await pickupSocket.returnUserSchedulePickupDetails({haulerid, hauler})

        userSchedulePickup.map((user, index) => {
            setTimeout(() => {
                if(user.socketId !== false) {
                    socket.to(user.socketId).emit('userSchedulePickup', {hauler, time: user, ongoingPickup: ongoingPickup._id, pickupid: user.id})
                }
            }, 1000*index)
        })
    })

    socket.on('haulerDisconnect', () => {
        pickupSocket.haulerDisconnect({id: socket.id})
    })

    socket.on('sendMessage', async({senderid, receiverid, text, sender, createdAt, pickupid}) => {
        const hauler = await chatSocket.returnHaulerSocketid({haulerid: receiverid})
        const user = await chatSocket.returnUserSocketid({userid: receiverid})
        
        if(user !== false) {
            socket.to(user).emit('getMessage', {senderid, text, sender, createdAt, Pickupid: pickupid})
        } else if(hauler !== false) {
            socket.to(hauler).emit('getMessage', {senderid, text, sender, createdAt, Pickupid: pickupid})
        }
    })

    socket.on('disconnect', () => {
        pickupSocket.removeUser({id: socket.id})
        chatSocket.removeUser({id: socket.id})
    })
})

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})