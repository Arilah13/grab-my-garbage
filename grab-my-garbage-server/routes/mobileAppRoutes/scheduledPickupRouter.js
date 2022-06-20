const router = require('express').Router()
const scheduledPickupController = require('../../controllers/mobileAppControllers/schedulePickupController')
const auth = require('../../middleware/auth')

router.post('/', auth, scheduledPickupController.addScheduledPickup)

router.get('/getPickup/:id', auth, scheduledPickupController.getSchedulePickup)

router.put('/:id', scheduledPickupController.cancelSchedulePickup)

router.put('/inactive/:id', auth, scheduledPickupController.inactiveSchedulePickup)

router.put('/active/:id', auth, scheduledPickupController.activeSchedulePickup)

module.exports = router