const router = require('express').Router()
const messageController = require('../../controllers/mobileAppControllers/messageController')
const auth = require('../../middleware/auth')

router.post('/user', messageController.newMessageUser)

router.post('/hauler', messageController.newMessageHauler)

router.route('/:id')
    .get(auth, messageController.findMessage)
    .put(messageController.messageReceived)

router.post('/send', auth, messageController.sendSMS)

router.put('/:id')

module.exports = router