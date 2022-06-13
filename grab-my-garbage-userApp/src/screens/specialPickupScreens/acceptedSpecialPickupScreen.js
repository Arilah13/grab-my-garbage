import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Icon, Button } from 'react-native-elements'

import { colors } from '../../global/styles'
import { dateHelper, timeHelper } from '../../helpers/pickupHelper'

import { getAcceptedPickups } from '../../redux/actions/specialPickupActions'

import Headercomponent from '../../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

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
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Home' destination = 'Home' />

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
                            <Text style = {styles.text8}>No Pickup Available</Text>
                        )}
                        renderItem = {({item}) => (
                            <View style = {styles.card}>
                                <View style = {styles.card}>
                                    <View style = {{flex: 1, flexWrap: 'wrap'}}>
                                    <View>
                                        <View style = {{...styles.view1, flexDirection: 'row', marginLeft: 10}}>  
                                            <Text style = {styles.text7}>{item.category}</Text>                        
                                        </View>
                                        <View style = {{...styles.view1, flexDirection: 'row'}}> 
                                            <Text style = {styles.text1}>Weight:</Text>   
                                            <Text style = {styles.text1}>{item.weight}kg</Text>                        
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
                                            item.active === 1 &&
                                            <Text style = {{color: 'red', fontSize: 15, fontWeight: 'bold',marginLeft: SCREEN_WIDTH/1.57}}>Active</Text>
                                        }
                                        <Button
                                            title = 'View'
                                            buttonStyle = {{
                                                width: 70,
                                                height: 40,
                                                marginTop: item.active === 1 ? 5 : 18,
                                                borderRadius: 15,
                                                marginLeft: SCREEN_WIDTH/1.65,
                                                backgroundColor: colors.buttons
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
        </SafeAreaView>
    );
}

export default Acceptedspecialpickupscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: 7.8*SCREEN_HEIGHT/10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 10,
        alignItems: 'center',
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
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.darkBlue,
        marginTop: SCREEN_HEIGHT/3
    }

})
