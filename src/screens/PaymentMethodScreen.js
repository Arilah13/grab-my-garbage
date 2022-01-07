import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, CheckBox, Button } from 'react-native-elements'
import { showMessage } from 'react-native-flash-message'

import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Paymentmethodscreen = ({route, navigation}) => {

    const { name } = route.params

    const [ check1, setCheck1 ] = useState(false)
    const [ check2, setCheck2 ] = useState(false)
    const [ check3, setCheck3 ] = useState(false)

    const Check1 = () => {
        setCheck1(true)
        setCheck2(false)
        setCheck3(false)
    }
    const Check2 = () => {
        setCheck1(false)
        setCheck2(true)
        setCheck3(false)
    }
    const Check3 = () => {
        setCheck1(false)
        setCheck2(false)
        setCheck3(true)
    }

    const pay = () => {
        if(check1 === true)
            navigation.navigate('Payment', {
                creditcard: true, paypal: false, cash: false
            })
        if(check2 === true)
            //setShowGateway(true)
            navigation.navigate('Payment', {
                creditcard: false, paypal: true, cash: false
            })
        if(check3 === true)
            navigation.navigate('Payment', {
                creditcard: false, paypal: false, cash: true
            })
        if(check1 === false && check2 === false && check3 === false)
            showMessage({
                message: 'Select An Option',
                type: 'default',
                backgroundColor: colors.warning,
                autoHide: true,
                animated: true,
                animationDuration: 150,
                duration: 800,
            })
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <TouchableOpacity style = {styles.container}
                onPress = {() => navigation.navigate(name === 'Special' ? 'SpecialPickup' : 'Schedule')}
            >
                <Icon
                    type = 'material'
                    name = 'arrow-back'
                    color = {colors.blue5}
                    size = {25}
                    style = {{
                        alignSelf: 'flex-start',
                        marginTop: 25,
                        display: 'flex'
                    }}
                />
                <Text style = {styles.text1}>{name === 'Special' ? 'Special Pickup' : 'Schedule Pickup'}</Text>
            </TouchableOpacity>

            <View style = {styles.container2}>
                <Text style = {styles.text2}>Payment Methods</Text>
                <View style = {styles.view1}>
                    <Image
                        source = {require('../../assets/visa.png')}
                        resizeMode = 'contain'
                        style = {{
                            position: 'absolute',
                            width: '25%',
                            height: '30%',
                            marginTop: SCREEN_HEIGHT/24,
                            marginLeft: '6%'
                        }}
                    />
                    <Text style = {styles.text3}>Credit Card</Text>
                    <View style = {{ marginTop: SCREEN_HEIGHT/42, marginRight: '3%' }}>
                        <CheckBox
                            right
                            checkedIcon = 'dot-circle-o'
                            uncheckedIcon = 'circle-o'
                            checked = {check1}
                            onPress = {() => Check1()}
                            size = {22}
                        />
                    </View>
                </View>
                <View style = {{...styles.view1, marginTop: 25}}>
                    <Text style = {styles.text3}>Paypal</Text>
                    <Image
                        source = {require('../../assets/paypal.png')}
                        resizeMode = 'contain'
                        style = {{
                            position: 'absolute',
                            width: '30%',
                            height: '55%',
                            marginTop: SCREEN_HEIGHT/34,
                            marginLeft: '6%'
                        }}
                    />
                    <View style = {{ marginTop: SCREEN_HEIGHT/42, marginRight: '3%' }}>
                        <CheckBox
                            right
                            checkedIcon = 'dot-circle-o'
                            uncheckedIcon = 'circle-o'
                            checked = {check2}
                            onPress = {() => Check2()}
                        />
                    </View>
                </View>
                <View style = {{...styles.view1, marginTop: 25}}>
                    <Text style = {styles.text3}>Cash On Pickup</Text>
                    <Image
                        source = {require('../../assets/money.png')}
                        resizeMode = 'contain'
                        style = {{
                            position: 'absolute',
                            width: '30%',
                            height: '30%',
                            marginTop: SCREEN_HEIGHT/22,
                            marginLeft: '6%'
                        }}
                    />
                    <View style = {{ marginTop: SCREEN_HEIGHT/42, marginRight: '3%' }}>
                        <CheckBox
                            right
                            checkedIcon = 'dot-circle-o'
                            uncheckedIcon = 'circle-o'
                            checked = {check3}
                            onPress = {() => Check3()}
                        />
                    </View>
                </View>

                <View style = {{top: SCREEN_HEIGHT/1.36, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                    <Button
                        title = 'Continue'
                        buttonStyle = {styles.button}
                        onPress = {() => pay()}
                    />
                </View>
            </View>    
        </SafeAreaView>
    );
}

export default Paymentmethodscreen

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    text1:{
        display: 'flex',
        top: 26,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    container2:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: 9*SCREEN_HEIGHT/10,
        paddingTop: 30,
        paddingLeft: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text2:{
        color: colors.blue2,
        fontSize: 17,
        fontWeight: 'bold'
    },
    view1:{
        width: '95%',
        height: '14%',
        backgroundColor: colors.white,
        marginTop: 35,
        borderRadius: 20
    },
    text3:{
        marginLeft: '40%', 
        fontWeight: '800', 
        color: colors.blue2, 
        marginTop: SCREEN_HEIGHT/22,
        position: 'absolute'
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },

})