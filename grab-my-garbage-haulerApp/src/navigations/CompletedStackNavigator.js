import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'
import CompletedPickupscreen from '../screens/specialPickupScreens/completedspecialPickupScreen'
import Locationscreen from '../screens/specialPickupScreens/specialPickupLocationScreen'

import { colors } from '../global/styles'
import { hideComponent } from '../redux/actions/specialRequestActions'

const Stack = createNativeStackNavigator()

const Completedstacknavigator = ({navigation, route}) => {

    const dispatch = useDispatch()

    const tabHiddenRoutes = ['Location', 'PickupDetail3']

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
                name = 'completedPickupScreen' 
                component = {CompletedPickupscreen} 
                options = {{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name = 'PickupDetail3'
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

export default Completedstacknavigator
