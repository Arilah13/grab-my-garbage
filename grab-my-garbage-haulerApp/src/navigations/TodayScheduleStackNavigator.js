import React, { useLayoutEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Schedulepickuprequestscreen from '../screens/schedulePickupScreens/schedulePickupRequestScreen'
import Scheduledpickupdetail from '../screens/schedulePickupScreens/schedulePickupDetailScreen'

const Stack = createNativeStackNavigator()

const TodayScheduleStackNavigator = ({navigation, route}) => {
    const { navigation1 } = route.params

    const tabHiddenRoutes = ['TodayDetail']

    const routeName = getFocusedRouteNameFromRoute(route)

    useLayoutEffect(() => {
        if(tabHiddenRoutes.includes(routeName)) {
            navigation.setOptions({tabBarStyle: {display: 'none'}, swipeEnabled: false})
            navigation1.setOptions({tabBarStyle: {display: 'none'}})
        } else {
            navigation.setOptions({
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.blue1,
                    borderRadius: 15,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    height: 45,
                },
                swipeEnabled: true
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
    })

    return (
        <Stack.Navigator>

            <Stack.Screen
                name = 'Today' 
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
