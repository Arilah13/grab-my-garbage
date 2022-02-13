import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, StyleSheet, KeyboardAvoidingView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GiftedChat, Bubble, Send, InputToolbar, Composer, Message } from 'react-native-gifted-chat'
import { Icon } from 'react-native-elements'

import Headercomponent from '../../components/PickupHeaderComponent'
import { colors } from '../../global/styles'
import { getConversation, sendMessage, getMessage } from '../../redux/actions/conversationActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Pickupchatscreen = ({route, navigation}) => {

    const dispatch = useDispatch()

    const { name, haulerid } = route.params

    const [messages, setMessages] = useState([])

    const userDetail = useSelector((state) => state.userDetail)
    const { user } = userDetail

    const conversations = useSelector((state) => state.getConversation)
    const { loading, conversation } = conversations

    const Messages = useSelector((state) => state.getMessage)
    const { loading: messageLoading,  message } = Messages

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle = {{
                    right: {
                        backgroundColor: colors.darkBlue
                    },
                    left: {
                        backgroundColor: colors.white,
                    }
                }}
                textStyle = {{
                    right: {
                        color: colors.white
                    }
                }}
            />
        );
    }

    const renderSend = (props) => {
        return(
            <Send {...props}>
                <View>
                    <Icon 
                        type = 'material-community'
                        name = 'send-circle'
                        size = {32}
                        color = {colors.darkBlue}
                        style = {{
                            marginRight: 5,
                            marginBottom: 7
                        }}
                    />
                </View>
            </Send>
        );
    }

    const scrollToBottomComponent = () => {
        return(
            <Icon
                type = 'font-awesome'
                name = 'angle-double-down'
                size = {22}
                color = {colors.darkBlue}
            />
        )
    }

    const renderInputToolbar = (props) => {
        return(
            <InputToolbar
                {...props}
                containerStyle = {{
                    borderRadius: 15,
                    height: 45
                }}
            />
        )
    }

    const renderComposer = (props) => {
        return(
            <Composer 
                {...props}
                placeholderTextColor = {colors.blue2}
            />
        )
    }

    const renderMessage = (props) => {
        return(
            <Message 
                {...props}
                renderAvatar = {() => null}
            />
        )
    }

    const sendMsg = (message) => {
        dispatch(sendMessage({
            text: message[0].text,
            createdAt: message[0].createdAt,
            sender: message[0].user,
            conversationId: conversation[0]._id
        }))
    }

    useEffect(() => {
        dispatch(getConversation({receiverid: haulerid._id, senderid: user._id}))
    }, [])

    useEffect(() => {
        if(loading === false) {
            dispatch(getMessage({ conversationId: conversation[0]._id }))
        }
    }, [conversation])

    useEffect(() => {
        if(messageLoading === false) {
            if(message.length > 0) {
                message.map((message) => {
                    setMessages([
                        {
                        _id: message._id,
                        text: message.text,
                        createdAt: message.createdAt,
                        user: {
                            _id: message.sender[0],
                            name: message.sender[1],
                            avatar: message.sender[2]
                        },
                        },
                    ])
                })
            }
        }
    }, [message])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1, height: SCREEN_HEIGHT/1.25, paddingBottom: 30}}>
            <Headercomponent name = {name} />
        
            <GiftedChat
                messages = {messages}
                onSend = {messages => {
                    onSend(messages)
                    sendMsg(messages)
                }}
                user={{
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
                Platform.OS === 'android' && <KeyboardAvoidingView behavior = 'padding' keyboardVerticalOffset = {155} />
            }
        </SafeAreaView>
    );
}

export default Pickupchatscreen

const styles = StyleSheet.create({



})
