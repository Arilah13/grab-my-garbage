const router = require('express').Router()
const specialPickupController = require('../../controllers/adminAppControllers/specialPickupController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .get(specialPickupController.returnSpecialPickupList)

router.route('/:id')
        .put(specialPickupController.cancelSpecialPickup)

module.exports = router