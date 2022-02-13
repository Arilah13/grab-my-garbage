import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Acceptedpickupscreen from '../screens/requestScreens/acceptedPickupScreen'
import Pickupdetailscreen from '../screens/requestScreens/pickupDetailScreen'
import Locationscreen from '../screens/requestScreens/LocationScreen'
import Pickupchatscreen from '../screens/requestScreens/pickupChatScreen'

const Stack = createNativeStackNavigator()

const Acceptedstacknavigator = () => {
    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = "acceptedPickup" 
                component = {Acceptedpickupscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'pickupDetail'
                component = {Pickupdetailscreen}
                options = {{
                    headerShown: false
                }}
            />  
            <Stack.Screen
                name = 'Location'
                component = {Locationscreen}
                options = {{
                    headerShown: false
                }}
            /> 
            <Stack.Screen
                name = 'Chat'
                component = {Pickupchatscreen}
                options = {{
                    headerShown: false
                }}
            />  

        </Stack.Navigator>
    );
}

export default Acceptedstacknavigator
