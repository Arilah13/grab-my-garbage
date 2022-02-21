require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
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

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})