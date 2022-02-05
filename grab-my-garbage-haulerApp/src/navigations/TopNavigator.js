import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
            <SafeAreaView>
                <View style = {styles.view1}>
                    <Text style = {styles.text1}>Pickups</Text>
                </View>
            </SafeAreaView>

            <Tab.Navigator
                screenOptions = {{
                    tabBarActiveTintColor: colors.white,
                    tabBarInactiveTintColor: colors.blue6,
                    tabBarStyle: {
                        elevation: 0,
                        backgroundColor: colors.white,
                        borderRadius: 15
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: 'bold'
                    },
                    tabBarShowLabel: true,
                    headerShown: false,
                    tabBarIndicatorStyle: {
                        height: 48,
                        borderRadius: 15,
                    },
                    tabBarPressColor: colors.white
                }}
                style = {{
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: colors.blue1,
                }}
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

})
