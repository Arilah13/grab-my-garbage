import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../../global/styles'

const Paymentsuccessscreen = ({navigation, route}) => {

    const { name } = route.params

    return (
        <SafeAreaView style = {styles.container}>
            <LottieView 
                source = {require('../../../assets/animation/loader.json')}
                style = {{
                    width: 100,
                    height: 180,
                }}
                loop = {true}
                autoPlay = {true}
            />
            <Text style = {styles.text1}>Your pickup is placed successfully!</Text>
            <Button
                title = 'Check your pickup'
                buttonStyle = {styles.button}
                onPress = {() => navigation.navigate('Requests')}
            />
        </SafeAreaView>
    );
}

export default Paymentsuccessscreen

const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.blue1,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 45,
        width: 250
    },
    text1:{
        fontWeight: 'bold',
        marginTop: 20,
        fontSize: 20,
        marginBottom: 30
    }

})
