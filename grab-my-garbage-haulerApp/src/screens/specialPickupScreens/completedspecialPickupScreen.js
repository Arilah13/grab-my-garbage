import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, RefreshControl, StatusBar } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { timeHelper, date1Helper } from '../../helpers/specialPickuphelper'

import { getCompletedPickups } from '../../redux/actions/specialRequestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Height = StatusBar.currentHeight

const CompletedPickupscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const completedPickups = useSelector((state) => state.completedPickups)
    const { loading, pickupInfo } = completedPickups

    const onRefresh = useCallback(() => {
        dispatch(getCompletedPickups())
    }, [])

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getCompletedPickups())
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
                    renderItem = {({item}) => (
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
                                            marginRight: 3
                                        }}
                                    />  
                                    <Text style = {styles.text5}>{item.location[0].city}</Text>                        
                                </View>
                                <View style = {{...styles.view1, flexDirection: 'row'}}>    
                                    <Text style = {styles.text1}>{item.customerId.name}</Text>                        
                                </View>
                                <View style = {{...styles.view1, flexDirection: 'row'}}>
                                    <Text style = {styles.text4}>completed: </Text>
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
                                    <Text style = {styles.text4}>{timeHelper(item.completedDate)}</Text>
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
                                    <Text style = {styles.text5}>{date1Helper(item.completedDate)}</Text>
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
                                    onPress = {() => navigation.navigate('PickupDetail', {item, time: timeHelper(item.datetime), completedTime: timeHelper(item.completedDate), date: date1Helper(item.completedDate), date1: date1Helper(item.datetime), buttons: false, name: 'Completed Pickups'})}
                                />
                            </View>
                            </View>
                        </View>
                    )} 
                />
            }
        </View>
    );
}

export default CompletedPickupscreen

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
