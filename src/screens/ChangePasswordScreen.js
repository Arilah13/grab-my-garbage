import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'
import { Formik } from 'formik'

import { colors } from '../global/styles'
import Headercomponent from '../components/HeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Changepasswordscreen = () => {

    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)

    const formikRef = useRef()
    const password1 = useRef('password')

    const initialValues = { password: '', password_1: '' }

    const handleVisibility = () => {
        setShow(!show)
    }
    const handleVisibility1 = () => {
        setShow1(!show1)
    }

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Account' />

            <View style = {styles.container2}>
                <Text style = {styles.text2}>Change Password</Text>

                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    onSubmit = {(values, {setSubmitting}) => {
                        validate(values)
                        if(validated) {
                            setTimeout(() => {
                                setSubmitting(false)
                                
                            }, 400)
                        } else {
                            setSubmitting(false)
                        }
                    }}
                    innerRef = {formikRef}
                >
                {   
                    (props) =>
                    <>
                    <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10}}>
                        <Icon
                            name = 'lock'
                            type = 'material'
                            color = {colors.grey1}
                        />
                        <TextInput
                            secureTextEntry = {show ? false : true}
                            placeholder = 'Password'
                            autoFocus = {false}
                            style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                            onChangeText = {props.handleChange('password')}
                            value = {props.values.password}
                            onSubmitEditing = {() => password1.current.focus()}
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

                    <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10}}>
                        <Icon
                            name = 'lock'
                            type = 'material'
                            color = {colors.grey1}
                        />
                        <TextInput
                            secureTextEntry = {show1 ? false : true}
                            placeholder = 'Confirm Password'
                            autoFocus = {false}
                            style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                            onChangeText = {props.handleChange('password_1')}
                            value = {props.values.password_1}
                            ref = {password1}
                        />                              
                            {
                                show1 ? (
                                <Icon
                                    name= 'visibility-off'
                                    onPress = {handleVisibility1}
                                    type = 'material'
                                    iconStyle = {{marginLeft: 10}}
                                    color = {colors.grey1}
                                />) : (
                                <Icon
                                    name= 'visibility'
                                    onPress = {handleVisibility1}
                                    type = 'material'
                                    iconStyle = {{marginLeft: 10}}
                                    color = {colors.grey1}
                                /> )
                            }
                    </View>
                    </>
                }
                </Formik>

                <View style = {{top: SCREEN_HEIGHT/1.35, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                    <Button
                        title = 'Update Password'
                        buttonStyle = {styles.button}
                        onPress = {() => navigation.navigate('AddCard')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Changepasswordscreen

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
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
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

})
