import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, KeyboardAvoidingView, Dimensions, Image, Pressable } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { renderMessage, renderBubble, renderComposer, renderInputToolbar, renderSend, scrollToBottomComponent } from '../../helpers/chatScreenHelper'

import { sendMessage, receiverRead, addCurrentConvo } from '../../redux/actions/conversationActions'
import { RESET_CURRENT_CONVO, GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatcomponent = ({haulerid, setModalVisible, convo}) => {
    const dispatch = useDispatch()

    const [messages, setMessages] = useState([])

    const userDetail = useSelector((state) => state.userDetail)
    const { user } = userDetail

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { conversation } = getAllConversation

    const sendMsg = async(message) => {
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
            text: message[0].text
        }
        await conv.totalMessage.splice(conv.totalMessage.length, 0, element)
        conv.message = element
        await conversation.splice(0, 0, conv)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
        dispatch(sendMessage({
            text: message[0].text,
            createdAt: message[0].createdAt,
            sender: message[0].user,
            conversationId: convo.conversation._id
        }))
        socket.emit('sendMessage', ({
            senderid: user._id,
            sender: message[0].user,
            receiverid: haulerid._id,
            text: message[0].text,
            createdAt: message[0].createdAt,
            senderRole: 'user',
            receiver: haulerid,
            conversationId: convo.conversation._id
        }))
    }

    useEffect(() => {
        socket.on('getMessage', async({senderid, text, sender, createdAt, conversationId}) => {
            const message = [{text, user: sender, createdAt, _id: Date.now()}]
            if(senderid === haulerid._id) {
                onSend(message)
                dispatch(receiverRead(conversationId))
            }       
        }) 
    }, [socket])

    useEffect(async() => {
        dispatch(addCurrentConvo(haulerid._id))
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
        <View style = {{backgroundColor: colors.white, borderTopRightRadius: 15, borderTopLeftRadius: 15, overflow: 'hidden'}}>
            <View style = {{height: 1*SCREEN_HEIGHT/10, flexDirection: 'row', backgroundColor: colors.white}}>
                <Pressable onPress = {() => {
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
                    source = {{uri: haulerid.image}}
                    style = {styles.image}
                />
                <Text style = {styles.text}>{haulerid.name}</Text>
            </View>
            <View style = {{backgroundColor: colors.grey9, height: 8*SCREEN_HEIGHT/10, paddingBottom: 10}}>
                <GiftedChat
                    messages = {messages}
                    onSend = {messages => {
                        onSend(messages)
                        sendMsg(messages)
                    }}
                    user = {{
                        _id: user._id,
                        name: user.name,
                        avatar: user.image
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
