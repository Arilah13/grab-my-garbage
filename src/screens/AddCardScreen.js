import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-elements'
import { TextInputMask } from 'react-native-masked-text'

import { colors } from '../global/styles'
import Headercomponent from '../components/HeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Addcardscreen = ({navigation}) => {

    const [date, setDate] = useState()
    const [creditcard, setCreditcard] = useState()
    const [issuer, setIssuer] = useState('visa-or-mastercard')

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent path = 'Paymentoption' name = 'Payment Option' />

            <View style = {styles.container2}>
                <View style = {{padding: 20}}>
                    <Text style = {styles.text2}>Card Number</Text>
                    <TextInputMask
                        style = {styles.textInput}
                        type = 'credit-card'
                        options = {{
                            obfuscated: false,
                            issuer: issuer
                        }}
                        onChangeText = {text => {
                            setCreditcard(text)
                            text.startsWith(4) || text.startsWith(5) ? 
                            setIssuer('visa-or-mastercard') :
                            setIssuer('amex')
                        }}
                        value = {creditcard}
                        placeholder = 'Card Number'
                    />
                    {/* <Image 
                        source = {issuer === 'amex' ? require('../../assets/amex.png') : require('../')}
                    /> */}
                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.text2}>Expiry Date</Text>                      
                        <Text style = {{...styles.text2, marginLeft: SCREEN_WIDTH/2.9}}>CVV</Text>                       
                    </View>
                    <View style = {{flexDirection: 'row'}}>
                        <TextInputMask 
                            style = {{...styles.textInput, width: SCREEN_WIDTH/4}}
                            keyboardType = 'number-pad'
                            type = 'custom'
                            options = {{
                                mask: '99/99'
                            }}
                            onChangeText = {text => setDate(text)}
                            value = {date}
                            placeholder = 'MM/YY'
                        />
                        <TextInput
                            style = {{...styles.textInput, width: SCREEN_WIDTH/3.8, marginLeft: SCREEN_WIDTH/4}}
                            keyboardType = 'number-pad'
                            placeholder = 'CVV'
                        />
                    </View>
                    <Text style = {styles.text2}>Name</Text>
                    <TextInput
                        style = {styles.textInput}
                        placeholder = 'Name On Card'
                    />
                </View>

                <View style = {{top: SCREEN_HEIGHT/1.35, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                    <Button
                        title = 'Add Card'
                        buttonStyle = {styles.button}
                        onPress = {() => pay()}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Addcardscreen

const styles = StyleSheet.create({

    container2:{
        display: 'flex',
        backgroundColor: colors.white,
        height: 9*SCREEN_HEIGHT/10,
        paddingTop: 30,
        paddingLeft: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    text2:{
        color: colors.grey
    },
    textInput:{
        backgroundColor: colors.grey8,
        marginTop: 10,
        marginBottom: 10,
        height: 45,
        borderRadius: 10,
        width: SCREEN_WIDTH/1.3,
        paddingLeft: 20,
        color: colors.grey1
    },

})
