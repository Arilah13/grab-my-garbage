import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import axios from 'axios'

import { colors } from '../../global/styles'
import { dateHelper, date1Helper, timeHelper } from '../../helpers/pickupHelper'

import { getPendingPickups } from '../../redux/actions/specialPickupActions'

import Headercomponent from '../../components/headerComponent'
import Mapcomponent from '../../components/pickupComponent/mapComponent'
import Chatcomponent from '../../components/pickupComponent/chatComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Specialpickupdetailscreen = ({route, navigation}) => {
    const dispatch = useDispatch()

    const { item, name, completedTime } = route.params

    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [loading, setLoading] = useState(false)
    const [disable, setDisable] = useState(false)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        },
    }

    const handleCancel = async(id) => {
        setLoading(true)
        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialpickup/${id}`, config)
        if(res.status === 200) {
            dispatch(getPendingPickups())
            setTimeout(() => {
                setLoading(false)
                navigation.navigate('pendingPickup')
            }, 3000)
        }  
    }

    useEffect(() => {
        if(item.active === 1) {
            setDisable(true)
        } else if(item.active === 0) {
            setDisable(false)
        }
    }, [])

    return (
        <SafeAreaView>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {styles.container}
            >
                <Headercomponent name = {name} />    

                <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.grey8, borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                    <Pressable style = {styles.container2} onPress = {() => setModalVisible(true) }>
                        <Icon 
                            type = 'feather'
                            name = 'map-pin'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                marginTop: 30,
                                alignSelf: 'flex-start'
                            }}
                        />
                        <Text style = {styles.text1}>Pick Up Location</Text>
                        <Text style = {styles.text2}>{item.location[0].city}</Text>
                        <Icon 
                            type = 'material-community'
                            name = 'dots-vertical'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                //alignSelf: 'flex-end',
                                //marginRight: 5,
                                //bottom: 15,
                                position: 'absolute'
                            }}
                        />
                    </Pressable>
                    <View style = {{flex: 1, backgroundColor: colors.white, borderTopRightRadius: 30, borderTopLeftRadius: 30, padding: 15}}>
                        <View style = {styles.container3}>
                            <Text style = {styles.text3}>Pickup Scheduled on:</Text>
                            <Text style = {styles.text4}>{date1Helper(item.datetime) + ' ' + timeHelper(item.datetime)}</Text>
                        </View>
                        <View style = {{...styles.container5, paddingTop: 0}}>
                            <Text style = {styles.text3}>{name === 'Completed Pickups' ? 'Pickup Collected On:' : 'Collect Pickup Before:'}</Text>
                            <Text style = {styles.text4}>{name === 'Completed Pickups' ? dateHelper(item.datetime)+' '+completedTime : dateHelper(item.datetime)+' '+timeHelper(item.datetime)}</Text>
                        </View>
                        <View style = {styles.container4}>
                            <Text style = {styles.text5}>Trash Categories:</Text>
                            <View style = {{position: 'absolute'}}>
                                <Text style = {{...styles.text6, marginLeft: 155, marginTop: 0}}>{item.category[0]}</Text>
                            </View>
                            { item.category.length > 1 ?
                                <View style = {{marginTop: -8}}> 
                                    {(item.category).slice(1).map(trash =>
                                        <Text  
                                            key = {trash} 
                                            style = {styles.text6}
                                        >
                                            {trash}
                                        </Text>        
                                    )}
                                </View> : null
                            }
                        </View>
                        <View style = {{...styles.container5, paddingTop: 20}}>
                            <Text style = {styles.text3}>Weight:</Text>
                            <Text style = {styles.text4}>{item.weight} kg</Text>
                        </View>
                        <View style = {{...styles.container5, paddingBottom: 5, paddingTop: 0}}>
                            <Text style = {styles.text3}>Optional Images:</Text>
                            {
                                item.image === null ? 
                                <Text style = {styles.text4}>No Images Attached</Text>
                                : null
                            }
                        </View>
                        <View style = {{alignSelf: 'center'}}>
                            {
                                item.image !== null ? 
                                <Image 
                                    source = {{uri: item.image}}
                                    resizeMode = 'contain'
                                    style = {styles.image}
                                /> : null
                            }
                        </View>
                        <View style = {{...styles.container5, paddingBottom: 0}}>
                            <Text style = {styles.text3}>Payment:</Text>
                            <Text style = {styles.text4}>Rs. {item.payment}</Text>
                        </View>
                        <View style = {styles.container5}>
                            <Text style = {styles.text3}>Payment Method:</Text>
                            <Text style = {styles.text4}>{item.paymentMethod}</Text>
                        </View>
                        {
                            name === 'Accepted Pickups' ? 
                            <>
                            <View style = {{...styles.container5, paddingTop: 0}}>
                                <Text style = {styles.text3}>Hauler Name:</Text>
                                <Text style = {styles.text4}>{item.pickerId.name}</Text>
                            </View> 
                            <TouchableOpacity 
                                style = {{...styles.container5, paddingTop: 30, justifyContent: 'center'}}
                                onPress = {() => setModalVisible1(true)}
                            >
                                <Icon
                                    type = 'material'
                                    name = 'chat'
                                    color = {colors.darkBlue}
                                    size = {27}
                                />    
                                <Text style = {styles.text7}>Chat With Hauler</Text>
                            </TouchableOpacity>
                            </>
                            : null
                        }
                        {
                            item.accepted === 0 && item.completed === 0 &&
                            <View style = {{alignSelf: 'center', flexDirection: 'row', marginTop: 20}}>
                                <Button
                                    title = 'Cancel'
                                    buttonStyle = {styles.button}
                                    loading = {loading}
                                    disabled = {loading || disable}
                                    onPress = {() => handleCancel(item._id)}
                                />
                        </View>
                        }
                    </View>

                    <Modal 
                        isVisible = {modalVisible}
                        swipeDirection = {'down'}
                        style = {{ justifyContent: 'center', margin: 10 }}
                        onBackButtonPress = {() => setModalVisible(false)}
                        onBackdropPress = {() => setModalVisible(false)}
                        animationIn = 'zoomIn'
                        animationOut = 'zoomOut'
                        animationInTiming = {500}
                        animationOutTiming = {500}
                        useNativeDriver = {true}
                        useNativeDriverForBackdrop = {true}
                        deviceHeight = {SCREEN_HEIGHT}
                        deviceWidth = {SCREEN_WIDTH}
                    >
                        <View style = {styles.view1}>
                            <Mapcomponent location = {item.location[0]} item = {item} setModalVisible = {setModalVisible} type = 'special' navigation = {navigation} />
                        </View>                
                    </Modal>

                    <Modal 
                        isVisible = {modalVisible1}
                        swipeDirection = {'down'}
                        style = {{ justifyContent: 'center', margin: 10 }}
                        onBackButtonPress = {() => setModalVisible1(false)}
                        onBackdropPress = {() => setModalVisible1(false)}
                        animationIn = 'zoomIn'
                        animationOut = 'zoomOut'
                        animationInTiming = {500}
                        animationOutTiming = {500}
                        useNativeDriver = {true}
                        useNativeDriverForBackdrop = {true}
                        deviceHeight = {SCREEN_HEIGHT}
                        deviceWidth = {SCREEN_WIDTH}
                    >
                        <View style = {styles.view2}>
                            <Chatcomponent haulerid = {item.pickerId} pickupid = {item._id} setModalVisible = {setModalVisible1}/>
                        </View>                
                    </Modal>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Specialpickupdetailscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.blue1,
        //paddingLeft: 10,
        //paddingTop: 10,
    },
    container2:{
        backgroundColor: colors.grey8,
        paddingLeft: 25, 
        marginBottom: 10,
        height: SCREEN_HEIGHT/9,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text1:{
        color: colors.blue7,
        left: 40,
        bottom: 30
    },
    text2:{
        color: colors.blue2,
        left: 40,
        bottom: 30,
        fontWeight: 'bold'
    },
    container3:{
        backgroundColor: colors.white,
        padding: 25,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        flexDirection: 'row'
    },
    text3:{
        color: colors.blue2,
        fontWeight: 'bold',
    },
    text4:{
        color: colors.grey,
        fontWeight: 'bold',
        marginLeft: 20
    },
    text5:{
        color: colors.blue2,
        fontWeight: 'bold',
        marginBottom: 8
    },
    container4:{
        backgroundColor: colors.white,
        paddingLeft: 25,
    },
    text6:{
        color: colors.grey,
        fontWeight: 'bold',
        marginLeft: 130,
        marginTop: 5
    },
    container5:{
        backgroundColor: colors.white,
        padding: 25,
        flexDirection: 'row'
    },
    image:{
        height: 200,
        width: 200,
        //borderRadius: 500,
        alignContent: 'center'
    },
    text7:{
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    view1:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    view2:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    button:{
        backgroundColor: colors.darkBlue,
        borderRadius: 10,
        height: 40,
        width: 140,
        marginHorizontal: 20
    },

})
