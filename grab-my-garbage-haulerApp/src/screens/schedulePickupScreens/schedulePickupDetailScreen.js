import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'

import { colors } from '../../global/styles'
import { dayConverter, fromDate } from '../../helpers/schedulePickuphelper'

import { receiverRead } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

import Headercomponent from '../../components/headerComponent'
import Mapcomponent from '../../components/mapComponent'
import Chatcomponent from '../../components/homeScreen/chatComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Scheduledpickupdetail = ({navigation, route}) => {
    const dispatch = useDispatch()

    const { item } = route.params

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [convo, setConvo] = useState()

    const messageRead = async(userId) => {
        const index = await conversation.findIndex((convo) => convo.conversation.userId._id === userId && convo.conversation.haulerId._id === userInfo._id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverHaulerRead === false) {
            await element.totalMessage.map(msg => msg.haulerSeen = true)
            element.conversation.receiverHaulerRead = true
            element.message.haulerSeen = true
            dispatch(receiverRead(element.conversation._id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }

    useEffect(async() => {
        const convo = await conversation.find((convo) => convo.conversation.haulerId._id === userInfo._id && convo.conversation.userId._id === item.customerId._id)
        setConvo(convo)
    }, [])

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {{backgroundColor: colors.white}}
            >
                <Headercomponent name = 'Scheduled Pickup Detail' />

                <View style = {{backgroundColor: colors.white}}>
                    <Pressable style = {styles.container2} onPress = {() => setModalVisible(true)}>
                        <Icon 
                            type = 'feather'
                            name = 'map-pin'
                            color = {colors.blue2}
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
                                <Text style = {styles.text3}>Pickup Scheduled Duration:</Text>
                                <Text style = {styles.text4}>{fromDate(item.from) + ' - ' + fromDate(item.to)}</Text>
                            </View>
                            
                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>Collection Days:</Text>
                                <Text style = {styles.text4}>
                                    {
                                        item.days.map((day) => {
                                            return(
                                                dayConverter(day) + '   '
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

                    <View style = {{...styles.container1, marginTop: 0, backgroundColor: colors.green2}}>
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
                    
                    <TouchableOpacity 
                        style = {{...styles.container1,
                            justifyContent: 'center', elevation: 0, marginVertical: 10,
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
                        <Text style = {styles.text6}>Chat With Customer</Text>
                    </TouchableOpacity>
                        
                </View>
            </ScrollView>

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
                deviceHeight = {SCREEN_HEIGHT}
                deviceWidth = {SCREEN_WIDTH}
            >
                <View style = {styles.view1}>
                    <Mapcomponent latlng = {item.location[0]}/>
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
                    <Chatcomponent userid = {item.customerId} pickupid = {item._id} setModalVisible = {setModalVisible1} convo = {convo} />
                </View>                
            </Modal>

        </SafeAreaView>
    );
}

export default Scheduledpickupdetail

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.blue1,
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
        height: '30%',
        width: '100%',
        borderTopEndRadius: 15,
        borderTopStartRadius: 15,
        overflow: 'hidden',
    },
    view2:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.blue5
    }

})
