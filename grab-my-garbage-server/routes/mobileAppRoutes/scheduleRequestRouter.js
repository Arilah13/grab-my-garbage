const router = require('express').Router()
const requestController = require('../../controllers/mobileAppControllers/scheduleRequestController')
const auth = require('../../middleware/auth')

router.get('/scheduledPickup/:id', requestController.getScheduledPickupforToday)

router.get('/:id/:lat/:lng', requestController.getScheduledPickupToCollect)

router.put('/pickupToday/:id', requestController.completeScheduledPickupforToday)

router.put('/active/:id', requestController.activePickup)

router.put('/inactive/:id', requestController.inactivePickup)

router.get('/all/:id', requestController.getAllScheduledPickup)

module.exports = router