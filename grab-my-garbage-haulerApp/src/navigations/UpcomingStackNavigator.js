import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'
import UpcomingPickupscreen from '../screens/specialPickupScreens/upcomingspecialPickupScreen'

const Stack = createNativeStackNavigator()

const Upcomingstacknavigator = ({route, navigation}) => {

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
                name = "upcomingPickupScreen" 
                component = {UpcomingPickupscreen} 
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

export default Upcomingstacknavigator
