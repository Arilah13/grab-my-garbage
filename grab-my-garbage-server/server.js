require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/db')

const userRoutes = require('./routes/userRouter')

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(cors())

connectDB()

app.use('/users', userRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})