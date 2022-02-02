import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Provider } from 'react-redux'

import Rootnavigator from './src/navigations/RootNavigator'
import store from './src/redux/store'

export default function App() {
  return (
    <Provider store = {store}>
        <Rootnavigator />
    </Provider>
  );
}
