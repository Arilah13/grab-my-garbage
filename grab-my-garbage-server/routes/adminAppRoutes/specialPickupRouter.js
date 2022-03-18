const router = require('express').Router()
const specialPickupController = require('../../controllers/adminAppControllers/specialPickupController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .get(specialPickupController.returnspecialPickupList)

router.route('/:id')
        .get(specialPickupController.returnSpecialPickupDetail)
        .delete(specialPickupController.deleteSpecialPickup)

router.get('/user/:id', specialPickupController.returnSpecialPickupUser)

router.get('/hauler/:id', specialPickupController.returnSpecialPickupHauler)

module.exports = router