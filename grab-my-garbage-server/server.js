require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const SOCKET = require('socket.io')
const connectDB = require('./config/db')

const userRoutes = require('./routes/userRouter')
const paymentRoutes = require('./routes/paymentRouter')
const pickupRoutes = require('./routes/pickupRouter')
const requestRoutes = require('./routes/requestRouter')
const haulerRoutes = require('./routes/haulerRouter')
const pickupSocket = require('./socket/pickupSocket')

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(cors())

connectDB()

app.use('/users', userRoutes)
app.use('/payment', paymentRoutes)
app.use('/pickup', pickupRoutes)
app.use('/request', requestRoutes)
app.use('/haulers', haulerRoutes)

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
        console.log(userSocketid)
        if(userSocketid !== false)
            socket.to(userSocketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
    })

    socket.on('haulerDisconnect', () => {
        pickupSocket.haulerDisconnect({id: socket.id})
    })

    socket.on('userJoined', async({userid}) => {
        pickupSocket.userJoin({id: socket.id, userid})
        // const ongoingPickup = await pickupSocket.checkOngoingPickup({userid})
        // if( ongoingPickup !== false) {
        //     const hauler = await pickupSocket.returnHaulerLocation({haulerid: ongoingPickup.haulerid})
        //     socket.to(socketid).emit('userPickup', {pickup: ongoingPickup, hauler: hauler})
        // }
    })
})

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})