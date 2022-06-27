const router = require('express').Router()
const haulerController = require('../../controllers/mobileAppControllers/haulerController')
const auth = require('../../middleware/auth')

router.post('/login', haulerController.login)

router.post('/', haulerController.returnDetails)

router.put('/password/:id', auth, haulerController.updateHaulerPassword)

router.put('/pushtoken/:id', haulerController.removePushToken)

module.exports = router