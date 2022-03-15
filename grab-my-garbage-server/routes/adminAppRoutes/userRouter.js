const router = require('express').Router()
const userController = require('../../controllers/adminAppControllers/userController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.get('/', userController.returnUserList)

router.route('/:id')
        .get(userController.returnUserDetail)
        .put(userController.updateUserDetail)
        .delete(userController.deleteUser)

module.exports = router