const router = require('express').Router()
const haulerController = require('../../controllers/adminAppControllers/haulerController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.get('/', haulerController.returnHaulerList)

router.post('/', haulerController.addHaulers)

module.exports = router