import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import axios from 'axios'

import { colors } from '../../global/styles'

import { PENDING_PICKUP_RETRIEVE_SUCCESS, UPCOMING_PICKUP_RETRIEVE_SUCCESS } from '../../redux/constants/specialRequestConstants'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'
import { receiverRead } from '../../redux/actions/conversationActions'

import Headercomponent from '../../components/headerComponent'
import Mapcomponent from '../../components/mapComponent'
import Chatcomponent from '../../components/homeScreen/chatComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Pickupdetailscreen = ({navigation, route}) => {
    const dispatch = useDispatch()

    const { item, time, date, buttons, name, date1, completedTime } = route.params

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [active, setActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [disable, setDisable] = useState(false)
    const [convo, setConvo] = useState()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const pendingPickups = useSelector((state) => state.pendingPickups)
    const { pickupInfo } = pendingPickups

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { pickupInfo: upcoming } = upcomingPickups

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        },
    }

    const handleActive = async(id) => {
        if(active === true) {
            setLoading(true)
            const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/exclude/${id}`, config)
            if(res.status === 200) {
                const pickup = await upcoming.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
                pickup[0].inactive = 1
                upcoming.push(pickup[0])
                dispatch({
                    type: UPCOMING_PICKUP_RETRIEVE_SUCCESS,
                    payload: upcoming
                })
                setActive(false)
                setLoading(false)
            }
        } else if(active === false) {
            setLoading(true)
            const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/include/${id}`, config)
            if(res.status === 200) {
                const pickup = await upcoming.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
                pickup[0].inactive = 0
                upcoming.push(pickup[0])
                dispatch({
                    type: UPCOMING_PICKUP_RETRIEVE_SUCCESS,
                    payload: upcoming
                })
                setActive(true)
                setLoading(false)
            }
        }
    }

    const declinePickup = async(id) => {
        setLoading2(true)
        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/declinePickup/${id}`, {id: userInfo._id}, config)

        if(res.status === 200) {
            await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
            dispatch({
                type: PENDING_PICKUP_RETRIEVE_SUCCESS,
                payload: pickupInfo
            })
            setLoading2(false)
            navigation.navigate('pendingPickupScreen')
        }
    }

    const acceptPickup = async(id) => {
        setLoading1(true)
        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/specialrequest/acceptPickup/${id}`, {haulerId: userInfo._id}, config)

        if(res.status === 200) {
            await axios.post('https://grab-my-garbage-server.herokuapp.com/users/notification', {}, config)
            const pickup = await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
            dispatch({
                type: PENDING_PICKUP_RETRIEVE_SUCCESS,
                payload: pickupInfo
            })
            upcoming.push(pickup[0])
            dispatch({
                type: UPCOMING_PICKUP_RETRIEVE_SUCCESS,
                payload: upcoming
            })
            setLoading1(false)
            navigation.navigate('pendingPickupScreen')
        }  
    }

    const messageRead = async(userId) => {
        const index = await conversation.findIndex((convo) => convo.conversation.userId._id === userId && convo.conversation.haulerId._id === userInfo._id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverHaulerRead === false) {
            element.conversation.receiverHaulerRead = true
            dispatch(receiverRead(element.conversation._id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }

    useEffect(() => {
        if(item.inactive === 1) {
            setActive(false)
        } else if(item.inactive === 0) {
            setActive(true)
        }

        if(item.active === 1) {
            setDisable(true)
        } else if(item.active === 0) {
            setDisable(false)
        }
    }, [])

    useEffect(async() => {
        if(name === 'Upcoming Pickups') {
            const convo = await conversation.find((convo) => convo.conversation.haulerId._id === userInfo._id && convo.conversation.userId._id === item.customerId._id)
            setConvo(convo)
        }
    }, [])

    return (
        <>
            <View style = {{flex: 1}}>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {{backgroundColor: colors.white}}
            >
                <Headercomponent name = {name} />    

                <View style = {{backgroundColor: colors.white}}>
                    <Pressable style = {styles.container2} onPress = {() => {
                        setModalVisible(true)
                    }}>
                        <Icon 
                            type = 'feather'
                            name = 'map-pin'
                            color = {colors.darkBlue}
                            size = {25}
                            style = {{
                                marginTop: 30,
                                alignSelf: 'flex-start'
                            }}
                        />
                        <Text style = {styles.text1}>Pick Up Location</Text>
                        <Text style = {styles.text2}>{item.location[0].city}</Text>
                    </Pressable>
  
                    <View style = {styles.container1}>
                        <View style = {{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
                            <Icon
                                type = 'material'
                                name = 'schedule'
                                size = {18}
                                color = {colors.darkBlue}
                                style = {{
                                    marginTop: 2,
                                    marginRight: 5,
                                    marginLeft: 3
                                }}
                            />
                            <Text style = {styles.title}>Schedule</Text>
                        </View>

                        <View style = {styles.container3}>
                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>Pickup Scheduled on:</Text>
                                <Text style = {styles.text4}>{date1 + ' ' + time}</Text>
                            </View>

                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>{name === 'Completed Pickups' ? 'Pickup Collected On:' : 'Collect Pickup Before:'}</Text>
                                <Text style = {styles.text4}>{name === 'Completed Pickups' ? date+' '+completedTime : date+' '+time}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style = {{...styles.container1, marginTop: 0}}>
                        <View style = {{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
                            <Icon
                                type = 'material'
                                name = 'info-outline'
                                size = {18}
                                color = {colors.darkBlue}
                                style = {{
                                    marginTop: 2,
                                    marginRight: 5,
                                    marginLeft: 3
                                }}
                            />
                            <Text style = {styles.title}>Waste Information</Text>
                        </View>

                        <View style = {styles.container3}>
                            <View style = {{flexDirection: 'row', marginTop: 10}}>
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

                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>Weight:</Text>
                                <Text style = {styles.text4}>{item.weight} kg</Text>
                            </View>
                        </View>
                    </View>

                    <View style = {{...styles.container1, marginTop: 0}}>
                        <View style = {{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
                            <Icon
                                type = 'material'
                                name = 'attach-money'
                                size = {18}
                                color = {colors.darkBlue}
                                style = {{
                                    marginTop: 2,
                                    marginRight: 5,
                                    marginLeft: 3
                                }}
                            />
                            <Text style = {styles.title}>Payment Information</Text>
                        </View>
                        
                        <View style = {styles.container3}>
                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>Payment:</Text>
                                <Text style = {styles.text4}>Rs. {item.payment}</Text>
                            </View>

                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>Payment Method:</Text>
                                <Text style = {styles.text4}>{item.paymentMethod}</Text>
                            </View>
                        </View>
                    </View>

                    <View style = {{...styles.container1, marginTop: 0}}>
                        <View style = {{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
                            <Icon
                                type = 'material'
                                name = 'info'
                                size = {18}
                                color = {colors.darkBlue}
                                style = {{
                                    marginTop: 2,
                                    marginRight: 5,
                                    marginLeft: 3
                                }}
                            />
                            <Text style = {styles.title}>Additional Information</Text>
                        </View>
                        
                        <View style = {styles.container3}>
                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>Optional Images:</Text>
                                {
                                    item.image === null &&
                                    <Text style = {styles.text4}>No Images Attached</Text>
                                }
                            </View>

                            <View style = {{alignSelf: 'center', marginTop: 5}}>
                                    {
                                        item.image !== null &&
                                        <Image 
                                            source = {{uri: item.image}}
                                            resizeMode = 'contain'
                                            style = {styles.image}
                                        />
                                    }
                            </View>
                        </View>
                    </View>

                    {buttons === true ? 
                    <View style = {{...styles.container1, flexWrap: 'wrap', 
                        alignSelf: 'center', elevation: 0, backgroundColor: colors.white,
                        flexDirection: 'row', marginTop: 20
                    }}>
                        <Button
                            title = 'Accept'
                            buttonStyle = {{
                                width: 100,
                                height: 40,
                                marginTop: 15,
                                borderRadius: 15,
                                backgroundColor: colors.darkBlue
                            }}
                            onPress = {() => acceptPickup(item._id)}                                                                                            
                            loading = {loading1}
                            disabled = {loading1}
                        />
                        <Button
                            title = 'Decline'
                            buttonStyle = {{
                                width: 100,
                                height: 40,
                                marginTop: 15,
                                borderRadius: 15,
                                marginLeft: 30,
                                backgroundColor: colors.darkBlue
                            }}
                            onPress = {() => declinePickup(item._id)}
                            loading = {loading2}
                            disabled = {loading2}
                        />
                    </View> : 
                    name === 'Upcoming Pickups' ? 
                    <TouchableOpacity 
                        style = {{...styles.container1, 
                            justifyContent: 'center', elevation: 0, marginVertical: 9,
                            flexDirection: 'row', backgroundColor: colors.white
                        }}
                        onPress = {() => {
                            messageRead(item.customerId._id)
                            setModalVisible1(true)
                        }}
                    >
                        <Icon
                            type = 'material'
                            name = 'chat'
                            color = {colors.darkBlue}
                            size = {27}
                        />    
                        <Text style = {styles.text7}>Chat With Customer</Text>
                    </TouchableOpacity>
                    : null                           
                    }

                    {
                        name === 'Upcoming Pickups' &&
                        <View style = {{alignSelf: 'center', flexDirection: 'row'}}>
                            <Button
                                title = {active ? 'Exclude' : 'Include'}
                                buttonStyle = {{...styles.button, backgroundColor: active ? colors.darkBlue : colors.darkGrey, marginTop: 0}}
                                loading = {loading}
                                disabled = {loading || disable}
                                onPress = {() => handleActive(item._id)}
                            />
                        </View>
                    }

                </View>
            </ScrollView>
            </View>

            <Modal 
                isVisible = {modalVisible}
                swipeDirection = {'down'}
                style = {{ justifyContent: 'flex-end', margin: 0 }}
                onBackButtonPress = {() => setModalVisible(false)}
                onBackdropPress = {() => setModalVisible(false)}
                animationInTiming = {500}
                animationOutTiming = {500}
                useNativeDriver = {true}
                useNativeDriverForBackdrop = {true}
            >
                <View style = {styles.view}>
                    <Mapcomponent latlng = {item.location[0]}/>
                </View>                
            </Modal>

            <Modal 
                isVisible = {modalVisible1}
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
                <View style = {styles.view1}>
                    <Chatcomponent userid = {item.customerId} pickupid = {item._id} setModalVisible = {setModalVisible1} convo = {convo} modalVisible = {modalVisible} />
                </View>                
            </Modal>

        </>
    );
}

export default Pickupdetailscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.white
    },
    container1:{
        backgroundColor: colors.grey9,
        elevation: 5,
        margin: 15
    },  
    container2:{
        backgroundColor: colors.grey9,
        paddingLeft: 25, 
        height: '9.5%',
    },
    text1:{
        color: colors.blue7,
        left: 40,
        bottom: 30
    },
    text2:{
        color: colors.darkBlue,
        left: 40,
        bottom: 30,
        fontWeight: 'bold'
    },
    container3:{
        margin: 15,
        padding: 10,
        paddingTop: 0,
        marginTop: 5,
    },
    text3:{
        color: colors.blue7,
        fontWeight: 'bold',
        fontSize: 15
    },
    text4:{
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginLeft: 20
    },
    text5:{
        color: colors.blue7,
        fontWeight: 'bold',
        marginBottom: 8
    },
    text6:{
        color: colors.darkBlue,
        fontWeight: 'bold',
        marginLeft: 130,
        marginTop: 5
    },
    image:{
        height: 130,
        width: 150,
        alignContent: 'center'
    },
    text7:{
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    view:{
        backgroundColor: colors.white,
        height: '30%',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        overflow: 'hidden'
    },
    view1:{
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
        marginHorizontal: 20,
    },
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    }

})
