import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'
import CompletedPickupscreen from '../screens/specialPickupScreens/completedspecialPickupScreen'

const Stack = createNativeStackNavigator()

const Completedstacknavigator = ({navigation, route}) => {
    const tabHiddenRoutes = ['PickupDetail']

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
                name = 'completedPickupScreen' 
                component = {CompletedPickupscreen} 
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

export default Completedstacknavigator
