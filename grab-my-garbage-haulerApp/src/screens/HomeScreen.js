import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet, Dimensions, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button } from 'react-native-elements'

import { colors } from '../global/styles'
import Onlinecomponent from '../components/HomeScreen/OnlineComponent'

import { getLatngDiffInMeters } from '../helpers/homehelper'
import { sendSMS } from '../redux/actions/specialRequestActions'
import { getScheduledPickupsToCollect, completeScheduledPickup } from '../redux/actions/scheduleRequestActions'
import { getUpcomingPickups, completedPickup } from '../redux/actions/specialRequestActions'
import Mapcomponent from '../components/HomeScreen/MapComponent'
import Onpickupcomponent from '../components/HomeScreen/onPickupComponent'
import Pickupcompletecomponent from '../components/HomeScreen/pickupCompleteComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = ({navigation}) => {
    const dispatch = useDispatch()

    const translation = useRef(new Animated.Value(220)).current
    const choice = useRef(null)

    const [end, setEnd] = useState(null)
    const [online, setOnline] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pickupBtn, setpickupBtn] = useState(true)
    const [order, setOrder] = useState(null)
    const [redo, setRedo] = useState(false)
    const [arrived, setArrived] = useState(false)
    const [nextPickup, setNextPickup] = useState(false)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const retrieveCollectSchedulePickup = useSelector((state) => state.retrieveCollectSchedulePickup)
    const { loading: pickupLoading, pickupInfo, success } = retrieveCollectSchedulePickup

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading: specialPickupLoading, pickupInfo: specialPickupInfo, success: specialPickupSuccess } = upcomingPickups

    const socketHolder = useSelector((state) => state.socketHolder)
    const { loading: socketLoading, socket } = socketHolder

    const map = useSelector((state) => state.map)
    const { origin } = map

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

    const filterPickup = async(pickup) => {
        const pickupOrder = await pickup.sort((pickup_1, pickup_2) => 
            getLatngDiffInMeters(pickup_1.location[0].latitude, pickup_1.location[0].longitude, origin.latitude, origin.longitude) > 
            getLatngDiffInMeters (pickup_2.location[0].latitude, pickup_2.location[0].longitude, origin.latitude, origin.longitude) ? 1 : -1)
        console.log(pickupOrder)
        return pickupOrder
    }

    const setPickups = (pickupOrder) => {
        if(pickupOrder.length > 0) {
            setEnd({
                latitude: pickupOrder[0].location[0].latitude,
                longitude: pickupOrder[0].location[0].longitude
            })
            setOrder(pickupOrder[0])
            
            if (choice.current === 'schedule') {
                socket.emit('scheduledPickupOnProgress', { haulerid: userInfo._id, ongoingPickup: pickupOrder[0], pickup: pickupOrder })
            } else if (choice.current === 'special') {
                socket.emit('pickupOnProgress', { haulerid: userInfo._id, pickupid: pickupOrder[0]._id, userid: pickupOrder[0].customerId._id })
            }
        } else {
            setEnd(null)
            setOrder(null)
        } 
    }

    const pickupHandler = async() => {
            setLoading(true)
            setRedo(true)
            
            if (choice.current === 'schedule') {
                const pickupOrder = await filterPickup(pickupInfo)
                setPickups(pickupOrder)
            } else if (choice.current === 'special') {
                const pickupOrder = await filterPickup(specialPickupInfo)
                setPickups(pickupOrder)
            }
            
            setLoading(false)
            setRedo(false)
    }

    const handlePickupComplete = async() => {
        if(arrived === false) {
            setArrived(true)

            let num
            num = String(order.customerId.phone).substring(1)

            let receiver = '+94'.concat(num)
            const message = 'Your Hauler is at your doorstep, make sure garbage is collected'

            dispatch(sendSMS({receiver: receiver, message: message}))

        } else if(arrived === true) {
            setLoading(true)

            if (choice.current === 'schedule') {
                dispatch(completeScheduledPickup({id: order._id, completedDate: new Date(), completedHauler: userInfo}))
                socket.emit('schedulePickupCompleted', {pickupid: order._id, userid: order.customerId._id})
            } else if(choice.current === 'special') {
                dispatch(completedPickup(order._id))
                socket.emit('pickupCompleted', {pickupid: order._id})
            }

            setNextPickup(true)

        }
    }

    // const animatePolylineStart = () => {     
    //     if(polylinePath.length < directionRoutes.length) {
    //         const Direction = directionRoutes
    //         const polylinePath = [...Direction.slice(0, polylinePath.length - 1)]
    //         setPolylinePath(polylinePath)
    //     } else {
    //         setPolylinePath([])
    //     }
    // }

    useEffect(async() => {
        if(nextPickup === true && specialPickupSuccess === true && specialPickupLoading === false && success === true && pickupLoading === false) {
            setArrived(false)
            pickupHandler()
            setNextPickup(false)
        }
    }, [specialPickupInfo, pickupInfo])

    useEffect(() => {
        if(socketLoading === false) {
            socket.emit('haulerJoined', { haulerid: userInfo._id })
            socket.on('newOrder', () => {
                //dispatch(getPendingPickups(latitude, longitude))
            })
        }
    }, [socket])

    useEffect(() => {
        if(online === true) {
            dispatch(getScheduledPickupsToCollect())
            dispatch(getUpcomingPickups())
        }
    }, [online])

    useEffect(() => {
        if(pickupBtn === true)
            choice.current = null
    }, [pickupBtn])

    // useEffect(() => {
    //     if(polylinePath.length > 0 && directionRoutes.length > 0)
    //         setInterval(() => animatePolylineStart(), 70)
    // }, [polylinePath, directionRoutes])

    return (
        <SafeAreaView style = {{backgroundColor: colors.grey8}}>
            <View style = {styles.container1}>
                <View style = {{flexDirection: 'row'}}>
                    <Onlinecomponent 
                        animation = {animation} 
                        online = {online} 
                        setOnline = {setOnline} 
                        pickupBtn = {pickupBtn}
                        choice = {choice.current}
                        order = {order}
                    />
                </View>
            </View>

            <View style = {styles.container2}>
                <Mapcomponent end = {end} redo = {redo} setLoading = {setLoading}/>        
                <Animated.View style = {{...styles.view1, transform: [{translateY: translation}]}}>
                    <Animated.View style = {{...styles.view2, transform: [{translateY: translation}]}}>
                        {
                            (loading === true || pickupLoading === true || specialPickupLoading === true) ? 
                            (
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
                            ) :
                            pickupBtn === true ?
                            ( 
                                <Button 
                                    title = 'Start Pickup'
                                    buttonStyle = {styles.button}
                                    onPress = {() => {
                                        setTimeout(() => {
                                            setpickupBtn(false)
                                        }, 500) 
                                        animation(2.8*SCREEN_HEIGHT/10, 2.8*SCREEN_HEIGHT/110)
                                    }}
                                />
                            ) : 
                            pickupBtn === false && choice.current === null ? (
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
                            ) :
                            order !== null && pickupBtn === false && choice.current === 'schedule' ?
                            (
                                <Onpickupcomponent 
                                    navigation = {navigation} 
                                    handlePickupComplete = {handlePickupComplete} 
                                    order = {order} 
                                    arrived = {arrived}
                                />
                            ) :
                            order !== null && pickupBtn === false && choice.current === 'special' ?
                            (
                                <Onpickupcomponent 
                                    navigation = {navigation} 
                                    handlePickupComplete = {handlePickupComplete} 
                                    order = {order} 
                                    arrived = {arrived}
                                />
                            ) :
                            order === null && choice.current !== null && pickupLoading === false && success === true || specialPickupLoading === false && specialPickupSuccess === true ? 
                            (
                                <Pickupcompletecomponent navigation = {navigation} choice = {choice.current} setpickupBtn = {setpickupBtn} animate = {animation} />
                            ) :
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
        backgroundColor: colors.white,
        //paddingLeft: 25, 
        marginBottom: 0,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around'
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
    }
    
})
