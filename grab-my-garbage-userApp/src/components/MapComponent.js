import React, { useEffect } from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { mapStyle } from '../global/mapStyle'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const Mapcomponent = ({latlng, mapView, latlngDelta, timeoutValue}) => {  
    return (
        <View>
            <MapView
                provider = {PROVIDER_GOOGLE}
                style = {styles.map}
                customMapStyle = {mapStyle}
                showsUserLocation = {true}
                followsUserLocation = {true}
                region = {{latitude: latlng.latitude, longitude: latlng.longitude, latitudeDelta: latlngDelta.latitudeDelta, longitudeDelta: latlngDelta.longitudeDelta}}
                ref = {mapView}
                onMapReady = {() => {
                    const timeout = setTimeout(() => {
                                mapView.current.fitToSuppliedMarkers(['mk1'], {
                                    animated: true,
                                    edgePadding: {
                                        top: SCREEN_WIDTH/20,
                                        bottom: SCREEN_WIDTH/20,
                                        left: SCREEN_WIDTH/20,
                                        right: SCREEN_WIDTH/20,
                                    }
                                })
                            }, 1000)
                    timeoutValue(timeout)
                }}
            >
                <Marker 
                    coordinate = {latlng} 
                    identifier = {'mk1'}
                >
                    <Image
                        source = {require('../../assets/marker.png')}
                        style = {styles.marker}
                    />
                </Marker>
            </MapView>
        </View>
    );
}

export default Mapcomponent

const styles = StyleSheet.create({

    map: {
        height: "107%",
        width: "100%",
        zIndex: -1
    },    
    marker: {
        width: 28,
        height: 29,
    }

})