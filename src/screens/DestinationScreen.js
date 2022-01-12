import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Icon } from 'react-native-elements'
import * as Location from 'expo-location'

import Mapcomponent from '../components/MapComponent'
import { addDestination } from '../redux/actions/mapActions'
import { colors } from '../global/styles'
import { GOOGLE_MAPS_APIKEY } from '@env'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const Destinationscreen = ({route, navigation}) => {
    const dispatch = useDispatch()

    const [latlng, setLatLng] = useState({latitude: 6.9271, longitude: 79.8612})

    const homePlace = {
        description: 'Home',
        geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
    }
    const currentLocation = {
        description: 'Current location',
        geometry: { location: { lat: latlng.latitude, lng: latlng.longitude } },
        formatted_address: 'Current Location'
    }

    const checkPermission = async() => {
        const hasPermission = await Location.requestForegroundPermissionsAsync()
        if(hasPermission.status !== 'granted') {
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
    },[])
    
    const Destination = ({latitude, longitude, address, name}) => {
        dispatch(addDestination(latitude, longitude, name, address))
    }

    return (
        <SafeAreaView style = {styles.container}>
            <KeyboardAvoidingView behavior = 'position' keyboardVerticalOffset = {-100}>
            <View style = {styles.container2}>
                <Mapcomponent 
                    latlng = {latlng}
                />

                <TouchableOpacity style = {styles.view}
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
            </View>
            <View style = {styles.container3}>
                <Text style = {styles.Text1}>Pick Up Location</Text>
                <GooglePlacesAutocomplete
                    nearbyPlacesAPI = 'GoogleReverseGeocoding'
                    placeholder = 'Please enter your location'
                    listViewDisplayed = 'auto'
                    debounce = {400}
                    currentLocation = {false}
                    minLength = {2}
                    enablePoweredByContainer = {false}
                    fetchDetails = {true}
                    autoFocus = {true}
                    styles = {autoComplete}
                    query = {{
                        key: GOOGLE_MAPS_APIKEY,
                        language: 'en',
                        components: 'country:lk'
                    }}
                    predefinedPlaces = {[currentLocation, homePlace]}

                    onPress = {(data, details = null) => {
                        Destination({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            address: details.formatted_address,
                            name: details.name
                        })

                        setLatLng({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
                        setTimeout(() => {
                            if(route.params.destination === 'Special Pickup')
                                navigation.navigate('SpecialPickup')
                            if(route.params.destination === 'Schedule Pickup')
                                navigation.navigate('Schedule')
                        }, 2000)                       
                    }}
                />
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Destinationscreen

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    container2: {
        maxHeight: SCREEN_HEIGHT/1.7,
        //borderBottomEndRadius: -5,
        zIndex: -1
    },
    view: {
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
    container3: {
        minHeight: SCREEN_HEIGHT/2.2,
        backgroundColor: colors.white,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        padding: 25,
        //bottom: 31,
    },
    Text1: {
        color: colors.blue3,
        fontWeight: 'bold'
    }

})

const autoComplete = {
    
    textInput:{
        backgroundColor: colors.grey9,
        height: 50,
        borderRadius: 10,
        fontSize: 15,
        borderWidth: 1,
        borderColor: colors.grey,
    },
    container: {
        paddingTop:15,
        flex: 1,
        backgroundColor:colors.white,
    },
    separator: {
        height: 0
    },
    description: {
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 15,
    }
}