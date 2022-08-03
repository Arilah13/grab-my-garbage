const router = require('express').Router()
const pickupController = require('../../controllers/mobileAppControllers/specialPickupController')
const auth = require('../../middleware/auth')

router.post('/', pickupController.addSpecialPickup)

router.get('/pendingPickups/:id', pickupController.getPendingPickups)

router.get('/completedPickups/:id', pickupController.getCompletedPickups)

router.get('/acceptedPickups/:id', pickupController.getAcceptedPickups)

router.put('/:id', pickupController.cancelPickup)

router.put('/:id/remove', pickupController.deletePickup)

module.exports = router