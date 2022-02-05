import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { getUpcomingPickups } from '../../redux/actions/requestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const UpcomingPickupscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading, pickupInfo } = upcomingPickups

    const time = (timeC) => {
        const timeA = (((timeC).split('T')[1]).split('.')[0]).split(':')[0]
        const timeB = (parseInt(timeA) + 11) % 12 + 1
        const timeD = timeB + ':' + (((timeC).split('T')[1]).split('.')[0]).split(':')[1] + (parseInt(timeA) >= 12 ? ' PM' : ' AM') 
        return timeD
    }

    const date = (dateA) => {
        let month
        const dateB = ((dateA).split('T')[0]).split('-')[1]
        if(dateB === '01') {
            month = 'January'
        } else if(dateB === '02') {
            month = 'February'
        } else if(dateB === '03') {
            month = 'March'
        } else if(dateB === '04') {
            month = 'April'
        } else if(dateB === '05') {
            month = 'May'
        } else if(dateB === '06') {
            month = 'June'
        } else if(dateB === '07') {
            month = 'July'
        } else if(dateB === '08') {
            month = 'August'
        } else if(dateB === '09') {
            month = 'September'
        } else if(dateB === '10') {
            month = 'October'
        } else if(dateB === '11') {
            month = 'November'
        } else if(dateB === '12') {
            month = 'December'
        }
        const dateC = parseInt(((dateA).split('T')[0]).split('-')[2]) + 1
        const final = dateC + ' ' + month
        return (final)
    }

    useEffect(() => {
        // const unsubscribe = navigation.addListener('focus', () => {
            
        // })
        // return unsubscribe
        dispatch(getUpcomingPickups())
    }, [navigation])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
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
                :
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
                                    <Text style = {styles.text4}>{time(item.datetime)}</Text>
                                    <Text style = {styles.text5}>{date(item.datetime)}</Text>
                                </View>
                            </View>
                            <View>
                                <Button
                                    title = 'View'
                                    buttonStyle = {{
                                        width: 70,
                                        height: 40,
                                        marginTop: 18,
                                        borderRadius: 15,
                                        marginLeft: 30,
                                        backgroundColor: colors.buttons
                                    }}
                                    onPress = {() => navigation.navigate('PickupDetail2', {item, time: time(item.datetime), date: date(item.datetime), buttons: false, name: 'Upcoming Pickups'})}
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

export default UpcomingPickupscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: 7*SCREEN_HEIGHT/10,
        paddingLeft: 10,
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
    }

})
