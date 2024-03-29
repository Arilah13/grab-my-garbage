import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, RefreshControl, StatusBar } from 'react-native'
import LottieView from 'lottie-react-native'
import { Icon, Button } from 'react-native-elements'

import { colors } from '../../global/styles'
import { date2Helper, timeHelper } from '../../helpers/pickupHelper'

import { getAcceptedPickups } from '../../redux/actions/specialPickupActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Height = StatusBar.currentHeight

const Acceptedspecialpickupscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const retrieveAcceptedPickups = useSelector(state => state.retrieveAcceptedPickups)
    const { loading, pickupInfo } = retrieveAcceptedPickups

    const onRefresh = useCallback(() => {
        dispatch(getAcceptedPickups())
    }, [])

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getAcceptedPickups())
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
            {loading === false &&
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
                            <View style = {styles.card}>
                                <View style = {{flex: 1, flexWrap: 'wrap'}}>
                                <View>
                                    <View style = {{...styles.view1, flexDirection: 'row'}}>  
                                        <Text style = {styles.text5}>{item.category}</Text>                        
                                    </View>
                                    <View style = {{...styles.view1, flexDirection: 'row'}}> 
                                        <Text style = {styles.text1}>Weight:</Text>   
                                        <Text style = {{...styles.text1, marginLeft: 7}}>{item.weight}kg</Text>                        
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
                                                marginRight: 3,
                                                marginLeft: 3
                                            }}
                                        />
                                        <Text style = {styles.text2}>{timeHelper(item.datetime)}</Text>
                                        <Icon
                                            type = 'material'
                                            name = 'calendar-today'
                                            size = {16}
                                            color = {colors.blue2}
                                            style = {{
                                                marginTop: 5,
                                                marginRight: 5,
                                                marginLeft: 3
                                            }}
                                        />
                                        <Text style = {styles.text3}>{date2Helper(item.datetime)}</Text>
                                    </View>
                                </View>
                                <View style = {{position: 'absolute'}}>
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
                                            marginTop: item.active === 1 ? 10 : 18,
                                            borderRadius: 15,
                                            marginLeft: SCREEN_WIDTH/1.3,
                                            backgroundColor: colors.darkBlue
                                        }}
                                        onPress = {() => navigation.navigate('pickupDetail', {item, name: 'Accepted Pickups'})}
                                    />
                                </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
            }
        </View>  
    );
}

export default Acceptedspecialpickupscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: SCREEN_HEIGHT - (80 + Height),
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
