import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CheckBox, Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import axios from 'axios'

import { colors } from '../../global/styles'
import Headercomponent from '../../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Paymentmethodscreen = ({route, navigation}) => {

    const { name } = route.params

    const specialPickup = useSelector(state => state.specialPickup)
    const { pickupInfo } = specialPickup

    const scheduledPickup = useSelector(state => state.scheduledPickup)
    const { pickupInfo: scheduledPickupInfo } = scheduledPickup

    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)

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

    let price = 0
    let tax = 0
    let total = 0

    const Price = () => {
        if(name === 'Special') {
            price = 0
            price = price + 200 * pickupInfo.category.length
            price = price + pickupInfo.solid_weight * 100
            return price
        } else if(name === 'Schedule') {
            const date1 = new Date(scheduledPickupInfo.from).getTime()
            const date2 = new Date(scheduledPickupInfo.to).getTime()
            const days = (date2 - date1) / (1000*60*60*24)
            price = scheduledPickupInfo.days.length * 50 * (days / 7)
            return price
        }
    }
    const Tax = () => {
        tax = 0
        tax = price * 0.2
        return tax
    }
    const Total = () => {
        total = 0
        total = price + tax 
        return total
    }

    const pay = () => {
        if(check1 === true)
            navigation.navigate('Payment', {
                creditcard: true, paypal: false, cash: false, name: name,
                price: Price(), tax: Tax(), total: Total()
            })
        if(check2 === true)
            navigation.navigate('Payment', {
                creditcard: false, paypal: true, cash: false, name: name,
                price: Price(), tax: Tax(), total: Total()
            })
        if(check3 === true)
            navigation.navigate('Payment', {
                creditcard: false, paypal: false, cash: true, name: name,
                price: Price(), tax: Tax(), total: Total()
            })
        if(check1 === false && check2 === false && check3 === false)
            Alert.alert('Select One Option', 'An option has to be selected to proceed forward',
                [
                    {
                        text: 'Ok',
                    }
                ],
                {
                    cancelable: true
                }
            )
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>           
            <Headercomponent name = {name === 'Special' ? 'Special Pickup' : 'Schedule'} />

            <View style = {styles.container2}>
                <Text style = {styles.text2}>Payment Methods</Text>
                <View style = {styles.view1}>
                    <Image
                        source = {require('../../../assets/visa.png')}
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
                        source = {require('../../../assets/paypal.png')}
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
                        source = {require('../../../assets/money.png')}
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
    modal:{
        height: '55%',
        //width: 500,
        backgroundColor: colors.white,
        borderRadius: 20
    },
    text4:{
        margin: 30,
        marginBottom: 0,
        fontSize: 15,
        color: colors.blue2,
        fontWeight: 'bold'
    },
    view2:{
        height: 2.2*SCREEN_HEIGHT/25,
        marginLeft: 17,
        width: '90%',
        backgroundColor: colors.blue1,
        borderRadius: 20,
    },
    image1:{
        height: 50
    },
    text5:{
        color: colors.blue2,
        margin: 20,
        marginLeft: 60,
        marginTop: 18,
        fontSize: 15
    }

})