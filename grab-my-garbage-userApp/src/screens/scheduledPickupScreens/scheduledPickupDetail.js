import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import axios from 'axios'

import { colors } from '../../global/styles'
import { dayConverter } from '../../helpers/schedulepickupHelper'

import { getScheduledPickups } from '../../redux/actions/schedulePickupActions'

import Headercomponent from '../../components/headerComponent'
import Mapcomponent from '../../components/pickupComponent/mapComponent'
import Chatcomponent from '../../components/pickupComponent/chatComponent'
import CompletedPickupsComponent from '../../components/completedPickupsComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Scheduledpickupdetail = ({navigation, route}) => {
    const dispatch = useDispatch()

    const { item, from, to } = route.params

    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false)
    const [modalVisible2, setModalVisible2] = useState(false)
    const [active, setActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [disable, setDisable] = useState(false)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const retrieveScheduledPickup = useSelector(state => state.retrieveScheduledPickup)
    const { pickupInfo } = retrieveScheduledPickup

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        },
    }

    const handleActive = async(id) => {
        if(active === true) {
            setLoading(true)
            const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/inactive/${id}`, config)
            if(res.status === 200) {
                setActive(false)
                setLoading(false)
                dispatch(getScheduledPickups())
            }
        } else if(active === false) {
            setLoading(true)
            const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/active/${id}`, config)
            if(res.status === 200) {
                setActive(true)
                setLoading(false)
                dispatch(getScheduledPickups())
            }
        }
    }

    const handleCancel = async(id) => {
        setLoadingCancel(true)
        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/schedulepickup/${id}`, config)
        if(res.status === 200) {
            setActive(true)
            dispatch(getScheduledPickups())
            setTimeout(() => {
                setLoadingCancel(false)
                navigation.navigate('ScheduleRequests')
            }, 3000)
        }
    }

    // const findandActivePickups = () => {
    //     const index = pickupInfo.findIndex((d, index) => {
    //         if(d._id === item._id) {
    //             return Promise.all(index)
    //         }
    //     })
    //     Promise.all(index)
    //     const element = pickupInfo.splice(index, 1)[0]
    //     Promise.all(element)
    // }

    useEffect(() => {
        if(item.inactive === 0) {
            setActive(true)
        } else if(item.inactive === 1) {
            setActive(false)
        }

        if(item.active === 1) {
            setDisable(true)
        } else if(item.active === 0) {
            setDisable(false)
        }
    }, [])

    useEffect(() => {
        socket.on('schedulePickupDone', async({pickupid}) => {
            if(pickupid === item._id) {
                setDisable(false)
                item.active = 0
            }
        })

        socket.on('userSchedulePickup', async({pickupid}) => {
            if(pickupid === item._id) {
                setDisable(true)
                item.active = 1
            }
        })
    }, [socket])

    // useEffect(() => {
    //     console.log(item)
    // }, [])

    return (
        <SafeAreaView>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {styles.container}
            >
                <Headercomponent name = 'Scheduled Pickups' />

                <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.grey8, borderTopLeftRadius: 30, borderTopRightRadius: 30}}>

                    <Pressable style = {styles.container2} onPress = {() => setModalVisible(true)}>
                        <Icon 
                            type = 'feather'
                            name = 'map-pin'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                marginTop: 30,
                                alignSelf: 'flex-start'
                            }}
                        />
                        <Text style = {styles.text1}>Pick Up Location</Text>
                        <Text style = {styles.text2}>{item.location[0].city}</Text>
                        <Icon 
                            type = 'material-community'
                            name = 'dots-vertical'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                //alignSelf: 'flex-end',
                                //marginRight: 5,
                                //bottom: 15,
                                position: 'absolute'
                            }}
                        />
                    </Pressable>

                    <View style = {{flex: 1, backgroundColor: colors.white, borderTopRightRadius: 30, borderTopLeftRadius: 30, padding: 15}}>
                        <View style = {styles.container3}>
                            <Text style = {styles.text3}>Pickup Scheduled Duration:</Text>
                            <Text style = {styles.text4}>{from + ' - ' + to}</Text>
                        </View>
                        <View style = {{...styles.container5, paddingTop: 0}}>
                            <Text style = {styles.text3}>Collection Days:</Text>
                            <Text style = {styles.text4}>
                                {
                                    item.days.map((day) => {
                                        return(
                                            dayConverter(day) + '   '
                                        )
                                    })
                                }
                            </Text>
                        </View>
                        <View style = {{...styles.container5, paddingBottom: 0, paddingTop: 0}}>
                            <Text style = {styles.text5}>Time Slot:</Text>
                            <Text style = {styles.text4}>{item.timeslot}</Text>
                        </View>
                        <View style = {{...styles.container5, paddingBottom: 0}}>
                            <Text style = {styles.text3}>Payment:</Text>
                            <Text style = {styles.text4}>Rs. {item.payment}</Text>
                        </View>
                        <View style = {styles.container5}>
                            <Text style = {styles.text3}>Payment Method:</Text>
                            <Text style = {styles.text4}>{item.paymentMethod}</Text>
                        </View>

                        <View style = {{...styles.container5, paddingTop: 0}}>
                            <Text style = {styles.text3}>Hauler Name:</Text>
                            <Text style = {styles.text4}>{item.pickerId.name}</Text>
                        </View> 

                        <TouchableOpacity 
                            style = {{...styles.container5, paddingTop: 30, justifyContent: 'center'}}
                            onPress = {() => setModalVisible1(true)}
                        >
                            <Icon
                                type = 'material'
                                name = 'chat'
                                color = {colors.darkBlue}
                                size = {27}
                            />    
                            <Text style = {styles.text7}>Chat With Hauler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style = {{...styles.container5, paddingTop: 5, marginBottom: 5, justifyContent: 'center'}}
                            onPress = {() => setModalVisible2(true)}
                        >
                            <Icon
                                type = 'material'
                                name = 'airport-shuttle'
                                color = {colors.darkBlue}
                                size = {27}
                            />    
                            <Text style = {styles.text7}>Completed Pickups</Text>
                        </TouchableOpacity>

                        <View style = {{alignSelf: 'center', flexDirection: 'row'}}>
                            <Button
                                title = {active ? 'Inactive' : 'Active'}
                                buttonStyle = {{...styles.button, backgroundColor: active ? colors.darkBlue : colors.darkGrey}}
                                loading = {loading}
                                disabled = {loading || disable}
                                onPress = {() => handleActive(item._id)}
                            />

                            <Button
                                title = 'Cancel'
                                buttonStyle = {styles.button}
                                loading = {loadingCancel}
                                disabled = {loadingCancel || disable}
                                onPress = {() => handleCancel(item._id)}
                            />
                        </View>
                    </View>

                    <Modal 
                        isVisible = {modalVisible}
                        swipeDirection = {'down'}
                        style = {{ justifyContent: 'center', margin: 10 }}
                        onBackButtonPress = {() => setModalVisible(false)}
                        onBackdropPress = {() => setModalVisible(false)}
                        animationIn = 'zoomIn'
                        animationOut = 'zoomOut'
                        animationInTiming = {500}
                        animationOutTiming = {500}
                        useNativeDriver = {true}
                        useNativeDriverForBackdrop = {true}
                        deviceHeight = {SCREEN_HEIGHT}
                        deviceWidth = {SCREEN_WIDTH}
                    >
                        <View style = {styles.view1}>
                            <Mapcomponent 
                                location = {item.location[0]} 
                                item = {item} 
                                setModalVisible = {setModalVisible} 
                                type = 'schedule' 
                                navigation = {navigation} 
                                modalVisible = {modalVisible}
                            />
                        </View>                
                    </Modal>

                    <Modal 
                        isVisible = {modalVisible1}
                        swipeDirection = {'down'}
                        style = {{ justifyContent: 'center', margin: 10 }}
                        onBackButtonPress = {() => setModalVisible1(false)}
                        onBackdropPress = {() => setModalVisible1(false)}
                        animationIn = 'zoomIn'
                        animationOut = 'zoomOut'
                        animationInTiming = {500}
                        animationOutTiming = {500}
                        useNativeDriver = {true}
                        useNativeDriverForBackdrop = {true}
                        deviceHeight = {SCREEN_HEIGHT}
                        deviceWidth = {SCREEN_WIDTH}
                    >
                        <View style = {styles.view2}>
                            <Chatcomponent haulerid = {item.pickerId} pickupid = {item._id} setModalVisible = {setModalVisible1} />
                        </View>                
                    </Modal>

                    <Modal 
                        isVisible = {modalVisible2}
                        swipeDirection = {'down'}
                        style = {{ justifyContent: 'center', margin: 10 }}
                        onBackButtonPress = {() => setModalVisible2(false)}
                        onBackdropPress = {() => setModalVisible2(false)}
                        animationIn = 'zoomIn'
                        animationOut = 'zoomOut'
                        animationInTiming = {500}
                        animationOutTiming = {500}
                        useNativeDriver = {true}
                        useNativeDriverForBackdrop = {true}
                        deviceHeight = {SCREEN_HEIGHT}
                        deviceWidth = {SCREEN_WIDTH}
                    >
                        <View style = {{...styles.view2, height: '35%'}}>
                            <CompletedPickupsComponent item = {item} setModalVisible2 = {setModalVisible2} />
                        </View>                
                    </Modal>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Scheduledpickupdetail

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.blue1,
        //paddingLeft: 10,
        //paddingTop: 10,
    },
    container2:{
        backgroundColor: colors.grey8,
        paddingLeft: 25, 
        marginBottom: 10,
        height: SCREEN_HEIGHT/9,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text1:{
        color: colors.blue7,
        left: 40,
        bottom: 30
    },
    text2:{
        color: colors.blue2,
        left: 40,
        bottom: 30,
        fontWeight: 'bold'
    },
    container3:{
        backgroundColor: colors.white,
        padding: 25,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        flexDirection: 'row'
    },
    text3:{
        color: colors.blue2,
        fontWeight: 'bold',
    },
    text4:{
        color: colors.grey,
        fontWeight: 'bold',
        marginLeft: 20
    },
    text5:{
        color: colors.blue2,
        fontWeight: 'bold',
        marginBottom: 8
    },
    container4:{
        backgroundColor: colors.white,
        paddingLeft: 25,
    },
    text6:{
        color: colors.grey,
        fontWeight: 'bold',
        marginLeft: 130,
        marginTop: 5
    },
    container5:{
        backgroundColor: colors.white,
        padding: 25,
        flexDirection: 'row'
    },
    image:{
        height: 200,
        width: 200,
        //borderRadius: 500,
        alignContent: 'center'
    },
    text7:{
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    view1:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    view2:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    button:{
        backgroundColor: colors.darkBlue,
        borderRadius: 10,
        height: 40,
        width: 140,
        marginHorizontal: 20
    },

})
