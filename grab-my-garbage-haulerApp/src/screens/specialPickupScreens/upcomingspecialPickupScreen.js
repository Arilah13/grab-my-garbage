import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { dateHelper, date1Helper, timeHelper } from '../../helpers/specialPickuphelper'

import { getUpcomingPickups } from '../../redux/actions/specialRequestActions'

import Headercomponent from '../../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const UpcomingPickupscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading, pickupInfo } = upcomingPickups

    useEffect(() => {
        // const unsubscribe = navigation.addListener('focus', () => {
            
        // })
        // return unsubscribe
        dispatch(getUpcomingPickups())
    }, [])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Pickup' destination = 'Pickup' />
            <View style = {styles.container}>
                {loading === true ?
                    <LottieView 
                        source = {require('../../../assets/animation/truck_loader.json')}
                        style = {{
                            width: 300,
                            height: 400,
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
                                    <Text style = {styles.text7}>{item.location[0].city}</Text>                        
                                </View>
                                <View style = {{...styles.view1, flexDirection: 'row'}}>    
                                    <Text style = {styles.text1}>{item.customerId.name}</Text>                        
                                </View>
                                <View style = {{...styles.view1, flexDirection: 'row'}}>
                                    <Text style = {styles.text6}>before: </Text>
                                    <Icon
                                        type = 'material'
                                        name = 'schedule'
                                        size = {18}
                                        color = {colors.blue2}
                                        style = {{
                                            marginTop: 5,
                                            marginRight: 5
                                        }}
                                    />
                                    <Text style = {styles.text4}>{timeHelper(item.datetime)}</Text>
                                    <Text style = {styles.text5}>{dateHelper(item.datetime)}</Text>
                                </View>
                            </View>
                            <View style = {{position: 'absolute'}}>
                                {
                                    item.inactive === 1 &&
                                    <Text style = {{color: 'grey', fontSize: 15, fontWeight: 'bold',marginLeft: SCREEN_WIDTH/1.61}}>Excluded</Text>
                                }
                                <Button
                                    title = 'View'
                                    buttonStyle = {{
                                        width: 70,
                                        height: 40,
                                        marginTop: item.inactive === 1 ? 5 : 18,
                                        borderRadius: 15,
                                        marginLeft: SCREEN_WIDTH/1.65,
                                        backgroundColor: colors.buttons
                                    }}
                                    onPress = {() => {
                                        navigation.navigate('PickupDetail', {item, time: timeHelper(item.datetime), date: dateHelper(item.datetime), date1: date1Helper(item.datetime), buttons: false, name: 'Upcoming Pickups'}
                                    )}}
                                />
                            </View>
                            </View>
                        </View>
                    )}
                /> : <Text style = {styles.text8}>No Pickup Available</Text>
                }
            </View>
        </SafeAreaView>
    );
}

export default UpcomingPickupscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: 7.8*SCREEN_HEIGHT/10,
        paddingLeft: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 10,
    },
    card:{
        width: SCREEN_WIDTH/1.2,
        height: 80,
        marginBottom: 20,
        backgroundColor: colors.blue1,
        borderRadius: 20,
        shadowColor: '#171717',
        elevation: 5,
        shadowOpacity: 0.7,
        shadowRadius: 30
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
    }

})
