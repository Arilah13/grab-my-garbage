import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import * as Linking from 'expo-linking'
import LottieView from 'lottie-react-native'

import { colors } from '../../global/styles'
import { mapStyle } from '../../global/mapStyle'
import { GOOGLE_MAPS_APIKEY } from '@env'
import Headercomponent from '../../components/HeaderComponent'
import { removeOngoingPickup } from '../../redux/actions/specialPickupActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const scheduledPickupLocationscreen = ({route, navigation}) => {

    const dispatch = useDispatch()

    const mapView = useRef()
    const marker = useRef()
    const first = useRef(true)

    const { location, item } = route.params

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const ongoingScheduledPickupLocation = useSelector((state) => state.ongoingScheduledPickupLocation)
    const { ongoingPickups } = ongoingScheduledPickupLocation

    const [redo, setRedo] = useState(true)
    const [pickup, setPickup] = useState(null)
    const [complete, setComplete] = useState(false)
    const [time, setTime] = useState(null)
    const [show, setShow] = useState(false)
    const [timeout1, setTimeoutValue1] = useState(null)
    const [timeout2, setTimeoutValue2] = useState(null)

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

    useEffect(() => {
        if(ongoingPickups !== undefined && ongoingPickups.length > 0) {
            const ongoingPickup =  ongoingPickups.find((ongoingPickup) => ongoingPickup.pickupid === item._id)
            if(ongoingPickup) {
                setPickup(ongoingPickup)
                timeChanger(ongoingPickup.time)
                if(ongoingPickup.pickupid === ongoingPickup.ongoingPickupid){
                    setShow(true)
                    mapView.current.animateToRegion({
                        latitude: ongoingPickup.latitude,
                        longitude: ongoingPickup.longitude,
                        latitudeDelta: 0.0005,
                        longitudeDelta: 0.00025
                    }, 5000)
                    if(first.current === false)
                        marker.current.animateMarkerToCoordinate({latitude: ongoingPickup.latitude, longitude: ongoingPickup.longitude}, 7000)
                    first.current = false
                }
            }
        }
    }, [ongoingPickups]) 

    useEffect(() => {
        if(pickup !== null) 
            setTimeout(() => {
                setRedo(false)
            }, 100) 
    }, [pickup])

    useEffect(() => {
        socket.on('pickupDone', async({pickupid}) => {
            setPickup(null)
            dispatch(removeOngoingPickup(pickupid))
            setComplete(true)
            const timeout = setTimeout(() => {
                navigation.navigate('acceptedPickup')
            }, 1500)
            setTimeoutValue2(timeout)
        })
    }, [socket])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1, height: SCREEN_HEIGHT}}>
            <Headercomponent 
                name = 'Pickup Detail' 
                timeout1 = {timeout1}
                timeout2 = {timeout2}
            />
            <View style = {{padding: 10}}>
                <View style  = {styles.container}>     
                    <MapView
                        provider = {PROVIDER_GOOGLE}
                        style = {styles.map}
                        customMapStyle = {mapStyle}
                        showsUserLocation = {false}
                        followsUserLocation = {false}
                        initialRegion = {{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.01 }}
                        ref = {mapView}
                    >
                        <Marker coordinate = {{latitude: location.latitude, longitude: location.longitude}} >
                            <Image
                                source = {require('../../../assets/marker.png')}
                                style = {styles.marker}
                            />
                        </Marker>
                        {
                            pickup !== null && complete === false ? 
                            <>
                                <Marker.Animated
                                    ref = {marker}
                                    coordinate = {{latitude: pickup.latitude, longitude: pickup.longitude}}
                                >
                                    <Image
                                        source = {require('../../../assets/garbage_truck.png')}
                                        style = {styles.marker2}
                                    />
                                </Marker.Animated>
                                <MapViewDirections
                                    origin = {{latitude: pickup.latitude, longitude: pickup.longitude}}
                                    destination = {{latitude: location.latitude, longitude: location.longitude}}
                                    mode = 'DRIVING'
                                    language = 'en'
                                    strokeWidth = {show === true ? 3 : 0}
                                    strokeColor = {colors.blue2}
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
                    {
                        pickup !== null && complete === false ?
                        (
                            <View style = {styles.view1}>
                                <View style = {styles.view2}>
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
                                        <Text style = {{...styles.text2, marginTop: 15, fontSize: 14, marginLeft: 70}}>Est. Arrival Time:</Text>
                                        <Text style = {{...styles.text2, marginTop: 15, position: 'absolute', marginLeft: 190, fontSize: 14}}>{ time !== null ? time : null}</Text>
                                    </View>
                                    <View style = {{flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around', marginTop: -10}}>
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
                                            onPress = {() => navigation.navigate('Chat', {
                                                haulerid: pickup.haulerid, name: 'Location', pickupid: pickup.pickupid
                                            })}
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
                                </View>
                            </View>
                        ) :
                        complete === true && pickup === null ? 
                        <View style = {styles.view1}>
                            <View style = {styles.view2}>
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
                            </View>
                        </View>
                        :
                        null
                    }
                </View>
            </View>
        </SafeAreaView>
    );
}

export default scheduledPickupLocationscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        //paddingTop: 10,
        overflow: 'hidden'
    },
    map: {
        height: "100%",
        width: "100%",
        zIndex: -1
    },    
    marker: {
        width: 28,
        height: 29,
    },
    marker2: {
        width: 28,
        height: 40,
    },
    view1:{
        position: 'absolute',
        padding: 10,
        marginTop: SCREEN_HEIGHT/1.6,
        alignSelf: 'center'
    },
    view2:{
        width: SCREEN_WIDTH/1.2,
        height: 170,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text1:{
        marginLeft: 20,
        marginTop: 25,
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

})
