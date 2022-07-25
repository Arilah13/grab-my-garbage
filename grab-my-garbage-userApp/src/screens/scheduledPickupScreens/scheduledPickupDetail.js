import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import axios from 'axios'

import { colors } from '../../global/styles'
import { dayConverter } from '../../helpers/schedulepickupHelper'

import { SCHEDULED_PICKUP_RETRIEVE_SUCCESS } from '../../redux/constants/scheduledPickupConstants'
import { receiverRead } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

import Headercomponent from '../../components/headerComponent'
import Mapcomponent from '../../components/pickupComponent/mapComponent'
import Chatcomponent from '../../components/pickupComponent/chatComponent'
import CompletedPickupsComponent from '../../components/completedPickupsComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Scheduledpickupdetail = ({navigation, route}) => {
    const dispatch = useDispatch()

    const { item, from, to } = route.params

    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [modalVisible2, setModalVisible2] = useState(false)
    const [active, setActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [disable, setDisable] = useState(false)
    const [convo, setConvo] = useState()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const retrieveScheduledPickup = useSelector(state => state.retrieveScheduledPickup)
    const { pickupInfo } = retrieveScheduledPickup

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        },
    }

    const handleActive = async(id) => {
        if(active === true) {
            setLoading(true)
            const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/inactive/${id}`, config)
            if(res.status === 200) {
                const pickup = await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
                pickup[0].inactive = 1
                pickupInfo.push(pickup[0])
                dispatch({
                    type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                    payload: pickupInfo
                })
                setActive(false)
                setLoading(false)
            }
        } else if(active === false) {
            setLoading(true)
            const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/active/${id}`, config)
            if(res.status === 200) {
                const pickup = await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
                pickup[0].inactive = 0
                pickupInfo.push(pickup[0])
                dispatch({
                    type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                    payload: pickupInfo
                })
                setActive(true)
                setLoading(false)
            }
        }
    }

    const handleCancel = async(id) => {
        setLoadingCancel(true)
        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/${id}`, config)
        if(res.status === 200) {
            await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
            dispatch({
                type: SCHEDULED_PICKUP_RETRIEVE_SUCCESS,
                payload: pickupInfo
            })
            setLoadingCancel(false)
            navigation.navigate('ScheduleRequests')
        }
    }

    const messageRead = async(haulerId) => {
        const index = await conversation.findIndex((convo) => convo.conversation.haulerId._id === haulerId && convo.conversation.userId._id === userInfo._id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverUserRead === false) {
            await element.totalMessage.map(msg => msg.userSeen = true)
            element.conversation.receiverUserRead = true
            element.message.userSeen = true
            dispatch(receiverRead(element.conversation._id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }
    
    useEffect(() => {
        if(item.inactive === 0) {
            setActive(true)
        } else if(item.inactive === 1) {
            setActive(false)
        }

        if(item.active === 1) {
            setDisable(true)
        } else if(item.active === 0) {
            setDisable(false)
        }
    }, [])

    useEffect(() => {
        socket.on('schedulePickupDone', async({pickupid}) => {
            if(pickupid === item._id) {
                setDisable(false)
            }
        })

        socket.on('userSchedulePickup', async({pickupid}) => {
            if(pickupid === item._id) {
                setDisable(true)
            }
        })
    }, [socket])

    useEffect(async() => {
        const convo = await conversation.find((convo) => convo.conversation.haulerId._id === item.pickerId._id && convo.conversation.userId._id === userInfo._id)
        setConvo(convo)
        console.log(item)
    }, [])

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {{backgroundColor: colors.white}}
            >
                <Headercomponent name = 'Schedule Pickup Detail' destination = 'ScheduleRequests' />

                <View style = {{backgroundColor: colors.white}}>
                    <Pressable style = {styles.container2} onPress = {() => setModalVisible(true)}>
                        <Icon 
                            type = 'feather'
                            name = 'map-pin'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                marginTop: 26,
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
                                color = {colors.blue5}
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
                                <Text style = {styles.text3}>Scheduled Duration:</Text>
                                <Text style = {styles.text4}>{from + ' - ' + to}</Text>
                            </View>

                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>Collection Days:</Text>
                                <Text style = {{...styles.text4, marginLeft: 10}}>
                                    {
                                        item.days.map((day, index) => {
                                            return(
                                                dayConverter(day) + ', '
                                            )
                                        })
                                    }
                                </Text>
                            </View>

                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text5}>Time Slot:</Text>
                                <Text style = {styles.text4}>{item.timeslot}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style = {{...styles.container1, backgroundColor: colors.grey8}}>
                        <View style = {{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
                            <Icon
                                type = 'material'
                                name = 'attach-money'
                                size = {18}
                                color = {colors.blue5}
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
                    
                    <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity 
                            style = {{...styles.container1,
                                elevation: 0, marginVertical: 10,
                                flexDirection: 'row', backgroundColor: colors.white
                            }}
                            onPress = {() => {
                                messageRead(item.pickerId._id)
                                setModalVisible1(true)
                            }}
                        >
                            <Icon
                                type = 'material'
                                name = 'chat'
                                color = {colors.darkBlue}
                                size = {27}
                            />    
                            <Text style = {styles.text6}>Chat With Hauler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style = {{...styles.container1, 
                                elevation: 0, marginVertical: 10,
                                flexDirection: 'row', backgroundColor: colors.white
                            }}
                            onPress = {() => setModalVisible2(true)}
                        >
                            <Icon
                                type = 'material'
                                name = 'airport-shuttle'
                                color = {colors.darkBlue}
                                size = {27}
                            />    
                            <Text style = {styles.text6}>Completed Pickups</Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {{alignSelf: 'center', flexDirection: 'row', marginTop: 10}}>
                        <Button
                            title = {active ? 'Inactive' : 'Active'}
                            buttonStyle = {{...styles.button, backgroundColor: active ? colors.darkBlue : colors.darkGrey}}
                            loading = {loading}
                            disabled = {loading || disable}
                            onPress = {() => handleActive(item._id)}
                        />

                        <Button
                            title = 'Cancel'
                            buttonStyle = {styles.button}
                            loading = {loadingCancel}
                            disabled = {loadingCancel || disable}
                            onPress = {() => handleCancel(item._id)}
                        />
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
                            <Mapcomponent 
                                location = {item.location[0]} 
                                item = {item} 
                                setModalVisible = {setModalVisible} 
                                type = 'schedule' 
                                navigation = {navigation} 
                                modalVisible = {modalVisible}
                                convo = {convo}
                            />
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
                            <Chatcomponent 
                                haulerid = {item.pickerId} 
                                pickupid = {item._id} 
                                setModalVisible = {setModalVisible1} 
                                convo = {convo} 
                            />
                        </View>                
                    </Modal>

                    <Modal 
                        isVisible = {modalVisible2}
                        swipeDirection = {'down'}
                        style = {{ justifyContent: 'center', margin: 10 }}
                        onBackButtonPress = {() => setModalVisible2(false)}
                        onBackdropPress = {() => setModalVisible2(false)}
                        animationIn = 'zoomIn'
                        animationOut = 'zoomOut'
                        animationInTiming = {500}
                        animationOutTiming = {500}
                        useNativeDriver = {true}
                        useNativeDriverForBackdrop = {true}
                        deviceHeight = {SCREEN_HEIGHT}
                        deviceWidth = {SCREEN_WIDTH}
                    >
                        <View style = {{...styles.view2, height: '35%'}}>
                            <CompletedPickupsComponent item = {item} setModalVisible2 = {setModalVisible2} />
                        </View>                
                    </Modal>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Scheduledpickupdetail

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.blue1
    },
    container1:{
        backgroundColor: colors.grey9,
        elevation: 5,
        margin: 15,
        borderRadius: 15
    },  
    container2:{
        backgroundColor: colors.grey9,
        paddingLeft: 25, 
        height: '16%',
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
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.blue5
    }

})
