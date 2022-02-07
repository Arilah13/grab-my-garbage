import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { mapStyle } from '../global/mapStyles'

const Mapcomponent = ({latlng}) => {  

    return (
        <View>
            <MapView
                provider = {PROVIDER_GOOGLE}
                style = {styles.map}
                customMapStyle = {mapStyle}
                showsUserLocation = {false}
                followsUserLocation = {false}
                region = {{ latitude: latlng.latitude, longitude: latlng.longitude, latitudeDelta: 0.004, longitudeDelta: 0.003 }}
            >
                <Marker coordinate = {latlng} >
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
        height:"100%",
        width:"100%",
        zIndex: -1
    },    
    marker: {
        width: 28,
        height: 29,
    }

})