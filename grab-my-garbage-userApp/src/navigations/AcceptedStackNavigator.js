import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import Acceptedpickupscreen from '../screens/specialPickupScreens/acceptedSpecialPickupScreen'
import Pickupdetailscreen from '../screens/specialPickupScreens/specialPickupDetailScreen'
import Locationscreen from '../screens/specialPickupScreens/specialPickupLocationScreen'
import Pickupchatscreen from '../screens/specialPickupScreens/pickupChatScreen'

import { colors } from '../global/styles'
import { hideComponent } from '../redux/actions/specialPickupActions'

const Stack = createNativeStackNavigator()

const Acceptedstacknavigator = ({navigation, route}) => {

    const dispatch = useDispatch()

    const tabHiddenRoutes = ['pickupDetail', 'Location', 'Chat']

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
