import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import * as Linking from 'expo-linking'
import Modal from 'react-native-modal'

import { colors } from '../../global/styles'

import Chatcomponent from './chatComponent'

import { receiverRead } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Onpickupcomponent = ({handlePickupComplete, order, arrived}) => {
    const dispatch = useDispatch()

    const [modalVisible, setModalVisible] = useState(false)
    const [convo, setConvo] = useState()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

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
        const convo = await conversation.find((convo) => convo.conversation.haulerId._id === userInfo._id && convo.conversation.userId._id === order.customerId._id)
        setConvo(convo)
    }, [])

    return (
        <>
        <View style = {{flexWrap: 'wrap', flexDirection: 'row'}}>
            <View>
                <Image
                    source = {{uri: order.customerId.image}} 
                    style = {styles.image}
                />
            </View>

            <View>
                <Text style = {styles.text2}>{order.customerId.name}</Text>
            </View>
        </View>

        <View style = {{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
            <TouchableOpacity 
                style = {{
                    flexDirection: 'row', 
                }}
                onPress = {() => Linking.openURL(`tel:${order.customerId.phone}`)}
            >
                <Icon
                    type = 'material'
                    name = 'call'
                    color = {colors.darkBlue}
                    size = {22}
                />
                <Text style = {styles.text3}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {{
                    flexDirection: 'row', 
                }}
                onPress = {() => {
                    messageRead(order.customerId._id)
                    setModalVisible(true)
                }}
            >
                <Icon
                    type = 'material'
                    name = 'chat'
                    color = {colors.darkBlue}
                    size = {22}
                />    
                <Text style = {styles.text3}>Chat</Text>
            </TouchableOpacity>
        </View>

        <View style = {{marginTop: 10, padding: 25, paddingVertical: 0}}>
            <Button 
                title = { arrived === false ? 'Arrived' : 'Completed' }
                buttonStyle = {{
                    width: SCREEN_WIDTH/1.2,
                    borderRadius: 5,
                    height: 45,
                    backgroundColor: colors.darkBlue
                }}
                onPress = {() => handlePickupComplete()}
            />
        </View> 

        <Modal
            isVisible = {modalVisible}
            swipeDirection = {'down'}
            style = {{ justifyContent: 'flex-end', marginHorizontal: 10, marginBottom: 0 }}
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
                <Chatcomponent userid = {order.customerId} pickupid = {order._id} setModalVisible = {setModalVisible} convo = {convo} />
            </View>  
        </Modal>
        </>
    );
}

export default Onpickupcomponent

const styles = StyleSheet.create({

    image:{
        height: 60,
        width: 60,
        borderRadius: 50,
        marginTop: 10,
        marginLeft: 30,
        borderColor: colors.darkBlue,
        borderWidth: 2
    },
    text2:{
        marginLeft: 20,
        marginTop: 25,
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    text3:{
        marginLeft: 15,
        fontWeight: 'bold',
        color: colors.darkBlue,
        fontSize: 13
    },
    view1:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: 'hidden',
    },


})
