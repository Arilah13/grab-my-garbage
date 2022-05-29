const router = require('express').Router()
const userController = require('../../controllers/adminAppControllers/userController')
const authAdmin = require('../../middleware/authAdmin')

router.get('/list', authAdmin, userController.returnUserList)

router.route('/')
        .post(authAdmin, userController.loginAdmin)
        .get(authAdmin, userController.returnAdmin)
        .put(authAdmin, userController.updateAdmin)

router.route('/:id')
        .get(authAdmin, userController.returnUserDetail)
        .put(authAdmin, userController.updateUserDetail)
        .delete(authAdmin, userController.deleteUser)

module.exports = router