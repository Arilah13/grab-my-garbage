import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'
import UpcomingPickupscreen from '../screens/specialPickupScreens/upcomingspecialPickupScreen'
import Locationscreen from '../screens/specialPickupScreens/specialPickupLocationScreen'
import Pickupchatscreen from '../screens/specialPickupScreens/specialPickupChatScreen'

import { colors } from '../global/styles'
import { hideComponent } from '../redux/actions/specialRequestActions'

const Stack = createNativeStackNavigator()

const Upcomingstacknavigator = ({navigation, route}) => {

    const dispatch = useDispatch()

    const tabHiddenRoutes = ['Location', 'PickupDetail2', 'Chat']

    const routeName = getFocusedRouteNameFromRoute(route)

    useLayoutEffect(() => {
        if(tabHiddenRoutes.includes(routeName)) {
            navigation.setOptions({tabBarStyle: {display: 'none'}, swipeEnabled: false})
            dispatch(hideComponent(true))
        } else {
            dispatch(hideComponent(false))
            navigation.setOptions({tabBarStyle: {
                display: 'flex',
                elevation: 0,
                backgroundColor: colors.white,
                borderRadius: 15
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
                name = 'PickupDetail2'
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

export default Upcomingstacknavigator
