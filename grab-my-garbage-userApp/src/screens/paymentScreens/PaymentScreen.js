import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Modal, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { Icon, Button } from 'react-native-elements'
import { useStripe, initStripe } from '@stripe/stripe-react-native'
import { StripeProvider } from '@stripe/stripe-react-native'
import socketIO from 'socket.io-client'

import { colors } from '../../global/styles'

import { getPaymentSheet } from '../../redux/actions/paymentActions'
import { getSpecialPickupInfo } from '../../redux/actions/specialPickupActions'
import { getScheduledPickupInfo } from '../../redux/actions/schedulePickupActions'
import { PAYMENT_SHEET_RESET } from '../../redux/constants/paymentConstants'

import Headercomponent from '../../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Paymentscreen = ({route, navigation}) => {

    const dispatch = useDispatch()

    const webView = useRef()

    const specialPickup = useSelector(state => state.specialPickup)
    const { pickupInfo } = specialPickup

    const scheduledPickup = useSelector(state => state.scheduledPickup)
    const { pickupInfo: scheduledPickupInfo } = scheduledPickup

    const {initPaymentSheet, presentPaymentSheet} = useStripe()

    const { creditcard, paypal, cash, price, tax, total, name } = route.params

    const [showGateway, setShowGateway] = useState(false)
    const [prog, setProg] = useState(false)
    const [progClr, setProgClr] = useState('#000')
    const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [paymentStart, setPaymentStart] = useState(false)

    const paymentIntent = useSelector((state) => state.paymentIntent)
    const {paymentInfo} = paymentIntent

    const paymentSheet = useSelector((state) => state.paymentSheet)
    const {loading, paymentSheet: sheet} = paymentSheet

    // const requestPickup = async() => {
    //     const socket = socketIO.connect('http://192.168.13.1:5000')
        
    //     const latitude = pickupInfo.location.latitude
    //     const longitude = pickupInfo.location.longitude
    //     socket.emit('lookingPickup', {latitude, longitude})
    // }

    const initializeStripe = async() => {
        const publishableKey = await paymentInfo.publishable_key
        setPaymentStart(true)
        
        setTimeout(async() => {
            if(publishableKey) {
                await initStripe({
                    publishableKey: publishableKey
                })
            }
        }, 1000)       
    }

    const initialisePaymentSheet = async() => {
        await initializeStripe()

        try {
            const {error} = await initPaymentSheet({
                customerId: sheet.customer,
                customerEphemeralKeySecret: sheet.ephemeralKey,
                paymentIntentClientSecret:  sheet.paymentIntent,
                merchantDisplayName: 'grab-my-garbage Inc.',
            })

            if (!error) {
                setPaymentSheetEnabled(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const choosePaymentOption = async() => {
        await initialisePaymentSheet()

        const {error} = await presentPaymentSheet({
            confirmPayment: false
        })

        if(error) {
            setLoading(false)
        } else if(!error) {
            dispatch({
                type: PAYMENT_SHEET_RESET
            })
            navigation.navigate('Paymentpresuccess', { name: name })
            if(name === 'Special') {
                requestPickup()
                dispatch(getSpecialPickupInfo({pickupInfo, total, method: 'Creditcard'}))
            } else if (name === 'Schedule') { 
                dispatch(getScheduledPickupInfo({pickupInfo: scheduledPickupInfo, total, method: 'Creditcard'}))
            }
            setLoading(false)
        }
    }

    const sendTotal = `window._price = ${total}; true;`

    const pay = async() => {
        if(paypal === true) {
            setLoading(true)
            setShowGateway(true)
        } else if(cash === true) {
            setLoading(true)
            navigation.navigate('')
        } else if(creditcard === true) {
            setLoading(true)
            choosePaymentOption()
        }
    }

    const onMessage = (e) => {
        let data = e.nativeEvent.data
        setShowGateway(false)
        setLoading(false)
        let payment = JSON.parse(data);
        if (payment.status === 'COMPLETED') {
            navigation.navigate('Paymentpresuccess', { name: name })
            if(name === 'Special') {
                requestPickup()
                dispatch(getSpecialPickupInfo({pickupInfo, total, method: 'PayPal'}))
            } else if (name === 'Schedule') {
                dispatch(getScheduledPickupInfo({pickupInfo: scheduledPickupInfo, total, method: 'PayPal'}))
            }
            setLoading(false)
        } else {
            Alert.alert('Payment Failed', 'Payment has been failed, Please try again',
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
    }

    useEffect(() => {
        if(paymentStart === false && creditcard === true)
            dispatch(getPaymentSheet(total))
    }, [paymentStart])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
        <StripeProvider publishableKey = {paymentInfo.publishable_key}>

            <Headercomponent name = 'Payment Method' />

            <View style = {styles.container2}>
                <Text style = {styles.text2}>Confirm Payment</Text>
                <View style = {{padding: 20}}>
                    <Text style = {styles.text3}>Subtotal</Text>
                    <Text style = {styles.text4}>Rs {price}</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.text3}>Tax</Text>
                    <Text style = {styles.text4}>Rs {tax}</Text>
                    <View style = {styles.border} />
                    <Text style = {styles.text3}>Total</Text>
                    <Text style = {styles.text4}>Rs {total}</Text>
                </View>
                
                <View style = {{top: SCREEN_HEIGHT/1.36, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                    <Button
                        title = 'Confirm'
                        buttonStyle = {styles.button}
                        loading = {isLoading || loading}
                        disabled = {isLoading || loading}
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
                                onPress={() => {
                                    setShowGateway(false)
                                    setLoading(false)
                                }}
                            >
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
                            ref = {webView}
                            javaScriptEnabled = {true}
                            onLoadStart = {() => {
                                setProg(true)
                                setProgClr('#000')
                                webView.current.injectJavaScript(sendTotal)
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

        </StripeProvider>
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
