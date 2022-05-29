const mongoose = require('mongoose')

const haulerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: Array
    },
    password: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        default: 1,
    },
    image: {
        type: String,
        required: false
    },
    service_city: {
        type: String,
        required: true
    },
    pushId: {
        type: String,
        required: false
    },
    scheduleNotification: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Haulers', haulerSchema)