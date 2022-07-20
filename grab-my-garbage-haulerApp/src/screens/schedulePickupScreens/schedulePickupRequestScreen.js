import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions, RefreshControl, StatusBar } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { fromDate } from '../../helpers/schedulePickuphelper'

import { getScheduledPickups } from '../../redux/actions/scheduleRequestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Height = StatusBar.currentHeight

const Schedulepickuprequestscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const scheduledPickups = useSelector((state) => state.retrieveSchedulePickup)
    const { loading, pickupInfo } = scheduledPickups

    const onRefresh = useCallback(() => {
        dispatch(getScheduledPickups())
    }, [])

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getScheduledPickups())
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
                        alignSelf: 'center'
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
                                        size = {18}
                                        color = {colors.blue2}
                                        style = {{
                                            marginTop: 5,
                                            marginRight: 5
                                        }}
                                    /> 
                                    <Text style = {styles.text5}>
                                        {item.location[0].city}
                                    </Text>                                         
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
                                <Button
                                    title = 'View'
                                    buttonStyle = {{
                                        width: 70,
                                        height: 40,
                                        marginTop: 18,
                                        borderRadius: 15,
                                        marginLeft: SCREEN_WIDTH/1.3,
                                        backgroundColor: colors.buttons
                                    }}
                                    onPress = {() => navigation.navigate('ScheduleDetail', {item, from: fromDate(item.from), to: fromDate(item.to)})}
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

export default Schedulepickuprequestscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        height: SCREEN_HEIGHT - (95 + Height),
        backgroundColor: colors.grey9,
        paddingTop: 20,
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
        marginTop: 4,
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
