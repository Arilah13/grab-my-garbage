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
        <>
            <Tab.Navigator
                screenOptions = {{
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.blue6,
                    tabBarStyle: {
                        elevation: 0,
                        backgroundColor: colors.blue1,
                        borderRadius: 15,
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 20,
                        height: 45,
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: 'bold'
                    },
                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarIndicatorStyle: {
                        height: 45,
                        borderRadius: 15,
                    },
                    tabBarPressColor: colors.white,
                    swipeEnabled: false,
                }}
                style = {{
                    backgroundColor: colors.white,
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
        </>
    );
}

export default Topnavigator
