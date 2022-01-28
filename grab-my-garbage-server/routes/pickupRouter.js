const router = require('express').Router()
const pickupController = require('../controllers/pickupController')
const auth = require('../middleware/auth')

router.post('/specialpickup', auth, pickupController.addSpecialPickup)

router.get('/allPickups/:id', auth, pickupController.getAllPickups)

module.exports = router