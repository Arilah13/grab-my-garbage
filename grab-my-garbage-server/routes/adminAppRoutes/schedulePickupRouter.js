const router = require('express').Router()
const schedulePickupController = require('../../controllers/adminAppControllers/schedulePickupController')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .get(authAdmin, schedulePickupController.returnschedulePickupList)
        .post(authAdmin, schedulePickupController.addSchedulePickup)

router.route('/:id')
        .get(authAdmin, schedulePickupController.returnSchedulePickupDetail)
        .put(authAdmin, schedulePickupController.updateSchedulePickupDetail)
        .delete(authAdmin, schedulePickupController.deleteSchedulePickup)

router.get('/user/:id', authAdmin, schedulePickupController.returnSchedulePickupUser)

router.get('/hauler/:id',  authAdmin, schedulePickupController.returnSchedulePickupHauler)

module.exports = router