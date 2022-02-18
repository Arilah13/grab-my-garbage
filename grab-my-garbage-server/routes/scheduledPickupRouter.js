const router = require('express').Router()
const scheduledPickupController = require('../controllers/schedulePickupController')
const auth = require('../middleware/auth')

router.post('/', auth, scheduledPickupController.addScheduledPickup)

router.get('/getPickup/:id', auth, scheduledPickupController.getSpecialPickup)

module.exports = router