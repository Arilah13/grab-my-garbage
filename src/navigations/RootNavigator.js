import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import StackNavigator from './StackNavigator'

const Rootnavigator = () => {
    return (
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    );
}

export default Rootnavigator;
