import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'
import PendingPickupscreen from '../screens/specialPickupScreens/pendingspecialPickupScreen'

const Stack = createNativeStackNavigator()

const Pendingstacknavigator = ({route, navigation}) => {
    const tabHiddenRoutes = ['PickupDetail']

    const routeName = getFocusedRouteNameFromRoute(route)

    useLayoutEffect(() => {
        if(tabHiddenRoutes.includes(routeName)) {
            navigation.setOptions({tabBarStyle: {display: 'none', marginTop: 0}, swipeEnabled: false})
        } else {
            navigation.setOptions({
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.white,
                    height: 45,
                },
                swipeEnabled: false
            })
        }
    }, [navigation, route])

    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = 'pendingPickupScreen' 
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
