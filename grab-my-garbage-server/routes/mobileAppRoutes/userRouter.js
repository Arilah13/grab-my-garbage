const router = require('express').Router()
const userController = require('../../controllers/mobileAppControllers/userController')
const auth = require('../../middleware/auth')

router.post('/register', userController.register)

router.post('/googleregister', userController.google)

router.post('/facebookregister', userController.facebook)

router.post('/', userController.returnDetails)

router.post('/login', userController.login)

router.post('/refresh_token', auth, userController.refreshtoken)

router.route('/:id').get(auth, userController.getUserById).put(auth, userController.updateUserProfile)

router.route('/password/:id').put(auth, userController.updateUserPassword)

router.put('/pushtoken/:id', userController.removePushToken)

router.put('/notification/:id', userController.removeNotification)

router.put('/notification/read/:id', userController.readNotification)

module.exports = router