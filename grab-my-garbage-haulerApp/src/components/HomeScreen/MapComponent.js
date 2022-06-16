import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet, Image, Dimensions, Animated, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import { mapStyle } from '../../global/mapStyles'
import { GOOGLE_MAPS_APIKEY } from '@env'
import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const AnimatedImage = Animated.createAnimatedComponent(Image)
const AnimatedMarker = Animated.createAnimatedComponent(Marker)

const Mapcomponent = ({end, redo, setLoading}) => {
    const map = useSelector((state) => state.map)
    const { origin } = map

    const first = useRef(true)
    const mapView = useRef()
    const marker = useRef()
    const rotation = useRef(new Animated.Value(0)).current
    
    const bearingDegree = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    })

    const [currentCoordinate, setCurrentCoordinate] = useState()
    const [distance, setDistance] = useState(null)
    const [timeout1, setTimeoutValue1] = useState(null)
    const [timeout2, setTimeoutValue2] = useState(null)
    const [timeout3, setTimeoutValue3] = useState(null)

    const markerID = ['Marker1']

    useEffect(() => {
        if(origin !== undefined) {
            if(first.current === true) {
                setCurrentCoordinate(new AnimatedRegion({
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 0
                }))
                first.current = false
            }
            // if(mapView.current) {
            //     mapView.current.animateToRegion({
            //         latitude: origin.latitude,
            //         longitude: origin.longitude,
            //         latitudeDelta: 0.0005,
            //         longitudeDelta: 0.00025
            //     }, 2000)
            // }
            // mapView.current.animateCamera({
            //     center: {
            //         latitude: origin.latitude,
            //         longitude: origin.longitude,
            //     },
            //     heading: origin.heading,
            //     zoom: 18
            // })

            if(Platform.OS === 'android') {
                if(marker.current) {
                    marker.current.animateMarkerToCoordinate({latitude: origin.latitude, longitude: origin.longitude}, 1)
                    Animated.timing(rotation, {
                        toValue: origin.heading,
                        useNativeDriver: true,
                        duration: 1000
                    }).start()
                }
            } else {
                if(currentCoordinate) {
                    currentCoordinate.timing({
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                        duration: 500,
                        useNativeDriver: true
                    }).start()
                }       
            }
        }
    }, [origin])

    return (
        <MapView
            provider = {PROVIDER_GOOGLE}
            style = {styles.map}
            customMapStyle = {mapStyle}
            showsUserLocation = {false}
            minZoomLevel = {8}
            maxZoomLevel = {20}
            followsUserLocation = {true}
            initialRegion = {
                origin ? {latitude: origin.latitude, longitude: origin.longitude, latitudeDelta: 0.04, longitudeDelta: 0.02} :
                {latitude: 6.9271, longitude: 79.8612, latitudeDelta: 0.04, longitudeDelta: 0.02}
            }
            ref = {mapView}
            showsCompass = {true}

            onMapReady = {() => {
                if(origin) {
                    setLoading(true)
                    const timeout1 = setTimeout(() => {
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
                    const timeout2 = setTimeout(() => {
                        setLoading(false)
                    }, 2000)
                    setTimeoutValue1(timeout1)
                    setTimeoutValue2(timeout2)
                }
            }}
        >
            {origin ?
                <AnimatedMarker
                    coordinate = {origin}
                    identifier = 'Marker1'
                    ref = {marker}
                    flat = {false}
                    anchor = {{x: 0.5, y: 0.5}}
                    tracksViewChanges = {true}
                >
                    <AnimatedImage 
                        source = {require('../../../assets/map/arrow.png')} 
                        style = {{
                            width: 25,
                            height: 25,
                            resizeMode: 'cover',
                            transform: [{
                                rotate: bearingDegree
                            }]
                        }}
                    />
                </AnimatedMarker>
            : null}
            {
                end !== null ?
                <>
                    <Marker.Animated 
                        coordinate = {end} 
                        anchor = {{x: 0.5, y: 0.5}}
                    >
                        <AnimatedImage
                            source = {require('../../../assets/garbage.png')}
                            style = {{
                                resizeMode: 'cover',
                                height: 40,
                                width: 40
                            }}
                        />
                    </Marker.Animated>
                    <MapViewDirections
                        origin = {origin}
                        destination = {end}
                        mode = 'DRIVING'
                        language = 'en'
                        strokeWidth = {5}
                        strokeColor = {colors.darkBlue}
                        apikey = {GOOGLE_MAPS_APIKEY}
                        resetOnChange = {false}
                        
                        onReady = {(result) => {
                            setDistance(result.distance)
                            if(redo === true){
                                mapView.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: SCREEN_WIDTH/7,
                                        bottom: SCREEN_HEIGHT/3,
                                        left: SCREEN_WIDTH/7,
                                        top: SCREEN_HEIGHT/7
                                    }
                                })

                                const timeout = setTimeout(() => {
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
                                setTimeoutValue3(timeout)
                            }
                        }}
                    /> 
                </>
                : null
            }
                
        </MapView>
    );
}

export default Mapcomponent

const styles = StyleSheet.create({
    
    map: {
        height:"100%",
        width:"100%",
        zIndex: -1
    },   

})
