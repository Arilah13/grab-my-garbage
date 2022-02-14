const router = require('express').Router()
const messageController = require('../controllers/messageController')

router.post('/', messageController.newMessage)

router.get('/:id', messageController.findMessage)

module.exports = router