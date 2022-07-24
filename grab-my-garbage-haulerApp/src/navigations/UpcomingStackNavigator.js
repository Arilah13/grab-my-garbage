import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'
import UpcomingPickupscreen from '../screens/specialPickupScreens/upcomingspecialPickupScreen'

const Stack = createNativeStackNavigator()

const Upcomingstacknavigator = ({route, navigation}) => {
    const { navigation1 } = route.params

    const tabHiddenRoutes = ['PickupDetail']

    const routeName = getFocusedRouteNameFromRoute(route)

    useLayoutEffect(() => {
        if(tabHiddenRoutes.includes(routeName)) {
            navigation.setOptions({tabBarStyle: {display: 'none'}, swipeEnabled: false})
            navigation1.setOptions({tabBarStyle: {display: 'none'}})
        } else {
            navigation.setOptions({
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.white,
                    height: 45,
                },
                swipeEnabled: false
            })
            navigation1.setOptions({
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: colors.grey8,
                    height: 50
                }
            })
        }
    }, [navigation, route])

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
