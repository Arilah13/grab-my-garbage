const router = require('express').Router()
const haulerController = require('../../controllers/adminAppControllers/haulerController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .get(haulerController.returnHaulerList)
        .post(haulerController.addHaulers)

router.route('/:id')
        .get(haulerController.returnHaulerDetail)
        .delete(haulerController.deleteHauler)
        .put(haulerController.updateHaulerDetail)

module.exports = router