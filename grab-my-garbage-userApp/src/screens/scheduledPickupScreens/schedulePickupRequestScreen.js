import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
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

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getScheduledPickups())
        }
    }, [])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Home' destination = 'Home'/>

            <View style = {styles.container}>
                <View style = {styles.view2}>
                    <Text style = {styles.text9}>Scheduled Pickup List</Text>
                </View>
                {loading === true ?
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
                : loading === false && pickupInfo.length > 0  ?
                <FlatList
                    numColumns = {1}
                    showsHorizontalScrollIndicator = {false}
                    showsVerticalScrollIndicator = {false}
                    data = {pickupInfo}
                    keyExtractor = {(item) => item._id}
                    renderItem = {({item}) => (
                        <View style = {styles.card}>
                            <View style = {styles.card}>
                                <View style = {{flex: 1, flexWrap: 'wrap'}}>
                                <View>
                                    <View style = {{...styles.view1, flexDirection: 'row', marginLeft: 10}}>  
                                        {
                                            item.days.map((day) => {
                                                return (
                                                    <Text 
                                                        style = {styles.text7}
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
                                        <Text style = {{...styles.text1, fontSize: 14}}>{item.timeslot}</Text>                        
                                    </View>
                                    <View style = {{...styles.view1, flexDirection: 'row'}}>
                                        <Text style = {styles.text6}>Duration:</Text>
                                        <Icon
                                            type = 'material'
                                            name = 'hourglass-empty'
                                            size = {18}
                                            color = {colors.blue2}
                                            style = {{
                                                marginTop: 5,
                                                marginRight: 5
                                            }}
                                        />
                                        <Text style = {styles.text4}>{fromDate(item.from) + ' - ' + fromDate(item.to)}</Text>
                                        <Text style = {styles.text5}></Text>
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
                                            marginLeft: SCREEN_WIDTH/1.65,
                                            backgroundColor: colors.buttons
                                        }}
                                        onPress = {() => navigation.navigate('PickupScheduleDetail', {item, from: fromDate(item.from), to: fromDate(item.to)})}
                                    />
                                </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
                : <Text style = {styles.text8}>No Pickup Available</Text>
                }
            </View>
        </SafeAreaView>
    );
}

export default Schedulepickuprequestscreen

const styles = StyleSheet.create({

    container:{
        height: 9*SCREEN_HEIGHT/10,
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 30
    },
    card:{
        width: SCREEN_WIDTH/1.15,
        height: 80,
        marginBottom: 20,
        backgroundColor: colors.blue1,
        borderRadius: 20,
        shadowColor: '#171717',
        elevation: 5,
        shadowOpacity: 0.7,
        shadowRadius: 30,
    },
    view1:{
        justifyContent: 'flex-start',
    },
    text1:{
        color: colors.blue2,
        fontWeight: 'bold',
        marginTop: 8,
        marginLeft: 7,
    },
    text2:{
        color: colors.blue2,
        marginLeft: 35,
        marginTop: 15,
        fontWeight: 'bold'
    },
    text3:{
        color: colors.blue2,
        marginRight: 40,
        marginLeft: 35,
        marginTop: 15,
        fontWeight: 'bold'
    },
    text4:{
        color: colors.blue2,
        fontWeight: 'bold',
        marginTop: 5,
        marginRight: 10
    },
    text5:{
        marginTop: 5,
        color: colors.blue2,
        marginLeft: 0,
    },
    text6:{
        marginTop: 6,
        fontSize: 12,
        color: colors.blue2,
        marginLeft: 7,
    },
    text7:{
        marginTop: 7,
        fontSize: 12,
        color: colors.blue2,
        fontWeight: 'bold'
    },
    text8:{
        alignSelf: 'center',
        marginTop: '50%',
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    view2:{
        marginBottom: 20
    },
    text9:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.blue2,
    }

})
