import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { LogBox } from 'react-native'
import { Provider } from 'react-redux'
import FlashMessage from 'react-native-flash-message'

import Rootnavigator from './src/navigations/RootNavigator'
import store from './src/redux/store'

export default function App() {
  LogBox.ignoreLogs(["ReactNative.NativeModules.LottieAnimationView.getConstants"])
  return (
    <Provider store = {store}>
        <Rootnavigator />
        <FlashMessage position = {'center'} />
    </Provider>
  );
}
