import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { getCompletedPickups } from '../../redux/actions/requestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const CompletedPickupscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const completedPickups = useSelector((state) => state.completedPickups)
    const { loading, pickupInfo } = completedPickups

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
        dispatch(getCompletedPickups())
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
                                    onPress = {() => navigation.navigate('PickupDetail3', {item, time: time(item.datetime), date: date(item.datetime), buttons: false, name: 'Completed Pickups'})}
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

export default CompletedPickupscreen

const styles = StyleSheet.create({

    view1:{
        
    }

})
