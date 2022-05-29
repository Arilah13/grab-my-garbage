const router = require('express').Router()
const requestController = require('../../controllers/mobileAppControllers/specialRequestController')
const auth = require('../../middleware/auth')

router.get('/pendingPickup/:lat/:lng/:id', auth, requestController.getPendingPickups)

router.get('/pendingOfflinePickup/:id', auth, requestController.getPendingOfflinePickups)

router.get('/upcomingPickup/:id', auth, requestController.getUpcomingPickups)

router.get('/completedPickup/:id', auth, requestController.getCompletedPickups)

router.put('/declinePickup/:id', auth, requestController.updateDeclinedHauler)

router.put('/acceptPickup/:id', auth, requestController.updateAcceptHauler)

router.put('/updateCompletedPickup/:id', auth, requestController.updateCompletedPickup)

router.put('/exclude/:id', auth, requestController.excludePickup)

router.put('/include/:id', auth, requestController.includePickup)

router.put('/active/:id', auth, requestController.activePickup)

//router.get('/allPickups/:id', auth, pickupController.getAllPickups)

module.exports = router