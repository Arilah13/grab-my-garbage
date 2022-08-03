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
    const [rowIndex, setRowIndex] = useState()

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const messageRead = async(id) => {
        const index = await conversation.findIndex((convo) => convo.conversation._id === id)
        
        const element = await conversation.splice(index, 1)[0]
        
        if(element.conversation.receiverHaulerRead === false) {
            await element.totalMessage.map(msg => msg.haulerSeen = true)
            element.conversation.receiverHaulerRead = true
            dispatch(receiverRead(id))
        }
        
        await conversation.splice(index, 0, element)
        dispatch({
            type: GET_ALL_CONVERSATIONS_SUCCESS,
            payload: conversation
        })
    }

    const checkUnRead = (item) => {
        const data = item.filter(item => item.haulerSeen === false)
        return data.length
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
        <SafeAreaView style = {{backgroundColor: colors.grey9}}>
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
                            keyExtractor = {(item)=>item.conversation._id}
                            ListEmptyComponent = {() => <Text style = {styles.text2}>No Chat Available</Text>}
                            renderItem = {({item, index}) => (
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
                                                    setLoadingId(loadingId.filter(load => load !== item.conversation._id))
                                                    await conversation.splice(conversation.findIndex(convo => convo.conversation._id === item.conversation._id), 1)
                                                    dispatch({
                                                        type: GET_ALL_CONVERSATIONS_SUCCESS,
                                                        payload: conversation
                                                    })
                                                } else {
                                                    setLoadingId(loadingId.filter(load => load !== item.conversation._id))
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
                                        backgroundColor: colors.white,
                                    }}
                                    onOpen = {() => setRowIndex(index)}
                                    onClose = {() => {
                                        if(index === rowIndex) {
                                            setRowIndex(null)
                                        }
                                    }}
                                    close = {rowIndex !== index}
                                    rowId = {index}
                                >
                                    <Pressable 
                                        style = {styles.card}
                                        onPress = {() => {
                                            if(item.conversation.receiverHaulerRead === false) {
                                                messageRead(item.conversation._id)
                                                socket.emit('messageSeen', {id: item.conversation._id, receiverRole: 'hauler', receiverId: item.conversation.userId._id})
                                            }
                                            socket.emit('currentMsg', {userId: userInfo._id, conversationId: item.conversation._id, senderRole: 'hauler'})
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

                                                <View style = {styles.userInfoText1}>
                                                    {
                                                        item.totalMessage[item.totalMessage.length - 1].sender[0] === userInfo._id && (item.totalMessage[item.totalMessage.length - 1].pending ? 
                                                        <Icon
                                                            type = 'material'
                                                            name = 'image'
                                                            color = {colors.darkGrey}
                                                            size = {20}
                                                            style = {{marginRight: 3}}
                                                        /> : item.totalMessage[item.totalMessage.length - 1].userSeen ?
                                                        <Text style = {styles.text1}>✓✓</Text> : item.totalMessage[item.totalMessage.length - 1].received ?
                                                        <Text style = {styles.text}>✓✓</Text> : 
                                                        <Text style = {styles.text}>✓</Text> )
                                                    }
                                                    {
                                                        item.totalMessage[item.totalMessage.length - 1].text ?
                                                        <Text style = {styles.messageText}>{item.totalMessage[item.totalMessage.length - 1].text}</Text> :
                                                        <View style = {{flexDirection: 'row'}}>
                                                            <Icon
                                                                type = 'material'
                                                                name = 'image'
                                                                color = {colors.darkGrey}
                                                                size = {20}
                                                                style = {{marginRight: 3}}
                                                            />
                                                            <Text style = {styles.messageText}>Photo</Text>
                                                        </View>
                                                    }
                                                    {
                                                        item.conversation.receiverHaulerRead === false &&
                                                        <View style = {styles.unRead}>
                                                            <View style = {styles.circle}>
                                                                <Text style = {styles.unReadNo}>{checkUnRead(item.totalMessage)}</Text>
                                                            </View>
                                                        </View>
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
        backgroundColor: colors.white,
        height: 9.4*SCREEN_HEIGHT/10 - 50,
        width: SCREEN_WIDTH
    },
    card:{
        width: SCREEN_WIDTH,
        height: 70
    },
    userInfo:{
        flexDirection: 'row',    
    },
    userImgWrapper:{
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
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
        width: 300
    },
    userInfoText:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 7,
    },
    userInfoText1:{
        flexDirection: 'row',
    },
    userName:{
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.grey1
    },
    postTime: {
        fontSize: 12,
        color: '#666',
    },
    messageText: {
        fontSize: 14,
        color: colors.grey2
    },
    title:{
        fontSize: 18, 
        alignSelf: 'center', 
        marginTop: 10, 
        fontWeight: 'bold',
        color: colors.grey2
    },
    text:{
        marginRight: 5,
        color: colors.grey
    },
    text1:{
        marginRight: 5,
        color: colors.darkBlue
    },
    unRead:{
        position: 'absolute',
        marginLeft: '90%',
    },
    circle:{
        height: 18,
        width: 18,
        backgroundColor: colors.error,
        borderRadius: 25,
        alignItems: 'center'
    },
    unReadNo:{
        color: colors.white
    },
    text2:{
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.darkBlue,
        marginTop: SCREEN_HEIGHT/3
    },

})
