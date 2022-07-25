import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, StyleSheet, Text, FlatList, Dimensions, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import * as Notifications from 'expo-notifications'

import { colors } from '../global/styles'
import { menuData } from '../global/data'
import { fromDate } from '../helpers/schedulepickupHelper'

import { addOngoingPickupLocation, removeOngoingPickup } from '../redux/actions/specialPickupActions'
import { addOngoingSchedulePickupLocation, removeOngoingSchedulePickup } from '../redux/actions/schedulePickupActions'
import { getPaymentIntent } from '../redux/actions/paymentActions'
import { SCHEDULED_PICKUP_RETRIEVE_SUCCESS } from '../redux/constants/scheduledPickupConstants'
import { ACCEPTED_PICKUP_RETRIEVE_SUCCESS, COMPLETED_PICKUP_RETRIEVE_SUCCESS } from '../redux/constants/specialPickupConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = ({navigation}) => {
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo, loading } = userLogin

    const specialPickup = useSelector((state) => state.specialPickup)
    const { pickupInfo } = specialPickup

    const socketHolder = useSelector((state) => state.socketHolder)
    const { loading: socketLoading, socket } = socketHolder

    const retrieveAcceptedPickups = useSelector((state) => state.retrieveAcceptedPickups)
    const { pickupInfo: acceptedPickups} = retrieveAcceptedPickups

    const retrieveScheduledPickup = useSelector((state) => state.retrieveScheduledPickup)
    const { pickupInfo: schedulePickup } = retrieveScheduledPickup

    const retrieveCompletedPickups = useSelector(state => state.retrieveCompletedPickups)
    const { pickupInfo: completed } = retrieveCompletedPickups

    const [activeScheduleStatus, setActiveScheduleStatus] = useState(false)
    const [activeSpecialStatus, setActiveSpecialStatus] = useState(false)
    const [scheduleId, setScheduleId] = useState(null)
    const [specialId, setSpecialId] = useState(null)
    const [firstSpecialStart, setFirstSpecialStart] = useState(true)
    const [firstScheduleStart, setFirstScheduleStart] = useState(true)
    const [first, setFirst] = useState(true)
    const [start, setStart] = useState(true)

    const responseListener = useRef()

    const handleSchedulePress = async() => {
        const pickup = await schedulePickup.find((pickup) => pickup._id === scheduleId)
        navigation.navigate('PickupScheduleDetail', {
            item: pickup, from: fromDate(pickup.from), to: fromDate(pickup.to)
        })
    }

    const handleSpecialPress = async() => {
        const pickup = await acceptedPickups.find((pickup) => pickup._id === specialId)
        navigation.navigate('SpecialRequests', {
            screen: 'Accepted',
            params: {
                screen: 'pickupDetail',
                params: {item: pickup, name: 'Accepted Pickups'}
            }
        })
    }

    useEffect(() => {
        dispatch(getPaymentIntent())

        Notifications.setNotificationHandler({
            handleNotification: async() => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true
            })
        })
    }, [])

    useEffect(async() => {
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const {notification: {request: {content: {data: {screen, item}}}}} = response

            if(screen === 'pickupDetail') {
                navigation.navigate('SpecialRequests', {
                    screen: 'Accepted',
                    params: {
                        screen: 'pickupDetail',
                        params: {
                            item, name: 'Accepted Pickups'
                        }
                    }
                })
            } else if(screen === 'completedPickup') {
                navigation.navigate('SpecialRequests', {
                    screen: 'Completed',
                    params: {
                        screen: 'completedPickup',
                    }
                })
            } else if(screen === 'PickupScheduleDetail') {
                navigation.navigate('ScheduleRequests', {
                    screen: 'PickupScheduleDetail',
                    params: {
                        item, from: fromDate(item.from), to: fromDate(item.to)
                    }
                })
            } else if(screen === 'ScheduleRequests') {
                navigation.navigate('ScheduleRequests')
            } else if(screen === 'Chat') {
                navigation.navigate('Home', {
                    screen: 'Chat'
                })
            }
        })

        return () => {
            Notifications.removeNotificationSubscription(responseListener.current)
        }
    }, [])

    const summation = () => {
        let sum = 0
        userInfo.schedule.map((schedule) => {
            sum += parseInt(schedule.payment)
        })
        userInfo.special.map((special) => {
            sum += parseInt(special.payment)
        })
        return sum
    }

    useEffect(async() => {
        if(socketLoading === false && first === true) {
            await socket.emit('userJoined', { userid: userInfo._id })
            setFirst(false)
        }
    }, [socket])

    useEffect(async() => {
        if(socket && schedulePickup && acceptedPickups && completed && start === true) {
            if(start === true) {
                setStart(false)
            }

            socket.on('userPickup', async({pickup, hauler, time}) => {
                dispatch(addOngoingPickupLocation({latitude: hauler.latitude, longitude: hauler.longitude, heading: hauler.heading, haulerid: pickup.haulerid, pickupid: pickup.pickupid, time: time}))
                setActiveSpecialStatus(true)
                setSpecialId(pickup.pickupid)

                if(firstSpecialStart === true) {
                    const index = await acceptedPickups.findIndex(pickup => pickup._id === pickup.pickupid)
                    const pickup = await acceptedPickups.splice(index, 1)[0]
                    pickup.active = 1
                    await acceptedPickups.splice(index, 0, pickup)
                    dispatch({
                        type: ACCEPTED_PICKUP_RETRIEVE_SUCCESS,
                        payload: acceptedPickups
                    })
                    setFirstSpecialStart(false)
                }

            })
            socket.on('userSchedulePickup', async({hauler, time, ongoingPickup, pickupid}) => {
                dispatch(addOngoingSchedulePickupLocation({latitude: hauler.latitude, longitude: hauler.longitude, heading: hauler.heading, haulerid: time.haulerid, ongoingPickupid: ongoingPickup, pickupid: pickupid, time: time.time}))
                setActiveScheduleStatus(true)
                setScheduleId(ongoingPickup)

                if(firstScheduleStart === true) {
                    const index = await schedulePickup.findIndex(pickup => pickup._id === pickupid)
                    const pickup = await schedulePickup.splice(index, 1)[0]
                    pickup.active = 1
                    await schedulePickup.splice(index, 0, pickup)
                    dispatch({
                        type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                        payload: schedulePickup
                    })
                    setFirstScheduleStart(false)
                }
            })

            socket.on('pickupDone', async({pickupid}) => {
                dispatch(removeOngoingPickup(pickupid))
                setActiveSpecialStatus(false)

                const pickup = await acceptedPickups.splice(acceptedPickups.findIndex(pickup => pickup._id === pickupid), 1)[0]
                dispatch({
                    type: ACCEPTED_PICKUP_RETRIEVE_SUCCESS,
                    payload: acceptedPickups
                })
                pickup.active = 0
                pickup.completed = 1
                completed.push(pickup)
                dispatch({
                    type: COMPLETED_PICKUP_RETRIEVE_SUCCESS,
                    payload: completed
                })

                setFirstSpecialStart(true)
            })
            socket.on('schedulePickupDone', async({pickupid}) => {
                dispatch(removeOngoingSchedulePickup(pickupid))
                setActiveScheduleStatus(false)

                const index = await schedulePickup.findIndex(pickup => pickup._id === pickupid)
                const pickup = await schedulePickup.splice(index, 1)[0]
                pickup.active = 0
                await schedulePickup.splice(index, 0, pickup)
                dispatch({
                    type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                    payload: schedulePickup
                })

                setFirstScheduleStart(true)
            })
        }
    }, [socket, acceptedPickups, schedulePickup, completed])

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
            <View style={{backgroundColor: colors.grey9}}>
                <View style = {styles.container}>
                    {
                        activeScheduleStatus &&
                        <Pressable 
                            style = {styles.view3}
                            onPress = {() => handleSchedulePress()}                      
                        >
                            <Text style = {styles.text3}>Schedule Pickup Ongoing</Text>
                        </Pressable>
                    }
                    {
                        activeSpecialStatus &&
                        <Pressable 
                            onPress = {() => handleSpecialPress()}
                            style = {styles.view3}
                        >
                            <Text style = {styles.text3}>Special Pickup Ongoing</Text>
                        </Pressable>
                    }
                    <View style = {styles.view1}>
                        <Text style = {styles.text1}>Hi {userInfo.name}</Text>
                        <Text style = {styles.text2}>Have you taken out the trash today?</Text>
                        <Image
                            source = {userInfo.image ? {uri: userInfo.image} : require('../../assets/user.png')}
                            style = {styles.image1}
                        />
                    </View>
                </View>

                <View style = {styles.container1}>
                    <View style = {styles.container2}>
                        <View style = {{width: '50%', alignItems: 'center'}}>
                            <Text style = {styles.text4}>Total Spent</Text>
                            <Text style = {styles.text5}>Rs {summation()}</Text>
                        </View>
                        <View style = {{width: '50%', alignItems: 'center'}}>
                            <Text style = {styles.text4}>Total Pickups</Text>
                            <Text style = {styles.text5}>{userInfo.count}</Text>
                        </View>
                    </View>

                    <View style = {{justifyContent: 'center', marginTop: '5%', flexDirection: 'column'}}>
                        <FlatList
                            numColumns = {2}
                            showsHorizontalScrollIndicator = {false}
                            data = {menuData}
                            keyExtractor = {(item) => item.id}
                            renderItem = {({item}) => (
                                <Pressable style = {styles.card}
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
                                        <Text style = {styles.title}>{item.name1}</Text>
                                        <Text style = {styles.description}>{item.description}</Text>
                                        <Text style = {styles.description}>{item.description1}</Text>
                                    </View>
                                </Pressable>
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
        backgroundColor: colors.grey9,
        //marginBottom: 0,
        height: SCREEN_HEIGHT/3.5
    },
    view1:{
        display: 'flex',
        paddingLeft: 25, 
        //flex: 1,
        justifyContent: 'space-around',
    },
    text1:{
        color: colors.grey2,
        fontSize: 21,
        //paddingBottom:5,
        paddingTop: 55,
        fontWeight: 'bold'
    },
    text2:{
        color: colors.grey1,
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
        backgroundColor: colors.white,
        height: SCREEN_HEIGHT/6.5,
        padding: 10,
        borderRadius: 25,
        flexDirection: 'row',
        elevation: 5
    },
    card:{
        flex: 1,
        margin: 5,
        marginHorizontal: 10
    },
    view2:{
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 15,
        backgroundColor: colors.white,
        elevation: 5,
        width: SCREEN_WIDTH/2.6,
        paddingHorizontal: 0
    },
    image2:{
        height: 40,
        width: 40,
        marginLeft: 10,
        alignSelf: 'flex-start'
    },
    title:{
        color: colors.grey2,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    description:{
        color: colors.grey1,
        marginLeft: 10,
        fontSize: 13
    },
    view3:{
        height: 25,
        width: SCREEN_WIDTH,
        position: 'absolute',
        backgroundColor: colors.darkGrey,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 999
    },
    text3:{
        color: colors.darkBlue,
        fontSize: 16,
        alignSelf: 'center'
    },
    text4:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.grey2,
        marginTop: 5
    },
    text5:{
        marginTop: 20,
        color: colors.grey1,
        fontSize: 17,
        fontWeight: 'bold'
    }

})