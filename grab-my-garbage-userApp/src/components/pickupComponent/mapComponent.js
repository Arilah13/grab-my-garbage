import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated } from 'react-native'
import { Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import * as Linking from 'expo-linking'
import LottieView from 'lottie-react-native'
import Modal from 'react-native-modal'

import { colors } from '../../global/styles'
import { mapStyle } from '../../global/mapStyle'
import { GOOGLE_MAPS_APIKEY } from '@env'

import { getAcceptedPickups, getCompletedPickups } from '../../redux/actions/specialPickupActions'
import { receiverRead } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

import Chatcomponent from './chatComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const AnimatedImage = Animated.createAnimatedComponent(Image)

const Mapcomponent = ({location, item, setModalVisible, type, navigation, modalVisible, convo}) => {
    const dispatch = useDispatch()

    const mapView = useRef()
    const marker = useRef()
    const first = useRef(true)
    const translation = useRef(new Animated.Value(SCREEN_HEIGHT/4.3)).current
    const fade = useRef(new Animated.Value(0)).current
    const rotation = useRef(new Animated.Value(0)).current

    const bearingDegree = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    })

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const ongoingScheduledPickupLocation = useSelector((state) => state.ongoingScheduledPickupLocation)
    const { ongoingPickups } = ongoingScheduledPickupLocation

    const ongoingPickupLocation = useSelector((state) => state.ongoingPickupLocation)
    const { ongoingPickups: ongoingSpecialPickups } = ongoingPickupLocation

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const [redo, setRedo] = useState(true)
    const [pickup, setPickup] = useState(null)
    const [complete, setComplete] = useState(false)
    const [time, setTime] = useState(null)
    const [show, setShow] = useState(false)
    const [timeout1, setTimeoutValue1] = useState(null)
    const [timeout2, setTimeoutValue2] = useState(null)
    const [timeout3, setTimeoutValue3] = useState(null)
    const [modalVisible1, setModalVisible1] = useState(false)

    const timeChanger = (duration) => {
        const date = new Date().getTime() 
        const time = date + (duration * 1000) + (330 * 60000)
        const hour = Math.floor((time / (1000*60*60)) % 24)
        let minutes = Math.floor((time / (1000 * 60)) % 60)
        if(minutes < 10){
            minutes = '0' + String(minutes)
        }
        const hour_12 = (hour + 11) % 12 + 1 

        const final = hour_12 + ':' + minutes + (hour >= 12 ? ' PM' : ' AM')  
        setTime(final)
    }

    const messageRead = async(haulerId) => {
        const index = await conversation.findIndex((convo) => convo.conversation.haulerId._id === haulerId && convo.conversation.userId._id === userInfo._id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverUserRead === false) {
            element.conversation.receiverUserRead = true
            dispatch(receiverRead(element.conversation._id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }

    useEffect(() => {
        if (type === 'schedule') {
            if(ongoingPickups !== undefined && ongoingPickups.length > 0) {
                const ongoingPickup =  ongoingPickups.find((ongoingPickup) => ongoingPickup.pickupid === item._id)
                if(ongoingPickup) {
                    setPickup(ongoingPickup)
                    timeChanger(ongoingPickup.time)
                    Animated.timing(rotation, {
                        toValue: ongoingPickup.heading,
                        useNativeDriver: true,
                        duration: 4000
                    }).start()
                    if(ongoingPickup.pickupid === ongoingPickup.ongoingPickupid){
                        setShow(true)
                        // if(mapView.current) {
                        //     mapView.current.animateToRegion({
                        //         latitude: ongoingPickup.latitude,
                        //         longitude: ongoingPickup.longitude,
                        //         latitudeDelta: 0.0005,
                        //         longitudeDelta: 0.00025
                        //     }, 2000)
                        // }
                        if(marker.current) {
                            marker.current.animateMarkerToCoordinate({latitude: ongoingPickup.latitude, longitude: ongoingPickup.longitude}, 500)
                        }
                    }
                    Animated.timing(translation, {
                        toValue: 0,
                        useNativeDriver: true,
                        duration: 1000
                    }).start()
                }
            }
        } else if (type === 'special') {
            if(ongoingSpecialPickups !== undefined && ongoingSpecialPickups.length > 0) {
                const ongoingSpecialPickup =  ongoingSpecialPickups.find((ongoingPickup) => ongoingPickup.pickupid === item._id)

                if(ongoingSpecialPickup && ongoingSpecialPickup.pickupid === item._id){
                    setShow(true)
                    setPickup(ongoingSpecialPickup)
                    timeChanger(ongoingSpecialPickup.time)
                    Animated.timing(rotation, {
                        toValue: ongoingSpecialPickup.heading,
                        useNativeDriver: true,
                        duration: 2000
                    }).start()
                    // if(mapView.current) {
                    //     mapView.current.animateToRegion({
                    //         latitude: ongoingSpecialPickup.latitude,
                    //         longitude: ongoingSpecialPickup.longitude,
                    //         latitudeDelta: 0.0005,
                    //         longitudeDelta: 0.00025
                    //     }, 2000)
                    // }
                    if(marker.current) {
                        marker.current.animateMarkerToCoordinate({latitude: ongoingSpecialPickup.latitude, longitude: ongoingSpecialPickup.longitude}, 500)
                    }
                    Animated.timing(translation, {
                        toValue: 0,
                        useNativeDriver: true,
                        duration: 1000
                    }).start()
                }
            }
        }
    }, [ongoingPickups, ongoingSpecialPickups]) 

    useEffect(() => {
        if(pickup !== null) 
            setTimeout(() => {
                setRedo(false)
            }, 100) 
    }, [pickup])

    useEffect(() => {
        socket.on('pickupDone', async({pickupid}) => {
            if(item._id === pickupid && first.current === true) {
                setPickup(null)
                dispatch(getAcceptedPickups())
                dispatch(getCompletedPickups())
                setComplete(true)
                setTimeout(() => {
                    if(modalVisible === true) {
                        setModalVisible(false)
                    }
                    if(modalVisible1 === true) {
                        setModalVisible1(false)
                    }
                }, 2500)
                const timeout = setTimeout(() => {
                    navigation.navigate('acceptedPickup')
                }, 2800)
            }
            first.current = false
        })

        socket.on('schedulePickupDone', async({pickupid}) => {
            if(item._id === pickupid && first.current === true) {
                setPickup(null)
                setComplete(true)
                setTimeout(() => {
                    if(modalVisible === true) {
                        setModalVisible(false)
                    }
                    if(modalVisible1 === true) {
                        setModalVisible1(false)
                    }
                }, 2500)
            }
            first.current = false
        })
    }, [socket])

    useEffect(() => {
        Animated.timing(fade, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start()
    }, [])

    return (
        <View style  = {styles.container}>     
            <MapView
                provider = {PROVIDER_GOOGLE}
                style = {styles.map}
                customMapStyle = {mapStyle}
                showsUserLocation = {false}
                followsUserLocation = {false}
                initialRegion = {{latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.01}}
                ref = {mapView}
                minZoomLevel = {8}
                maxZoomLevel = {20}
            >
                <Marker.Animated 
                    coordinate = {{latitude: location.latitude, longitude: location.longitude}} 
                    anchor = {{x: 0.5, y: 0.5}}
                >
                    <AnimatedImage
                        source = {require('../../../assets/map/marker.png')}
                        style = {{
                            width: 25,
                            height: 25,
                            resizeMode: 'cover',
                        }}
                    />
                </Marker.Animated>
                {
                    pickup !== null && complete === false ? 
                    <>
                        <Marker.Animated
                            ref = {marker}
                            coordinate = {{latitude: pickup.latitude, longitude: pickup.longitude}}
                            anchor = {{x: 0.5, y: 0.5}}
                        >
                            <AnimatedImage
                                source = {require('../../../assets/map/truck_garbage.png')}
                                style = {{
                                    width: 35,
                                    height: 35,
                                    resizeMode: 'cover',
                                    transform: [{
                                        rotate: bearingDegree
                                    }]
                                }}
                            />
                        </Marker.Animated>
                        <MapViewDirections
                            origin = {{latitude: pickup.latitude, longitude: pickup.longitude}}
                            destination = {{latitude: location.latitude, longitude: location.longitude}}
                            mode = 'DRIVING'
                            language = 'en'
                            strokeWidth = {show === true ? 5 : 0}
                            strokeColor = {colors.darkBlue}
                            apikey = {GOOGLE_MAPS_APIKEY}
                            resetOnChange = {false}
                            timePrecision = 'now'
                            
                            onReady = {(result) => {
                                const timeout = setTimeout(() => {
                                    redo === true ?
                                    mapView.current.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: SCREEN_WIDTH/20,
                                            bottom: SCREEN_HEIGHT/2.5,
                                            left: SCREEN_WIDTH/20,
                                            top: SCREEN_HEIGHT/20
                                        }
                                    })
                                : null
                                }, 100)
                                setTimeoutValue1(timeout)
                            }}
                        />
                    </>
                    : null
                }
            </MapView>

            <Animated.View style = {{...styles.view, opacity: fade}}>
                <TouchableOpacity onPress = {() => {
                        //clearTimeout(timeout)
                        setModalVisible(false)
                    }}
                >
                    <Icon
                        type = 'font-awesome-5'
                        name = 'angle-left'
                        color = {colors.darkBlue}
                        size = {32}
                        style = {{
                            alignSelf: 'flex-start',
                            marginTop: 25,
                            display: 'flex'
                        }}
                    />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style = {{...styles.view1, transform: [{translateY: translation}]}}>
                <View style = {styles.view2}>
                    {
                        complete === true && pickup === null ? 
                            <LottieView 
                                source = {require('../../../assets/animation/finish.json')}
                                style = {{
                                    width: SCREEN_WIDTH,
                                    height: 160,
                                    alignSelf: 'center',
                                }}
                                loop = {true}
                                autoPlay = {true}
                            /> 
                                : pickup !== null ?
                            <>
                            <View style = {{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
                                <View>
                                    <Image
                                        source = {{uri: item.pickerId.image}} 
                                        style = {styles.image}
                                    />
                                </View>
                                <View>
                                    <Text style = {styles.text1}>{item.pickerId.name}</Text>
                                </View>
                            </View>
                            <View style = {{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
                                <Text style = {{...styles.text2, marginTop: 25, fontSize: 14, marginLeft: 100}}>Est. Arrival Time:</Text>
                                <Text style = {{...styles.text2, marginTop: 25, position: 'absolute', marginLeft: 220, fontSize: 14}}>{ time !== null ? time : null}</Text>
                            </View>
                            <View style = {{flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around', marginTop: 5}}>
                                <TouchableOpacity 
                                    style = {{
                                        flexDirection: 'row', 
                                    }}
                                    onPress = {() => Linking.openURL(`tel:${item.pickerId.phone}`)}
                                >
                                    <Icon
                                        type = 'material'
                                        name = 'call'
                                        color = {colors.darkBlue}
                                        size = {25}
                                    />
                                    <Text style = {styles.text2}>Call</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style = {{
                                        flexDirection: 'row', 
                                    }}
                                    onPress = {() => {
                                        messageRead(item.pickerId._id)
                                        setModalVisible1(true)
                                    }}
                                >
                                    <Icon
                                        type = 'material'
                                        name = 'chat'
                                        color = {colors.darkBlue}
                                        size = {25}
                                    />    
                                    <Text style = {styles.text2}>Chat</Text>
                                </TouchableOpacity>
                            </View>    
                            
                            
                            <Modal
                                isVisible = {modalVisible1}
                                swipeDirection = {'down'}
                                style = {{ justifyContent: 'flex-end', marginHorizontal: 10, marginBottom: 0 }}
                                onBackButtonPress = {() => setModalVisible1(false)}
                                onBackdropPress = {() => setModalVisible1(false)}
                                animationInTiming = {500}
                                animationOutTiming = {500}
                                useNativeDriver = {true}
                                useNativeDriverForBackdrop = {true}
                                deviceHeight = {SCREEN_HEIGHT}
                                deviceWidth = {SCREEN_WIDTH}
                            >
                                <View style = {styles.view3}>
                                    <Chatcomponent haulerid = {item.pickerId} pickupid = {pickup.pickupid} setModalVisible = {setModalVisible1} convo = {convo}/>
                                </View>  
                            </Modal>
                            </>     
                            : null                        
                    }                           
                </View>
            </Animated.View>

        </View>
    );
}

export default Mapcomponent

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
    },
    view: {
        position: 'absolute', 
        marginLeft: 15,
        zIndex: 4
    },
    map: {
        height: "100%",
        width: "100%",
        zIndex: -1
    },    
    view1:{
        position: 'absolute',
        padding: 10,
        marginTop: SCREEN_HEIGHT/1.5,
        alignSelf: 'center',
        width: SCREEN_WIDTH
    },
    view2:{
        width: SCREEN_WIDTH/1.05,
        height: SCREEN_HEIGHT/4.3,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text1:{
        marginTop: 25,
        marginLeft: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    text2:{
        marginLeft: 15,
        fontWeight: 'bold',
        color: colors.darkBlue,
        fontSize: 15
    }, 
    image:{
        height: 60,
        width: 60,
        borderRadius: 50,
        marginTop: 10,
        marginLeft: 30,
        borderColor: colors.darkBlue,
        borderWidth: 2
    },
    view3:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: 'hidden',
    },

})
