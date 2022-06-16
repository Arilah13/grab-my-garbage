const router = require('express').Router()
const requestController = require('../../controllers/mobileAppControllers/scheduleRequestController')
const auth = require('../../middleware/auth')

router.get('/scheduledPickup/:id', auth, requestController.getScheduledPickupforToday)

router.get('/:id/:lat/:lng', auth, requestController.getScheduledPickupToCollect)

router.put('/pickupToday/:id', auth, requestController.completeScheduledPickupforToday)

router.put('/active/:id', requestController.activePickup)

router.put('/inactive/:id', requestController.inactivePickup)

router.get('/all/:id', auth, requestController.getAllScheduledPickup)

module.exports = router