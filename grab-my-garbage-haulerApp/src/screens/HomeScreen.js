import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Button, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import socketIO from 'socket.io-client'
import * as TaskManager from 'expo-task-manager'
import ToggleButton from 'react-native-toggle-element'

import { colors } from '../global/styles'
import Mapcomponent from '../components/MapComponent'
import { addLocation, addOrigin } from '../redux/actions/mapActions'
import { getPendingPickups } from '../redux/actions/requestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = () => {
    const dispatch = useDispatch()
    const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION'
    let latitude
    let longitude

    const [online, setOnline] = useState(false)

    const socket = socketIO.connect('http://192.168.13.1:5000')

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
    const userid = userInfo._id

    const checkPermission = async() => {
        const hasPermission = await Location.requestForegroundPermissionsAsync()
        const hasBackgroundPermission = await Location.requestBackgroundPermissionsAsync()
        if(hasPermission.status !== 'granted') {
            const permission = await askPermission()
            
            return permission
        }
        if(hasBackgroundPermission !== 'granted') {
            const permission = await askBackgroundPermission()

            return permission
        }
        return true
    };

    const askPermission = async() => {
        const permission = await Location.requestForegroundPermissionsAsync()
        return permission.status === 'granted'
    }

    const askBackgroundPermission = async() => {
        const permission = await Location.requestBackgroundPermissionsAsync()
        return permission.status === 'granted'
    }

    const getLocation = async() => {
        try{
            const {granted} = await Location.requestForegroundPermissionsAsync()
            if(!granted) return
            const {coords} = await Location.getCurrentPositionAsync()
            latitude = coords.latitude
            longitude = coords.longitude
        } catch(err){
            console.log(err)
        }
    }

    useEffect(async() => {
        if(online === true) {
            checkPermission()
            TaskManager.defineTask(TASK_FETCH_LOCATION, async({data: { locations }, err}) => {
                if(err) {
                    console.log(err)
                    return
                }
                const [location] = locations
                try{
                    latitude = location.coords.latitude
                    longitude = location.coords.longitude
                    socket.emit('online', {haulerid: userid, latitude, longitude})
                } catch (err) {
                    console.error(err)
                }
            })

            Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 1,
                deferredUpdatesInterval: 10000,
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: 'Using your location',
                    notificationBody: 'As long as you are online, location will be used',
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

    const handleOnline = () => {
        if(online === false) {
            setOnline(true)
        } else {
            setOnline(false)
            socket.emit('haulerDisconnect')
            dispatch(addLocation({latitude, longitude}))
        }
    }
 
    useEffect(async() => {
        if(online === true) {
            await getLocation()
            socket.emit('online', {haulerid: userid, latitude, longitude})
            
            socket.on('newOrder', () => {
                dispatch(getPendingPickups(latitude, longitude))
            })

            // setTimeout(() => {
                
            // }, [1000])
        }
    }, [online])

    return (
        <SafeAreaView>
            <View style = {styles.view1}>
                <View style = {{flexDirection: 'row'}}>
                    <ToggleButton
                        value = {online}
                        onPress = {handleOnline}
                        leftComponent = {
                        <Text style = {{color: colors.white, fontWeight: 'bold', marginLeft: 8}}>
                            {online === true ? 'Online' : ''}
                        </Text>                          
                        }
                        rightComponent = {
                            <Text style = {{color: colors.blue2, fontWeight: 'bold', marginRight: 7}}>
                                {online === false ? 'Offline' : ''}
                            </Text>
                        }
                        thumbActiveComponent = {
                            <Icon
                                type = 'font-awesome'
                                name = 'truck'
                                color = {colors.darkBlue}
                                style = {{
                                    margin: 6
                                }}
                            />
                        }
                        thumbInActiveComponent = {
                            <Icon
                                type = 'font-awesome'
                                name = 'truck'
                                color = {colors.darkBlue}
                                style = {{
                                    margin: 6
                                }}
                            />
                        }
                        trackBar = {{
                            activeBackgroundColor: colors.darkBlue,
                            inActiveBackgroundColor: colors.white,
                            borderActiveColor: colors.darkBlue,
                            borderInActiveColor: colors.white,
                            borderWidth: 5,
                            width: 140,
                        }}
                        thumbStyle = { online === true ? {
                            backgroundColor: colors.white
                        } : {
                            backgroundColor: colors.grey10,
                        }}
                        thumbButton = {{
                            height: 50,
                            width: 60
                        }}
                    />
                </View>
                <View style = {{flexDirection: 'row'}}>
                    <Text style = {styles.text2}>{userInfo.name}</Text>
                    <Image
                        source = {userInfo.image ? {uri: userInfo.image} : require('../../assets/user.png')}
                        resizeMode = 'contain'
                        style = {styles.image1}
                    />
                </View>
            </View>

            {/* <Mapcomponent 
                latlng = {latlng}
            /> */}


        </SafeAreaView>
    );
}

export default Homescreen

const styles = StyleSheet.create({

    view1:{
        backgroundColor: colors.blue1,
        //paddingLeft: 25, 
        marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    text1:{
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 15
    },
    text2:{
        marginTop: SCREEN_HEIGHT/25,
        marginRight: 2,
        color: colors.blue2,
        fontSize: 15,
        fontWeight: 'bold'
    },
    image1:{
        height: 40,
        width: 60,
        marginTop: SCREEN_HEIGHT/35,
        marginRight: SCREEN_WIDTH/20,
        borderRadius: 500,
    },

})
