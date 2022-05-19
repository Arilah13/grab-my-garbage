const router = require('express').Router()
const conversationController = require('../../controllers/mobileAppControllers/coversationController')
const auth = require('../../middleware/auth')

router.post('/', auth, conversationController.newConversation)

router.get('/:id1/:id2', auth, conversationController.findConversation)

router.get('/:id', auth, conversationController.getConversation)

router.put('/:id', conversationController.markRead)

module.exports = router