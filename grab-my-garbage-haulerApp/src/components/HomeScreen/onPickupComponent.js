import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import * as Linking from 'expo-linking'
import Modal from 'react-native-modal'

import { colors } from '../../global/styles'

import Chatcomponent from './chatComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Onpickupcomponent = ({navigation, handlePickupComplete, order, arrived}) => {

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <>
        <View style = {{flexWrap: 'wrap', flexDirection: 'row'}}>
            <View>
                <Image
                    source = {{uri: order.customerId.image}} 
                    style = {styles.image}
                />
            </View>

            <View>
                <Text style = {styles.text2}>{order.customerId.name}</Text>
            </View>
        </View>

        <View style = {{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
            <TouchableOpacity 
                style = {{
                    flexDirection: 'row', 
                }}
                onPress = {() => Linking.openURL(`tel:${order.customerId.phone}`)}
            >
                <Icon
                    type = 'material'
                    name = 'call'
                    color = {colors.darkBlue}
                    size = {22}
                />
                <Text style = {styles.text3}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {{
                    flexDirection: 'row', 
                }}
                onPress = {() => setModalVisible(true)}
            >
                <Icon
                    type = 'material'
                    name = 'chat'
                    color = {colors.darkBlue}
                    size = {22}
                />    
                <Text style = {styles.text3}>Chat</Text>
            </TouchableOpacity>
        </View>

        <View style = {{marginTop: 10, padding: 25, paddingVertical: 0}}>
            <Button 
                title = { arrived === false ? 'Arrived' : 'Completed' }
                buttonStyle = {{
                    width: SCREEN_WIDTH/1.2,
                    borderRadius: 5,
                    height: 45,
                    backgroundColor: colors.darkBlue
                }}
                onPress = {() => handlePickupComplete()}
            />
        </View> 

        <Modal
            isVisible = {modalVisible}
            swipeDirection = {'down'}
            style = {{ justifyContent: 'flex-end', marginHorizontal: 10, marginBottom: 0 }}
            onBackButtonPress = {() => setModalVisible(false)}
            onBackdropPress = {() => setModalVisible(false)}
            animationInTiming = {500}
            animationOutTiming = {500}
            useNativeDriver = {true}
            useNativeDriverForBackdrop = {true}
            deviceHeight = {SCREEN_HEIGHT}
            deviceWidth = {SCREEN_WIDTH}
        >
            <View style = {styles.view1}>
                <Chatcomponent userid = {order.customerId} pickupid = {order._id} setModalVisible = {setModalVisible}/>
            </View>  
        </Modal>
        </>
    );
}

export default Onpickupcomponent

const styles = StyleSheet.create({

    image:{
        height: 60,
        width: 60,
        borderRadius: 50,
        marginTop: 10,
        marginLeft: 30,
        borderColor: colors.darkBlue,
        borderWidth: 2
    },
    text2:{
        marginLeft: 20,
        marginTop: 25,
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.darkBlue
    },
    text3:{
        marginLeft: 15,
        fontWeight: 'bold',
        color: colors.darkBlue,
        fontSize: 13
    },
    view1:{
        backgroundColor: colors.white,
        height: '95%',
        width: '100%',
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: 'hidden',
    },


})
