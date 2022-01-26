import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'

import { colors } from '../../global/styles'

const Paymentpresuccessscreen = ({navigation}) => {

    const lottieRef = useRef()

    useEffect(() => {
        if(lottieRef.current) {
            setTimeout(() => {
                lottieRef.current?.reset()
                lottieRef.current?.play()
            }, 100)
        }
    }, [lottieRef.current])

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Paymentsuccess')
        }, 3500)
    }, [])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1, flex: 1}}>
            <View style = {styles.container}>
                <Text style = {styles.text1}>Congratulations!</Text>
                <Text style = {styles.text2}>Payment successfully done!</Text>
                <Text style = {styles.text3}>Creating your pickup, please wait...</Text>
                <LottieView 
                    ref = {lottieRef}
                    source = {require('../../../assets/animation/creditcard.json')}
                    style = {{
                        width: 400,
                        height: 400,
                    }}
                    loop = {false}
                    autoPlay = {false}
            />
            </View>
        </SafeAreaView>
    );
}

export default Paymentpresuccessscreen

const styles = StyleSheet.create({

    container: {
        backgroundColor:colors.blue1,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    text1: {
        fontWeight: 'bold',
        color: colors.blue2,
        fontSize: 18,
        marginBottom: 5
    },
    text2: {
        fontWeight: 'bold',
        color: colors.blue2,
        fontSize: 18,
        marginBottom: 13
    },
    text3: {
        fontSize: 15,
        color: colors.blue2
    }

})
