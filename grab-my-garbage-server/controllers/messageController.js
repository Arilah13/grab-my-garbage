const Messages = require('../models/messageModel')

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
    }
}

module.exports = messageController