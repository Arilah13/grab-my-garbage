const router = require('express').Router()
const messageController = require('../../controllers/mobileAppControllers/messageController')
const auth = require('../../middleware/auth')

router.post('/user', messageController.newMessageUser)

router.post('/hauler', messageController.newMessageHauler)

router.route('/:id')
    .get(messageController.findMessage)
    .put(messageController.messageReceived)

router.post('/send', messageController.sendSMS)

router.put('/:id')

module.exports = router