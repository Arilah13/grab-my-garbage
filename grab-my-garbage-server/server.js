require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const socket_io = require('socket.io')
const connectDB = require('./config/db')

const userRoutes = require('./routes/userRouter')
const paymentRoutes = require('./routes/paymentRouter')
const pickupRoutes = require('./routes/pickupRouter')

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(cors())

connectDB()

app.use('/users', userRoutes)
app.use('/payment', paymentRoutes)
app.use('/pickup', pickupRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})