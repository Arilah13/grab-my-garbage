const router = require('express').Router()
const scheduledPickupController = require('../../controllers/mobileAppControllers/schedulePickupController')
const auth = require('../../middleware/auth')

router.post('/', scheduledPickupController.addScheduledPickup)

router.get('/getPickup/:id', auth, scheduledPickupController.getSchedulePickup)

router.put('/:id', auth, scheduledPickupController.cancelSchedulePickup)

router.put('/inactive/:id', auth, scheduledPickupController.inactiveSchedulePickup)

module.exports = router