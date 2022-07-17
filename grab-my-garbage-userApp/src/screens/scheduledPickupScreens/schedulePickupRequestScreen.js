import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { dayConverter, fromDate } from '../../helpers/schedulepickupHelper'

import { getScheduledPickups } from '../../redux/actions/schedulePickupActions'

import Headercomponent from '../../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Schedulepickuprequestscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const retrieveScheduledPickup = useSelector(state => state.retrieveScheduledPickup)
    const { loading, pickupInfo } = retrieveScheduledPickup

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
            <Headercomponent name = 'Home' destination = 'Home'/>

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
                        renderItem = {({item}) => (
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
                                            <Text style = {{color: colors.darkGrey, fontSize: 15, fontWeight: 'bold',marginLeft: SCREEN_WIDTH/1.57}}>Inactive</Text>
                                        }
                                        {
                                            item.active === 1 &&
                                            <Text style = {{color: 'red', fontSize: 15, fontWeight: 'bold',marginLeft: SCREEN_WIDTH/1.57}}>Active</Text>
                                        }
                                        <Button
                                            title = 'View'
                                            buttonStyle = {{
                                                width: 70,
                                                height: 40,
                                                marginTop: item.active === 1 || item.inactive === 1 ? 5 : 18,
                                                borderRadius: 15,
                                                marginLeft: SCREEN_WIDTH/1.4,
                                                backgroundColor: colors.darkBlue
                                            }}
                                            onPress = {() => navigation.navigate('PickupScheduleDetail', {item, from: fromDate(item.from), to: fromDate(item.to)})}
                                        />
                                    </View>
                                </View>
                            </View>
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
        width: SCREEN_WIDTH/1.1,
        borderRadius: 5,
        height: 80,
        backgroundColor: colors.white,
        elevation: 5,
        marginBottom: 10
    },
    view1:{
        justifyContent: 'flex-start',
        marginLeft: 8
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
