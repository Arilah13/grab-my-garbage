const mongoose = require('mongoose')
require('dotenv').config()

const URI = process.env.MONGODB_URL
const connectDB = async() => {
    try{
        mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        console.log('MONGODB connection success')
    }catch(err){
        console.error("MONGODB Connection Failed")
        process.exit(1)
    }
}

module.exports = connectDB