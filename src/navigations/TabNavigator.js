import React from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'
import Schedulescreen from '../screens/ScheduleScreen'
import Accountscreen from '../screens/AccountScreen'
import Homescreen from '../screens/HomeScreen'

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.blue5,
                tabBarInactiveTintColor: colors.blue6,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 10,
                    elevation: 0,
                    backgroundColor: '#f9f9fc',
                    //borderRadius: 15,
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
                            type = 'material-community'
                            name = 'home'
                            color = {focused ? colors.blue5 : colors.blue4 }
                            size = {30}
                        />
                    ),
                }}
            />

            {/* <Tab.Screen
                name="Schedule"
                component={Schedulescreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name='material-icons'
                            name='schedule'
                            color={focused ? colors.blue5 : colors.blue4 }
                            size={30}
                        />
                    )
                }}
            /> */}

            {/* <Tab.Screen
                name = 'Chat'
                component = {Schedulescreen}
                options = {{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            type = 'material-icons'
                            name = 'chat-bubble-outline'
                            color = {focused ? colors.blue5 : colors.blue4 }
                            size = {30}
                        />
                    )
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
