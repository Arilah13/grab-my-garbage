const router = require('express').Router()
const requestController = require('../../controllers/mobileAppControllers/scheduleRequestController')
const auth = require('../../middleware/auth')

router.get('/scheduledPickup/:id', auth, requestController.getScheduledPickupforToday)

router.get('/:id', auth, requestController.getScheduledPickupToCollect)

router.put('/pickupToday/:id', auth, requestController.completeScheduledPickupforToday)

router.put('/active/:id', auth, requestController.activePickup)

router.put('/inactive/:id', auth, requestController.inactivePickup)

module.exports = router