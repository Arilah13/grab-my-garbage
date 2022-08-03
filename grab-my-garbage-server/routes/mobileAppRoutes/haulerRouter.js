const router = require('express').Router()
const haulerController = require('../../controllers/mobileAppControllers/haulerController')
const auth = require('../../middleware/auth')

router.post('/login', haulerController.login)

router.post('/', haulerController.returnDetails)

//router.post('/notification', haulerController.add)

router.put('/password/:id', haulerController.updateHaulerPassword)

router.put('/pushtoken/:id', haulerController.removePushToken)

router.put('/notification/:id', haulerController.removeNotification)

router.put('/notification/read/:id', haulerController.readNotification)

module.exports = router