import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Image, Animated, Pressable, ScrollView, StatusBar } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { mapStyle } from '../../global/mapStyles'
import { dayConverter } from '../../helpers/schedulePickuphelper'

import { getAllScheduledPickup } from '../../redux/actions/scheduleRequestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const AnimatedImage = Animated.createAnimatedComponent(Image)
const AnimatedMarker = Animated.createAnimatedComponent(Marker)

const Height = StatusBar.currentHeight

const Allscheduledetailscreen = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState()

    const allSchedulePickup = useSelector((state) => state.allSchedulePickup)
    const { loading, allSchedule } = allSchedulePickup

    const map = useSelector((state) => state.map)
    const { origin } = map

    const rotation = useRef(new Animated.Value(0)).current
    const translation = useRef(new Animated.Value(SCREEN_HEIGHT/2)).current

    const bearingDegree = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    })

    const infoFind = async(id) => {
        const markerData = await allSchedule.find(schedule => schedule._id === id)
        setData(markerData)
        return true
    }

    const animation = () => {
        Animated.timing(translation, {
            toValue: 0,
            useNativeDriver: true,
            duration: 500,
            delay: 0
        }).start()
    }

    const animationClose = () => {
        Animated.timing(translation, {
            toValue: SCREEN_HEIGHT/2,
            useNativeDriver: true,
            duration: 500,
            delay: 0
        }).start()
    }

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getAllScheduledPickup())
        }
    }, [])

    useEffect(() => {
        if(origin) {
            Animated.timing(rotation, {
                toValue: origin.heading,
                useNativeDriver: true,
                duration: 1000
            }).start()
        }
    }, [origin])

    return (
        <View style  = {styles.container}>
            <MapView
                provider = {PROVIDER_GOOGLE}
                style = {styles.map}
                customMapStyle = {mapStyle}
                showsUserLocation = {false}
                followsUserLocation = {false}
                initialRegion = {
                    origin ? {latitude: origin.latitude, longitude: origin.longitude, latitudeDelta: 0.04, longitudeDelta: 0.02} :
                    {latitude: 6.9271, longitude: 79.8612, latitudeDelta: 0.04, longitudeDelta: 0.02}
                }
            >
                {
                    origin && 
                    <AnimatedMarker 
                        coordinate = {origin} 
                        flat = {false}
                        anchor = {{x: 0.5, y: 0.5}}
                        tracksViewChanges = {true}
                    >
                        <AnimatedImage
                            source = {require('../../../assets/map/arrow.png')}
                            style = {{
                                width: 25,
                                height: 25,
                                resizeMode: 'cover',
                                transform: [{
                                    rotate: bearingDegree
                                }]
                            }}
                        />
                    </AnimatedMarker>
                }
                {
                    allSchedule && allSchedule.length > 0 && allSchedule.map(marker => 
                        <Marker 
                            coordinate = {marker.location[0]} 
                            flat = {false}
                            anchor = {{x: 0.5, y: 0.5}}
                            tracksViewChanges = {true}
                            key = {marker._id}
                            onPress = {async() => {
                                await infoFind(marker._id)
                                animation()
                            }}
                        >
                            <Image
                                source = {require('../../../assets/garbage.png')}
                                style = {{
                                    width: 25,
                                    height: 25,
                                    resizeMode: 'cover',
                                }}
                            />
                        </Marker>
                    )
                }   
            </MapView>

            <Animated.View style = {{...styles.view1, transform: [{translateY: translation}]}}>
                <Pressable onPress = {animationClose}>
                    <Icon
                        type = 'material'
                        name = 'minimize'
                        color = {colors.grey2}
                        size = {30}
                    />
                </Pressable>

                <ScrollView 
                    showsVerticalScrollIndicator = {false}
                    style = {styles.view2}
                >
                    {
                        data &&
                        <>
                            <View style = {styles.container1}>
                                <View style = {{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
                                    <Icon
                                        type = 'material'
                                        name = 'schedule'
                                        size = {18}
                                        color = {colors.blue5}
                                        style = {{
                                            marginTop: 2,
                                            marginRight: 5,
                                            marginLeft: 3
                                        }}
                                    />
                                    <Text style = {styles.title}>Schedule</Text>
                                </View>

                                <View style = {styles.container3}>
                                    <View style = {{flexDirection: 'row', marginTop: 10}}>
                                        <Text style = {styles.text1}>Duration:</Text>
                                        <Text style = {styles.text2}>{data.from + ' - ' + data.to}</Text>
                                    </View>

                                    <View style = {{flexDirection: 'row', marginTop: 5}}>
                                        <Text style = {styles.text1}>Collection Days:</Text>
                                        <Text style = {styles.text2}>
                                            {
                                                data.days.map((day) => {
                                                    return(
                                                        dayConverter(day) + '   '
                                                    )
                                                })
                                            }
                                        </Text>
                                    </View>
                                    
                                    <View style = {{flexDirection: 'row', marginTop: 5}}>
                                        <Text style = {styles.text1}>Time Slot:</Text>
                                        <Text style = {styles.text2}>{data.timeslot}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style = {{...styles.container1, marginTop: 0, backgroundColor: colors.green2}}>
                                <View style = {{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
                                    <Icon
                                        type = 'material'
                                        name = 'attach-money'
                                        size = {18}
                                        color = {colors.blue5}
                                        style = {{
                                            marginTop: 2,
                                            marginRight: 5,
                                            marginLeft: 3
                                        }}
                                    />
                                    <Text style = {styles.title}>Payment Information</Text>
                                </View>

                                <View style = {styles.container3}>
                                    <View style = {{flexDirection: 'row', marginTop: 10}}>
                                        <Text style = {styles.text1}>Payment:</Text>
                                        <Text style = {styles.text2}>Rs. {data.payment}</Text>
                                    </View>

                                    <View style = {{flexDirection: 'row', marginTop: 5}}>
                                        <Text style = {styles.text1}>Payment Method:</Text>
                                        <Text style = {styles.text2}>{data.paymentMethod}</Text>
                                    </View>
                                </View>
                            </View>

                                {/* <View style = {{flexDirection: 'row'}}>
                                    <Text style = {styles.text1}>Customer Name:</Text>
                                    <Text style = {styles.text2}>{data.customerId.name}</Text>
                                </View> */}
                        </>
                    }
                </ScrollView>
            </Animated.View>
        </View>
    );
}

export default Allscheduledetailscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: SCREEN_HEIGHT - (95 + Height),
        overflow: 'hidden'
    },
    map:{
        height: '100%',
        width: '100%',
        zIndex: -1,
    },  
    view1:{
        position: 'absolute',
        height: SCREEN_HEIGHT/2,
        width: SCREEN_WIDTH/1.05,
        marginTop: (SCREEN_HEIGHT - 110) - SCREEN_HEIGHT/2,
        backgroundColor: colors.white,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        padding: 25,
        paddingTop: 0,
        paddingBottom: 5,
        marginHorizontal: 10
    }, 
    view2:{
        marginTop: 10,
        flexWrap: 'wrap',
    },
    text1:{
        fontSize: 16,
        color: colors.blue2,
        marginBottom: 15,
        fontWeight: 'bold'
    },
    text2:{
        marginLeft: 10,
        color: colors.grey1,
        fontSize: 15
    },
    container1:{
        backgroundColor: colors.grey9,
        elevation: 5,
        margin: 15,
        marginBottom: 20,
        borderRadius: 15
    }, 
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.blue5
    },
    container3:{
        margin: 15,
        padding: 10,
        paddingTop: 0,
        marginTop: 5,
        paddingBottom: 0,
        marginBottom: 5
    },

})
