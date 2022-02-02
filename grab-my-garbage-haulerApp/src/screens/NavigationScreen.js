import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import socketIO from 'socket.io-client'
import * as TaskManager from 'expo-task-manager'

import { colors } from '../global/styles'
import Mapcomponent from '../components/MapComponent'
import { addOrigin } from '../redux/actions/mapActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Navigationscreen = () => {
    const dispatch = useDispatch()
    const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION'

    const [online, setOnline] = useState(false)

    // const lookPickups = async() => {
    //     const socket = socketIO.connect('http://192.168.13.1:5000')

    //     socket.on('connect', () => {
    //         socket.emit('lookingPickup')
    //     })

    //     socket.on('pickRequest', response => {
    //         console.log(response)
    //     })
    // }

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
            dispatch(addOrigin(latitude, longitude))    
        } catch(err){
            console.log(err)
        }
    }

    const handleLocation = async() => {
        setOnline(!online)
        if(online === false) {
            await checkPermission()
            await getLocation()
        } 
    } 

    useEffect(async() => {
        console.log(online)
        if(online === true) {
            TaskManager.defineTask(TASK_FETCH_LOCATION, async({data: { locations }, err}) => {
                if(err) {
                    console.log(err)
                    return
                }
                const [location] = locations
                try{
                    dispatch(addOrigin(location.coords.latitude, location.coords.longitude))
                    console.log(location)
                } catch (err) {
                    console.error(err)
                }
            })

            Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 0,
                deferredUpdatesInterval: 10000,
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: 'Using your location',
                    notificationBody: 'To turn off, do this'
                }
            })
        } else if(online === false) {
            Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
                if(value) {
                    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
                }
            })
        }
    }, [online])

    return (
        <SafeAreaView>
            <View style = {styles.view1}>
                <Text style = {styles.text1}></Text>
            </View>

            {/* <Mapcomponent 
                latlng = {latlng}
            /> */}

            <Button 
                title = 'SIGN IN'
                onPress = {handleLocation}
            />
        </SafeAreaView>
    );
}

export default Navigationscreen

const styles = StyleSheet.create({

    view1:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    text1:{
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 15
    },


})
