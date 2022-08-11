import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, RefreshControl, StatusBar, ActivityIndicator } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'
import Swipeout from 'react-native-swipeout'
import axios from 'axios'

import { colors } from '../../global/styles'
import { date2Helper, timeHelper } from '../../helpers/specialPickuphelper'

import { getUpcomingPickups } from '../../redux/actions/specialRequestActions'
import { UPCOMING_PICKUP_RETRIEVE_SUCCESS } from '../../redux/constants/specialRequestConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Height = StatusBar.currentHeight

const UpcomingPickupscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [loadingId, setLoadingId] = useState([])
    const [rowIndex, setRowIndex] = useState()

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading, pickupInfo } = upcomingPickups

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

    const handleInactive = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/exclude/${id}`, config)

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

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/include/${id}`, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    const onRefresh = useCallback(() => {
        dispatch(getUpcomingPickups())
    }, [])

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getUpcomingPickups())
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
            {
            loading === false &&
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
                            left = {[
                                {
                                    backgroundColor: item.inactive === 0 ? 'grey' : 'green',
                                    onPress: async() => {
                                        setLoadingId([...loadingId, item._id])
                                        const res = item.inactive === 0 ? await handleInactive(item._id) : await handleActive(item._id)
                                        if(res === true) {
                                            setLoadingId(loadingId.filter(load => load !== item._id))
                                            const pickup = await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === item._id), 1)[0]
                                            pickup.inactive = item.inactive === 1 ? 0 : 1
                                            await pickupInfo.splice(index, 0, pickup)
                                            dispatch({
                                                type: UPCOMING_PICKUP_RETRIEVE_SUCCESS,
                                                payload: pickupInfo
                                            })
                                            setRowIndex(null)
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
                                                    name = {item.inactive === 0 ? 'toggle-off' : 'toggle-on'}
                                                    color = 'white'
                                                    size = {30}
                                                />
                                                <Text style = {{alignSelf: 'center', color: colors.white}}>{item.inactive === 0 ? 'Exclude' : 'Include'}</Text>
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
                            <View style = {styles.card}>
                                <View style = {{flex: 1, flexWrap: 'wrap'}}>
                                <View>
                                    <View style = {{...styles.view1, flexDirection: 'row'}}>  
                                        <Icon
                                            type = 'material'
                                            name = 'place'
                                            size = {18}
                                            color = {colors.blue2}
                                            style = {{
                                                marginTop: 7,
                                                marginRight: 3,
                                            }}
                                        />  
                                        <Text style = {styles.text1}>{item.location[0].city}</Text>                        
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
                                                marginLeft: 3,
                                                marginRight: 3
                                            }}
                                        />
                                        <Text style = {styles.text4}>{timeHelper(item.datetime)}</Text>
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
                                    {
                                        item.inactive === 1 &&
                                        <View style = {{width: SCREEN_WIDTH/5, backgroundColor: colors.grey8, marginLeft: '80%', height: 25, justifyContent: 'center'}}>
                                            <Text style = {{color: colors.darkBlue, fontSize: 15, fontWeight: 'bold', marginLeft: 5}}>Excluded</Text>
                                        </View>
                                    }
                                    {
                                        item.active === 1 &&
                                        <View style = {{width: SCREEN_WIDTH/5, backgroundColor: colors.grey8, marginLeft: '80%', height: 25, justifyContent: 'center'}}>
                                            <Text style = {{color: 'red', fontSize: 15, fontWeight: 'bold', marginLeft: 5}}>Active</Text>
                                        </View>
                                    }
                                    <Button
                                        title = 'View'
                                        buttonStyle = {{
                                            width: 70,
                                            height: 40,
                                            marginTop: item.inactive === 1 || item.active === 1 ? 10 : 18,
                                            borderRadius: 15,
                                            marginLeft: SCREEN_WIDTH/1.3,
                                            backgroundColor: colors.darkBlue
                                        }}
                                        onPress = {() => {
                                            navigation.navigate('PickupDetail', {item, buttons: false, name: 'Upcoming Pickups'}
                                        )}}
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

export default UpcomingPickupscreen

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
