import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'

import { colors } from '../../global/styles'
import { dayConverter } from '../../helpers/schedulePickuphelper'

import Headercomponent from '../../components/headerComponent'
import Mapcomponent from '../../components/mapComponent'
import Chatcomponent from '../../components/homeScreen/chatComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Scheduledpickupdetail = ({navigation, route}) => {
    const { item, from, to } = route.params

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [convo, setConvo] = useState()

    useEffect(async() => {
        const convo = await conversation.find((convo) => convo.conversation.haulerId._id === userInfo._id && convo.conversation.userId._id === item.customerId._id)
        setConvo(convo)
    }, [])

    return (
        <SafeAreaView>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {styles.container}
            >
                <Headercomponent name = 'Scheduled Pickups' />

                <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.grey8, borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                    <Pressable style = {styles.container2} onPress = {() => setModalVisible(true)}>
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
                            <Text style = {styles.text3}>Pickup Scheduled Duration:</Text>
                            <Text style = {styles.text4}>{from + ' - ' + to}</Text>
                        </View>
                        <View style = {{...styles.container5, paddingTop: 0}}>
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
                        <View style = {{...styles.container5, paddingBottom: 0, paddingTop: 0}}>
                            <Text style = {styles.text5}>Time Slot:</Text>
                            <Text style = {styles.text4}>{item.timeslot}</Text>
                        </View>
                        <View style = {{...styles.container5, paddingBottom: 0}}>
                            <Text style = {styles.text3}>Payment:</Text>
                            <Text style = {styles.text4}>Rs. {item.payment}</Text>
                        </View>
                        <View style = {styles.container5}>
                            <Text style = {styles.text3}>Payment Method:</Text>
                            <Text style = {styles.text4}>{item.paymentMethod}</Text>
                        </View>

                        <View style = {{...styles.container5, paddingTop: 0}}>
                            <Text style = {styles.text3}>Customer Name:</Text>
                            <Text style = {styles.text4}>{item.customerId.name}</Text>
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
                            <Text style = {styles.text7}>Chat With Customer</Text>
                        </TouchableOpacity>
                        
                    </View>
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

})
