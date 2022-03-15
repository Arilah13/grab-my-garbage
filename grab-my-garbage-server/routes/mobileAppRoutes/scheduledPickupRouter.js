const router = require('express').Router()
const scheduledPickupController = require('../../controllers/mobileAppControllers/schedulePickupController')
const auth = require('../../middleware/auth')

router.post('/', scheduledPickupController.addScheduledPickup)

router.get('/getPickup/:id', auth, scheduledPickupController.getSchedulePickup)

module.exports = router