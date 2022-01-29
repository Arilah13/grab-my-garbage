import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-elements'
import Swiper from 'react-native-swiper'

import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Welcomescreen = ({navigation}) => {

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style = {styles.header}>
                <Text style = {styles.text}>CREATE ZERO WASTE</Text>
                <Text style = {styles.text}>CAMPAIGN</Text>
            </View>
            <View style = {{height: 4*SCREEN_HEIGHT/5}}>
                <View style = {styles.slide}>
                    <Swiper autoplay = {true} showsPagination = {false} autoplayTimeout = {5}>
                        <View style={styles.slide1}>
                            <Image 
                                source = {require('../../../assets/slide1.png')}
                                resizeMode  = 'stretch'
                                style = {{
                                    height: '100%',
                                    width: '100%'
                                }}                            
                                alt = 'slide1'
                            />
                        </View>

                        <View style={styles.slide2}>
                            <Image 
                                source = {require('../../../assets/slide2.png')}
                                resizeMode = 'stretch'
                                style = {{
                                    height: '100%',
                                    width: '100%'
                                }}    
                                alt = 'plate3'
                            />
                        </View>

                        <View style={styles.slide3}>
                            <Image 
                                source = {require('../../../assets/slide3.png')}
                                resizeMode = 'stretch'
                                style = {{
                                    height: '100%',
                                    width: '100%'
                                }}             
                                alt = 'plate5'
                            />
                        </View>
                    </Swiper>

                </View>
                <View style = {{position: 'absolute', width: SCREEN_WIDTH, padding: 15, top: SCREEN_HEIGHT/1.8}}>
                    <Button 
                        title = 'SIGN IN'
                        buttonStyle = {styles.button1}
                        onPress = {() => navigation.navigate('SignIn')}
                    />
                    <Button
                        title = 'CREATE ACCOUNT'
                        buttonStyle = {styles.button2}
                        onPress={() => navigation.navigate('SignUp')}
                    />
                </View>
            </View>      
        </SafeAreaView>
    );
}

export default Welcomescreen

const styles = StyleSheet.create({

    header:{
        height: SCREEN_HEIGHT/5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 25
    },
    text:{
        fontSize: 26,
        color: colors.blue2,
        fontWeight: 'bold'
    },
    slide:{
        height: SCREEN_HEIGHT/2,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button1:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    button2:{
        marginTop: 20,
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },

})
