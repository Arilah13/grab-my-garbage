import React, { useState, useLayoutEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { StatusBar } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import TodayScheduleStackNavigator from './TodayScheduleStackNavigator'
import Allscheduledetailscreen from '../screens/schedulePickupScreens/allScheduleDetailScreen'

const Tab = createMaterialTopTabNavigator()

const Height = StatusBar.currentHeight

const ScheduleTopNavigator = ({navigation}) => {
    const [route1, setRoute1] = useState()

    useLayoutEffect(() => {
        let routeName1
        if(route1) {
            routeName1 = getFocusedRouteNameFromRoute(route1)
        }
        
        if(routeName1 === 'TodayDetail') {
            navigation.setOptions({tabBarStyle: {display: 'none'}})
        } else {
            navigation.setOptions({
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: colors.grey8,
                    height: 50
                }
            })
        }
    }, [route1])

    return (
        <Tab.Navigator
            screenOptions = {{
                tabBarActiveTintColor: colors.darkBlue,
                tabBarInactiveTintColor: colors.darkGrey,
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.white,
                    height: 45,
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    fontWeight: 'bold',
                },
                tabBarShowLabel: true,
                headerShown: false,
                tabBarIndicatorStyle: {
                    height: 2,
                },
                tabBarPressColor: colors.grey9,
                swipeEnabled: false,
            }}
            style = {{
                backgroundColor: colors.white,
                marginTop: Height,
            }}
            tabBarPosition = 'top'
        >
            <Tab.Screen 
                name = 'Today' 
                component = {TodayScheduleStackNavigator} 
                options = {({route}) => ({
                    tabBarLabel: route.name
                },
                setRoute1(route))}
            />
            <Tab.Screen 
                name = 'All'
                component = {Allscheduledetailscreen} 
                options = {({route}) => ({
                    tabBarLabel: route.name
                })}
            />
        </Tab.Navigator>
    );
}

export default ScheduleTopNavigator
