import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'
import Accountscreen from '../screens/AccountScreen'
import Homescreen from '../screens/HomeScreen'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.blue5,
                tabBarInactiveTintColor: colors.blue6,
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: '#f9f9fc',
                    height: 60
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    bottom: 4
                },
                tabBarShowLabel: true,
                headerShown: false
            }}
            initialRouteName = 'Home'
        >
            <Tab.Screen
                name = 'Home'
                component = {Homescreen}
                options = {{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material'
                            name = 'explore'
                            color = {focused ? colors.blue5 : colors.blue4 }
                            size = {30}
                        />
                    ),
                }}
            />

            {/* <Tab.Screen
                name = 'Pickup'
                component = {Topnavigator}
                options = {{
                    tabBarLabel: 'Pickups',
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material'
                            name = 'local-shipping'
                            color = {focused ? colors.blue5 : colors.blue4 }
                            size = {30}
                        />
                    ),
                }}
            /> */}

            <Tab.Screen
                name = 'Account'
                component = {Accountscreen}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material-icons'
                            name = 'account-circle'
                            color = {focused ? colors.blue5 : colors.blue4 }
                            size = {30}
                        />
                    )
                }}
            /> 
        </Tab.Navigator>
    );
}

export default TabNavigator;
