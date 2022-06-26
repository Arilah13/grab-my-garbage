import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Icon } from 'react-native-elements'
import axios from 'axios'
import Swipeout from 'react-native-swipeout'

import { colors } from '../../global/styles'
import { date1Helper } from '../../helpers/specialPickuphelper'

import { receiverRead, addCurrentConvo } from '../../redux/actions/conversationActions'
import { GET_ALL_CONVERSATIONS_SUCCESS } from '../../redux/constants/conversationConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatmenuscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [loadingId, setLoadingId] = useState([])

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation

    const messageRead = async(id) => {
        const index = await conversation.findIndex((convo) => convo.conversation._id === id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverHaulerRead === false) {
            element.conversation.receiverHaulerRead = true
            dispatch(receiverRead(id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }

    const checkLoading = (id) => {
        const load = loadingId.find(load => load === id)
        if(load) {
            return true
        } else {
            return false
        }
    }

    const handleDelete = async(id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/conversation/hauler/${id}/remove`, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.grey8}}>
            <View style = {{height: 0.6*SCREEN_HEIGHT/10}}>
                <Text style = {styles.title}>Chats</Text>
            </View>
            {
                loading === true && conversation === undefined ?
                <LottieView 
                    source = {require('../../../assets/animation/truck_loader.json')}
                    style = {{
                        width: SCREEN_WIDTH,
                        height: 9.4*SCREEN_HEIGHT/10 - 50,
                        backgroundColor: colors.grey8,
                        alignSelf: 'center'
                    }}
                    loop = {true}
                    autoPlay = {true}
                /> :
                <View style = {styles.container}>
                    <View style = {{alignItems: 'center'}}>
                        <FlatList
                            data = {conversation}
                            extraData = {conversation}
                            keyExtractor = {(item)=>item.conversation._id}
                            inverted
                            renderItem = {({item}) => (
                                item.conversation.haulerVisible === true &&
                                <Swipeout
                                    autoClose = {false}
                                    right = {[
                                        {
                                            backgroundColor: 'red',
                                            onPress: async() => {
                                                setLoadingId([...loadingId, item.conversation._id])
                                                const res = await handleDelete(item.conversation._id)
                                                if(res === true) {
                                                    loadingId.splice(loadingId.findIndex(load => load === item.conversation._id), 1)
                                                    await conversation.splice(conversation.findIndex(convo => convo.conversation._id === item.conversation._id), 1)
                                                    dispatch({
                                                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                                                        payload: conversation
                                                    })
                                                } else {
                                                    loadingId.splice(loadingId.findIndex(load => load === item.conversation._id), 1)
                                                }
                                            },
                                            component: 
                                            <View style = {{paddingVertical: 15}}>
                                                {
                                                    checkLoading(item.conversation._id) === true ?
                                                    <ActivityIndicator 
                                                        color = {colors.white} 
                                                        size = {30}
                                                    /> :
                                                    <Icon
                                                        type = 'material'
                                                        name = 'delete-outline'
                                                        color = 'white'
                                                        size = {30}
                                                    />
                                                }
                                            </View>
                                        }
                                    ]}
                                    style = {{
                                        backgroundColor: colors.grey9,
                                    }}
                                >
                                    <Pressable 
                                        style = {styles.card}
                                        onPress = {() => {
                                            messageRead(item.conversation._id)
                                            dispatch(addCurrentConvo(item.conversation.userId._id))
                                            navigation.navigate('Message', {userid: item.conversation.userId, message: item.totalMessage, id: item.conversation._id})
                                        }}
                                    >
                                        <View style = {styles.userInfo}>
                                            <View style = {styles.userImgWrapper}>
                                                <Image
                                                    source = {{uri: item.conversation.userId.image === null ? require('../../../assets/user.png') : item.conversation.userId.image }}
                                                    style = {styles.userImg}
                                                />
                                            </View>

                                            <View style = {styles.textSection}>
                                                <View style = {styles.userInfoText}>
                                                    <Text style = {styles.userName}>{item.conversation.userId.name}</Text>
                                                    <Text style = {styles.postTime}>{date1Helper(item.conversation.updatedAt)}</Text>
                                                </View>
                                                <View style = {styles.userInfoText}>
                                                    <Text style = {styles.messageText}>{item.message.text ? item.message.text : 'Photo'}</Text>
                                                    {
                                                        item.conversation.receiverHaulerRead === false &&
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
                                </Swipeout>
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
        backgroundColor: colors.grey9,
        height: 9.4*SCREEN_HEIGHT/10 - 50,
    },
    card:{
        width: '100%'
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
        alignSelf: 'center', 
        marginTop: 10, 
        fontWeight: 'bold',
        color: colors.blue2
    }

})
