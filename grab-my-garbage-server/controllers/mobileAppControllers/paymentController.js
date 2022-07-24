const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Users = require('../../models/userModel')

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

            res.status(200).json({
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
            res.status(200).json({
                publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
                secret_key: process.env.STRIPE_SECRET_KEY
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = paymentController