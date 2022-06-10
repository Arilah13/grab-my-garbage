import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Provider } from 'react-redux'
import { LogBox } from 'react-native'

import store from './src/redux/store'
import Splashnavigator from './src/navigations/SplashNavigator'

export default function App() {
  //LogBox.ignoreAllLogs()
  return (
    <Provider store = {store}>
      <StatusBar 
        style = 'light'
      />
      <Splashnavigator />
    </Provider>
  );
}
