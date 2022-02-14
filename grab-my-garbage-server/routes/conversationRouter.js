const router = require('express').Router()
const conversationController = require('../controllers/coversationController')

router.post('/', conversationController.newConversation)

router.get('/:id1/:id2', conversationController.findConversation)

module.exports = router