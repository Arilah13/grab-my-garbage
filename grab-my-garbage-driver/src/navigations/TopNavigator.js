import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { colors } from '../global/styles'
import PendingPickupscreen from '../screens/pickupScreens/PendingPickupScreen'
import CompletedPickupscreen from '../screens/pickupScreens/CompletedPickupScreen'
import UpcomingPickupscreen from '../screens/pickupScreens/UpcomingPickupScreen'

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
                    component = {PendingPickupscreen} 
                    options = {{
                        tabBarLabel: 'Pending'
                    }}
                />
                <Tab.Screen 
                    name = "upcomingPickup" 
                    component = {UpcomingPickupscreen} 
                    options = {{
                        tabBarLabel: 'Upcoming'
                    }}
                />
                <Tab.Screen 
                    name = "completedPickup" 
                    component = {CompletedPickupscreen} 
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
