const router = require('express').Router()
const conversationController = require('../../controllers/mobileAppControllers/coversationController')
const auth = require('../../middleware/auth')

router.post('/', auth, conversationController.newConversation)

router.get('/:id1/:id2', auth, conversationController.findConversation)

router.get('/:id', conversationController.getConversation)

router.put('/user/:id', conversationController.markReadUser)

router.put('/hauler/:id', auth, conversationController.markReadHauler)

module.exports = router