import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Headercomponent from '../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const data = [
    {
        description: 'Special Pickup Accepted',
        date: new Date(new Date().getTime() - 10*24*60*60*1000)
    },
    {
        description: 'Special Pickup Declined',
        date: new Date(new Date().getTime() - 5*24*60*60*1000)
    }
]

const NotificationScreen = () => {
    const [dates, setDates] = useState([])

    // useEffect(async() => {
    //     for(let)
    //     console.log(dates)
    // }, [])
 
    return (
        <SafeAreaView>
            <Headercomponent name = 'Home' destination = 'HomeScreen' />

            <View style = {styles.container}>
                {
                    // data.map(data => {
                    //     console.log(data.date.toISOString().split('T')[0])
                    // })
                }
            </View>
        </SafeAreaView>
    );
}

export default NotificationScreen

const styles = StyleSheet.create({

    container:{
        height: SCREEN_HEIGHT - SCREEN_HEIGHT/10 
    }

})
