import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Icon } from 'react-native-elements'
import axios from 'axios'

import { addCurrentConvo, receiverRead } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

import { colors } from '../../global/styles'
import { date1Helper } from '../../helpers/pickupHelper'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatmenuscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation

    const messageRead = async(id) => {
        const index = await conversation.findIndex((convo) => convo.conversation._id === id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverUserRead === false) {
            element.conversation.receiverUserRead = true
            dispatch(receiverRead(id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style = {{height: 0.8*SCREEN_HEIGHT/10}}>
                <Text style = {styles.title}>Chat</Text>
            </View>
            {
                loading === true && conversation === undefined ?
                <LottieView 
                    source = {require('../../../assets/animation/truck_loader.json')}
                    style = {{
                        width: SCREEN_WIDTH,
                        height: 9.2*SCREEN_HEIGHT/10 - 50,
                        backgroundColor: colors.white,
                        alignSelf: 'center'
                    }}
                    loop = {true}
                    autoPlay = {true}
                /> :
                <View style = {styles.container}>
                    <View style = {{alignItems: 'center'}}>
                        <FlatList
                            data = {conversation}
                            keyExtractor = {(item)=>item.conversation._id}
                            renderItem = {({item}) => (
                                <Pressable 
                                    style = {styles.card}
                                    onPress = {() => {
                                        messageRead(item.conversation._id)
                                        dispatch(addCurrentConvo(item.conversation.haulerId._id))
                                        navigation.navigate('Message', {haulerid: item.conversation.haulerId, message: item.totalMessage, id: item.conversation._id})
                                    }}
                                >
                                    <View style = {styles.userInfo}>
                                        <View style = {styles.userImgWrapper}>
                                            <Image
                                                source = {{uri: item.conversation.haulerId.image === null ? require('../../../assets/user.png') : item.conversation.haulerId.image }}
                                                style = {styles.userImg}
                                            />
                                        </View>

                                        <View style = {styles.textSection}>
                                            <View style = {styles.userInfoText}>
                                                <Text style = {styles.userName}>{item.conversation.haulerId.name}</Text>
                                                <Text style = {styles.postTime}>{date1Helper(item.conversation.updatedAt)}</Text>
                                            </View>
                                            <View style = {styles.userInfoText}>
                                                <Text style = {styles.messageText}>{item.message.text}</Text>
                                                {
                                                    item.conversation.receiverUserRead === false &&
                                                        <Icon
                                                            type = 'material-community'
                                                            name = 'circle-medium'
                                                            color = 'red'
                                                            size = {26}
                                                            style = {{
                                                                marginRight: 5,
                                                                marginBottom: -10
                                                            }}
                                                        />
                                                    
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            }
        </SafeAreaView>
    );
}

export default Chatmenuscreen

const styles = StyleSheet.create({

    container:{
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: colors.white,
        height: 9.2*SCREEN_HEIGHT/10 - 50,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15
    },
    card:{
        width: '100%',
    },
    userInfo:{
        flexDirection: 'row',    
        justifyContent: 'space-between',
    },
    userImgWrapper:{
        paddingTop: 15,
        paddingBottom: 15
    },
    userImg:{
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textSection:{
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        paddingLeft: 0,
        marginLeft: 10,
        width: 300,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    userInfoText:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    userName:{
        fontSize: 14,
        fontWeight: 'bold',
    },
    postTime: {
        fontSize: 12,
        color: '#666',
    },
    messageText: {
        fontSize: 14,
        color: '#333333'
    },
    title:{
        fontSize: 18, 
        marginBottom: 15, 
        alignSelf: 'center', 
        marginTop: 10, 
        fontWeight: 'bold',
        color: colors.blue4
    }

})
