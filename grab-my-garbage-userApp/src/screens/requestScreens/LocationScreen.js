import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { colors } from '../../global/styles'
import { mapStyle } from '../../global/mapStyle'
import Headercomponent from '../../components/PickupHeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Locationscreen = ({route}) => {

    const { location } = route.params

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const [truck, setTruck] = useState(null) 

    socket.on('userPickup', async({pickup, hauler}) => {
        console.log(pickup)
        console.log(hauler)
        setTruck({latitude: hauler.latitude, longitude: hauler.longitude})
    })

    useEffect(() => {
        //console.log(location)
    }, []) 

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
                >
                    <Marker coordinate = {{latitude: location.latitude, longitude: location.longitude}} >
                        <Image
                            source = {require('../../../assets/marker.png')}
                            style = {styles.marker}
                        />
                    </Marker>
                    {
                        truck !== null ? 
                        <Marker coordinate = {truck}>
                            <Image
                                source = {require('../../../assets/garbage_truck.png')}
                                style = {styles.marker2}
                            />
                        </Marker> : null
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
