const router = require('express').Router()
const haulerController = require('../../controllers/mobileAppControllers/haulerController')
const auth = require('../../middleware/auth')

router.post('/login', haulerController.login)

router.post('/', haulerController.returnDetails)

module.exports = router