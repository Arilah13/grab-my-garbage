const router = require('express').Router()
const paymentController = require('../../controllers/mobileAppControllers/paymentController')
const auth = require('../../middleware/auth')

router.post('/create', paymentController.payment)

router.get('/paymentIntent', paymentController.paymentIntent)

// router.get('/list/:id', paymentController.listCard)

module.exports = router