const router = require('express').Router()
const requestController = require('../controllers/requestController')
const auth = require('../middleware/auth')

router.get('/pendingPickup/:lat/:lng', requestController.getPendingPickups)

router.get('/pendingOfflinePickup/:id', requestController.getPendingOfflinePickups)

router.get('/upcomingPickup/:id', requestController.getUpcomingPickups)

router.get('/completedPickup/:id', requestController.getCompletedPickups)

//router.get('/allPickups/:id', auth, pickupController.getAllPickups)

module.exports = router