import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, KeyboardAvoidingView, Dimensions, Image, Pressable } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../../global/styles'
import { renderMessage, renderBubble, renderComposer, renderInputToolbar, renderSend, scrollToBottomComponent } from '../../helpers/chatScreenHelper'

import { sendMessage, receiverRead } from '../../redux/actions/conversationActions'
import { RESET_CURRENT_CONVO } from '../../redux/constants/conversationConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatscreen = ({route, navigation}) => {
    const dispatch = useDispatch()

    const { haulerid, message, id } = route.params

    const [messages, setMessages] = useState([])

    const userDetail = useSelector((state) => state.userDetail)
    const { user } = userDetail

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const sendMsg = (message) => {
        dispatch(sendMessage({
            text: message[0].text,
            createdAt: message[0].createdAt,
            sender: message[0].user,
            conversationId: id
        }))
        
        socket.emit('sendMessage', ({
            senderid: user._id,
            sender: message[0].user,
            receiverid: haulerid._id,
            text: message[0].text,
            createdAt: message[0].createdAt,
            senderRole: 'user',
            conversationId: id
        }))
    }

    useEffect(() => {
        socket.on('getMessage', ({senderid, text, sender, createdAt, conversationId}) => {
            const message = [{text, user: sender, createdAt, _id: Date.now()}]

            if(senderid === haulerid._id) {
                onSend(message)
            }

            if(conversationId === id) {
                setTimeout(() => {
                    dispatch(receiverRead(conversationId))
                }, 3000) 
            }
        })
    }, [socket])

    useEffect(async() => {
        let array = []
        if(message.length > 0) {
            await message.slice(0).reverse().map((message) => {
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
        <SafeAreaView style = {{backgroundColor: colors.white, height: SCREEN_HEIGHT}}>
            <View style = {{height: 1*SCREEN_HEIGHT/10, flexDirection: 'row', backgroundColor: colors.white}}>
                <Pressable onPress = {() => {
                    navigation.goBack()
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
            <View style = {{backgroundColor: colors.grey9, height: 8.6*SCREEN_HEIGHT/10}}>
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
                    Platform.OS === 'android' && <KeyboardAvoidingView behavior = 'padding' keyboardVerticalOffset = {1.4*SCREEN_HEIGHT/10} />
                }
            </View>
        </SafeAreaView>
    );
}

export default Chatscreen

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
