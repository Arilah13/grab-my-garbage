const router = require('express').Router()
const pickupController = require('../controllers/pickupController')
const auth = require('../middleware/auth')

router.post('/specialpickup', auth, pickupController.addSpecialPickup)

router.get('/pendingPickups/:id', auth, pickupController.getPendingPickups)

router.get('/completedPickups/:id', auth, pickupController.getCompletedPickups)

router.get('/acceptedPickups/:id', auth, pickupController.getAcceptedPickups)

module.exports = router