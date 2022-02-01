const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Users = require('../models/userModel')
const braintree = require('braintree')

const paymentController = {
    payment: async(req, res) => {
        try{
            let payment
            const {amount, id} = req.body

            const user = await Users.findById(id)

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

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount*100,
                currency: 'lkr',
                customer: payment,
                payment_method_types: ['card']
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
    paypal: async(req, res) => {

        let gateway = new braintree.BraintreeGateway({
            environment: braintree.Environment.Sandbox,
            merchantId: process.env.BRAINTREE_MERCHANT_ID,
            publicKey: process.env.BRAINTREE_PUBLIC_KEY,
            privateKey: process.env.BRAINTREE_PRIVATE_KEY
        })

        try{
            gateway.clientToken.generate({}, (err, response) => {
                if (err) {
                    res.status(400).json({msg: 'no token'})
                }

                res.json({
                    token: response.clientToken
                })
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