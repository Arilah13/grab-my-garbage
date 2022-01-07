import express from "express"
import Stripe from "stripe"

const app = express()
const port = 3000
const PUBLISHABLE_KEY = 'pk_test_51KEDiWHZHfoHRvThf4FqX65tZSvTQjYSdWF6pk4NxDg6xitd9pX0XM6dupcvbCUHyk2H1VUnJmwpe3Ra6x7wXWpz006qMH30fJ'
const SECRET_KEY = 'sk_test_51KEDiWHZHfoHRvThmwSZkVvxp2wPfZQlRf56ESpsLCsfQnhzJ6cohmEJWwnRUhJi19SAGF9Xw0Pil8BjFAbU66Bs00VnUTot0Z'

const stripe = Stripe(SECRET_KEY, {apiVersion: '2020-08-27'})

app.listen(port, () => {
    console.log(`App listening at ${port}`)
})

app.post('/create-payment-intent', async(req, res) => {
    try{
        const paymentIntent = await Stripe.paymentIntents.create
        ({
            amount: 1099,
            currency: 'usd',
            payment_method_types: ['card']
        })

        const clientSecret = paymentIntent.client_secret

        res.json({
            clientSecret: clientSecret
        })
    } catch(e) {
        console.log(e.message)
        res.json({error: e.message})
    }
})