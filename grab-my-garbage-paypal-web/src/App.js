import React from "react"
import ReactDOM from "react-dom"
import "./App.css"
import axios from "axios"

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM })

function App() {
  const _createOrder = async(data, actions) => {
    let price = window._price
    const amount = await axios.get(`https://v6.exchangerate-api.com/v6/2fa3253696e2c34e9237a37f/pair/LKR/USD/${price}`)
    const final = Math.round(amount.data.conversion_result * 10) / 10

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: final,
          },
        },
      ],
    })
  }

  const _onApprove = async(data, actions) => {
    let order = await actions.order.capture()
    window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify(order))
    return order
  }

  const _onError = async(err) => {
    let errObj = {
      err: err,
      status: "FAILED",
    };
    window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify(errObj))
  }

  return (
    <div className="App">
      <PayPalButton
        style = {{
          layout: 'horizontal',
          color: 'blue',
          tagline: false,
          label: 'pay'
        }}
        createOrder={(data, actions) => _createOrder(data, actions)}
        onApprove={(data, actions) => _onApprove(data, actions)}
        onError={(err) => _onError("ERROR")}
      />
    </div>
  );
}
export default App