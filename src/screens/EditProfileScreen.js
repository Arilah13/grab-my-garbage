import React from 'react'
import { View, Text, StyleSheet, Dimensions, ImageBackground, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'
import Headercomponent from '../components/HeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Editprofilescreen = () => {
    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Account' />

            <View style = {styles.container}>
                <View style = {styles.view}>
                    <Text style = {styles.text}>Profile</Text>
                    <ImageBackground 
                        style = {styles.image} 
                        source = {require('../../assets/slide1.png')}
                        
                    >
                        <Icon
                            type = 'material'
                            name = 'add-a-photo'
                            color = {colors.error}
                            style = {styles.icon}
                        />
                    </ImageBackground>
                </View>

                <View style = {styles.view2}>
                    <Text style = {styles.text2}>Email Address</Text>
                    <TextInput 
                        style = {styles.textInput}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Editprofilescreen

const styles = StyleSheet.create({

    container:{
        height: 9*SCREEN_HEIGHT/10,
        backgroundColor: colors.blue2,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    view:{
        height: 3*SCREEN_HEIGHT/10,
        alignItems: 'center'
    },
    view2:{
        height: 7*SCREEN_HEIGHT/10,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30 
    },
    text: {
        marginTop: 10,
        fontWeight: 'bold',
        color: colors.white,
        fontSize: 17
    },
    image:{
        width: 150,
        height: 150,
        borderRadius: 500,
        overflow: 'hidden',
        marginTop: 10
    },
    icon:{
        marginTop: 120
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
    text2:{
        color: colors.grey
    },
})
