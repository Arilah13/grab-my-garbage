const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    userVisible: {
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

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
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
        default: 0,
    },
    image: {
        type: String,
        required: false
    },
    paymentId: {
        type: String,
        required: false
    },
    pushId: {
        type: Array,
        required: false
    },
    notification: [notificationSchema]
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)