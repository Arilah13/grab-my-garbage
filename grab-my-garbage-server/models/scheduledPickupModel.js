const mongoose = require('mongoose')

const scheduledPickupSchema = new mongoose.Schema({
    location: {
        type: Array,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    }, 
    days: {
        type: Array,
        required: true
    },
    timeslot: {
        type: String,
        required: true,
    },
    payment: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Users'
    },
    pickerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Haulers'
    },
    completed: {
        type: Number,
        default: 0
    },
    completedPickups: {
        type: Array,
        required: false,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('scheduledPickup', scheduledPickupSchema)