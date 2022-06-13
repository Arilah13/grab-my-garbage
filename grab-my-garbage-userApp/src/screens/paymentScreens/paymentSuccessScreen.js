import React, { useCallback } from 'react'
import { Text, StyleSheet, BackHandler } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'

import { colors } from '../../global/styles'

const Paymentsuccessscreen = ({navigation, route}) => {
    const { name } = route.params

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Home')
                return true
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => 
                BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }, [])
    )

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
            {
                name === 'Special' ?
                    <>
                        <Text style = {styles.text1}>Your pickup is placed successfully!</Text>
                        <Text style = {styles.text2}>Pickup will be collected within 24hour</Text>
                    </>
                : 
                    <Text style = {{...styles.text1, marginBottom: 30}}>Your pickup is placed successfully!</Text>
            }
            <Button
                title = 'Check your pickup'
                buttonStyle = {styles.button}
                onPress = {() => name === 'Special' ? navigation.navigate('SpecialRequests') : navigation.navigate('ScheduleRequests')}
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
        marginBottom: 5,
        color: colors.darkBlue
    },
    text2: {
        fontSize: 15,
        marginBottom: 30,
        color: colors.grey
    }

})
