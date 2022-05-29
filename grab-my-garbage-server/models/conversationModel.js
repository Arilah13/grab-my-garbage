const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    haulerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Haulers'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    receiverUserRead: {
        type: Boolean
    },
    receiverHaulerRead: {
        type: Boolean
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Conversations', conversationSchema)