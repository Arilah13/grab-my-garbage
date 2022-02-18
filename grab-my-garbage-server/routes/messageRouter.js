const router = require('express').Router()
const messageController = require('../controllers/messageController')
const auth = require('../middleware/auth')

router.post('/', auth, messageController.newMessage)

router.get('/:id', auth, messageController.findMessage)

router.post('/send', auth, messageController.sendSMS)

module.exports = router