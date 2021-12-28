import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import * as Location from 'expo-location'

import { colors } from '../global/styles'
import { mapStyle } from '../global/mapStyle'

const Mapcomponent = ({latitude, longitude}) => {

    const [latlng, setLatLng] = useState({latitude: latitude, longitude: longitude})

    const checkPermission = async() => {
        const hasPermission = await Location.requestForegroundPermissionsAsync()
        if(hasPermission.status === 'granted') {
            const permission = await askPermission()
            return permission
        }
        return true
    };

    const askPermission = async() => {
        const permission = await Location.requestForegroundPermissionsAsync()
        return permission.status === 'granted'
    }

    const getLocation = async() => {
        try{
            const {granted} = await Location.requestForegroundPermissionsAsync()
            if(!granted) return
            const {
                coords: {latitude, longitude}
            } = await Location.getCurrentPositionAsync()
            setLatLng({latitude: latitude, longitude: longitude})
        } catch(err){

        }
    }

    useEffect(()=>{
        checkPermission()
        getLocation()
        //console.log(latlng)
    },[])

    return (
        <View>
            <MapView
                provider = {PROVIDER_GOOGLE}
                style = {styles.map}
                customMapStyle = {mapStyle}
                showsUserLocation = {true}
                followsUserLocation = {true}
                region={{ latitude: latlng.latitude, longitude: latlng.longitude, latitudeDelta: 0.02, longitudeDelta: 0.01 }}
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
        height:"107%",
        width:"100%",
        zIndex: -1
    },    
    marker: {
        width: 28,
        height: 29,
    }

})