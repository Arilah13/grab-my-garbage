const Conversations = require('../../models/conversationModel')
const Messages = require('../../models/messageModel')

const conversationController = {
    newConversation: async(req, res) => {
        try{
            const { userid: userId, haulerid: haulerId } = req.body

            const newConversation = new Conversations({
                haulerId: haulerId, userId: userId, receiverUserRead: false, receiverHaulerRead: false
            })

            const savedConversation = await newConversation.save()
            
            res.status(201).json(savedConversation)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    findConversation: async(req, res) => {
        try{
            const userId = req.params.id1
            const haulerId = req.params.id2

            const conversation = await Conversations.find({
                haulerId: haulerId, userId: userId
            }).populate('haulerId').populate('userId')
            
            if(!conversation) {return res.status(400).json({msg: 'Conversation does not exists.'})}

            res.status(200).json(conversation)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getConversation: async(req, res) => {
        try{
            let endResult = []

            const conversation = await Conversations.find({
                $or: [{userId: req.params.id}, {haulerId: req.params.id}]
            }).populate('haulerId').populate('userId')

            if(conversation.length > 0) {
                for(let i=0; i<conversation.length; i++) {
                    const message = await Messages.find({conversationId: conversation[i]._id})
                    if(message.length > 0) {
                        endResult.push({conversation: conversation[i], message: message[message.length-1], totalMessage: message})
                    }
                }
                if(endResult.length > 1 ) {
                    endResult.sort((a, b) => b.message.createdAt - a.message.createdAt)
                }
            }
            
            res.status(200).json(endResult)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    markReadUser: async(req, res) => {
        try{
            const conversation = await Conversations.findById(req.params.id)

            conversation.receiverUserRead = true

            await conversation.save()

            res.status(200).json({msg: 'updated'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    markReadHauler: async(req, res) => {
        try{
            const conversation = await Conversations.findById(req.params.id)

            conversation.receiverHaulerRead = true

            await conversation.save()

            res.status(200).json({msg: 'updated'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = conversationController