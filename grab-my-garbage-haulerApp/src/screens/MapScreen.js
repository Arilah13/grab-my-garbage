import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image, Alert, TouchableOpacity } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
//import Animated, { SlideInDown, SlideOutDown, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'

import { colors } from '../global/styles'
import { mapStyle } from '../global/mapStyles'
import { GOOGLE_MAPS_APIKEY } from '@env'
import { getLatngDiffInMeters } from '../helpers/homehelper'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Mapscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const mapView = useRef()

    const [end, setEnd] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pickupBtn, setpickupBtn] = useState(true)

    // const boxHeight = useSharedValue(0)
    // const boxMarginTop = useSharedValue(SCREEN_HEIGHT/1.4)

    const markerID = ['Marker1']
    let pickupOrder

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading: pickupLoading, pickupInfo } = upcomingPickups

    const map = useSelector((state) => state.map)
    const { origin } = map

    const handlePickup = async() => {
        setLoading(true)
        setpickupBtn(false)
        pickupOrder = await pickupInfo.sort((pickup_1, pickup_2) => 
            getLatngDiffInMeters(pickup_1.location[0].latitude, pickup_1.location[0].longitude, origin.latitude, origin.longitude) > 
            getLatngDiffInMeters (pickup_2.location[0].latitude, pickup_2.location[0].longitude, origin.latitude, origin.longitude) ? 1 : -1)
        setEnd({
            latitude: pickupOrder[0].location[0].latitude,
            longitude: pickupOrder[0].location[0].longitude
        })
        setLoading(false)
    }

    // const boxAnimation = useAnimatedStyle(() => {
    //     return{
    //         height: withTiming(boxHeight.value, {duration: 750})
    //     }
    // })

    // const heightAnimation = useAnimatedStyle(() => {
    //     return{
    //         marginTop: withTiming(boxMarginTop.value, {duration: 750})
    //     }
    // })

    // const toggleHeight = () => {
    //     boxHeight.value === 130 ? 
    //     boxHeight.value = 0 : 
    //     boxHeight.value = 130

    //     boxMarginTop.value === SCREEN_HEIGHT/1.2 ?
    //     boxMarginTop.value = SCREEN_HEIGHT/1.4 :
    //     boxMarginTop.value = SCREEN_HEIGHT/1.2
    // }

    // useEffect(() => {
    //     boxHeight.value = 130

    //     boxMarginTop.value = SCREEN_HEIGHT/1.2
    // }, [])

    return (
        <SafeAreaView>
            <View style = {styles.container1}>
                {/* { 
                    end === null && start === null ? 
                    <Homemapcomponent 
                        latlng = {null}
                        origin = {null}
                        destination = {null}
                    /> : start !== null && end === null ?
                    <Homemapcomponent
                        latlng = {start}
                        origin = {null}
                        destination = {null}
                    /> :
                    <Homemapcomponent 
                        latlng = {start}
                        origin = {start}
                        destination = {end}
                    />
                } */}
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
                            pickupBtn === true ?
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
                                    loading = {loading || pickupLoading}
                                    disabled = {loading || pickupLoading}
                                    onPress = {() => handlePickup()}
                                />
                            ) : 
                                <View>
                                    <Image
                                        //source = {{uri: pickupOrder[0].customerId.image}} 
                                    />
                                </View>
                        }
                    </View>
                </View>
            </View>


        </SafeAreaView>
    );
}

export default Mapscreen

const styles = StyleSheet.create({

    container1:{
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
    },
    view1:{
        position: 'absolute',
        padding: 10,
        marginTop: SCREEN_HEIGHT/1.4,
    },
    view2:{
        width: SCREEN_WIDTH/1.05,
        height: 200,
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
