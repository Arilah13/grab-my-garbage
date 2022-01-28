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
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Pickup', pickupSchema)