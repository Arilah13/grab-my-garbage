import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Provider } from 'react-redux'

//import store from './src/redux/store'
import Rootnavigator from './src/navigations/RootNavigator'

export default function App() {
  return (
    <>
        <Rootnavigator />
    </>
  );
}
