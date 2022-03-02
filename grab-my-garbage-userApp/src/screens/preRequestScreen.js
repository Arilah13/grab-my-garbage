import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-elements'

import Headercomponent from '../components/headerComponent'
import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Prerequestscreen = ({navigation}) => {
    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = {'Home'} />

            <View style = {styles.container}>
                <Button
                    title = 'Scheduled Pickup Requests'
                    buttonStyle = {styles.button}
                    onPress = {() => navigation.navigate('ScheduleRequest')}
                />
                <Button
                    title = 'Special Pickup Requests'
                    buttonStyle = {{...styles.button, marginTop: 25}}
                    onPress = {() => navigation.navigate('Requests')}
                />
            </View>
        </SafeAreaView>
    );
}

export default Prerequestscreen

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
