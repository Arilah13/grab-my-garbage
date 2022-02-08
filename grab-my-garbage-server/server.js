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
    socket.on('online', ({haulerid, latitude, longitude}) => {
        pickupSocket.haulerJoin({id: socket.id, haulerid, latitude, longitude})
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
        pickupSocket
    })

    socket.on('haulerDisconnect', () => {
        pickupSocket.haulerDisconnect({id: socket.id})
    })

    socket.on('userJoined', ({userid}) => {
        pickupSocket.userJoin({id: socket.id, userid})
    })
})

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})