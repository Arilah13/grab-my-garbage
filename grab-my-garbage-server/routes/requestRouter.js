const router = require('express').Router()
const requestController = require('../controllers/requestController')
const auth = require('../middleware/auth')

router.get('/pendingPickup/:lat/:lng', requestController.getPendingPickups)

//router.get('/allPickups/:id', auth, pickupController.getAllPickups)

module.exports = router