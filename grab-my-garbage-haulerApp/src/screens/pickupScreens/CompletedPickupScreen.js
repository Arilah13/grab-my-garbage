import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { getCompletedPickups } from '../../redux/actions/requestActions'
import { dateHelper, timeHelper } from '../../helpers/pickuphelper'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const CompletedPickupscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const completedPickups = useSelector((state) => state.completedPickups)
    const { loading, pickupInfo } = completedPickups

    const time = (timeC) => {
        return timeHelper(timeC)
    }

    const date = (dateA) => {
        return dateHelper(dateA)
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
