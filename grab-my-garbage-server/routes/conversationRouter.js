const router = require('express').Router()
const conversationController = require('../controllers/coversationController')
const auth = require('../middleware/auth')

router.post('/', auth, conversationController.newConversation)

router.get('/:id1/:id2', auth, conversationController.findConversation)

module.exports = router