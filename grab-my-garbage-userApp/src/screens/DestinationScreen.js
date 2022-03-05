import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Icon } from 'react-native-elements'
import * as Location from 'expo-location'

import { colors } from '../global/styles'
import { GOOGLE_MAPS_APIKEY } from '@env'

import { addDestination } from '../redux/actions/mapActions'
import { checkPermission } from '../helpers/destinationHelper'

import Mapcomponent from '../components/mapComponent'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const Destinationscreen = ({route, navigation}) => {
    const dispatch = useDispatch()
    const mapView = useRef()
    const translation = useRef(new Animated.Value(SCREEN_HEIGHT/2.2)).current

    const [latlng, setLatLng] = useState({latitude: 6.9271, longitude: 79.8612})
    const [city, setCity] = useState()
    const [latlngDelta, setLatlngDelta] = useState({latitudeDelta: 0.8, longitudeDelta: 0.7})
    const [timeout, setTimeoutValue] = useState(null)

    const currentLocation = {
        description: 'Current location',
        geometry: { location: { lat: latlng.latitude, lng: latlng.longitude } },
        formatted_address: 'Current Location',
        vicinity: city
    }

    const animation = (value, value1, delay) => {
        Animated.timing(translation, {
            toValue: value,
            useNativeDriver: true,
            duration: 500,
            delay: delay ? delay : 0
        }).start()
        setTimeout(() => {
            Animated.timing(translation, {
                toValue: value1,
                useNativeDriver: true,
                duration: 500,
                delay: delay ? delay + 500 : 0
            }).start()
        }, 1000)
    }

    const getLocation = async() => {
        try{
            const {granted} = await Location.requestForegroundPermissionsAsync()
            if(!granted) return
            const {
                coords: {latitude, longitude}
            } = await Location.getCurrentPositionAsync()
            let citycoords = await Location.reverseGeocodeAsync({latitude, longitude})
            if(citycoords[0].district === null) {
                setCity(citycoords[0].city)
            } else {
                setCity(citycoords[0].district)
            }
            setLatLng({latitude: latitude, longitude: longitude})    
        } catch(err){
            console.log(err)
        }
    }

    const timeoutValue = (value) => {
        setTimeoutValue(value)
    }

    useEffect(() => {
        checkPermission()
        getLocation()
    },[])

    useEffect(() => {
        animation(SCREEN_HEIGHT/2.2, 120)
    }, [])

    return (
        <SafeAreaView style = {{height: SCREEN_HEIGHT}}>
            <KeyboardAvoidingView behavior = 'position' keyboardVerticalOffset = {-50}>
            <View style = {{height: SCREEN_HEIGHT}}>
                <Mapcomponent 
                    latlng = {latlng}
                    mapView = {mapView}
                    latlngDelta = {latlngDelta}
                    timeoutValue = {timeoutValue}
                />

                <TouchableOpacity style = {styles.view}
                    onPress = {() => {
                        clearTimeout(timeout)
                        navigation.navigate('Home')
                    }}
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
            
            <Animated.View style = {{...styles.container3, transform: [{translateY: translation}]}}>
                <Text style = {styles.Text1}>Pick Up Location</Text>
                <GooglePlacesAutocomplete
                    nearbyPlacesAPI = 'GoogleReverseGeocoding'
                    placeholder = 'Please enter your location'
                    textInputProps = {{
                        onChangeText: (text) => {
                            if(!text)
                                animation(0, 120)
                            else
                                animation(0, 0)
                        },
                    }}
                    listViewDisplayed = 'auto'
                    keyboardShouldPersistTaps = 'handled'
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
                    predefinedPlaces = {[currentLocation]}
                    renderLeftButton = {() =>
                        <View style = {{position: 'absolute', zIndex: 1}}>
                            <Icon 
                                type = 'material'
                                name = 'search'
                                color = {colors.blue2}
                                style = {{
                                    marginTop: 12,
                                    marginLeft: 10
                                }}
                            />
                        </View>
                    }

                    onPress = {(data, details = null) => {
                        dispatch(addDestination(
                                details.geometry.location.lat, 
                                details.geometry.location.lng, 
                                details.name, 
                                details.formatted_address,
                                details.vicinity
                            ))
                        setLatLng({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
                        if(details.formatted_address !== 'Current Location') {
                            setTimeout(() => {
                                mapView.current.fitToSuppliedMarkers(['mk1'], {
                                    animated: true,
                                    edgePadding: {
                                        top: SCREEN_WIDTH/20,
                                        bottom: SCREEN_WIDTH/3,
                                        left: SCREEN_WIDTH/20,
                                        right: SCREEN_WIDTH/20,
                                    }
                                })
                            }, 800)
                        } else if(details.formatted_address === 'Current Location') {
                            setLatlngDelta({latitudeDelta: 0.00025, longitudeDelta: 0.000125})
                        }
                        setTimeout(() => {
                            if(route.params.destination === 'Special Pickup')
                                navigation.navigate('SpecialPickup')
                            if(route.params.destination === 'Schedule Pickup')
                                navigation.navigate('Schedule')
                        }, 4500)                       
                    }}
                />
            </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Destinationscreen

const styles = StyleSheet.create({

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
        position: 'absolute',
        height: SCREEN_HEIGHT/2.2,
        width: SCREEN_WIDTH,
        marginTop: SCREEN_HEIGHT - SCREEN_HEIGHT/2.2,
        backgroundColor: colors.white,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        padding: 25,
        paddingBottom: 5
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
        paddingLeft: 40
    },
    container: {
        paddingTop: 15,
        flex: 1,
        backgroundColor: colors.white
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