const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Users = require('../models/userModel')

const paymentController = {
    payment: async(req, res) => {
        try{
            let payment

            const user = await Users.findById(req.params.id)

            if(user.paymentId !== null && user.paymentId !== undefined) {
                payment = user.paymentId
            } else {
                const customer = await stripe.customers.create({
                    name: user.name,
                    email: user.email
                })
                user.paymentId = customer.id
                payment = customer.id
                await user.save()
            }

            const ephemeralKey = await stripe.ephemeralKeys.create(
                {customer: payment},
                {apiVersion: '2020-08-27'}
            )

            const paymentIntent = await stripe.setupIntents.create({
                amount: 1000,
                currency: 'eur',
                customer: payment,
                automatic_payment_methods: {
                    enabled: true
                },
            })

            res.json({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: payment,
                publishable_key: process.env.STRIPE_PUBLISHABLE_KEY
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    paymentIntent: async(req, res) => {
        try{
            res.json({
                publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
                secret_key: process.env.STRIPE_SECRET_KEY
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    // listCard: async(req, res) => {
    //     try{
    //         const user = await Users.findById(req.params.id)

    //         if(user.paymentId !== null && user.paymentId !== undefined) {
    //             const paymentMethods = await stripe.customers.listPaymentMethods(
    //                 user.paymentId,
    //                 {type: 'card'}
    //             )
    //             console.log(paymentMethods)
    //             res.json({
    //                 paymentDetails: paymentMethods
    //             })
    //         } else {
    //             res.json(null)
    //         }
    //     } catch(err) {
    //         return res.status(500).json({msg: err.message})
    //     }
    // }
}

module.exports = paymentController