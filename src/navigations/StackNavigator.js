import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Specialpickupscreen from '../screens/SpecialPickupScreen'
import TabNavigator from './TabNavigator'

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = 'Home'
                component = {TabNavigator}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'SpecialPickup'
                component = {Specialpickupscreen}
                options = {{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default StackNavigator;
