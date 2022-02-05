import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Pickupdetailscreen from '../screens/pickupScreens/PickupDetailScreen'
import UpcomingPickupscreen from '../screens/pickupScreens/UpcomingPickupScreen'

const Stack = createNativeStackNavigator()

const Upcomingstacknavigator = () => {
    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = "upcomingPickupScreen" 
                component = {UpcomingPickupscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'PickupDetail2'
                component = {Pickupdetailscreen}
                options = {{
                    headerShown: false
                }}
            />  

        </Stack.Navigator>
    );
}

export default Upcomingstacknavigator
