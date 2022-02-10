import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import { colors } from '../../global/styles'
import { mapStyle } from '../../global/mapStyle'
import { GOOGLE_MAPS_APIKEY } from '@env'
import Headercomponent from '../../components/PickupHeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Locationscreen = ({route}) => {

    const mapView = useRef()

    const { location, item } = route.params

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const ongoingPickupLocation = useSelector((state) => state.ongoingPickupLocation)
    const { ongoingPickups } = ongoingPickupLocation

    const [redo, setRedo] = useState(false)
    const [pickup, setPickup] = useState(null)

    useEffect(() => {
        if(ongoingPickups !== undefined && ongoingPickups.length > 0) {
            const ongoingPickup =  ongoingPickups.find((ongoingPickup) => ongoingPickup.pickupid === item._id)
            if(ongoingPickup) {
                setPickup(ongoingPickup)
            }
        }
    }, [ongoingPickups]) 

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style  = {styles.container}>
                <Headercomponent name = 'Pickup Detail' />

                <MapView
                    provider = {PROVIDER_GOOGLE}
                    style = {styles.map}
                    customMapStyle = {mapStyle}
                    showsUserLocation = {false}
                    followsUserLocation = {false}
                    region={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.01 }}
                    ref = {mapView}
                >
                    <Marker coordinate = {{latitude: location.latitude, longitude: location.longitude}} >
                        <Image
                            source = {require('../../../assets/marker.png')}
                            style = {styles.marker}
                        />
                    </Marker>
                    {
                        pickup !== null ? 
                        <>
                            <Marker coordinate = {{latitude: pickup.latitude, longitude: pickup.longitude}}>
                                <Image
                                    source = {require('../../../assets/garbage_truck.png')}
                                    style = {styles.marker2}
                                />
                            </Marker>
                            <MapViewDirections
                                origin = {{latitude: pickup.latitude, longitude: pickup.longitude}}
                                destination = {{latitude: location.latitude, longitude: location.longitude}}
                                mode = 'DRIVING'
                                language = 'en'
                                strokeWidth = {3}
                                strokeColor = {colors.blue2}
                                apikey = {GOOGLE_MAPS_APIKEY}
                                resetOnChange = {true}
                                timePrecision = 'now'
                                
                                onReady = {(result) => {
                                    mapView.current.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: SCREEN_WIDTH/20,
                                            bottom: SCREEN_HEIGHT/3,
                                            left: SCREEN_WIDTH/20,
                                            top: SCREEN_HEIGHT/20
                                        }
                                    })
                                }}
                            />
                        </>
                        : null
                    }

                </MapView>
            </View>
        </SafeAreaView>
    );
}

export default Locationscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        //paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        //paddingTop: 10,
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
    }

})
