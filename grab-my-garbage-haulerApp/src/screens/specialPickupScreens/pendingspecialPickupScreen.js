import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { dateHelper, date1Helper, timeHelper } from '../../helpers/specialPickuphelper'

import { getPendingPickupsOffline } from '../../redux/actions/specialRequestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const PendingPickupscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const pendingPickups = useSelector((state) => state.pendingPickups)
    const { loading, pickupInfo } = pendingPickups

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    useEffect(() => {
        if(loading === undefined) {
            dispatch(getPendingPickupsOffline(userInfo._id, userInfo.token))
        }
    }, [])

    // useEffect(() => {
    //     if(pickupInfo !== undefined) {
    //         socket.on('pickupCancel', async({id}) => {
    //             // const id1 = await pickupInfo.find((pickup, index) => {
    //             //     if(pickup._id === id)
    //             //     return id
    //             // })
    //             // console.log(id1)
    //             pickupInfo.splice(0)
    //             dispatch({
    //                 type: PENDING_PICKUP_RETRIEVE_SUCCESS,
    //                 payload: pickupInfo
    //             })
    //         })
    //     }
    // }, [socket, pickupInfo])

    return (
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
                            <Button
                                title = 'View'
                                buttonStyle = {{
                                    width: 70,
                                    height: 40,
                                    marginTop: 18,
                                    borderRadius: 15,
                                    marginLeft: SCREEN_WIDTH/1.65,
                                    backgroundColor: colors.buttons
                                }}
                                onPress = {() => navigation.navigate('PickupDetail', {item, time: timeHelper(item.datetime), date: dateHelper(item.datetime), date1: date1Helper(item.datetime), buttons: true, name: 'Pending Pickups'})}
                            />
                        </View>
                        </View>
                    </View>
                )}
            /> : <Text style = {styles.text8}>No Pickup Available</Text>
            }
        </View>
    );
}

export default PendingPickupscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.white,
        height: SCREEN_HEIGHT - 55,
        alignItems: 'center',
        paddingTop: 20,
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
