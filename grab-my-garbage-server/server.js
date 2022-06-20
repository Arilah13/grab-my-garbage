require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const connectDB = require('./config/db')

const mobileUserRoutes = require('./routes/mobileAppRoutes/userRouter')
const mobileHaulerRoutes = require('./routes/mobileAppRoutes/haulerRouter')
const mobilePaymentRoutes = require('./routes/mobileAppRoutes/paymentRouter')

const mobileSpecialPickupRoutes = require('./routes/mobileAppRoutes/specialPickupRouter')
const mobileSpecialRequestRoutes = require('./routes/mobileAppRoutes/specialRequestRouter')
const mobileSchedulePickupRoutes = require('./routes/mobileAppRoutes/scheduledPickupRouter')
const mobileScheduleRequestRoutes = require('./routes/mobileAppRoutes/scheduleRequestRouter')

const mobileConversationRoutes = require('./routes/mobileAppRoutes/conversationRouter')
const mobileMessageRoutes = require('./routes/mobileAppRoutes/messageRouter')

const adminUserRoutes = require('./routes/adminAppRoutes/userRouter')
const adminHaulerRoutes = require('./routes/adminAppRoutes/haulerRouter')
const adminSpecialPickupRoutes = require('./routes/adminAppRoutes/specialPickupRouter')
const adminSchedulePickupRoutes = require('./routes/adminAppRoutes/schedulePickupRouter')

const app = express()
app.use(express.urlencoded({extended: false, limit: '50mb'}))
app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))

connectDB()

app.use('/users', mobileUserRoutes)
app.use('/payment', mobilePaymentRoutes)
app.use('/specialpickup', mobileSpecialPickupRoutes)
app.use('/schedulepickup', mobileSchedulePickupRoutes)
app.use('/specialrequest', mobileSpecialRequestRoutes)
app.use('/schedulerequest', mobileScheduleRequestRoutes)
app.use('/haulers', mobileHaulerRoutes)
app.use('/conversation', mobileConversationRoutes)
app.use('/message', mobileMessageRoutes)

app.use('/admin/users', adminUserRoutes)
app.use('/admin/haulers', adminHaulerRoutes)
app.use('/admin/specialpickup', adminSpecialPickupRoutes)
app.use('/admin/schedulepickup', adminSchedulePickupRoutes)

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})