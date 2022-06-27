const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String
    },
    sender: {
        type: Array
    },
    text: {
        type: String
    },
    created: {
        type: Date
    },
    image: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Messages', messageSchema)