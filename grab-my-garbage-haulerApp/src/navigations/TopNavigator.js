import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { StatusBar } from 'react-native'

import Completedstacknavigator from './CompletedStackNavigator'
import Pendingstacknavigator from './PendingStackNavigator'
import Upcomingstacknavigator from './UpcomingStackNavigator'

import { colors } from '../global/styles'

const Tab = createMaterialTopTabNavigator()

const Height = StatusBar.currentHeight

const Topnavigator = ({navigation}) => {
    return (
        <Tab.Navigator
            screenOptions = {{
                tabBarActiveTintColor: colors.darkBlue,
                tabBarInactiveTintColor: colors.darkGrey,
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.grey9,
                    height: 45,
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    fontWeight: 'bold'
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
                backgroundColor: colors.grey9,
                marginTop: Height,
            }}
            tabBarPosition = 'top'
        >
            <Tab.Screen 
                name = "pendingPickup" 
                component = {Pendingstacknavigator} 
                options = {{
                    tabBarLabel: 'Pending'
                }}
                initialParams = {{
                    navigation1: navigation
                }}
            />
            <Tab.Screen 
                name = "upcomingPickup" 
                component = {Upcomingstacknavigator} 
                options = {{
                    tabBarLabel: 'Upcoming'
                }}
                initialParams = {{
                    navigation1: navigation
                }}
            />
            <Tab.Screen 
                name = "completedPickup" 
                component = {Completedstacknavigator} 
                options = {{
                    tabBarLabel: 'Completed'
                }}
                initialParams = {{
                    navigation1: navigation
                }}
            />
        </Tab.Navigator>
    );
}

export default Topnavigator
