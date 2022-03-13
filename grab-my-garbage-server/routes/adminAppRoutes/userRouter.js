const router = require('express').Router()
const userController = require('../../controllers/adminAppControllers/userController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.get('/', userController.returnUserList)

router.get('/:id', userController.returnUserDetail)

router.put('/:id', userController.updateUserDetail)

module.exports = router