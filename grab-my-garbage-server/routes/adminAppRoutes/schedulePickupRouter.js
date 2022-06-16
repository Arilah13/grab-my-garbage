const router = require('express').Router()
const schedulePickupController = require('../../controllers/adminAppControllers/schedulePickupController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .get(schedulePickupController.returnschedulePickupList)
        .post(schedulePickupController.addSchedulePickup)

router.route('/:id')
        .get(schedulePickupController.returnSchedulePickupDetail)
        .put(schedulePickupController.updateSchedulePickupDetail)
        .delete(schedulePickupController.deleteSchedulePickup)

router.get('/user/:id', schedulePickupController.returnSchedulePickupUser)

router.get('/hauler/:id', schedulePickupController.returnSchedulePickupHauler)

module.exports = router