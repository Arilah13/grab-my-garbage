import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const NotificationScreen = () => {
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const returnDate = (date) => {
        const crntDate = new Date()
        const ysterDate = new Date(new Date().getTime() - 24*60*60*1000)

        if(crntDate.toISOString().split('T')[0] === date) {
            return 'Today'
        } else if(ysterDate.toISOString().split('T')[0] === date) {
            return 'Yesterday'
        } else {
            return date
        }
    }

    return (
        <SafeAreaView style = {styles.container}>
            <View style = {{height: 0.6*SCREEN_HEIGHT/10}}>
                <Text style = {styles.title}>Notifications</Text>
            </View>

            <View style = {styles.container1}>
                <View>
                    {
                        userInfo.notification.map((noti, index) => (
                            <>
                                <Text style = {styles.text} key = {index}>{returnDate(noti.date)}</Text>
                                <View>
                                    {
                                        noti.description.map((desc, index) => (
                                            index === 0 ?
                                            <View style = {styles.card} key = {index}>
                                                <Text style = {styles.text1}>{desc}</Text>
                                            </View> :
                                            <View style = {{...styles.card, marginTop: 0}} key = {index}>
                                                <Text style = {styles.text1}>{desc}</Text>
                                            </View>
                                        )) 
                                    }
                                </View>
                            </>
                        ))
                    }
                </View>
            </View>
        </SafeAreaView>
    );
}

export default NotificationScreen

const styles = StyleSheet.create({

    container:{
        height: SCREEN_HEIGHT - 50,
        backgroundColor: colors.grey9
    },
    title:{
        fontSize: 18,  
        alignSelf: 'center', 
        marginTop: 10, 
        fontWeight: 'bold',
        color: colors.blue2
    },
    container1:{
        backgroundColor: colors.white,
        height: 9.4*SCREEN_HEIGHT/10 - 50,
        width: SCREEN_WIDTH,
        paddingTop: 15
    },
    text:{
        fontSize: 16,
        color: colors.grey1,
        marginLeft: 15,
        marginTop: 10
    },
    card:{
        width: SCREEN_WIDTH,
        height: 50,
        backgroundColor: colors.grey8,
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'center',
    },
    text1:{
        fontSize: 15,
        color: colors.blue4
    }

})
