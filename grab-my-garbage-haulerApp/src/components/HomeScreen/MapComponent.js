import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, Dimensions, Platform, Animated, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import { mapStyle } from '../../global/mapStyles'
import { GOOGLE_MAPS_APIKEY } from '@env'
import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Mapcomponent = ({end, redo, setLoading}) => {
    const map = useSelector((state) => state.map)
    const { origin } = map

    const mapView = useRef()
    const marker = useRef()
    const rotation = useRef(new Animated.Value(0)).current

    const [coordinate, setCoordinate] = useState(
        new AnimatedRegion({
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.00025 
        })
    )
    
    const bearingDegree = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    })

    const markerID = ['Marker1']

    useEffect(() => {
        if(origin !== undefined) {      
            if(mapView.current) {
                mapView.current.animateToRegion({
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.0005,
                    longitudeDelta: 0.00025
                }, 2000)
            }

            if(Platform.OS === 'android') {
                if(marker.current) {
                    marker.current.animateMarkerToCoordinate({latitude: origin.latitude, longitude: origin.longitude}, 2000)
                    Animated.timing(rotation, {
                        toValue: origin.heading,
                        useNativeDriver: true,
                        duration: 1000
                    }).start()
                }
            }
        }
    }, [origin])

    return (
        <MapView.Animated
            provider = {PROVIDER_GOOGLE}
            style = {styles.map}
            customMapStyle = {mapStyle}
            showsUserLocation = {false}
            minZoomLevel = {8}
            maxZoomLevel = {20}
            showsMyLocationButton = {true}
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
                }
            }}
        >
            {origin &&
                <Marker.Animated
                    coordinate = {coordinate}
                    identifier = 'Marker1'
                    ref = {marker}
                    anchor = {{x: 0.5, y: 0.5}}
                >
                    <Animated.Image
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
                </Marker.Animated>
            }
            {
                end !== null &&
                <>
                    <Marker 
                        coordinate = {end} 
                        anchor = {{x: 0.5, y: 0.5}}
                    >
                        <Image
                            source = {require('../../../assets/garbage.png')}
                            style = {{
                                resizeMode: 'cover',
                                height: 40,
                                width: 40
                            }}
                        />
                    </Marker>

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
                            if(redo === true){
                                mapView.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: SCREEN_WIDTH/7,
                                        bottom: SCREEN_HEIGHT/3,
                                        left: SCREEN_WIDTH/7,
                                        top: SCREEN_HEIGHT/7
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
            }
                
        </MapView.Animated>
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
