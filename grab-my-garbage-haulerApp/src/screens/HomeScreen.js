import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button } from 'react-native-elements'
import * as Notifications from 'expo-notifications'
import { Icon } from 'react-native-elements'
import axios from 'axios'

import { colors } from '../global/styles'

import { sendSMS } from '../redux/actions/specialRequestActions'
import { completeScheduledPickup, activeSchedulePickup, inactiveSchedulePickup } from '../redux/actions/scheduleRequestActions'
import { completedPickup, activeSpecialPickup } from '../redux/actions/specialRequestActions'
import { USER_LOGIN_SUCCESS } from '../redux/constants/userConstants'

import Onlinecomponent from '../components/homeScreen/onlineComponent'
import Mapcomponent from '../components/homeScreen/mapComponent'
import Onpickupcomponent from '../components/homeScreen/onPickupComponent'
import Pickupcompletecomponent from '../components/homeScreen/pickupCompleteComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = ({navigation}) => {
    const dispatch = useDispatch()

    const translation = useRef(new Animated.Value(2.8*SCREEN_HEIGHT/10)).current
    const choice = useRef(null)
    const first = useRef(true)
    const responseListener = useRef()

    const [end, setEnd] = useState(null)
    const [online, setOnline] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pickupBtn, setpickupBtn] = useState(true)
    const [order, setOrder] = useState(null)
    const [redo, setRedo] = useState(false)
    const [arrived, setArrived] = useState(false)
    const [start, setStart] = useState(true)
    const [number, setNumber] = useState(0)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const retrieveCollectSchedulePickup = useSelector((state) => state.retrieveCollectSchedulePickup)
    const { loading: pickupLoading, pickupInfo } = retrieveCollectSchedulePickup

    const retrieveCollectSpecialPickup = useSelector((state) => state.retrieveCollectSpecialPickup)
    const { loading: specialPickupLoading, pickupInfo: specialPickupInfo } = retrieveCollectSpecialPickup

    const socketHolder = useSelector((state) => state.socketHolder)
    const { loading: socketLoading, socket } = socketHolder

    const animation = (value, value1, delay) => {
        Animated.timing(translation, {
            toValue: value,
            useNativeDriver: true,
            duration: 500,
            delay: delay ? delay : 0
        }).start()
        setTimeout(() => {
            Animated.timing(translation, {
                toValue: value1,
                useNativeDriver: true,
                duration: 500,
                delay: delay ? delay + 500 : 0
            }).start()
        }, 1000)
    }

    const setPickups = (pickupOrder) => {
        if(pickupOrder.length > 0) {
            setEnd({
                latitude: pickupOrder[0].location[0].latitude,
                longitude: pickupOrder[0].location[0].longitude
            })
            setOrder(pickupOrder[0])
            if (choice.current === 'schedule') {
                if(first.current === true) {
                    socket.emit('schedulePickupStarted', { pickup: pickupOrder })
                    first.current = false
                }
                
                socket.emit('scheduledPickupOnProgress', { haulerid: userInfo._id, ongoingPickup: pickupOrder[0], pickup: pickupOrder })

                dispatch(activeSchedulePickup(pickupOrder[0]._id))
            } else if (choice.current === 'special') {
                socket.emit('specialPickupOnProgress', { haulerid: userInfo._id, pickupid: pickupOrder[0]._id, userid: pickupOrder[0].customerId._id, pickup: pickupOrder[0] })

                dispatch(activeSpecialPickup(pickupOrder[0]._id))
            }
        } else {
            setEnd(null)
            setOrder(null)
        } 
    }

    const handlePickupComplete = useCallback(async() => {
        if(arrived === false) {
            setArrived(true)
            
            let num
            num = String(order.customerId.phone).substring(1)
            
            let receiver = '+94'.concat(num)
            const message = 'Your Hauler is at your doorstep, make sure garbage is collected'

            dispatch(sendSMS({receiver: receiver, message: message}))

            if (choice.current === 'schedule') {
                socket.emit('schedulePickupArrived', {pickup: order})
            } else if(choice.current === 'special') {
                socket.emit('specialPickupArrived', {pickup: order})
            }

        } else if(arrived === true) {
            setLoading(true)
            setArrived(false)
            
            if (choice.current === 'schedule') {
                dispatch(completeScheduledPickup({id: order._id, completedDate: new Date(), completedHauler: userInfo}))
                dispatch(inactiveSchedulePickup(order._id))

                socket.emit('schedulePickupCompleted', {pickupid: order._id, userid: order.customerId._id, haulerid: userInfo._id, pickup: order})

                await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === order._id), 1)
                setPickups(pickupInfo)
                
                pickupHandler()
            } else if(choice.current === 'special') {
                dispatch(completedPickup(order._id))

                socket.emit('specialPickupCompleted', {pickupid: order._id, pickup: order})

                await specialPickupInfo.splice(specialPickupInfo.findIndex(pickup => pickup._id === order._id), 1)
                setPickups(specialPickupInfo)

                pickupHandler()
            }

        }
    }, [pickupInfo, specialPickupInfo, order, arrived])

    const pickupHandler = useCallback(() => {
        setLoading(true)
        setRedo(true)
        
        if (choice.current === 'schedule') {
            setPickups(pickupInfo)
        } else if (choice.current === 'special') {
            setPickups(specialPickupInfo)
        }
        
        setLoading(false)
        setRedo(false)
    }, [pickupInfo, specialPickupInfo])

    const choiceCall = useCallback(() => {
        choice.current = null
    }, [choice.current])

    const checkNotification = async() => {
        let read = []
        await userInfo.notification.map((noti) => {
            noti.data.map(noti => {
                if(noti.seen === false) {
                    read.push(noti)
                }
            })
        })
        setNumber(read.length)
    }

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        },
    }

    const handleNotification = async() => {
        setNumber(0)
        await userInfo.notification.map(noti => {
            noti.data.map(noti => noti.seen = true)
        })
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        })
        await axios.put(`https://grab-my-garbage-server.herokuapp.com/haulers/notification/read/${userInfo._id}`, config)
    }

    useEffect(() => {
        checkNotification()
    }, [])

    useEffect(async() => {
        if(socketLoading === false && start === true) {
            await socket.emit('haulerJoined', { haulerid: userInfo._id })
            setStart(false)
        }
    }, [socket])

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async() => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true
            })
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const {notification: {request: {content: {data: {screen, item}}}}} = response

        if(screen) {
            if(screen === 'PickupDetail') {
                navigation.navigate('HomeScreen', {
                    screen: 'Special',
                    params: {
                        screen: 'Upcoming',
                        params: {
                            screen: 'PickupDetail',
                            params: {item, buttons: false, name: 'Upcoming Pickups'}
                        }
                    }
                })
            } else if(screen === 'Chat') {
                navigation.navigate('HomeScreen', {
                    screen: 'Chat'
                })
            } else if(screen === 'Schedule') {
                navigation.navigate('HomeScreen', {
                    screen: 'Schedule',
                    params: {
                        screen: 'Today'
                    }
                })
            } else {
                navigation.navigate(screen)
            }
        }
    })

    return () => {
        Notifications.removeNotificationSubscription(responseListener.current)
    }
    }, [])

    return (
        <SafeAreaView style = {{backgroundColor: colors.grey9}}>
            <View style = {styles.container1}>
                    <View style = {{position: 'absolute', marginLeft: SCREEN_WIDTH/3}}>
                        <Onlinecomponent 
                            animation = {animation} 
                            online = {online} 
                            setOnline = {setOnline} 
                            pickupBtn = {pickupBtn}
                            choice = {choice.current}
                            order = {order}
                        />
                    </View>
                    
                    <View style = {{position: 'absolute', marginLeft: SCREEN_WIDTH/1.15}}>
                        <Icon
                            type = 'material'
                            name = 'notifications'
                            color = {colors.darkGrey }
                            size = {38}
                            style = {{
                                marginLeft: SCREEN_WIDTH/1.2
                            }}
                            onPress = {() => {
                                handleNotification()
                                navigation.navigate('Notifications')
                            }}
                        />
                        {
                            number > 0 &&
                            <View style = {styles.unread}>
                                <Text style = {styles.textUnread}>{number}</Text>
                            </View>
                        }
                    </View>
            </View>

            <View style = {styles.container2}>
                <Mapcomponent 
                    end = {end} 
                    redo = {redo} 
                    setLoading = {setLoading}
                />        
                <Animated.View style = {{...styles.view1, transform: [{translateY: translation}]}}>
                    <Animated.View style = {{...styles.view2, transform: [{translateY: translation}]}}>
                        {
                            (loading === true || pickupLoading === true || specialPickupLoading === true) ? 
                                <View style = {{alignItems: 'center', padding: 50, paddingTop: 30}}>
                                    <LottieView 
                                        source = {require('../../assets/animation/truck_loader.json')}
                                        style = {{
                                            width: SCREEN_WIDTH,
                                            height: 75,
                                        }}
                                        loop = {true}
                                        autoPlay = {true}
                                    />
                                </View>
                            :
                            pickupBtn === true ?
                                <Button 
                                    title = 'Start Pickup'
                                    buttonStyle = {styles.button}
                                    disabled = {pickupLoading || specialPickupLoading}
                                    loading = {pickupLoading || specialPickupLoading}
                                    onPress = {() => {
                                        setTimeout(() => {
                                            setpickupBtn(false)
                                        }, 500) 
                                        animation(2.8*SCREEN_HEIGHT/10, 2.8*SCREEN_HEIGHT/110)
                                    }}
                                />
                            : 
                            pickupBtn === false && choice.current === null ? 
                                <>
                                    <Button 
                                        title = 'Scheduled Pickup'
                                        buttonStyle = {{...styles.button, height: 40}}
                                        onPress = {() => {                       
                                            choice.current = 'schedule'
                                            animation(0, 0)
                                            setTimeout(() => {
                                                pickupHandler()
                                            }, 500)
                                        }}
                                    />
                                    <Button 
                                        title = 'Special Pickup'
                                        buttonStyle = {{...styles.button, marginTop: 10, height: 40}}
                                        onPress = {() => {
                                            choice.current = 'special'
                                            animation(0, 0)
                                            setTimeout(() => {
                                                pickupHandler()
                                            }, 500)
                                        }}
                                    />
                                </>
                            :
                            order !== null && pickupBtn === false && choice.current !== null ?                       
                                <Onpickupcomponent 
                                    navigation = {navigation} 
                                    handlePickupComplete = {handlePickupComplete} 
                                    order = {order} 
                                    arrived = {arrived}
                                />
                            :
                            order === null && choice.current !== null ? 
                                <Pickupcompletecomponent 
                                    navigation = {navigation} 
                                    choice = {choice.current} 
                                    setpickupBtn = {setpickupBtn} 
                                    animate = {animation} 
                                    choiceCall = {choiceCall}
                                />
                            :
                            null
                        }
                    </Animated.View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

export default Homescreen

const styles = StyleSheet.create({

    container1:{
        backgroundColor: colors.grey9, 
        marginBottom: 0,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center'
    },
    container2:{
        height: 9*SCREEN_HEIGHT/10 - 50,
        width: SCREEN_WIDTH,
    },
    view1:{
        position: 'absolute',
        padding: 10,
        marginTop: 5.5*SCREEN_HEIGHT/10,
    },
    view2:{
        width: SCREEN_WIDTH/1.05,
        height: 2.8*SCREEN_HEIGHT/10,
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    button:{
        width: SCREEN_WIDTH/1.3,
        height: 50,
        marginTop: 30,
        borderRadius: 15,
        marginHorizontal: 30,
        backgroundColor: colors.darkBlue
    },
    unread: {
        position: 'absolute',
        backgroundColor: 'red',
        width: 18,
        height: 18,
        borderRadius: 18 / 2,
        left: 15,
        top: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textUnread:{
        alignItems: 'center',
        justifyContent: 'center',
        color: "#FFFFFF",
        fontSize: 12,
    }
    
})
