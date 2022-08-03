const router = require('express').Router()
const requestController = require('../../controllers/mobileAppControllers/specialRequestController')
const auth = require('../../middleware/auth')

router.get('/pendingOfflinePickup/:id', requestController.getPendingOfflinePickups)

router.get('/upcomingPickup/:id', requestController.getUpcomingPickups)

router.get('/completedPickup/:id', requestController.getCompletedPickups)

router.put('/declinePickup/:id', requestController.updateDeclinedHauler)

router.put('/acceptPickup/:id', requestController.updateAcceptHauler)

router.put('/updateCompletedPickup/:id', requestController.updateCompletedPickup)

router.put('/exclude/:id', requestController.excludePickup)

router.put('/include/:id', requestController.includePickup)

router.put('/active/:id', requestController.activePickup)

router.get('/:id/:lat/:lng', requestController.getUpcomingPickupsToCollect)

router.put('/:id/remove', requestController.deletePickup)

//router.get('/allPickups/:id', auth, pickupController.getAllPickups)

module.exports = router