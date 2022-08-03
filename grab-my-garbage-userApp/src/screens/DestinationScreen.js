import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Icon, Button } from 'react-native-elements'
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

    const [latlng, setLatLng] = useState({latitude: 6.9271, longitude: 79.8612})
    const [city, setCity] = useState()
    const [latlngDelta, setLatlngDelta] = useState({latitudeDelta: 0.8, longitudeDelta: 0.7})
    const [timeout, setTimeoutValue] = useState(null)

    const map = useSelector((state) => state.map)
    const { latitude, longitude } = map

    const currentLocation = {
        description: 'Current location',
        geometry: { location: { lat: latlng.latitude, lng: latlng.longitude } },
        formatted_address: 'Current Location',
        vicinity: city
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

    return (
        <SafeAreaView>
            <View style = {{height: SCREEN_HEIGHT}}>
                <Mapcomponent 
                    latlng = {latlng}
                    mapView = {mapView}
                    latlngDelta = {latlngDelta}
                    timeoutValue = {timeoutValue}
                />

                <View style = {styles.view}>
                    <TouchableOpacity style = {{flexDirection: 'row', paddingLeft: 15}}
                        onPress = {() => {
                            clearTimeout(timeout)
                            navigation.navigate('Home')
                        }}
                    >
                        <Icon
                            type = 'material'
                            name = 'arrow-back'
                            color = {colors.grey1}
                            size = {25}
                            style = {{
                                alignSelf: 'flex-start',
                                marginTop: 25,
                                display: 'flex'
                            }}
                        />
                        <Text style = {styles.Text1}>Pick Up Location</Text>
                    </TouchableOpacity>

                    <View style = {{paddingHorizontal: 20}}>
                        <GooglePlacesAutocomplete
                            nearbyPlacesAPI = 'GoogleReverseGeocoding'
                            placeholder = 'Please enter your location'
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
                                        color = {colors.grey}
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
                            }}
                        />
                    </View>
                </View>
                
                
                <View style = {{position: 'absolute', marginTop: SCREEN_HEIGHT/1.15, zIndex: 10, alignSelf: 'center'}}>
                    <Button
                        title = 'Continue'
                        buttonStyle = {styles.button}
                        onPress = {() => {
                            if(latitude && longitude) {
                                if(route.params.destination === 'Special')
                                    navigation.navigate('SpecialPickup')
                                if(route.params.destination === 'Schedule')
                                    navigation.navigate('Schedule')
                            }
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Destinationscreen

const styles = StyleSheet.create({

    view: {
        position: 'absolute', 
        zIndex: 4,
        width: SCREEN_WIDTH,
        backgroundColor: colors.white
    },
    Text1: {
        color: colors.grey1,
        fontWeight: 'bold',
        marginTop: 25,
        marginLeft: 15
    },
    button:{
        backgroundColor: colors.darkBlue,
        borderRadius: 10,
        height: 50,
        width: 150,
        zIndex: 10
    },

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