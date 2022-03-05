import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-elements'

import { colors } from '../global/styles'

import Headercomponent from '../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Prepickupscreen = ({navigation}) => {
    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = {'Home'} />

            <View style = {styles.container}>
                <Button
                    title = 'Start Scheduled Pickup'
                    buttonStyle = {styles.button}
                    onPress = {() => navigation.navigate('SchedulePickup')}
                />
                <Button
                    title = 'Start Special Pickup'
                    buttonStyle = {{...styles.button, marginTop: 25}}
                    onPress = {() => navigation.navigate('SpecialPickup')}
                />
            </View>
        </SafeAreaView>
    );
}

export default Prepickupscreen

const styles = StyleSheet.create({

    container:{
        height: 9*SCREEN_HEIGHT/10,
        backgroundColor: colors.white,
        padding: 30,
        borderRadius: 30
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 20,
        height: 50,
        width: 300,
        alignSelf: 'center',
        marginTop: 30
    }

})
