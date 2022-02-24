import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import * as Linking from 'expo-linking'

import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Onpickupcomponent = ({navigation, handlePickupComplete, order, arrived}) => {
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
                onPress = {() => navigation.navigate('Chat', {
                    userid: order.customerId, name: 'Pickup', pickupid: order._id
                })}
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


})
