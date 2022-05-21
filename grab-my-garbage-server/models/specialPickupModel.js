const mongoose = require('mongoose')

const pickupSchema = new mongoose.Schema({
    location: {
        type: Array,
        required: true,
    },
    datetime: {
        type: String,
        required: true,
    },
    category: {
        type: Array,
        required: true,
    },
    weight: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    payment: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    accepted:{
        type: Number,
        default: 0
    },
    cancelled:{
        type: Number,
        default: 0
    },
    completed:{
        type: Number,
        default: 0
    },
    completedDate:{
        type: String,
        required: false
    },
    pickerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Haulers'
    },
    declinedHaulers:{
        type: Array,
        required: false
    },
    inactive:{
        type: Number,
        default: 0
    },
    active:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Pickup', pickupSchema)