import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { colors } from '../global/styles'

import Acceptedstacknavigator from './AcceptedStackNavigator'
import Pendingstacknavigator from './PendingStackNavigator'
import Completedstacknavigator from './CompletedStackNavigator'

const Tab = createMaterialTopTabNavigator()

const Topnavigator = () => {
    return (
        <> 
            <Tab.Navigator
                screenOptions = {{
                    tabBarActiveTintColor: colors.darkBlue,
                    tabBarInactiveTintColor: colors.darkGrey,
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
                    tabBarStyle: {
                        elevation: 0,
                        backgroundColor: colors.grey9,
                        height: 45,
                    }
                }}
                style = {{ 
                    backgroundColor: colors.grey9,
                }}
                tabBarPosition = 'bottom'
            >
                <Tab.Screen 
                    name = 'pendingStack'
                    component = {Pendingstacknavigator} 
                    options = {{
                        tabBarLabel: 'Pending'
                    }}
                />
                <Tab.Screen 
                    name = 'acceptedStack'
                    component = {Acceptedstacknavigator} 
                    options = {{
                        tabBarLabel: 'Accepted'
                    }}
                />
                <Tab.Screen 
                    name = 'completedStack'
                    component = {Completedstacknavigator} 
                    options = {{
                        tabBarLabel: 'Completed'
                    }}
                />
            </Tab.Navigator>
        </>
    );
}

export default Topnavigator
