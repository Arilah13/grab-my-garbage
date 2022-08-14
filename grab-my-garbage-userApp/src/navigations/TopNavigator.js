import React, { useState, useLayoutEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import { colors } from '../global/styles'

import Acceptedstacknavigator from './AcceptedStackNavigator'
import Pendingstacknavigator from './PendingStackNavigator'
import Completedstacknavigator from './CompletedStackNavigator'

import Headercomponent from '../components/headerComponent'

const Tab = createMaterialTopTabNavigator()

const Topnavigator = () => {
    const [view, setView] = useState(true)
    const [route1, setRoute1] = useState()
    const [route2, setRoute2] = useState()
    const [route3 , setRoute3] = useState()
    
    useLayoutEffect(() => {
        let routeName1, routeName2, routeName3

        if(route1) {
            routeName1 = getFocusedRouteNameFromRoute(route1)
        }

        if(route2) {
            routeName2 = getFocusedRouteNameFromRoute(route2)
        }
        
        if(route3) {
            routeName3 = getFocusedRouteNameFromRoute(route3)
        }

        if(routeName1 === 'pickupDetail' || routeName2 === 'pickupDetail' || routeName3 === 'pickupDetail') {
            setView(false)
        } else {
            setView(true)
        }
    }, [route1, route2, route3])

    return (
        <>  
            {
                view &&
                <SafeAreaView>
                    <Headercomponent name = 'Special Pickups' destination = 'Home' />
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
                    swipeEnabled: false,
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
                    name = 'Pending'
                    component = {Pendingstacknavigator} 
                    options = {({route}) => ({
                        tabBarLabel: route.name,
                    },
                    setRoute1(route))}
                />
                <Tab.Screen 
                    name = 'Accepted'
                    component = {Acceptedstacknavigator} 
                    options = {({route}) => ({
                        tabBarLabel: route.name,
                    },
                    setRoute2(route))}
                />
                <Tab.Screen 
                    name = 'Completed'
                    component = {Completedstacknavigator} 
                    options = {({route}) => ({
                        tabBarLabel: route.name,
                    },
                    setRoute3(route))}
                />
            </Tab.Navigator>
        </>
    );
}

export default Topnavigator
