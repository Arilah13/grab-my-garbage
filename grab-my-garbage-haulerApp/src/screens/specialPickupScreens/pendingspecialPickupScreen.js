import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, RefreshControl, StatusBar, ActivityIndicator } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'
import Swipeout from 'react-native-swipeout'
import axios from 'axios'

import { colors } from '../../global/styles'
import { date2Helper, date1Helper, timeHelper, dateHelper } from '../../helpers/specialPickuphelper'

import { getPendingPickupsOffline, getUpcomingPickups } from '../../redux/actions/specialRequestActions'
import { PENDING_PICKUP_RETRIEVE_SUCCESS, UPCOMING_PICKUP_RETRIEVE_SUCCESS } from '../../redux/constants/specialRequestConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Height = StatusBar.currentHeight

const PendingPickupscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [loadingId, setLoadingId] = useState([])
    const [rowIndex, setRowIndex] = useState()

    const pendingPickups = useSelector((state) => state.pendingPickups)
    const { loading, pickupInfo } = pendingPickups

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { pickupInfo: upcoming } = upcomingPickups

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const checkLoading = (id) => {
        const load = loadingId.find(load => load === id)
        if(load) {
            return true
        } else {
            return false
        }
    }

    const handleAccept = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/acceptPickup/${id}`, {haulerId: userInfo._id}, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    const handleDecline = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/declinePickup/${id}`, {id: userInfo._id}, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    const onRefresh = useCallback(() => {
        dispatch(getPendingPickupsOffline())
        dispatch(getUpcomingPickups())
    }, [])

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getPendingPickupsOffline())
        }
    }, [])

    return (
        <View style = {styles.container}>
            {loading === true &&
                <LottieView 
                    source = {require('../../../assets/animation/truck_loader.json')}
                    style = {{
                        width: 300,
                        height: 400,
                    }}
                    loop = {true}
                    autoPlay = {true}
                />
            }
            {   loading === false &&
                <FlatList
                    numColumns = {1}
                    showsHorizontalScrollIndicator = {false}
                    showsVerticalScrollIndicator = {false}
                    data = {pickupInfo}
                    keyExtractor = {(item) => item._id}
                    refreshControl = {
                        <RefreshControl
                            refreshing = {loading}
                            onRefresh = {onRefresh}
                        />
                    }
                    ListEmptyComponent = {() => (
                        <Text style = {styles.text6}>No Pickup Available</Text>
                    )}
                    renderItem = {({item, index}) => (
                        <Swipeout
                            autoClose = {false}
                            right = {[
                                {
                                    backgroundColor: 'red',
                                    onPress: async() => {
                                        setLoadingId([...loadingId, item._id])
                                        const res = await handleDecline(item._id)
                                        if(res === true) {
                                            setLoadingId(loadingId.filter(load => load !== item._id))
                                            await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === item._id), 1)
                                            dispatch({
                                                type: PENDING_PICKUP_RETRIEVE_SUCCESS,
                                                payload: pickupInfo
                                            })
                                        } else {
                                            loadingId.splice(loadingId.findIndex(load => load === item._id), 1)
                                        }
                                    },
                                    component: 
                                    <View style = {{paddingVertical: 22}}>
                                        {
                                            checkLoading(item._id) === true ?
                                            <ActivityIndicator 
                                                color = {colors.white} 
                                                size = {30}
                                            /> :
                                            <Icon
                                                type = 'material'
                                                name = 'close'
                                                color = 'white'
                                                size = {30}
                                            />
                                        }
                                    </View>
                                }
                            ]}
                            left = {[
                                {
                                    backgroundColor: 'green',
                                    onPress: async() => {
                                        setLoadingId([...loadingId, item._id])
                                        const res = await handleAccept(item._id)
                                        if(res === true) {
                                            setLoadingId(loadingId.filter(load => load !== item._id))
                                            const pickup = await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === item._id), 1)[0]
                                            pickup.accepted = 1
                                            upcoming.push(pickup)
                                            dispatch({
                                                type: PENDING_PICKUP_RETRIEVE_SUCCESS,
                                                payload: pickupInfo
                                            })
                                            dispatch({
                                                type: UPCOMING_PICKUP_RETRIEVE_SUCCESS,
                                                payload: upcoming
                                            })
                                        } else {
                                            setLoadingId(loadingId.filter(load => load !== item._id))
                                        }
                                    },
                                    component: 
                                    <View style = {{paddingVertical: 22}}>
                                        {
                                            checkLoading(item._id) === true ?
                                            <ActivityIndicator 
                                                color = {colors.white} 
                                                size = {30}
                                            /> :
                                            <Icon
                                                type = 'material'
                                                name = 'done'
                                                color = 'white'
                                                size = {30}
                                            />
                                        }
                                    </View>
                                }
                            ]}
                            style = {styles.card}
                            onOpen = {() => setRowIndex(index)}
                            onClose = {() => {
                                if(index === rowIndex) {
                                    setRowIndex(null)
                                }
                            }}
                            close = {rowIndex !== index}
                            rowId = {index}
                        >
                            <View style = {styles.card}>
                                <View style = {{flex: 1, flexWrap: 'wrap'}}>
                                <View>
                                    <View style = {{...styles.view1, flexDirection: 'row'}}>  
                                        <Icon
                                            type = 'material'
                                            name = 'place'
                                            size = {16}
                                            color = {colors.blue2}
                                            style = {{
                                                marginTop: 7,
                                                marginRight: 3,
                                            }}
                                        />  
                                        <Text style = {styles.text5}>{item.location[0].city}</Text>                        
                                    </View>
                                    <View style = {{...styles.view1, flexDirection: 'row'}}>    
                                        <Text style = {styles.text1}>{item.customerId.name}</Text>                        
                                    </View>
                                    <View style = {{...styles.view1, flexDirection: 'row'}}>
                                        <Text style = {styles.text4}>before: </Text>
                                        <Icon
                                            type = 'material'
                                            name = 'schedule'
                                            size = {16}
                                            color = {colors.blue2}
                                            style = {{
                                                marginTop: 7,
                                                marginRight: 3,
                                                marginLeft: 3
                                            }}
                                        />
                                        <Text style = {styles.text2}>{timeHelper(item.datetime)}</Text>
                                        <Icon
                                            type = 'material'
                                            name = 'calendar-today'
                                            size = {15}
                                            color = {colors.blue2}
                                            style = {{
                                                marginTop: 6,
                                                marginRight: 5,
                                                marginLeft: 5
                                            }}
                                        />
                                        <Text style = {styles.text3}>{date2Helper(item.datetime)}</Text>
                                    </View>
                                </View>
                                <View style = {{position: 'absolute'}}>
                                    <Button
                                        title = 'View'
                                        buttonStyle = {{
                                            width: 70,
                                            height: 40,
                                            marginTop: 18,
                                            borderRadius: 15,
                                            marginLeft: SCREEN_WIDTH/1.3,
                                            backgroundColor: colors.darkBlue
                                        }}
                                        onPress = {() => navigation.navigate('PickupDetail', {item, time: timeHelper(item.datetime), date: dateHelper(item.datetime), date1: date1Helper(item.datetime), buttons: true, name: 'Pending Pickups'})}
                                    />
                                </View>
                                </View>
                            </View>
                        </Swipeout>
                    )}
                />
            }
        </View>
    );
}

export default PendingPickupscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: SCREEN_HEIGHT - (95 + Height),
        alignItems: 'center',
        paddingTop: 20,
    },
    card:{
        width: SCREEN_WIDTH,
        height: 80,
        backgroundColor: colors.white,
        shadowColor: '#171717',
        elevation: 5,
        shadowOpacity: 0.7,
        shadowRadius: 30,
        marginBottom: 10
    },
    view1:{
        justifyContent: 'flex-start',
        marginLeft: 30
    },
    text1:{
        color: colors.blue2,
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 14
    },
    text2:{
        color: colors.blue6,
        marginTop: 5,
        marginRight: 10,
        fontSize: 13
    },
    text3:{
        marginTop: 5,
        color: colors.blue6,
        marginLeft: 0,
        fontSize: 13
    },
    text4:{
        marginTop: 6,
        fontSize: 12,
        color: colors.blue6,
        fontSize: 13
    },
    text5:{
        marginTop: 7,
        fontSize: 12,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 14
    },
    text6:{
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.darkBlue,
        marginTop: SCREEN_HEIGHT/3
    }

})
