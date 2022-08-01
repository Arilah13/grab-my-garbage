const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    haulerVisible: {
        type: Boolean,
        default: true
    },
    data: {
        type: Object,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

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
        type: Array,
        required: false
    },
    scheduleNotification: {
        type: Number,
        default: 0
    },
    limit: {
        type: Number,
        default: 0
    },
    notification: [notificationSchema]
}, {
    timestamps: true
})

module.exports = mongoose.model('Haulers', haulerSchema)