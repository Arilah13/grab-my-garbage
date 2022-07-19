import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
    View, Text, StyleSheet, 
    KeyboardAvoidingView, Dimensions, 
    Image, Pressable, ActivityIndicator,
    TouchableOpacity 
} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import NetInfo from '@react-native-community/netinfo'

import { colors } from '../../global/styles'
import { renderBubble, renderComposer, renderInputToolbar, renderMessage, renderSend, scrollToBottomComponent } from '../../helpers/chatScreenHelper'

import { sendMessage, receiverRead, addCurrentConvo } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS, RESET_CURRENT_CONVO } from '../../redux/constants/conversationConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatcomponent = ({userid, setModalVisible, convo}) => {
    const dispatch = useDispatch()

    const [messages, setMessages] = useState([])

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const testConnection = async() => {
        const status = NetInfo.fetch()
        return status
    }

    const sendMsg = useCallback(async(message) => {
        const status = await testConnection()
        const conv = await conversation.splice(conversation.findIndex(conv => conv.conversation._id === convo.conversation._id), 1)[0]
        const element = {
            _id: Date.now(),
            conversationId: convo.conversation._id,
            createdAt: message[0].createdAt,
            created: message[0].createdAt,
            sender: [
                message[0].user._id,
                message[0].user.name,
                message[0].user.avatar
            ],
            text: message[0].text && message[0].text,
            image: message[0].image && message[0].image,
            pending: status.isConnected === true ? false : true,
            sent: status.isConnected === true ? true : false,
            received: false,
            userSeen: false,
            haulerSeen: true
        }
        await conv.totalMessage.splice(conv.totalMessage.length, 0, element)
        conv.message = element
        await conversation.splice(0, 0, conv)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })

        dispatch(sendMessage({
            text: message[0].text && message[0].text,
            createdAt: message[0].createdAt,
            sender: message[0].user,
            conversationId: convo.conversation._id,
            image: message[0].image && message[0].image,
            pending: status.isConnected === true ? false : true,
            sent: status.isConnected === true ? true : false,
            received: false,
            userSeen: false,
            haulerSeen: true
        }))
        socket.emit('sendMessage', ({
            senderid: userInfo._id,
            sender: message[0].user,
            receiverid: userid._id,
            text: message[0].text && message[0].text,
            image: message[0].image && message[0].image,
            createdAt: message[0].createdAt,
            senderRole: 'hauler',
            receiver: userid,
            conversationId: convo.conversation._id
        }))
    }, [conversation])

    const selectGallery = async() => {
        const state = await testConnection()
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          setModalVisible(false)
        }else{
            let image = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,5],
                quality: 1,
                base64: true
            })
            setModalVisible(false)
            if(!image.cancelled) {
                const msg = [{
                    _id: new Date(),
                    createdAt: new Date(),
                    image: image.base64,
                    user: {
                        _id: userInfo._id,
                        avatar: userInfo.image,
                        name: userInfo.name
                    },
                    pending: state.isConnected === true ? false : true,
                    sent: state.isConnected === true ? true : false,
                    received: false,
                    userSeen: false,
                    haulerSeen: true
                }]
                const msg1 = [{
                    _id: new Date(),
                    createdAt: new Date(),
                    image: 'data:image/png;base64,' + image.base64,
                    user: {
                        _id: userInfo._id,
                        avatar: userInfo.image,
                        name: userInfo.name
                    },
                    pending: state.isConnected === true ? false : true,
                    sent: state.isConnected === true ? true : false,
                    received: false,
                    userSeen: false,
                    haulerSeen: true
                }]
                onSend(undefined, msg1)
                sendMsg(msg)
            }
        }
    }

    const selectCamera = async() => {
        const state = await testConnection()
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          setModalVisible(false)
        }else{
            let image = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,5],
                quality: 1,
                base64: true
            })
            setModalVisible(false)
            if(!image.cancelled) {
                const msg = [{
                    _id: new Date(),
                    createdAt: new Date(),
                    image: image.base64,
                    user: {
                        _id: userInfo._id,
                        avatar: userInfo.image,
                        name: userInfo.name
                    },
                    pending: state.isConnected === true ? false : true,
                    sent: state.isConnected === true ? true : false,
                    received: false,
                    userSeen: false,
                    haulerSeen: true
                }]
                const msg1 = [{
                    _id: new Date(),
                    createdAt: new Date(),
                    image: 'data:image/png;base64,' + image.base64,
                    user: {
                        _id: userInfo._id,
                        avatar: userInfo.image,
                        name: userInfo.name
                    },
                    pending: state.isConnected === true ? false : true,
                    sent: state.isConnected === true ? true : false,
                    received: false,
                    userSeen: false,
                    haulerSeen: true
                }]
                onSend(undefined, msg1)
                sendMsg(msg)
            }
        }
    }

    useEffect(() => {
        socket.on('getMessage', ({senderid, text, sender, createdAt, conversationId, image, sender: userid}) => {
            if(senderid === userid._id) {
                if(text) {
                    const message = [{text, user: sender, createdAt, _id: Date.now()}]
                    onSend(message)
                }
                if(image && image !== 'data:image/png;base64,undefined') {
                    const message = [{image, user: sender, createdAt, _id: Date.now()}]
                    onSend(undefined, message)
                }
                dispatch(receiverRead(conversationId))
                socket.emit('messageSeen', {id: conversationId, receiverRole: 'hauler', receiverId: sender._id})
            }
        })
    }, [socket])

    useEffect(() => {
        if(messages.length > 0) {
            socket.on('messageReceived', ({conversationId}) => {
                if(conversationId === convo.conversation._id) {
                    messages.map(msg => msg.received = true)
                    setMessages(messages)
                }     
            })
            socket.on('messageSeen', ({conversationId}) => {
                if(conversationId === convo.conversation._id) {
                    messages.map(msg => msg.userSeen = true)
                    setMessages(messages)
                }
            })
        }
    }, [socket, messages])

    useEffect(async() => {
        dispatch(addCurrentConvo(userid._id))
        if(convo.conversation.receiverHaulerRead === false) {
            socket.emit('messageSeen', {id: convo.conversation._id, receiverRole: 'hauler', receiverId: userid._id})
        }
        socket.emit('currentMsg', {userId: userInfo._id, conversationId: convo.conversation._id, senderRole: 'hauler'})
        let array = []
        if(convo.totalMessage.length > 0) {
            await convo.totalMessage.slice(0).reverse().map((message) => {
                array.push({
                    _id: message._id,
                    text: message.text,
                    createdAt: message.createdAt,
                    user: {
                        _id: message.sender[0],
                        name: message.sender[1],
                        avatar: message.sender[2]
                    },
                    pending: message.pending,
                    userSeen: message.userSeen,
                    haulerSeen: message.haulerSeen,
                    received: message.received,
                    sent: message.sent
                })
            })
            setMessages(array)
        }
    }, [])

    const onSend = useCallback((messages = [], image) => {
        if(image) {
            setMessages(previousMessages => GiftedChat.append(previousMessages, image))
        } 
        if(messages.length > 0) {
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        }
    }, [])

    return (
        <View style = {{backgroundColor: colors.white, borderTopRightRadius: 15, borderTopLeftRadius: 15, overflow: 'hidden', height: SCREEN_HEIGHT}}>
            <View style = {{height: 1*SCREEN_HEIGHT/10, flexDirection: 'row', backgroundColor: colors.white}}>
                <Pressable onPress = {() => {
                    socket.emit('removeCurrentMsg', {userId: userInfo._id, senderRole: 'hauler'})
                    setModalVisible(false)
                    dispatch({
                        type: RESET_CURRENT_CONVO
                    })
                }}>
                    <Icon 
                        type = 'font-awesome-5'
                        name = 'angle-left'
                        size = {32}
                        color = {colors.darkBlue}
                        style = {{
                            marginLeft: 15,
                            marginTop: 17,
                            marginRight: 45
                        }}
                    />
                </Pressable>
                <Image 
                    source = {{uri: userid.image}}
                    style = {styles.image}
                />
                <Text style = {styles.text}>{userid.name}</Text>
            </View>
            <View style = {{backgroundColor: colors.grey9, height: 8*SCREEN_HEIGHT/10, paddingBottom: 10}}>
                <GiftedChat
                    messages = {messages}
                    onSend = {async(messages) => {
                        const status = await testConnection()
                        messages[0].pending = status.isConnected === true ? false : true
                        messages[0].sent = status.isConnected === true ? true : false
                        messages[0].received = false
                        messages[0].userSeen = false
                        messages[0].haulerSeen = true
                        onSend(messages)
                        sendMsg(messages)
                    }}
                    user = {{
                        _id: userInfo._id,
                        name: userInfo.name,
                        avatar: userInfo.image
                    }}
                    renderBubble = {renderBubble}
                    alwaysShowSend = {true}
                    renderSend = {renderSend}
                    renderLoading = {() => <ActivityIndicator />}
                    scrollToBottom = {true}
                    scrollToBottomComponent = {scrollToBottomComponent}
                    renderInputToolbar = {renderInputToolbar}
                    renderComposer = {renderComposer}
                    renderMessage = {renderMessage}
                    renderActions = {() => (
                        <Pressable onPress = {() => setModalVisible(true)}>
                            <Icon
                                type = 'material'
                                name = 'photo-camera'
                                color = {colors.darkBlue}
                                size = {26}
                                style = {{
                                    marginLeft: 5,
                                    marginBottom: 7
                                }}
                            />
                        </Pressable>
                    )}
                />
                {
                    Platform.OS === 'android' && <KeyboardAvoidingView behavior = 'padding' keyboardVerticalOffset = {2*SCREEN_HEIGHT/10} />
                }
            </View>

            <Modal 
                isVisible = {modalVisible}
                swipeDirection = {'down'}
                style = {{ justifyContent: 'flex-end', margin: 0 }}
                onBackButtonPress = {() => setModalVisible(false)}
                onBackdropPress = {() => setModalVisible(false)}
                useNativeDriver = {true}
                useNativeDriverForBackdrop = {true}
            >
                <View style = {styles.view1}>
                    <Text style = {styles.text2}>Choose from</Text>
                    <TouchableOpacity onPress = {() => selectGallery()}>
                        <Icon
                            type = 'material'
                            name = 'collections'
                            color = {colors.blue5}
                            size = {20}
                            style = {{
                                alignSelf: 'flex-start',
                                marginTop: '6%',
                                marginLeft: '8%',
                            }}
                        />
                        <Text style = {{...styles.button, color: colors.blue5, position: 'absolute'}}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => selectCamera()}>
                        <Icon
                            type = 'material'
                            name = 'photo-camera'
                            color = {colors.blue5}
                            size = {20}
                            style = {{
                                alignSelf: 'flex-start',
                                marginTop: '6%',
                                marginLeft: '8%',
                            }}
                        />
                        <Text style = {{...styles.button, color: colors.blue5, position: 'absolute'}}>Camera</Text>
                    </TouchableOpacity>
                </View>                
            </Modal>
        </View>
    );
}

export default Chatcomponent

const styles = StyleSheet.create({

    text:{
        marginTop: 22,
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.darkBlue
    },
    image:{
        height: 40,
        width: 40,
        marginHorizontal: 20,
        marginVertical: 14,
        borderColor: colors.blue2,
        borderWidth: 1,
        borderRadius: 50,
    },
    view1:{
        backgroundColor: colors.white,
        height: '25%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    text2:{
        marginTop: '8%',
        marginLeft: '8%',
        fontWeight: 'bold',
        color: colors.blue2,
        fontSize: 15
    },
    button:{
        marginTop: '6%',
        marginLeft: '18%',
    }

})
