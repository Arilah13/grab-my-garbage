import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Mapscreen from '../screens/MapScreen'
import Topnavigator from './TopNavigator'
import TabNavigator from './TabNavigator'

const Stack = createNativeStackNavigator()

const Stacknavigator = () => {
    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = 'HomeScreen' 
                component = {TabNavigator} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name = 'Pickup' 
                component = {Mapscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'History'
                component = {Topnavigator}
                options = {{
                    headerShown: false
                }}
            />  

        </Stack.Navigator>
    );
}

export default Stacknavigator
