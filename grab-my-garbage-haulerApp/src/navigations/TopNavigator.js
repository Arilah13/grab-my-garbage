import React, { useState, useLayoutEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { StatusBar } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import Completedstacknavigator from './CompletedStackNavigator'
import Pendingstacknavigator from './PendingStackNavigator'
import Upcomingstacknavigator from './UpcomingStackNavigator'

import { colors } from '../global/styles'

const Tab = createMaterialTopTabNavigator()

const Height = StatusBar.currentHeight

const Topnavigator = ({navigation}) => {
    // const [route1, setRoute1] = useState()
    // const [route2, setRoute2] = useState()
    // const [route3 , setRoute3] = useState()

    // useLayoutEffect(() => {
    //     let routeName1, routeName2, routeName3
    //     if(route1) {
    //         routeName1 = getFocusedRouteNameFromRoute(route1)
    //     }

    //     if(route2) {
    //         routeName2 = getFocusedRouteNameFromRoute(route2)
    //     }

    //     if(route3) {
    //         routeName3 = getFocusedRouteNameFromRoute(route3)
    //     }
        
    //     if(routeName1 === 'PickupDetail' || routeName2 === 'PickupDetail' || routeName3 === 'PickupDetail') {
    //         navigation.setOptions({tabBarStyle: {display: 'none'}})
    //     } else {
    //         navigation.setOptions({
    //             tabBarStyle: {
    //                 position: 'absolute',
    //                 elevation: 0,
    //                 backgroundColor: colors.grey8,
    //                 height: 50
    //             }
    //         })
    //     }
    // }, [route1, route2, route3])

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
                backgroundColor: colors.white,
                marginTop: Height,
            }}
            tabBarPosition = 'top'
        >
            <Tab.Screen 
                name = 'Pending' 
                component = {Pendingstacknavigator} 
                options = {({route}) => {
                    const routeName = getFocusedRouteNameFromRoute(route)
                    if(routeName === 'PickupDetail') {
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
                }}
            />
            <Tab.Screen 
                name = 'Upcoming' 
                component = {Upcomingstacknavigator} 
                options = {({route}) => {
                    const routeName = getFocusedRouteNameFromRoute(route)
                    if(routeName === 'PickupDetail') {
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
                }}
            />
            <Tab.Screen 
                name = 'Completed' 
                component = {Completedstacknavigator} 
                options = {({route}) => {
                    const routeName = getFocusedRouteNameFromRoute(route)
                    if(routeName === 'PickupDetail') {
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
                }}
            />
        </Tab.Navigator>
    );
}

export default Topnavigator
