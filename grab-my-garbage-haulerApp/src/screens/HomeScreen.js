import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image, Alert, FlatList, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import socketIO from 'socket.io-client'
import * as TaskManager from 'expo-task-manager'
import ToggleButton from 'react-native-toggle-element'

import { colors } from '../global/styles'
import { addLocation, addOrigin } from '../redux/actions/mapActions'
import { TASK_FETCH_LOCATION } from '../redux/constants/mapConstants'
import { getPendingPickups, getUpcomingPickups } from '../redux/actions/requestActions'
import { getLocation } from '../helpers/homehelper'
import { menuData } from '../global/data'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = ({navigation}) => {
    
    const dispatch = useDispatch()

    let latitude = null
    let longitude = null

    const [online, setOnline] = useState(false)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const socket = socketIO.connect('http://192.168.13.1:5000')

    const userid = userInfo._id

    const handleOnline = () => {
        if(online === false) {
            setOnline(true)
            TaskManager.defineTask(TASK_FETCH_LOCATION, async({data: { locations }, err}) => {
                if(err) {
                    console.log(err)
                    return
                }
                const [location] = locations
                try{
                    latitude = location.coords.latitude
                    longitude = location.coords.longitude
                    dispatch(addOrigin(latitude, longitude))
                    socket.emit('online', {haulerid: userid, latitude, longitude})
                } catch (err) {
                    console.error(err)
                }
            })

            Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 10,
                deferredUpdatesInterval: 1,
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: 'Using your location',
                    notificationBody: 'As long as you are online, location will be used',
                }
            })
        } else {
            setOnline(false)
            socket.emit('haulerDisconnect')
            dispatch(addLocation({latitude, longitude}))
            Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
                if(value) {
                    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
                }
            })
        }
    }

    const handleNavigation = async(item) => {
        if(item.destination === 'Pickup' && online === false) {
            Alert.alert('Have to be online', 'Currently offline need to be online',
                [
                    {
                        text: 'Ok',
                    }
                ],
                {
                    cancelable: true
                }
            )
        } else if(item.destination === 'Pickup' && online === true) {
            navigation.navigate(item.destination, {destination: item.name, socket: socket, haulerid: userid})
        } else {
            navigation.navigate(item.destination, {destination: item.name})
        }
    }
 
    useEffect(async() => {
        if(online === true) {
            const latlng = await getLocation()
            dispatch(addLocation({latitude: latlng.latitude, longitude: latlng.longitude}))
            latitude = latlng.latitude
            longitude = latlng.longitude
            dispatch(addOrigin(latlng.latitude, latlng.longitude))
            socket.emit('online', {haulerid: userid, latitude, longitude})
            
            socket.on('newOrder', () => {
                dispatch(getPendingPickups(latitude, longitude))
            })
            dispatch(getUpcomingPickups())
            // setTimeout(() => {
                
            // }, [1000])
        }
    }, [online])

    return (
        <SafeAreaView style = {{backgroundColor: colors.grey8}}>
            <View style = {styles.container1}>
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
            </View>
            <View style = {styles.container2}>
                    <View style = {styles.view1}>
                        <Text style = {styles.text2}>Hi {userInfo.name}</Text>
                        <Text style = {styles.text3}>Have you taken out the trash today?</Text>
                        <Image
                            source = {userInfo.image ? {uri: userInfo.image} : require('../../assets/user.png')}
                            style = {styles.image1}
                        />
                    </View>

                <View style = {styles.container3}>
                    <View style = {styles.container4}>

                    </View>

                    <View style = {{justifyContent: 'center', marginTop: '5%', flexDirection: 'column'}}>
                        <FlatList
                            numColumns = {2}
                            showsHorizontalScrollIndicator = {false}
                            data = {menuData}
                            keyExtractor = {(item) => item.id}
                            renderItem = {({item}) => (
                                <TouchableOpacity style = {styles.card}
                                    onPress = {() => handleNavigation(item)}
                                >
                                    <View style = {styles.view2}>
                                        <Image style = {styles.image2} source = {item.image}/>     
                                        <Text style = {styles.title}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View> 
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Homescreen

const styles = StyleSheet.create({

    container1:{
        backgroundColor: colors.grey8,
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
    container2:{
        backgroundColor: colors.blue1,
        height: (9*SCREEN_HEIGHT/10) - 60,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    view1:{
        display: 'flex',
        //borderTopLeftRadius: 25,
        //borderTopRightRadius: 25,
        paddingLeft: 25, 
        height: SCREEN_HEIGHT/5,
        //flex: 1,
        //justifyContent: 'space-around',
    },
    text2:{
        color: colors.blue2,
        fontSize: 21,
        //paddingBottom:5,
        paddingTop: 55,
        fontWeight: 'bold'
    },
    text3:{
        color: colors.blue2,
        fontSize: 14
    },
    image1:{
        height: 70,
        width: 70,
        left: "75%",
        bottom: 65,
        borderRadius: 50,
    },
    container3:{
        backgroundColor: colors.white,
        borderRadius: 30,
        height: "75%",
        padding: 15
    },
    container4:{
        backgroundColor: colors.blue2,
        height: SCREEN_HEIGHT/6.5,
        padding: 10,
        borderRadius: 25,
    },
    card:{
        margin: SCREEN_WIDTH/22,
        marginTop: 0,
        flex: 1,
        paddingLeft: 2,
        marginLeft: 8,
        marginRight: 8,
    },
    view2:{
        paddingBottom: 10,
        paddingTop: 25,
        borderRadius: 15,
        backgroundColor: colors.blue1,
        alignItems: 'center',
    },
    image2:{
        height: 60,
        width: 60,
        alignItems: 'center'
    },
    title:{
        color: colors.blue2,
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center'
    }

})
