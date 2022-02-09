import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

import { colors } from '../global/styles'
import Pendingpickupscreen from '../screens/requestScreens/pendingPickupScreen'
import Completedpickupscreen from '../screens/requestScreens/completedPickupScreen'
import Acceptedstacknavigator from './AcceptedStackNavigator'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Tab = createMaterialTopTabNavigator()

const Topnavigator = () => {

    const navigation = useNavigation()

    return (
        <>
            <SafeAreaView>
                <View style = {{backgroundColor: colors.blue1}}>
                    <TouchableOpacity 
                        style = {styles.container}
                        onPress = {() => navigation.navigate('Home')}
                    >
                        <Icon
                            type = 'material'
                            name = 'arrow-back'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                alignSelf: 'flex-start',
                                marginTop: 25,
                                display: 'flex'
                            }}
                        />
                        <Text style = {styles.text}>Home</Text>
                    </TouchableOpacity>
                    <Text style = {styles.text2}>Requests</Text>
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
                    component = {Pendingpickupscreen} 
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
                    name = "completedPickup" 
                    component = {Completedpickupscreen} 
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

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    text:{
        display: 'flex',
        top: 26,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    text2:{
        position: 'relative',
        color: colors.blue2,
        fontSize: 17,
        fontWeight: 'bold',
        margin: 10,
        marginTop: 0,
        marginLeft: 22,
        backgroundColor: colors.blue1
    },

})
