import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Pressable, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'

import { colors } from '../global/styles'
import { cardDetails } from '../global/data'
import Headercomponent from '../components/HeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Paymentoptionsscreen = ({navigation}) => {

    const remove = () => {
        Alert.alert('Confirm Delete', 'Do you want to delete?',
            [
                {
                    text: 'Yes',
                    style: 'destructive'
                },
                {
                    text: 'No',
                    style: 'destructive'
                }
            ],
            {
                cancelable: true,
            }
        )
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Account' />

            <View style = {styles.container2}>
                <Text style = {styles.text2}>Payment Methods</Text>

                <FlatList 
                    numColumns = {1}
                    showsVerticalScrollIndicator = {false}
                    data = {cardDetails}
                    keyExtractor = {(item) => item.id}
                    style = {{height: 20*SCREEN_HEIGHT/25, marginTop: 8}}
                    renderItem = {({item}) => (
                        <TouchableOpacity style = {{marginTop: 15}}
                            onPress = {() => navigation.navigate()}
                        >
                            <View style = {styles.view1}>
                                <Image 
                                    style = {styles.image1} 
                                    source = {item.type === 'Master' && require('../../assets/mastercard.png') || 
                                                item.type === 'Visa' &&  require('../../assets/visa_1.png') || 
                                                item.type === 'Amex' && require('../../assets/amex.png') ||
                                                item.type === 'Cash' && require('../../assets/cash.png')
                                            }
                                    resizeMode = 'contain'
                                />     
                                <View style = {{position: 'absolute', flexDirection: 'row'}}>
                                    <Text style = {item.type === 'Cash' ? styles.text4 : styles.text3}>
                                        {item.cardNo !== 'Cash' && '•••• ' + item.cardNo.split(' ')[2] || 
                                        item.cardNo === 'Cash' && 'Cash'}
                                        
                                    </Text>  
                                    <Pressable onPress = {() => remove()}>
                                    {item.type !== 'Cash' ?                                  
                                        <Icon
                                            type = 'material'
                                            name = 'highlight-off'
                                            style = {styles.icon}
                                            color = {colors.error}
                                        /> 
                                    
                                        : null 
                                    }
                                    </Pressable>
                                    </View>                          
                            </View>
                        </TouchableOpacity>
                    )}
                />
                {/* <View style = {{...styles.view1, marginTop: 25}}>
                    <Text style = {styles.text3}>Paypal</Text>
                    <Image
                        source = {require('../../assets/paypal.png')}
                        resizeMode = 'contain'
                        style = {{
                            position: 'absolute',
                            width: '30%',
                            height: '55%',
                            marginTop: SCREEN_HEIGHT/34,
                            marginLeft: '6%'
                        }}
                    />
                </View> */}

                <View style = {{width: '100%', padding: 15, paddingLeft: 3, height: 4*SCREEN_HEIGHT/25}}>
                    <Button
                        title = 'Add Payment Method'
                        buttonStyle = {styles.button}
                        onPress = {() => navigation.navigate('AddCard')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Paymentoptionsscreen

const styles = StyleSheet.create({

    container2:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: 9*SCREEN_HEIGHT/10,
        paddingTop: 30,
        paddingLeft: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text2:{
        marginTop: -8,
        color: colors.blue2,
        fontSize: 17,
        fontWeight: 'bold',
        height: SCREEN_HEIGHT/25
    },
    view1:{
        width: '95%',
        height: 80,
        backgroundColor: colors.white,
        //marginTop: 35,
        borderRadius: 20,
        zIndex: 1,
        elevation: 0
    },
    text3:{
        marginLeft: '45%', 
        fontWeight: 'bold', 
        color: colors.blue2, 
        marginTop: SCREEN_HEIGHT/24,
        fontSize: 16
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    image1:{
        width: '25%',
        height: '80%',
        marginTop: 8,
        marginLeft: 35
    },
    icon:{
        marginLeft: '30%',  
        marginTop: SCREEN_HEIGHT/25,
    },
    text4:{
        marginLeft: '65%', 
        fontWeight: 'bold', 
        color: colors.blue2, 
        marginTop: SCREEN_HEIGHT/24,
        fontSize: 16
    },

})
