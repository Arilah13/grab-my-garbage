const Messages = require('../models/messageModel')
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

const messageController = {
    newMessage: async(req, res) => {
        try{
            const { conversationId, sender_id, sender_name, sender_avatar, text, createdAt } = req.body

            const newMessage = new Messages({
                conversationId: conversationId,
                sender: [sender_id, sender_name, sender_avatar],
                text: text,
                created: createdAt
            })

            const savedMessage = await newMessage.save()
            
            res.status(200).json(savedMessage)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    findMessage: async(req, res) => {
        try{
            const messageid = req.params.id

            const message = await Messages.find({conversationId: messageid})

            if(!message) return res.status(400).json({msg: "Message does not exists."})

            res.status(200).json(message)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    sendSMS: async(req, res) => {
        try{
            const { receiver, message } = req.body

            client.messages.create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to: receiver,
                body: message
            }).then(() => {
                res.status(200).json({success: true})
            }).catch((err) => {
                res.status(500).json({msg: err.message})
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = messageController