require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const SOCKET = require('socket.io')
const connectDB = require('./config/db')

const userRoutes = require('./routes/userRouter')
const haulerRoutes = require('./routes/haulerRouter')
const paymentRoutes = require('./routes/paymentRouter')

const specialPickupRoutes = require('./routes/specialPickupRouter')
const specialRequestRoutes = require('./routes/specialRequestRouter')
const schedulePickupRoutes = require('./routes/scheduledPickupRouter')
const scheduleRequestRoutes = require('./routes/scheduleRequestRouter')

const conversationRoutes = require('./routes/conversationRouter')
const messageRoutes = require('./routes/messageRouter')

const pickupSocket = require('./socket/pickupSocket')
const chatSocket = require('./socket/chatSocket')


const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(cors())

connectDB()

app.use('/users', userRoutes)
app.use('/payment', paymentRoutes)
app.use('/specialpickup', specialPickupRoutes)
app.use('/schedulepickup', schedulePickupRoutes)
app.use('/specialrequest', specialRequestRoutes)
app.use('/schedulerequest', scheduleRequestRoutes)
app.use('/haulers', haulerRoutes)
app.use('/conversation', conversationRoutes)
app.use('/message', messageRoutes)

const PORT = process.env.PORT || 5000

const server = http.createServer(app)
const io = SOCKET(server)

io.on('connection', socket => {
    socket.on('online', async({haulerid, latitude, longitude}) => {
        const hauler = await pickupSocket.haulerJoin({id: socket.id, haulerid, latitude, longitude})
        const ongoingPickup = await pickupSocket.findPickupOnProgress({haulerid})
        if(ongoingPickup !== false) {
            const userSocketid = await pickupSocket.returnUserSocketid({userid: ongoingPickup.userid})
            if(userSocketid !== false)
                socket.to(userSocketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
        }
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
        if(userSocketid !== false)
            socket.to(userSocketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
    })

    socket.on('pickupCompleted', async({pickupid}) => {
        const userSocketid = await pickupSocket.completePickup({pickupid})
        if(userSocketid !== false)
            socket.to(userSocketid.id).emit('pickupDone', {pickupid: pickupid})
    })

    socket.on('haulerDisconnect', () => {
        pickupSocket.haulerDisconnect({id: socket.id})
    })

    socket.on('userJoined', async({userid}) => {
        await pickupSocket.userJoin({id: socket.id, userid})
        const ongoingPickup = await pickupSocket.checkOngoingPickup({userid})
        if( ongoingPickup !== false) {
            const hauler = await pickupSocket.returnHaulerLocation({haulerid: ongoingPickup.haulerid})
            socket.emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
        }
        await chatSocket.userJoin({id: socket.id, userid})
    })

    socket.on('haulerJoined', async({haulerid}) => {
        await chatSocket.haulerJoin({id: socket.id, haulerid})
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