const router = require('express').Router()
const schedulePickupController = require('../../controllers/adminAppControllers/schedulePickupController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .get(schedulePickupController.returnSchedulePickupList)

router.route('/:id')
        .put(schedulePickupController.cancelSchedulePickup)

module.exports = router