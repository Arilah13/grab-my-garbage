import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'
import axios from 'axios'
import Swipeout from 'react-native-swipeout'

import { colors } from '../../global/styles'
import { dayConverter, fromDate } from '../../helpers/schedulepickupHelper'

import { getScheduledPickups } from '../../redux/actions/schedulePickupActions'
import { SCHEDULED_PICKUP_RETRIEVE_SUCCESS } from '../../redux/constants/scheduledPickupConstants'

import Headercomponent from '../../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Schedulepickuprequestscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [loadingId, setLoadingId] = useState([])
    const [loadingId1, setLoadingId1] = useState([])
    const [rowIndex, setRowIndex] = useState()

    const retrieveScheduledPickup = useSelector(state => state.retrieveScheduledPickup)
    const { loading, pickupInfo } = retrieveScheduledPickup

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

    const checkLoading1 = (id) => {
        const load = loadingId1.find(load => load === id)
        if(load) {
            return true
        } else {
            return false
        }
    }

    const handleDelete = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/${id}/remove`, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    const handleCancel = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/${id}`, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    const handleInactive = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/inactive/${id}`, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    const handleActive = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/active/${id}`, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    const returnCard = (item) => {
        return(
            <View style = {styles.card}>
                <View style = {{flex: 1, flexWrap: 'wrap'}}>
                    <View>
                        <View style = {{...styles.view1, flexDirection: 'row'}}>  
                            {
                                item.days.map((day) => {
                                    return (
                                        <Text 
                                            style = {styles.text5}
                                            key = {day}
                                        >
                                            {dayConverter(day) + ' '}
                                        </Text>       
                                    )  
                                })
                            } 
                        </View>
                        <View style = {{...styles.view1, flexDirection: 'row'}}> 
                            <Text style = {styles.text1}>TimeSlot:</Text> 
                            <Icon
                                type = 'material'
                                name = 'schedule'
                                size = {17}
                                color = {colors.blue2}
                                style = {{
                                    marginTop: 8,
                                    marginRight: 3,
                                    marginLeft: 3
                                }}
                            />  
                            <Text style = {styles.text1}>{item.timeslot}</Text>                        
                        </View>
                        <View style = {{...styles.view1, flexDirection: 'row'}}>
                            <Text style = {styles.text4}>Duration:</Text>
                            <Icon
                                type = 'material'
                                name = 'hourglass-empty'
                                size = {16}
                                color = {colors.blue2}
                                style = {{
                                    marginTop: 6,
                                    marginRight: 3,
                                    marginLeft: 3
                                }}
                            />
                            <Text style = {styles.text2}>{fromDate(item.from) + ' - ' + fromDate(item.to)}</Text>
                            <Text style = {styles.text3}></Text>
                        </View>
                    </View>
                    <View style = {{position: 'absolute'}}>
                        {
                            item.inactive === 1 &&
                            <View style = {{width: SCREEN_WIDTH/5, backgroundColor: colors.grey8, marginLeft: '80%', height: 25, justifyContent: 'center'}}>
                                <Text style = {{color: colors.darkGrey, fontSize: 15, fontWeight: 'bold', marginLeft: 5}}>Inactive</Text>
                            </View>
                        }
                        {
                            item.active === 1 &&
                            <View style = {{width: SCREEN_WIDTH/5, backgroundColor: colors.grey8, marginLeft: '80%', height: 25, justifyContent: 'center'}}>
                                <Text style = {{color: 'red', fontSize: 15, fontWeight: 'bold', marginLeft: 5}}>Active</Text>
                            </View>
                        }
                        {
                            item.cancelled === 1 &&
                            <View style = {{width: SCREEN_WIDTH/5, backgroundColor: colors.grey8, marginLeft: '80%', height: 25, justifyContent: 'center'}}>
                                <Text style = {{color: 'red', fontSize: 15, fontWeight: 'bold', marginLeft: 5}}>Cancelled</Text>
                            </View>
                        }
                        {
                            item.completed === 1 &&
                            <View style = {{width: SCREEN_WIDTH/5, backgroundColor: colors.grey8, marginLeft: '80%', height: 25, justifyContent: 'center'}}>
                                <Text style = {{color: 'red', fontSize: 15, fontWeight: 'bold', marginLeft: 5}}>Completed</Text>
                            </View>
                        }
                        {
                            item.completed === 0 && item.cancelled === 0 &&
                            <Button
                                title = 'View'
                                buttonStyle = {{
                                    width: 70,
                                    height: 40,
                                    marginTop: item.active === 1 || item.inactive === 1 ? 10 : 18,
                                    borderRadius: 15,
                                    marginLeft: SCREEN_WIDTH/1.4,
                                    backgroundColor: colors.darkBlue
                                }}
                                onPress = {() => navigation.navigate('PickupScheduleDetail', {item})}
                            />
                        }
                    </View>
                </View>
            </View>
        )
    }

    const onRefresh = useCallback(() => {
        dispatch(getScheduledPickups())
    }, [])

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getScheduledPickups())
        }
    }, [])

    return (
        <SafeAreaView>
            <Headercomponent name = 'Schedule Pickups' destination = 'Home'/>

            <View style = {styles.container}>
                {loading === true &&
                    <LottieView 
                        source = {require('../../../assets/animation/truck_loader.json')}
                        style = {{
                            width: 300,
                            height: 400,
                            alignSelf: 'center'
                        }}
                        loop = {true}
                        autoPlay = {true}
                    />
                } 
                {loading === false &&
                    <FlatList
                        numColumns = {1}
                        showsHorizontalScrollIndicator = {false}
                        showsVerticalScrollIndicator = {false}
                        data = {pickupInfo}
                        refreshControl = {
                            <RefreshControl
                                refreshing = {loading}
                                onRefresh = {onRefresh}
                            />
                        }
                        keyExtractor = {(item) => item._id}
                        ListEmptyComponent = {() => (
                            <Text style = {styles.text6}>No Pickup Available</Text>
                        )}
                        renderItem = {({item, index}) => (
                            item.cancelled === 0 && item.completed === 0 ?
                            <Swipeout
                                autoClose = {false}
                                right = {[
                                    {
                                        backgroundColor: 'red',
                                        onPress: async() => {
                                            setLoadingId1([...loadingId1, item._id])
                                            const res = await handleCancel(item._id)
                                            const find = loadingId.find(load => load === item._id)
                                            if(res === true && !find) {
                                                setLoadingId1(loadingId1.filter(load => load !== item._id))
                                                const index = await pickupInfo.findIndex(pickup => pickup._id === item._id)
                                                const pickup = await pickupInfo.splice(index, 1)[0]
                                                pickup.inactive = 0
                                                pickup.cancelled = 1
                                                await pickupInfo.splice(index, 0, pickup)
                                                dispatch({
                                                    type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                                                    payload: pickupInfo
                                                })
                                                setRowIndex(null)
                                            } else {
                                                loadingId1.splice(loadingId1.findIndex(load => load === item._id), 1)
                                            }
                                        },
                                        component: 
                                        <View style = {{paddingVertical: 20}}>
                                            {
                                                checkLoading1(item._id) === true ?
                                                <ActivityIndicator 
                                                    color = {colors.white} 
                                                    size = {30}
                                                /> :
                                                <View>
                                                    <Icon
                                                        type = 'material'
                                                        name = 'close'
                                                        color = 'white'
                                                        size = {30}
                                                    />
                                                    <Text style = {{alignSelf: 'center', color: colors.white}}>Cancel</Text>
                                                </View>
                                            }
                                        </View>
                                    }
                                ]}
                                left = {[
                                    {
                                        backgroundColor: item.inactive === 0 ? 'red' : 'green',
                                        onPress: async() => {
                                            setLoadingId1([...loadingId1, item._id])
                                            const res = item.inactive === 0 ? await handleInactive(item._id) : await handleActive(item._id)
                                            if(res === true) {
                                                setLoadingId1(loadingId1.filter(load => load !== item._id))
                                                const index = await pickupInfo.findIndex(pickup => pickup._id === item._id)
                                                const pickup = await pickupInfo.splice(index, 1)[0]
                                                pickup.inactive = item.inactive === 0 ? 1 : 0
                                                await pickupInfo.splice(index, 0, pickup)
                                                dispatch({
                                                    type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                                                    payload: pickupInfo
                                                })
                                                setRowIndex(null)
                                            } else {
                                                setLoadingId1(loadingId1.filter(load => load !== item._id))
                                            }
                                        },
                                        component: 
                                        <View style = {{paddingVertical: 22}}>
                                            {
                                                checkLoading1(item._id) === true ?
                                                <ActivityIndicator 
                                                    color = {colors.white} 
                                                    size = {30}
                                                /> :
                                                <View>
                                                    <Icon
                                                        type = 'material'
                                                        name = {item.inactive === 0 ? 'toggle-off' : 'toggle-on'}
                                                        color = 'white'
                                                        size = {30}
                                                    />
                                                    <Text style = {{alignSelf: 'center', color: colors.white}}>{item.inactive === 0 ? 'Inactivate' : 'Activate'}</Text>
                                                </View>
                                            }
                                        </View>
                                    }
                                ]}
                                onOpen = {() => setRowIndex(index)}
                                onClose = {() => {
                                    if(index === rowIndex) {
                                        setRowIndex(null)
                                    }
                                }}
                                close = {rowIndex !== index}
                                rowId = {index}
                                style = {styles.card}
                            >
                            {returnCard(item)}
                            </Swipeout>
                            : 
                            <Swipeout
                                autoClose = {false}
                                right = {[
                                    {
                                        backgroundColor: 'red',
                                        onPress: async() => {
                                            setLoadingId([...loadingId, item._id])
                                            const res = await handleDelete(item._id)
                                            if(res === true) {
                                                setLoadingId(loadingId.filter(load => load !== item._id))
                                                await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === item._id), 1)
                                                dispatch({
                                                    type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                                                    payload: pickupInfo
                                                })
                                            } else {
                                                setLoadingId(loadingId.filter(load => load !== item._id))
                                            }
                                        },
                                        component: 
                                        <View style = {{paddingVertical: 20}}>
                                            {
                                                checkLoading(item._id) === true ?
                                                <ActivityIndicator 
                                                    color = {colors.white} 
                                                    size = {30}
                                                /> :
                                                <View>
                                                     <Icon
                                                        type = 'material'
                                                        name = 'delete-outline'
                                                        color = 'white'
                                                        size = {30}
                                                    />
                                                    <Text style = {{alignSelf: 'center', color: colors.white}}>Remove</Text>
                                                </View>
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
                                {returnCard(item)}
                            </Swipeout>

                        )}
                    />
                }
            </View>
        </SafeAreaView>
    );
}

export default Schedulepickuprequestscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        height: SCREEN_HEIGHT - 45,
        backgroundColor: colors.grey9,
        paddingTop: 10,
        alignItems: 'center',
    },
    card:{
        width: SCREEN_WIDTH,
        height: 80,
        backgroundColor: colors.white,
        shadowColor: '#171717',
        elevation: 5,
        shadowOpacity: 0.7,
        shadowRadius: 30,
        marginBottom: 10,
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
    },
    title:{
        fontSize: 16,  
        fontWeight: 'bold',
        color: colors.grey2
    },

})
