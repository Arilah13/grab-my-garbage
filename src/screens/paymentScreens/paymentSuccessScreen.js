import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native';

const Paymentsuccessscreen = ({navigation}) => {

    const lottieRef = useRef()

    useEffect(() => {
        if(lottieRef.current) {
            setTimeout(() => {
                lottieRef.current?.reset()
                lottieRef.current?.play()
            }, 100)
        }
    }, [lottieRef.current])

    // useEffect(() => {
    //     setTimeout(() => {
    //         navigation.navigate('Home')
    //     }, 2000)
    // })

    return (
        <View style = {styles.animationContainer}>
            <Text>Hi</Text>
            <LottieView 
                ref = {lottieRef}
                source = {require('../../../assets/animation/creditcard.json')}
                style = {{
                    width: 400,
                    height: 400,
                    //backgroundColor: '#eee'
                }}
                loop = {false}
                autoPlay = {false}
            />
        </View>
    );
}

export default Paymentsuccessscreen

const styles = StyleSheet.create({

    animationContainer: {
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
        // flex: 1,
    },

})
