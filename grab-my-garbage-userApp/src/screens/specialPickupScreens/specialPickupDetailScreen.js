import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import axios from 'axios'

import { colors } from '../../global/styles'
import { dateHelper, date1Helper, timeHelper } from '../../helpers/pickupHelper'

import { PENDING_PICKUP_RETRIEVE_SUCCESS } from '../../redux/constants/specialPickupConstants'
import { receiverRead } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

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
    const [convo, setConvo] = useState()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const retrievePendingPickups = useSelector(state => state.retrievePendingPickups)
    const { pickupInfo } = retrievePendingPickups

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

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
            await pickupInfo.splice(pickupInfo.findIndex(pickup => pickup._id === id), 1)
            dispatch({
                type: PENDING_PICKUP_RETRIEVE_SUCCESS,
                payload: pickupInfo
            })
            setLoading(false)
            navigation.navigate('pendingPickup')
        }  
    }

    const messageRead = async(haulerId) => {
        const index = await conversation.findIndex((convo) => convo.conversation.haulerId._id === haulerId && convo.conversation.userId._id === userInfo._id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverUserRead === false) {
            element.conversation.receiverUserRead = true
            dispatch(receiverRead(element.conversation._id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }

    useEffect(() => {
        if(item.active === 1) {
            setDisable(true)
        } else if(item.active === 0) {
            setDisable(false)
        }
    }, [])

    useEffect(async() => {
        if(name === 'Accepted Pickups') {
            const convo = await conversation.find((convo) => convo.conversation.haulerId._id === item.pickerId._id && convo.conversation.userId._id === userInfo._id)
            setConvo(convo)
        }
    }, [])

    return (
        <SafeAreaView style = {{flex: 1}}>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {{backgroundColor: colors.white}}
            >
                <Headercomponent name = {name} />    

                <View style = {{backgroundColor: colors.white}}>
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
                                <Text style = {styles.text4}>{date1Helper(item.datetime) + ' ' + timeHelper(item.datetime)}</Text>
                            </View>
                        

                            <View style = {{flexDirection: 'row', marginTop: 10}}>
                                <Text style = {styles.text3}>{name === 'Completed Pickups' ? 'Pickup Collected On:' : 'Collect Pickup Before:'}</Text>
                                <Text style = {styles.text4}>{name === 'Completed Pickups' ? dateHelper(item.datetime)+' '+completedTime : dateHelper(item.datetime)+' '+timeHelper(item.datetime)}</Text>
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

                    {
                        name === 'Accepted Pickups' &&
                        <>
                        <TouchableOpacity 
                            style = {{...styles.container1,
                                justifyContent: 'center', elevation: 0, marginVertical: 10,
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
                            <Text style = {styles.text7}>Chat With Hauler</Text>
                        </TouchableOpacity>
                        </>
                    }

                    {
                        item.accepted === 0 && item.completed === 0 &&
                        <View style = {{alignSelf: 'center', flexDirection: 'row', marginTop: 5}}>
                            <Button
                                title = 'Cancel'
                                buttonStyle = {styles.button}
                                loading = {loading}
                                disabled = {loading || disable}
                                onPress = {() => handleCancel(item._id)}
                            />
                        </View>
                    }

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
                            <Mapcomponent location = {item.location[0]} item = {item} setModalVisible = {setModalVisible} type = 'special' navigation = {navigation} convo = {convo} />
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
                            <Chatcomponent haulerid = {item.pickerId} pickupid = {item._id} setModalVisible = {setModalVisible1} convo = {convo}/>
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
        backgroundColor: colors.white,
    },
    container1:{
        backgroundColor: colors.grey9,
        elevation: 5,
        margin: 15
    },  
    container2:{
        backgroundColor: colors.grey9,
        paddingLeft: 25, 
        height: '11%',
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
        height: 150,
        width: 180,
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
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    }

})
