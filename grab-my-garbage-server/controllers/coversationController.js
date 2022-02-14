const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')

const conversationController = {
    newConversation: async(req, res) => {
        try{
            const { senderid, receiverid } = req.body

            const newConversation = new Conversations({
                members: [senderid, receiverid]
            })

            const savedConversation = await newConversation.save()
            
            res.status(200).json(savedConversation)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    findConversation: async(req, res) => {
        try{
            const userid = req.params.id1
            const receiverid = req.params.id2

            const conversation = await Conversations.find({
                members: { $in: [userid] }
            })
            if(!conversation) {return res.status(400).json({msg: "Conversation does not exists."})}

            res.status(200).json(conversation)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = conversationController