const router = require('express').Router()
const scheduledPickupController = require('../../controllers/mobileAppControllers/schedulePickupController')
const auth = require('../../middleware/auth')

router.post('/', scheduledPickupController.addScheduledPickup)

router.get('/getPickup/:id', scheduledPickupController.getSchedulePickup)

router.put('/:id', scheduledPickupController.cancelSchedulePickup)

router.put('/inactive/:id', scheduledPickupController.inactiveSchedulePickup)

router.put('/active/:id', scheduledPickupController.activeSchedulePickup)

router.put('/:id/remove', scheduledPickupController.deletePickup)

module.exports = router