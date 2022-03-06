import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, StyleSheet, Text, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import * as Notifications from 'expo-notifications'

import { colors } from '../global/styles'
import { menuData } from '../global/data'

import { addOngoingPickupLocation, removeOngoingPickup } from '../redux/actions/specialPickupActions'
import { addOngoingSchedulePickupLocation, removeOngoingSchedulePickup } from '../redux/actions/schedulePickupActions'
import { getPaymentIntent } from '../redux/actions/paymentActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = ({navigation}) => {

    const dispatch = useDispatch()

    const userDetail = useSelector((state) => state.userDetail)
    const { loading, user } = userDetail

    const specialPickup = useSelector((state) => state.specialPickup)
    const { pickupInfo } = specialPickup

    const socketHolder = useSelector((state) => state.socketHolder)
    const { loading: socketLoading, socket } = socketHolder

    const [expoPushToken, setExpoPushToken] = useState()
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [notification, setNotification] = useState()

    const notificationListener = useRef()
    const responseListener = useRef()

    useEffect(() => {
        dispatch(getPaymentIntent())
    }, [])

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async() => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true
            })
        })
    }, [])

    useEffect(async() => {
        if(loading === false) {
            setExpoPushToken(user.pushId)

            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification)
            })
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                const {notification: {request: {content: {data: {screen}}}}} = response

                if(screen) {
                    navigation.navigate(screen)
                }
            })

            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current)

                Notifications.removeNotificationSubscription(responseListener.current)
            }
        }
    }, [user, loading])

    useEffect(async() => {
        if(socketLoading === false) {
            await socket.emit('userJoined', { userid: user._id })

            socket.on('userPickup', async({pickup, hauler}) => {
                dispatch(addOngoingPickupLocation({latitude: hauler.latitude, longitude: hauler.longitude, heading: hauler.heading, haulerid: pickup.haulerid, pickupid: pickup.pickupid}))
            })
            socket.on('userSchedulePickup', async({hauler, time, ongoingPickup, pickupid}) => {
                dispatch(addOngoingSchedulePickupLocation({latitude: hauler.latitude, longitude: hauler.longitude, heading: hauler.heading, haulerid: time.haulerid, ongoingPickupid: ongoingPickup, pickupid: pickupid, time: time.time}))
            })

            socket.on('pickupDone', async({pickupid}) => {
                dispatch(removeOngoingPickup(pickupid))
            })
            socket.on('schedulePickupDone', async({pickupid}) => {
                dispatch(removeOngoingSchedulePickup(pickupid))
            })
        }
    }, [socket])

    return (
        <SafeAreaView>
            {loading === true ? 
                <LottieView 
                    source = {require('../../assets/animation/truck_loader.json')}
                    style = {{
                        width: SCREEN_WIDTH,
                        height: 500,
                    }}
                    loop = {true}
                    autoPlay = {true}
                />
            :
            <View style={{backgroundColor: colors.blue1}}>
                <View style = {styles.container}>
                    <View style = {styles.view1}>
                        <Text style = {styles.text1}>Hi {user.name}</Text>
                        <Text style = {styles.text2}>Have you taken out the trash today?</Text>
                        <Image
                            source = {user.image ? {uri: user.image} : require('../../assets/user.png')}
                            style = {styles.image1}
                        />
                    </View>
                </View>

                <View style = {styles.container1}>
                    <View style = {styles.container2}>

                    </View>

                    <View style = {{justifyContent: 'center', marginTop: '5%', flexDirection: 'column'}}>
                        <FlatList
                            numColumns = {2}
                            showsHorizontalScrollIndicator = {false}
                            data = {menuData}
                            keyExtractor = {(item) => item.id}
                            renderItem = {({item}) => (
                                <TouchableOpacity style = {styles.card}
                                    onPress = {() => {
                                        if(pickupInfo === undefined) {
                                            navigation.navigate(item.destination, {destination: item.name})
                                        } else {
                                            if(item.name === 'Schedule Pickup')
                                                navigation.navigate('Schedule')
                                            else
                                                navigation.navigate('SpecialPickup')
                                        }
                                    }}
                                >
                                    <View style = {styles.view2}>
                                        <Image style = {styles.image2} source = {item.image}/>     
                                        <Text style = {styles.title}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View> 
                </View>
            </View>
            }
        </SafeAreaView>
    );
}

export default Homescreen

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/3.5
    },
    view1:{
        display: 'flex',
        //flex: 1,
        justifyContent: 'space-around',
    },
    text1:{
        color: colors.blue2,
        fontSize: 21,
        //paddingBottom:5,
        paddingTop: 55,
        fontWeight: 'bold'
    },
    text2:{
        color: colors.blue2,
        fontSize: 14
    },
    image1:{
        height: 70,
        width: 70,
        left: "75%",
        bottom: 65,
        borderRadius: 50,
    },
    container1:{
        backgroundColor: colors.white,
        borderRadius: 30,
        height: "75%",
        padding: 15
    },
    container2:{
        backgroundColor: colors.blue2,
        height: SCREEN_HEIGHT/6.5,
        padding: 10,
        borderRadius: 25,
    },
    card:{
        margin: SCREEN_WIDTH/22,
        marginTop: 0,
        flex: 1,
        paddingLeft: 2,
        marginLeft: 8,
        marginRight: 8,
    },
    view2:{
        paddingBottom: 10,
        paddingTop: 25,
        borderRadius: 15,
        backgroundColor: colors.blue1,
        alignItems: 'center',
    },
    image2:{
        height: 60,
        width: 60,
        alignItems: 'center'
    },
    title:{
        color: colors.blue2,
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center'
    }

})