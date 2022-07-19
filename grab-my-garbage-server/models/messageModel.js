const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String
    },
    sender: {
        type: Array
    },
    text: {
        type: String,
        required: false
    },
    created: {
        type: Date
    },
    pending: {
        type: Boolean,
        required: true
    },
    sent: {
        type: Boolean,
        required: true
    },
    received: {
        type: Boolean,
        required: true
    },
    userSeen: {
        type: Boolean,
        required: true
    },
    haulerSeen: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        required: false
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Messages', messageSchema)