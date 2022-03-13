const router = require('express').Router()
const pickupController = require('../../controllers/mobileAppControllers/specialPickupController')
const auth = require('../../middleware/auth')

router.post('/', auth, pickupController.addSpecialPickup)

router.get('/pendingPickups/:id', auth, pickupController.getPendingPickups)

router.get('/completedPickups/:id', auth, pickupController.getCompletedPickups)

router.get('/acceptedPickups/:id', auth, pickupController.getAcceptedPickups)

module.exports = router