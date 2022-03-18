const router = require('express').Router()
const userController = require('../../controllers/adminAppControllers/userController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.get('/list', userController.returnUserList)

router.route('/')
        .post(userController.loginAdmin)
        .get(userController.returnAdmin)
        .put(userController.updateAdmin)

router.route('/:id')
        .get(userController.returnUserDetail)
        .put(userController.updateUserDetail)
        .delete(userController.deleteUser)

module.exports = router