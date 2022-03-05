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
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.blue6,
                    tabBarStyle: {
                        elevation: 0,
                        backgroundColor: colors.blue1,
                        borderRadius: 15,
                        marginLeft: 20,
                        marginRight: 20,
                        height: 45,
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: 'bold'
                    },
                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarIndicatorStyle: {
                        height: 40,
                        borderRadius: 15,
                    },
                    tabBarPressColor: colors.white,
                    swipeEnabled: false,
                }}
                style = {{ 
                    paddingBottom: 30,
                    backgroundColor: colors.white,
                }}
                tabBarPosition = 'bottom'
            >
                <Tab.Screen 
                    name = "pendingStack" 
                    component = {Pendingstacknavigator} 
                    options = {{
                        tabBarLabel: 'Pending'
                    }}
                />
                <Tab.Screen 
                    name = "acceptedStack" 
                    component = {Acceptedstacknavigator} 
                    options = {{
                        tabBarLabel: 'Accepted'
                    }}
                />
                <Tab.Screen 
                    name = "completedStack" 
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
