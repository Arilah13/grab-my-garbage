import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, KeyboardAvoidingView, Dimensions, Image, Pressable } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { renderBubble, renderComposer, renderInputToolbar, renderMessage, renderSend, scrollToBottomComponent } from '../../helpers/chatScreenHelper'

import { sendMessage, receiverRead } from '../../redux/actions/conversationActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatcomponent = ({userid, setModalVisible, convo}) => {
    const dispatch = useDispatch()

    const [messages, setMessages] = useState([])

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const sendMsg = (message) => {
        dispatch(sendMessage({
            text: message[0].text,
            createdAt: message[0].createdAt,
            sender: message[0].user,
            conversationId: convo.conversation._id
        }))
        socket.emit('sendMessage', ({
            senderid: userInfo._id,
            sender: message[0].user,
            receiverid: userid._id,
            text: message[0].text,
            createdAt: message[0].createdAt,
            senderRole: 'hauler',
            receiver: userid,
            conversationId: convo.conversation._id
        }))
    }

    useEffect(() => {
        socket.on('getMessage', ({senderid, text, sender, createdAt, conversationId}) => {
            const message = [{text, user: sender, createdAt, _id: Date.now()}]

            if(senderid === userid._id) {
                onSend(message)
            }

            if(conversationId === convo.conversation._id) {
                setTimeout(() => {
                    dispatch(receiverRead(conversationId))
                }, 3000) 
            }
                
        })
    }, [socket])

    useEffect(async() => {
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
                })
            })
            setMessages(array)
        }
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <View style = {{backgroundColor: colors.white, borderTopRightRadius: 15, borderTopLeftRadius: 15, overflow: 'hidden', height: SCREEN_HEIGHT}}>
                <View style = {{height: 1*SCREEN_HEIGHT/10, flexDirection: 'row', backgroundColor: colors.white}}>
                    <Pressable onPress = {() => setModalVisible(false)}>
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
                        onSend = {messages => {
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
                        scrollToBottom = {true}
                        scrollToBottomComponent = {scrollToBottomComponent}
                        renderInputToolbar = {renderInputToolbar}
                        renderComposer = {renderComposer}
                        renderMessage = {renderMessage}
                    />
                    {
                        Platform.OS === 'android' && <KeyboardAvoidingView behavior = 'padding' keyboardVerticalOffset = {2*SCREEN_HEIGHT/10} />
                    }
                </View>
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
    }

})
