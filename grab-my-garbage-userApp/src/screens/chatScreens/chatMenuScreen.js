import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Icon } from 'react-native-elements'
import { useRoute } from '@react-navigation/native'

import { receiverRead } from '../../redux/actions/conversationActions'

import { colors } from '../../global/styles'
import { date1Helper } from '../../helpers/pickupHelper'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatmenuscreen = ({navigation}) => {
    const data = useRef([])
    
    const dispatch = useDispatch()
    const route = useRoute()

    const [assigned, setAssigned] = useState(false)
    const [convoData, setConvoData] = useState([])

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation

    const getConversation = useSelector((state) => state.getConversation)
    const { conversation: currentConversation } = getConversation

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const messageRead = async(id) => {
        const index = data.current.findIndex((d, index) => {
            if(d.conversation._id === id) {
                return Promise.all(index)
            }
        })
        Promise.all(index)
        const element = data.current.splice(index, 1)[0]
        Promise.all(element)
        if(element.conversation.receiverRead === false) {
            element.conversation.receiverRead = true
            dispatch(receiverRead(id))
        }
        data.current.splice(index, 0, element)
        data.current = [...data.current]
        setConvoData(data.current)
    }

    useEffect(async() => {
        if(conversation !== undefined && assigned === false) {
            setAssigned(true)
            setConvoData(conversation)
            data.current = conversation
        }
    }, [conversation])

    useEffect(() => {
        socket.on('getMessage', async({senderid, text, sender, createdAt}) => {
            const index = data.current.findIndex((d, index) => {
                if(d.conversation.haulerId._id === senderid) {
                    return Promise.all(index)
                }
            })
            Promise.all(index)
            if(index >= 0) {
                const element = data.current.splice(index, 1)[0]
                Promise.all(element)
                element.message.text = text
                element.message.created = createdAt
                element.conversation.receiverRead = false
                data.current = [element, ...data.current]
                setConvoData(data.current)
            }
            else if(index === -1) {
                const element = {
                    conversation: {
                        _id: createdAt,
                        haulerId: {
                            _id: sender._id,
                            image: sender.avatar,
                            name: sender.name
                        },
                        receiverRead: false
                    },
                    message: {
                        created: createdAt,
                        text: text
                    }
                }
                data.current = [element, ...data.current]
                setConvoData(data.current)
            }
        })
    }, [socket])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style = {{height: 0.8*SCREEN_HEIGHT/10}}>
                <Text style = {styles.title}>Chat</Text>
            </View>
            {
                loading === true && conversation === undefined && assigned === false ?
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
                            data = {convoData}
                            extraData = {convoData}
                            keyExtractor = {(item, index)=>item.conversation._id}
                            renderItem = {({item}) => (
                                <Pressable 
                                    style = {styles.card}
                                    onPress = {async() => {
                                        await messageRead(item.conversation._id)
                                        setAssigned(false)
                                        navigation.navigate('Message', {haulerid: item.conversation.haulerId})
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
                                                <Text style = {styles.postTime}>{date1Helper(item.message.created)}</Text>
                                            </View>
                                            <View style = {styles.userInfoText}>
                                                <Text style = {styles.messageText}>{item.message.text}</Text>
                                                {
                                                    item.conversation.receiverRead === false &&
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
