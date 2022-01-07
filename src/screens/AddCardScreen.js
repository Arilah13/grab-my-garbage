import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Addcardscreen = ({navigation}) => {

    const [date, setDate] = useState(new Date())
    const [showDate, setShowDate] = useState(false)

    let formattedDate = date.toLocaleDateString().split('/')

    const handleConfirmDate = (date) => {
        setShowDate(false)
        setDate(date)
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <TouchableOpacity style = {styles.container}
                onPress = {() => navigation.navigate('Payment')}
            >
                <Icon
                    type = 'material'
                    name = 'arrow-back'
                    color = {colors.blue5}
                    size = {25}
                    style = {{
                        alignSelf: 'flex-start',
                        marginTop: 25,
                        display: 'flex'
                    }}
                />
                <Text style = {styles.text1}>Payment Confirmation</Text>
            </TouchableOpacity>

            <View style = {styles.container2}>
                <View style = {{padding: 20}}>
                    <Text style = {styles.text2}>Card Number</Text>
                    <TextInput 
                        style = {styles.textInput}
                        placeholder = 'Card Number'
                    />
                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.text2}>Expiry Date</Text>                      
                        <Text style = {{...styles.text2, marginLeft: SCREEN_WIDTH/3}}>CVV</Text>                       
                    </View>
                    <View style = {{flexDirection: 'row'}}>
                        <Pressable style = {styles.view} onPress = {() => setShowDate(true)}>
                            <Text style = {styles.text3}>{formattedDate[0]}/{formattedDate[1]}/{formattedDate[2]}</Text>
                            <DateTimePickerModal
                                isVisible = {showDate}
                                date = {date}
                                mode = 'date'
                                onConfirm = {(date) => handleConfirmDate(date)}
                                onCancel = {() => setDate(false)}
                            />
                        </Pressable>
                        <TextInput
                            style = {{...styles.textInput, width: SCREEN_WIDTH/3.8, marginLeft: SCREEN_WIDTH/6}}
                            placeholder = 'CVV'
                        />
                    </View>
                    <Text style = {styles.text2}>Name</Text>
                    <TextInput
                        style = {styles.textInput}
                        placeholder = 'Name On Card'
                    />
                </View>

                <View style = {{top: SCREEN_HEIGHT/1.36, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                    <Button
                        title = 'Add Card'
                        buttonStyle = {styles.button}
                        onPress = {() => pay()}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Addcardscreen

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    text1:{
        display: 'flex',
        top: 26,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    container2:{
        display: 'flex',
        backgroundColor: colors.white,
        height: 9*SCREEN_HEIGHT/10,
        paddingTop: 30,
        paddingLeft: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    text2:{
        color: colors.grey
    },
    textInput:{
        backgroundColor: colors.grey8,
        marginTop: 10,
        marginBottom: 10,
        height: 45,
        borderRadius: 10,
        width: SCREEN_WIDTH/1.3,
        paddingLeft: 20,
        color: colors.grey1
    },
    text3:{
        color: colors.grey1,
        marginTop: '9%',
        marginLeft: 20,
    },
    view:{
        backgroundColor: colors.grey8,
        width: SCREEN_WIDTH/3,
        height: 45,
        marginTop: 10,
        borderRadius: 10
    }

})
