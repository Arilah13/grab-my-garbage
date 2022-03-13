const router = require('express').Router()
const schedulePickupController = require('../../controllers/adminAppControllers/schedulePickupController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.get('/', schedulePickupController.returnschedulePickupList)

router.get('/:id', schedulePickupController.returnSchedulePickupUser)

module.exports = router