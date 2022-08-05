import React from 'react'
import { Provider } from 'react-redux'
import { LogBox } from 'react-native'

import Splashnavigator from './src/navigations/SplashNavigator'
import store from './src/redux/store'

export default function App() {
  LogBox.ignoreAllLogs()
  return (
    <Provider store = {store}>
        <Splashnavigator />
    </Provider>
  );
}
