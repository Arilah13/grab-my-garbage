const router = require('express').Router()
const userController = require('../../controllers/adminAppControllers/userController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.get('/list', userController.returnUserList)

router.route('/')
        .post(userController.loginAdmin)
        .put(userController.updateAdmin)

router.route('/:id')
        .put(userController.updateUserDetail)
        .delete(userController.deleteUser)

router.post('/special', userController.addSpecialPickup)

router.post('/schedule', userController.addScheduledPickup)

module.exports = router