const router = require('express').Router()
const haulerController = require('../../controllers/adminAppControllers/haulerController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/')
        .post(haulerController.addHaulers)
        .get(haulerController.returnHaulerList)

router.route('/:id')
        .put(haulerController.updateHaulerDetail)
        .get(haulerController.returnHaulerDetail)
        .delete(haulerController.deleteHauler)

module.exports = router