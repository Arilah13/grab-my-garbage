const router = require('express').Router()
const pickupController = require('../controllers/pickupController')
const auth = require('../middleware/auth')

router.post('/specialpickup', auth, pickupController.addSpecialPickup)

module.exports = router