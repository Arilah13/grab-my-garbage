import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import LottieView from 'lottie-react-native'
import * as Linking from 'expo-linking'

import { colors } from '../global/styles'
import { mapStyle } from '../global/mapStyles'
import { GOOGLE_MAPS_APIKEY } from '@env'
import { getLatngDiffInMeters } from '../helpers/homehelper'
import { sendSMS } from '../redux/actions/specialRequestActions'
import { getScheduledPickupsToCollect, completeScheduledPickup } from '../redux/actions/scheduleRequestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Scheduledpickupscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const mapView = useRef()

    const [end, setEnd] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pickupBtn, setpickupBtn] = useState(true)
    const [order, setOrder] = useState(null)
    const [redo, setRedo] = useState(false)
    const [arrived, setArrived] = useState(false)
    const [nextPickup, setNextPickup] = useState(false)
    const [distance, setDistance] = useState(null)
    const [enable, setEnable] = useState(false)

    const markerID = ['Marker1']

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const retrieveCollectSchedulePickup = useSelector((state) => state.retrieveCollectSchedulePickup)
    const { loading: pickupLoading, pickupInfo, success } = retrieveCollectSchedulePickup

    const map = useSelector((state) => state.map)
    const { origin } = map

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const filterPickup = async(pickup) => {
        const pickupOrder = await pickup.sort((pickup_1, pickup_2) => 
            getLatngDiffInMeters(pickup_1.location[0].latitude, pickup_1.location[0].longitude, origin.latitude, origin.longitude) > 
            getLatngDiffInMeters (pickup_2.location[0].latitude, pickup_2.location[0].longitude, origin.latitude, origin.longitude) ? 1 : -1)
        return pickupOrder
    }

    const pickupHandler = async() => {
        setLoading(true)
        setRedo(true)
        
        const pickupOrder = await filterPickup(pickupInfo)

        if(pickupOrder.length > 0) {
            setEnd({
                latitude: pickupOrder[0].location[0].latitude,
                longitude: pickupOrder[0].location[0].longitude
            })
            setOrder(pickupOrder[0])
            socket.emit('pickupOnProgress', { haulerid: userInfo._id, pickupid: pickupOrder[0]._id, userid: pickupOrder[0].customerId._id })
        } else {
            setEnd(null)
            setOrder(null)
        } 
        setLoading(false)
        setRedo(false)
    }

    const handlePickup = async() => {
        setpickupBtn(false)
        pickupHandler()
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
            dispatch(completeScheduledPickup({id: order._id, completedDate: new Date(), completedHauler: userInfo}))
            socket.emit('pickupCompleted', {pickupid: order._id})
            setNextPickup(true)
        }
    }

    useEffect(async() => {
        if(success === true && nextPickup === true && pickupLoading === false) {
            setArrived(false)
            pickupHandler()
        }
    }, [success, pickupLoading])

    useEffect(() => {
        mapView.current.animateToRegion({
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.00025
        })
    }, [origin])

    useEffect(() => {
        if(distance <= 100/1000) 
            setEnable(true)
        else 
            setEnable(false)
    }, [distance])

    useEffect(() => {
        dispatch(getScheduledPickupsToCollect())
    }, [])

    return (
        <SafeAreaView>
            <View style = {styles.container1}>
                <MapView
                    provider = {PROVIDER_GOOGLE}
                    style = {styles.map}
                    customMapStyle = {mapStyle}
                    showsUserLocation = {false}
                    followsUserLocation = {true}
                    initialRegion = {
                        {latitude: origin.latitude, longitude: origin.longitude, latitudeDelta: 0.04, longitudeDelta: 0.02}
                    }
                    ref = {mapView}

                    onMapReady = {() => {
                        setLoading(true)
                        setTimeout(() => {
                            mapView.current.fitToSuppliedMarkers(markerID, {
                                animated: true,
                                edgePadding: {
                                    right: SCREEN_WIDTH/20,
                                    bottom: SCREEN_HEIGHT/20,
                                    left: SCREEN_WIDTH/20,
                                    top: SCREEN_HEIGHT/20
                                }
                            })
                        }, 1000)
                        setTimeout(() => {
                            setLoading(false)
                        }, 2000)
                    }}
                >
                    <Marker 
                        coordinate = {origin}
                        identifier = 'Marker1'
                    >
                        <Image
                            source = {require('../../assets/garbage_truck.png')}
                            style = {styles.marker2}
                        />
                    </Marker>
                    {
                        end !== null ?
                        <>
                            <Marker coordinate = {end} >
                                <Image
                                    source = {require('../../assets/garbage.png')}
                                    style = {styles.marker}
                                />
                            </Marker>
                            <MapViewDirections
                                origin = {origin}
                                destination = {end}
                                mode = 'DRIVING'
                                language = 'en'
                                strokeWidth = {3}
                                strokeColor = {colors.blue2}
                                apikey = {GOOGLE_MAPS_APIKEY}
                                resetOnChange = {true}
                                
                                onReady = {(result) => {
                                    setDistance(result.distance)
                                    if(redo === true){
                                        mapView.current.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                right: SCREEN_WIDTH/20,
                                                bottom: SCREEN_HEIGHT/3,
                                                left: SCREEN_WIDTH/20,
                                                top: SCREEN_HEIGHT/20
                                            }
                                        })

                                        setTimeout(() => {
                                            mapView.current.fitToSuppliedMarkers(markerID, {
                                                animated: true,
                                                edgePadding: {
                                                    right: SCREEN_WIDTH/20,
                                                    bottom: SCREEN_HEIGHT/20,
                                                    left: SCREEN_WIDTH/20,
                                                    top: SCREEN_HEIGHT/20
                                                }
                                            })
                                        }, 4000)
                                    }
                                }}
                            /> 
                        </>
                        : null
                    }
                        
                </MapView>
                
                <TouchableOpacity style = {styles.view3}
                        onPress = {() => navigation.navigate('Home')}
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
                        <Text style = {styles.text}>Home</Text>
                </TouchableOpacity>
                
                <View style = {styles.view1}>
                    <View style = {styles.view2}>
                        {
                            (loading === true || pickupLoading === true) ? 
                            (
                                <View style = {{alignItems: 'center', padding: 50}}>
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
                            pickupBtn === true && pickupLoading === false && pickupInfo.length > 0 ?
                            ( 
                                <Button 
                                    title = 'Start Pickup'
                                    buttonStyle = {{
                                        width: SCREEN_WIDTH/1.3,
                                        height: 50,
                                        marginTop: 60,
                                        borderRadius: 15,
                                        marginHorizontal: 30,
                                        backgroundColor: colors.darkBlue
                                    }}
                                    onPress = {() => handlePickup()}
                                />
                            ) : 
                            order !== null && pickupBtn === false ?
                            (
                                <>
                                <View style = {{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
                                    <View>
                                        <Image
                                            source = {{uri: order.customerId.image}} 
                                            style = {styles.image}
                                        />
                                    </View>
                                    <View>
                                        <Text style = {styles.text2}>{order.customerId.name}</Text>
                                    </View>
                                </View>
                                <View style = {{flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <TouchableOpacity 
                                        style = {{
                                            flexDirection: 'row', 
                                        }}
                                        onPress = {() => Linking.openURL(`tel:${order.customerId.phone}`)}
                                    >
                                        <Icon
                                            type = 'material'
                                            name = 'call'
                                            color = {colors.darkBlue}
                                            size = {25}
                                        />
                                        <Text style = {styles.text3}>Call</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style = {{
                                            flexDirection: 'row', 
                                        }}
                                        onPress = {() => navigation.navigate('Chat', {
                                            userid: order.customerId, name: 'Pickup', pickupid: order._id
                                        })}
                                    >
                                        <Icon
                                            type = 'material'
                                            name = 'chat'
                                            color = {colors.darkBlue}
                                            size = {25}
                                        />    
                                        <Text style = {styles.text3}>Chat</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    enable === true ? 
                                    (
                                        <View style = {{flex: 1, marginTop: -40, padding: 25, paddingVertical: 0}}>
                                            <Button 
                                                title = { arrived === false ? 'Arrived' : 'Completed' }
                                                buttonStyle = {{
                                                    width: SCREEN_WIDTH/1.2,
                                                    borderRadius: 10,
                                                    height: 45,
                                                    backgroundColor: colors.darkBlue
                                                }}
                                                onPress = {() => handlePickupComplete()}
                                            />
                                        </View>
                                    ) :
                                    (
                                        <View style = {{flex: 1, marginTop: -40, padding: 25, paddingVertical: 0}}>
                                            <Button 
                                                title = { arrived === false ? 'Arrived' : 'Completed' }
                                                buttonStyle = {{
                                                    width: SCREEN_WIDTH/1.2,
                                                    borderRadius: 10,
                                                    height: 45,
                                                    backgroundColor: colors.darkBlue
                                                }}
                                                disabled = {true}
                                            />
                                        </View>
                                    )
                                }
                                
                                </>
                            ) :
                            order === null ? 
                            (
                                <View style = {{alignItems: 'center', padding: 50}}>
                                    <Text style = {{fontWeight: 'bold', fontSize: 15, color: colors.blue2}}>No Pickups Available For Now</Text>
                                    <Button 
                                        title = 'Check Pickups'
                                        buttonStyle = {{
                                            width: SCREEN_WIDTH/1.3,
                                            marginTop: 15,
                                            borderRadius: 10,
                                            height: 45,
                                            backgroundColor: colors.darkBlue
                                        }}
                                        onPress = {() => navigation.navigate('History')}
                                    />
                                </View>
                            ) :
                            null
                        }
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
}

export default Scheduledpickupscreen

const styles = StyleSheet.create({

    container1:{
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
    },
    view1:{
        position: 'absolute',
        padding: 10,
        marginTop: SCREEN_HEIGHT/1.5,
    },
    view2:{
        width: SCREEN_WIDTH/1.05,
        height: 220,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    view3: {
        position: 'absolute', 
        marginLeft: 15,
        zIndex: 4
    },
    text: {
        top: -24,
        left: 30,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    image:{
        height: 60,
        width: 60,
        borderRadius: 50,
        marginTop: 10,
        marginLeft: 20,
        borderColor: colors.darkBlue,
        borderWidth: 2
    },
    text2:{
        marginLeft: 20,
        marginTop: 25,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    text3:{
        marginLeft: 15,
        fontWeight: 'bold',
        color: colors.darkBlue,
        fontSize: 15
    },  
    map: {
        height:"100%",
        width:"100%",
        zIndex: -1
    },    
    marker: {
        width: 30,
        height: 30,
    },
    marker2: {
        width: 28,
        height: 40,
    }

})
