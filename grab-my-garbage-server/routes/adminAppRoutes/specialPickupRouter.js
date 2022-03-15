const router = require('express').Router()
const specialPickupController = require('../../controllers/adminAppControllers/specialPickupController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.get('/', specialPickupController.returnspecialPickupList)

router.get('/:id', specialPickupController.returnSpecialPickupUser)

router.get('/hauler/:id', specialPickupController.returnSpecialPickupHauler)

module.exports = router