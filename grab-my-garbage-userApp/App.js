import React from 'react'
import { Provider } from 'react-redux'

import Splashnavigator from './src/navigations/SplashNavigator'
import store from './src/redux/store'

export default function App() {
  return (
    <Provider store = {store}>
        <Splashnavigator />
    </Provider>
  );
}
