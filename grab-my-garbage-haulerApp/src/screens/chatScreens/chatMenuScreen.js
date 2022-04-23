import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'

import { colors } from '../../global/styles'
import { date1Helper } from '../../helpers/specialPickuphelper'

import { getConversations } from '../../redux/actions/conversationActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Chatmenuscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [assigned, setAssigned] = useState(false)

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    useEffect(() => {
        dispatch(getConversations())
    }, [])

    useEffect(() => {
        if(conversation !== undefined && assigned === false) {
            setData(conversation)
            setAssigned(true)
        }
    }, [conversation])

    useEffect(() => {
        if(socket) {
            socket.on('getMessage', async({senderid}) => {
                const index =  data.findIndex((data, index) => {
                    if(data.conversation[index].userId._id === senderid) {
                        return index
                    }
                })
                const element = await data.splice(index, 1)[0]
                await element
                //console.log(element)
                //console.log(element)
                //console.log(element)
                data.splice(0, 0, element)
            })
        }
    }, [socket])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style = {{height: 0.8*SCREEN_HEIGHT/10}}>
                <Text style = {styles.title}>Chat</Text>
            </View>
            {
                loading === true &&
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
                /> 
            }
            {
                loading === false && conversation !== undefined && assigned === true &&
                <View style = {styles.container}>
                    <View style = {{alignItems: 'center'}}>
                        <FlatList
                        data = {data}
                        keyExtractor = {(item, index)=>index}
                        renderItem = {({item, index}) => (
                            <Pressable 
                                style = {styles.card}
                                onPress = {() => {
                                    navigation.navigate('Message', {userid: item.conversation[index].userId})
                                }}
                            >
                                <View style = {styles.userInfo}>
                                    <View style = {styles.userImgWrapper}>
                                        <Image
                                            source = {{uri: item.conversation[index].userId.image === null ? require('../../../assets/user.png') : item.conversation[0].userId.image }}
                                            style = {styles.userImg}
                                        />
                                    </View>

                                    <View style = {styles.textSection}>
                                        <View style = {styles.userInfoText}>
                                            <Text style = {styles.userName}>{item.conversation[index].userId.name}</Text>
                                            <Text style = {styles.postTime}>{date1Helper(item.message.created)}</Text>
                                        </View>
                                        <Text style = {styles.messageText}>{item.message.text}</Text>
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
