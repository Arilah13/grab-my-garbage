import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Schedulepickuprequestscreen from '../screens/schedulePickupScreens/schedulePickupRequestScreen'
import Scheduledpickupdetail from '../screens/schedulePickupScreens/schedulePickupDetailScreen'

const Stack = createNativeStackNavigator()

const TodayScheduleStackNavigator = ({navigation, route}) => {
    const tabHiddenRoutes = ['TodayDetail']

    const routeName = getFocusedRouteNameFromRoute(route)

    useLayoutEffect(() => {
        if(tabHiddenRoutes.includes(routeName)) {
            navigation.setOptions({tabBarStyle: {display: 'none'}, swipeEnabled: false})
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
    })

    return (
        <Stack.Navigator>

            <Stack.Screen
                name = 'TodayScreen' 
                component = {Schedulepickuprequestscreen} 
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'TodayDetail' 
                component = {Scheduledpickupdetail} 
                options = {{
                    headerShown: false
                }}
            />
            
        </Stack.Navigator>
    );
}

export default TodayScheduleStackNavigator
