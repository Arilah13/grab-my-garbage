import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Pickupdetailscreen from '../screens/pickupScreens/PickupDetailScreen'
import CompletedPickupscreen from '../screens/pickupScreens/CompletedPickupScreen'

const Stack = createNativeStackNavigator()

const Completedstacknavigator = () => {
    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = "completedPickupScreen" 
                component = {CompletedPickupscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'PickupDetail3'
                component = {Pickupdetailscreen}
                options = {{
                    headerShown: false
                }}
            />  

        </Stack.Navigator>
    );
}

export default Completedstacknavigator
