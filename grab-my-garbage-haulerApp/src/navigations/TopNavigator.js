import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'

import Completedstacknavigator from './CompletedStackNavigator'
import Pendingstacknavigator from './PendingStackNavigator'
import Upcomingstacknavigator from './UpcomingStackNavigator'

import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Tab = createMaterialTopTabNavigator()

const Topnavigator = () => {

    const navigation = useNavigation()

    return (
        <>
            <SafeAreaView>
                <TouchableOpacity style = {styles.container}
                    onPress = {() => navigation.navigate('Home')}
                >
                    <Icon
                        type = 'material'
                        name = 'arrow-back'
                        color = {colors.blue5}
                        size = {20}
                        style = {{
                            alignSelf: 'flex-start',
                            marginTop: 15,
                            display: 'flex'
                        }}
                    />
                    <Text style = {styles.text}>Home</Text>
                </TouchableOpacity>
                {/* <View style = {styles.view1}>
                    <Text style = {styles.text1}>Pickups</Text>
                </View> */}
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
