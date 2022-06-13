import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { useFocusEffect } from '@react-navigation/native'

import { colors } from '../../global/styles'

import { SPECIAL_PICKUP_RESET } from '../../redux/constants/specialPickupConstants'

const Paymentpresuccessscreen = ({navigation, route}) => {
    const dispatch = useDispatch()

    const { name } = route.params

    const lottieRef = useRef()

    const specialPickup = useSelector(state => state.specialPickup)
    const { loading } = specialPickup

    useEffect(() => {
        if(lottieRef.current) {
            setTimeout(() => {
                lottieRef.current?.reset()
                lottieRef.current?.play()
            }, 100)
        }
    }, [lottieRef.current])

    useEffect(() => {
        if(name === 'Special') {
            if(loading === false) {
                navigation.navigate('Paymentsuccess', { name: name })
                dispatch({
                    type: SPECIAL_PICKUP_RESET
                })
            }
        } else {
            setTimeout(() => {
                navigation.navigate('Paymentsuccess', { name: name })
            }, 3500)
        }    
    }, [loading])

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                return true
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => 
                BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }, [])
    )

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1, flex: 1}}>
            <View style = {styles.container}>
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
        backgroundColor: colors.blue1,
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
