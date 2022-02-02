require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')
const connectDB = require('./config/db')

const userRoutes = require('./routes/userRouter')
const paymentRoutes = require('./routes/paymentRouter')
const pickupRoutes = require('./routes/pickupRouter')
const requestRoutes = require('./routes/requestRouter')
const haulerRoutes = require('./routes/haulerRouter')

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
const io = socket(server)

let haulerSocket = null

io.on('connection', socket => {
    console.log('user connected')
    socket.on('pickRequest', response => {
        if(haulerSocket != null) {
            haulerSocket.emit('pickRequest', response)
        }
    })

    socket.on('lookingPickup', () => {
        console.log('pickup looking')
        haulerSocket = socket
    })
})

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})