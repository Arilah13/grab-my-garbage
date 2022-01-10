const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.post('/register', userController.register)

router.post('/login', userController.login)

router.get('/logout', userController.logout)

router.post('/refresh_token', auth, userController.refreshtoken)

router.route('/profile').get(auth, userController.getUserProfile).put(auth, userController.updateUserProfile)

module.exports = router