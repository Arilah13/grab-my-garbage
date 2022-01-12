import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Modal, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { showMessage } from 'react-native-flash-message'
import { Icon, Button } from 'react-native-elements'

import { colors } from '../global/styles'
import Headercomponent from '../components/HeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Paymentscreen = ({route, navigation}) => {

    const { creditcard, paypal, cash } = route.params

    const [showGateway, setShowGateway] = useState(false)
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');

    const pay = () => {
        if(paypal === true)
            setShowGateway(true)
        if(cash === true)
            navigation.navigate('')
    }

    const onMessage = (e) => {
        let data = e.nativeEvent.data;
        setShowGateway(false);
        let payment = JSON.parse(data);
        if (payment.status === 'COMPLETED') {
            showMessage({
                message: 'Pickup Will be ON-TIME!!',
                type: 'success',
                autoHide: true,
                animated: true,
                animationDuration: 150,
                duration: 1000,
            })
            setTimeout(() => {
                navigation.navigate('Home')
            }, 2000)
        } else {
            showMessage({
                message: 'PAYMENT FAILED. PLEASE TRY AGAIN.',
                type: 'default',
                backgroundColor: colors.error,
                autoHide: true,
                animated: true,
                animationDuration: 150,
                duration: 1000,
            })
        }
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Payment Method' />

            <View style = {styles.container2}>
                <Text style = {styles.text2}>Confirm Payment</Text>
                <View style = {{padding: 20}}>
                    <Text style = {styles.text3}>Subtotal</Text>
                    <Text style = {styles.text4}>Rs 20</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.text3}>Tax</Text>
                    <Text style = {styles.text4}>Rs 20</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.text3}>Total</Text>
                    <Text style = {styles.text4}>Rs 20</Text>
                </View>
                
                <View style = {{top: SCREEN_HEIGHT/1.36, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                    <Button
                        title = 'Confirm'
                        buttonStyle = {styles.button}
                        onPress = {() => pay()}
                    />
                </View>
            </View>

            {showGateway ? (
                <Modal
                    visible = {showGateway}
                    onDismiss = {() => setShowGateway(false)}
                    onRequestClose = {() => setShowGateway(false)}
                    animationType = {"fade"}
                    transparent
                >
                    <View style={styles.webViewCon}>
                        <View style={styles.wbHead}>
                            <TouchableOpacity
                                style={{padding: 13}}
                                onPress={() => setShowGateway(false)}>
                                <Icon
                                    type = 'feather'
                                    name = 'x'
                                    size = {24}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#00457C',
                                }}>
                                PayPal Gateway
                            </Text>
                            <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                                <ActivityIndicator size={24} color={progClr} />
                            </View>
                        </View>
                        <WebView
                            source = {{uri: 'https://my--web-b513d.web.app/'}}
                            style = {{flex: 1}}
                            onLoadStart = {() => {
                                setProg(true)
                                setProgClr('#000')
                            }}
                            onLoadProgress = {() => {
                                setProg(true)
                                setProgClr('#00457C')
                            }}
                            onLoadEnd = {() => {
                                setProg(false)
                            }}
                            onLoad = {() => {
                                setProg(false)
                            }}
                            onMessage = {onMessage}
                        />
                    </View>
                </Modal>
            ) : null}
        </SafeAreaView>
    );
}

export default Paymentscreen

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
    text2:{
        color: colors.blue2,
        fontSize: 17,
        fontWeight: 'bold'
    },
    text3:{
        color: colors.grey,
        fontSize: 18,
        marginTop: 20
    },
    text4:{
        color: colors.grey, 
        marginTop: -22, 
        marginLeft: SCREEN_WIDTH/1.5, 
        fontSize: 17
    },
    border:{
        marginTop: 20,
        borderBottomWidth: 0.5,
        width: '95%',
        borderBottomColor: colors.grey
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        zIndex: 25,
        elevation: 2,
    },

})
