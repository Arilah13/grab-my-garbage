import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Provider } from 'react-redux'
import FlashMessage from 'react-native-flash-message'
import { StripeProvider } from '@stripe/stripe-react-native'

import Rootnavigator from './src/navigations/RootNavigator'
import store from './src/redux/store'

export default function App() {
  return (
    <Provider store = {store}>
      <StripeProvider publishableKey = 'pk_test_51KEDiWHZHfoHRvThf4FqX65tZSvTQjYSdWF6pk4NxDg6xitd9pX0XM6dupcvbCUHyk2H1VUnJmwpe3Ra6x7wXWpz006qMH30fJ'>
        <Rootnavigator />
        <FlashMessage position = {'center'} />
      </StripeProvider>
    </Provider>
  );
}
