const router = require('express').Router()
const messageController = require('../../controllers/mobileAppControllers/messageController')
const auth = require('../../middleware/auth')

router.post('/user', messageController.newMessageUser)

router.post('/hauler', messageController.newMessageHauler)

router.get('/:id', auth, messageController.findMessage)

router.post('/send', auth, messageController.sendSMS)

module.exports = router