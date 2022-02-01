const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.post('/register', userController.register)

router.post('/googleregister', userController.google)

router.post('/get', userController.returnDetails)

router.post('/login', userController.login)

router.get('/logout', userController.logout)

router.post('/refresh_token', auth, userController.refreshtoken)

router.route('/profile/:id').get(auth, userController.getUserById).put(auth, userController.updateUserProfile)

router.route('/profile/password/:id').put(userController.updateUserPassword)

module.exports = router