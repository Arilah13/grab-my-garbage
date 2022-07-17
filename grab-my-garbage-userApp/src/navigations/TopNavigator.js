import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../global/styles'

import Acceptedstacknavigator from './AcceptedStackNavigator'
import Pendingstacknavigator from './PendingStackNavigator'
import Completedstacknavigator from './CompletedStackNavigator'

import Headercomponent from '../components/headerComponent'


const Tab = createMaterialTopTabNavigator()

const Topnavigator = () => {
    const [view, setView] = useState(true)

    return (
        <>  
            {
                view &&
                <SafeAreaView>
                    <Headercomponent name = 'Home' destination = 'Home' />
                </SafeAreaView> 
            }  
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
                    swipeEnabled: true,
                    tabBarStyle: {
                        elevation: 0,
                        backgroundColor: colors.white,
                        height: 45,
                    }
                }}
                style = {{ 
                    backgroundColor: colors.white
                }}
                tabBarPosition = 'top'
            >
                <Tab.Screen 
                    name = 'pendingStack'
                    component = {Pendingstacknavigator} 
                    options = {{
                        tabBarLabel: 'Pending'
                    }}
                    initialParams = {{
                        setView: setView
                    }}
                />
                <Tab.Screen 
                    name = 'acceptedStack'
                    component = {Acceptedstacknavigator} 
                    options = {{
                        tabBarLabel: 'Accepted'
                    }}
                    initialParams = {{
                        setView: setView
                    }}
                />
                <Tab.Screen 
                    name = 'completedStack'
                    component = {Completedstacknavigator} 
                    options = {{
                        tabBarLabel: 'Completed'
                    }}
                    initialParams = {{
                        setView: setView
                    }}
                />
            </Tab.Navigator>
        </>
    );
}

export default Topnavigator
