import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Acceptedpickupscreen from '../screens/specialPickupScreens/acceptedSpecialPickupScreen'
import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'

const Stack = createNativeStackNavigator()

const Acceptedstacknavigator = ({navigation, route}) => {
    const tabHiddenRoutes = ['pickupDetail']

    const routeName = getFocusedRouteNameFromRoute(route)

    useLayoutEffect(() => {
        if(tabHiddenRoutes.includes(routeName)) {
            navigation.setOptions({tabBarStyle: {display: 'none'}, swipeEnabled: false})
        } else {
            navigation.setOptions({tabBarStyle: {
                elevation: 0,
                backgroundColor: colors.blue1,
                borderRadius: 15,
                marginLeft: 20,
                marginRight: 20,
                height: 45,
            },
            swipeEnabled: true
        })
        }
    })

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

        </Stack.Navigator>
    );
}

export default Acceptedstacknavigator
