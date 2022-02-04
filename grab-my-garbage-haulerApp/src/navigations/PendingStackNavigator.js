import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Pickupdetailscreen from '../screens/pickupScreens/PickupDetailScreen'
import PendingPickupscreen from '../screens/pickupScreens/PendingPickupScreen'

const Stack = createNativeStackNavigator()

const Pendingstacknavigator = () => {
    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = "pendingPickupScreen" 
                component = {PendingPickupscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'PickupDetail'
                component = {Pickupdetailscreen}
                options = {{
                    headerShown: false
                }}
            />  

        </Stack.Navigator>
    );
}

export default Pendingstacknavigator
