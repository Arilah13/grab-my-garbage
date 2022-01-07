import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Icon, SocialIcon, Button } from 'react-native-elements'

import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Signinscreen = ({navigation}) => {

    const [show, setShow] = useState(false)

    const handleVisibility = () => {
        setShow(!show)
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <TouchableOpacity style = {styles.container}
                onPress = {() => navigation.navigate('Welcome')}
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
                <Text style = {styles.text1}>Welcome</Text>
            </TouchableOpacity>
            <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.white, borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
            <View style = {{marginLeft: 4, marginTop: 20, height: SCREEN_HEIGHT/20 }}>
                <Text style = {styles.title}>Sign In</Text>
            </View>
            <View style = {{alignItems: 'center', marginTop: 20, height: SCREEN_HEIGHT/20}}>
                <Text style = {styles.text2}>Please enter the name and password</Text>
                <Text style = {styles.text2}>registered with your account</Text>
            </View>

            <Formik
                initialValues = {{email: '', password: '', }}
                onSubmit = {(values) => {
                    
                }}
            >
            {   
                (props) =>
                <View style = {{height: 7*SCREEN_HEIGHT/20}}>
                    <View style = {{padding: 20}}>
                        <TextInput
                            placeholder = 'Email'
                            keyboardType = 'email-address'
                            style = {styles.textInput}
                            onChangeText = {props.handleChange('email')}
                            value = {props.values.email}
                        />
                        <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10}}>
                            <Icon
                                name = 'lock'
                                type = 'material'
                                color = {colors.grey1}
                            />
                            <TextInput
                                secureTextEntry = {show ? false : true}
                                placeholder = 'Password'
                                style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                                onChangeText = {props.handleChange('password')}
                                value = {props.values.password}
                            />                              
                                {
                                    show ? (
                                    <Icon
                                        name= 'visibility-off'
                                        onPress = {handleVisibility}
                                        type = 'material'
                                        iconStyle = {{marginLeft: 10}}
                                        color = {colors.grey1}
                                    />) : (
                                    <Icon
                                        name= 'visibility'
                                        onPress = {handleVisibility}
                                        type = 'material'
                                        iconStyle = {{marginLeft: 10}}
                                        color = {colors.grey1}
                                    /> )
                                }
                        </View>
                        <Button 
                            title = 'SIGN IN'
                            buttonStyle = {styles.button}
                            onPress={props.handleSubmit}
                        />
                    </View>
                </View>
            }      
            </Formik>

            <View style = {{alignItems: 'center', height: 1.5*SCREEN_HEIGHT/20}}>
                <Text style={styles.text2}>Forgot Password?</Text>
                <Text style = {{fontSize: 20, fontWeight: 'bold'}}>OR</Text>
            </View>
            
            <View style = {{marginLeft: 10, marginRight: 10, height: 4*SCREEN_HEIGHT/20}}>
                <SocialIcon
                    title = 'Sign In With Facebook'
                    button
                    type = 'facebook'
                    style = {styles.SocialIcon}
                    onPress = {() => {}}
                />
                <SocialIcon
                    title = 'Sign In With Google'
                    button
                    type = 'google'
                    style = {styles.SocialIcon}
                    onPress = {() => {}}
                />
            </View>

            <View style = {{marginLeft: 5, height: 2*SCREEN_HEIGHT/20, flexDirection: 'row'}}>
                <Text style={{...styles.text1, top: 10}}>New on Grab-My-Trash?</Text>
                <Button
                    title = 'Create an account'
                    buttonStyle = {styles.createButton}
                    onPress={() => {
                        navigation.navigate("SignUp")
                    }}
                />
            </View>
            </View>
        </SafeAreaView>
    );
}

export default Signinscreen

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    title:{
        color: colors.blue2,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20
    },
    text1:{
        display: 'flex',
        top: 26,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    text2:{
        color: colors.grey1,
        fontSize: 16
    },
    textInput:{
        backgroundColor: colors.grey8,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 10,
        height: 45,
        borderRadius: 10,
        width: SCREEN_WIDTH/1.2,
        paddingLeft: 20,
        color: colors.grey1,
    },
    SocialIcon:{
        borderRadius: 12,
        height: 50
    },
    createButton:{
        backgroundColor: colors.buttons,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 40,
        width: SCREEN_WIDTH/2.5,
        marginLeft: SCREEN_WIDTH/10
    },
    button:{
        marginTop: SCREEN_HEIGHT/40,
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },

})
