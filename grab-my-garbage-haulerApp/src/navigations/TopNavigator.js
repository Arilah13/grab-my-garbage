import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Completedstacknavigator from './CompletedStackNavigator'
import Pendingstacknavigator from './PendingStackNavigator'
import Upcomingstacknavigator from './UpcomingStackNavigator'

import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

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
                    name = "pendingPickup" 
                    component = {Pendingstacknavigator} 
                    options = {{
                        tabBarLabel: 'Pending'
                    }}
                />
                <Tab.Screen 
                    name = "upcomingPickup" 
                    component = {Upcomingstacknavigator} 
                    options = {{
                        tabBarLabel: 'Upcoming'
                    }}
                />
                <Tab.Screen 
                    name = "completedPickup" 
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

const styles = StyleSheet.create({

    view1:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    text1:{
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 15
    },
    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 15, 
        paddingTop: 10,
        marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row',
    },
    text:{
        display: 'flex',
        top: 15,
        left: 5,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 14
    }

})
