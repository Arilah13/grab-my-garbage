const router = require('express').Router()
const requestController = require('../../controllers/mobileAppControllers/scheduleRequestController')
const auth = require('../../middleware/auth')

router.get('/scheduledPickup/:id', requestController.getScheduledPickupforToday)

router.get('/:id', requestController.getScheduledPickupToCollect)

router.put('/pickupToday/:id', requestController.completeScheduledPickupforToday)

module.exports = router