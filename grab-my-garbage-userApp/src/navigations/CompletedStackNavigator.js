import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Completedpickupscreen from '../screens/specialPickupScreens/completedSpecialPickupScreen'
import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'

const Stack = createNativeStackNavigator()

const Completedstacknavigator = ({navigation, route}) => {
    const tabHiddenRoutes = ['pickupDetail']

    const routeName = getFocusedRouteNameFromRoute(route)

    const { setView } = route.params

    useLayoutEffect(() => {
        if(tabHiddenRoutes.includes(routeName)) {
            navigation.setOptions({tabBarStyle: {display: 'none'}, swipeEnabled: false})
            setView(false)
        } else {
            navigation.setOptions({tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.white,
                    height: 45,
                },
                swipeEnabled: true
            })
            setView(true)
        }
    })

    return (
        <Stack.Navigator>

            <Stack.Screen 
                name = 'completedPickup'
                component = {Completedpickupscreen} 
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

export default Completedstacknavigator
