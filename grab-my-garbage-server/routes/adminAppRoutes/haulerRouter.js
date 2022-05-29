const router = require('express').Router()
const haulerController = require('../../controllers/adminAppControllers/haulerController')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .post(authAdmin, haulerController.addHaulers)
        .get(authAdmin, haulerController.returnHaulerList)

router.route('/:id')
        .put(authAdmin, haulerController.updateHaulerDetail)
        .get(authAdmin, haulerController.returnHaulerDetail)
        .delete(authAdmin, haulerController.deleteHauler)

module.exports = router