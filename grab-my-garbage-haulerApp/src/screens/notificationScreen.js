import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'
import Swipeout from 'react-native-swipeout'
import axios from 'axios'

import { colors } from '../global/styles'

import { USER_LOGIN_SUCCESS } from '../redux/constants/userConstants'
import Headercomponent from '../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const NotificationScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [loadingId, setLoadingId] = useState([])
    const [rowIndex, setRowIndex] = useState()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const returnDate = (date) => {
        const crntDate = new Date()
        const ysterDate = new Date(new Date().getTime() - 24*60*60*1000)

        if(crntDate.toISOString().split('T')[0] === date) {
            return 'Today'
        } else if(ysterDate.toISOString().split('T')[0] === date) {
            return 'Yesterday'
        } else {
            let mon

            const month = date.split('-')[1]
            if(month === '01') {
                mon = 'Jan'
            } else if(month === '02') {
                mon = 'Feb'
            } else if(month === '03') {
                mon = 'Mar'
            } else if(month === '04') {
                mon = 'Apr'
            } else if(month === '05') {
                mon = 'May'
            } else if(month === '06') {
                mon = 'Jun'
            } else if(month === '07') {
                mon = 'Jul'
            } else if(month === '08') {
                mon = 'Aug'
            } else if(month === '09') {
                mon = 'Sep'
            } else if(month === '10') {
                mon = 'Oct'
            } else if(month === '11') {
                mon = 'Nov'
            } else if(month === '12') {
                mon = 'Dec'
            }

            return mon + ' ' + date.split('-')[2]
        }
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
                Authorization: `Bearer ${userInfo.token}`
            },
        }

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/haulers/notification/${userInfo._id}`, {id}, config)

        if(res.status === 200) {
            return true
        } else {
            return false
        }
    }
 
    return (
        <SafeAreaView style = {{flex: 1}}>
            <Headercomponent name = 'Notifications' />

            <View style = {{height: SCREEN_HEIGHT - 95}}>
                <FlatList
                    numColumns = {1}
                    showsHorizontalScrollIndicator = {false}
                    showsVerticalScrollIndicator = {false}
                    data = {userInfo.notification}
                    keyExtractor = {(item, index) => index}
                    ListEmptyComponent = {() => (
                        <Text style = {styles.text3}>No Notification Available</Text>
                    )}
                    renderItem = {({item, index}) => (
                        <>
                            <View style = {styles.container1}>
                                <Text style = {styles.text}>{returnDate(item.date)}</Text>
                            </View>
                            
                            {
                                item.data.map((data) => (
                                    <Swipeout
                                        key = {data.id}
                                        autoClose = {false}
                                        right = {[
                                            {
                                                backgroundColor: 'red',
                                                onPress: async() => {
                                                    setLoadingId([...loadingId, data.id])
                                                    const res = await handleDelete(data.id)
                                                    if(res === true) {
                                                        setLoadingId(loadingId.filter(load => load !== data.id))
                                                        const number = await userInfo.notification.find(noti => noti.data.find(dat => dat.id === data.id))
                                                        if(number.data.length === 1) {
                                                            await userInfo.notification.splice(userInfo.notification.findIndex(noti => noti.data[0].id === data.id), 1)
                                                            dispatch({
                                                                type: USER_LOGIN_SUCCESS,
                                                                payload: userInfo
                                                            })
                                                        } else if(number.data.length > 1) {
                                                            const index = await userInfo.notification.map(noti => { return noti.data.findIndex(dat => dat.id === data.id) })
                                                            const final = await index.findIndex(index => index !== -1)
                                                            const final1 = await index.filter(index => index !== -1)[0]
                                                            await userInfo.notification[final].data.splice(final1, 1)
                                                            dispatch({
                                                                type: USER_LOGIN_SUCCESS,
                                                                payload: userInfo
                                                            })
                                                        }
                                                        setRowIndex(null)
                                                    } else {
                                                        loadingId.splice(loadingId.findIndex(load => load === data.id), 1)
                                                    }
                                                },
                                                component: 
                                                <View style = {{paddingVertical: 16}}>
                                                    {
                                                        checkLoading(data.id) === true ?
                                                        <ActivityIndicator 
                                                            color = {colors.white} 
                                                            size = {30}
                                                        /> :
                                                        <View>
                                                            <Icon
                                                                type = 'material'
                                                                name = 'delete-outline'
                                                                color = 'white'
                                                                size = {30}
                                                            />
                                                            <Text style = {{alignSelf: 'center', color: colors.white}}>Delete</Text>
                                                        </View>
                                                    }
                                                </View>
                                            }
                                        ]}
                                        onOpen = {() => setRowIndex(data.id)}
                                        onClose = {() => {
                                            if(data.id === rowIndex) {
                                                setRowIndex(null)
                                            }
                                        }}
                                        close = {rowIndex !== data.id}
                                        rowId = {data.id}
                                    >
                                        <View style = {styles.card}>
                                            <View style = {{marginLeft: 20}}>
                                                <Text style = {styles.text1}>{data.description}</Text>
                                                <Text style = {styles.text2}>{returnDate(item.date)}</Text>
                                            </View> 
                                        </View>
                                    </Swipeout>
                                )) 
                            }
                        </>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

export default NotificationScreen

const styles = StyleSheet.create({

    title:{
        fontSize: 18,  
        alignSelf: 'center', 
        marginTop: 10, 
        fontWeight: 'bold',
        color: colors.grey2
    },
    container1:{
        backgroundColor: colors.grey8,
        width: SCREEN_WIDTH,
        height: 40
    },
    text:{
        fontSize: 14,
        color: colors.grey3,
        marginLeft: 15,
        marginTop: 10,
        fontWeight: 'bold'
    },
    card:{
        width: SCREEN_WIDTH,
        height: 75,
        backgroundColor: colors.white,
        alignItems: 'center',
        borderTopWidth: 0.2,
        borderBottomWidth: 0.2,
        borderBottomColor: colors.blue3,
        borderTopColor: colors.blue3,
        flexDirection: 'row'
    },
    text1:{
        fontSize: 15,
        color: colors.blue4,
    },
    text2:{
        color: colors.darkGrey
    },
    text3:{
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.darkBlue,
        marginTop: SCREEN_HEIGHT/3,
        alignSelf: 'center'
    }

})
