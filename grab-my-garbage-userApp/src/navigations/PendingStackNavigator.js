import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import Pendingpickupscreen from '../screens/pickupScreens/pendingPickupScreen'
import Pickupdetailscreen from '../screens/pickupScreens/pickupDetailScreen'
import Locationscreen from '../screens/pickupScreens/LocationScreen'

import { colors } from '../global/styles'
import { hideComponent } from '../redux/actions/specialPickupActions'

const Stack = createNativeStackNavigator()

const Pendingstacknavigator = ({navigation, route}) => {

    const dispatch = useDispatch()

    const tabHiddenRoutes = ['pickupDetail', 'Location']

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
                name = "pendingPickup" 
                component = {Pendingpickupscreen} 
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

        </Stack.Navigator>
    );
}

export default Pendingstacknavigator