const router = require('express').Router()
const paymentController = require('../controllers/paymentController')
const auth = require('../middleware/auth')

router.get('/create/:id', auth, paymentController.payment)

router.get('/paymentIntent', auth, paymentController.paymentIntent)

// router.get('/list/:id', paymentController.listCard)

module.exports = router