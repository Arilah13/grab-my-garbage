const router = require('express').Router()
const specialPickupController = require('../../controllers/adminAppControllers/specialPickupController')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .get(authAdmin, specialPickupController.returnspecialPickupList)

router.route('/:id')
        .get(authAdmin, specialPickupController.returnSpecialPickupDetail)
        .delete(authAdmin, specialPickupController.deleteSpecialPickup)

router.get('/user/:id', authAdmin, specialPickupController.returnSpecialPickupUser)

router.get('/hauler/:id', authAdmin, specialPickupController.returnSpecialPickupHauler)

module.exports = router