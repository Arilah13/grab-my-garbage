import React, { useState, useRef, useEffect } from 'react'
//import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Icon, Button } from 'react-native-elements'
// import { showMessage } from 'react-native-flash-message'

import { colors } from '../../global/styles'

import { ANDROID_CLIENT_ID } from '@env'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const initialValues = {email: '', password: ''}

const Signinscreen = ({navigation}) => {

    //const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const [status, setStatus] = useState(false)
    const [validated, setValidated] = useState(false)

    const formikRef = useRef()
    const password1 = useRef('password')

    // const userLogin = useSelector(state => state.userLogin)
    // const {success, error} = userLogin

    const handleVisibility = () => {
        setShow(!show)
    }

    const validate = (values) => {
        let errors = {}
        
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if(!values.email) {
            errors.email = 'Email address is required'
        } else if (!regex.test(values.email)) {
            errors.email = 'Invalid email address provided'
        } else if (values.email && regex.test(values.email)) {
            errors.email = null
        }

        if(!values.password) {
            errors.password = 'Password is required'
        } else if (values.password.length < 6) {
            errors.password = 'Password must be atleast 6 characters'
        } else if(values.password.length > 50) {
            errors.password = 'Password must not be more than 50 characters'
        } else if(values.password && values.password.length > 5 && values.password.length < 51) {
            errors.password = null
        }

        if(errors.email !== null && errors.password !== null){
            //displayMessage(errors.email, errors.password)
        } else if (errors.password) {
            //displayMessage(errors.password, null)
        } else if (errors.email) {
            //displayMessage(errors.email, null)
        }

        if(errors.email === null && errors.password === null)
            setValidated(true)

    }

    const handleLogin = (values) => {
        //dispatch(Login(values.email, values.password))
        setTimeout(() => setStatus(true), 200)
    }

    // const displayMessage = (error, error1) => {
    //     if(error !== null && error1 === null)
    //         showMessage({
    //             message: error,
    //             type: 'danger',
    //             autoHide: true,
    //             animated: true,
    //             animationDuration: 150,
    //             duration: 800,
    //         })
    //     else
    //         showMessage({
    //             message: error + '\n' + error1,
    //             type: 'danger',
    //             autoHide: true,
    //             animated: true,
    //             animationDuration: 150,
    //             duration: 1500,
    //             style: {
    //                 height: 70
    //             }
    //         })
    // }

    // useEffect(() => {
    //     if(status)
    //     {
    //         if(success === true)
    //         {  
    //             setStatus(false)
    //             formikRef.current.resetForm()
    //         }
    //         else
    //         {
    //             setStatus(false)
    //             displayMessage(error, null)
    //         }
    //     }
    // }, [handleLogin])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Welcome' />
            <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.white, borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
            <View style = {{marginLeft: 4, marginTop: 20, height: SCREEN_HEIGHT/20 }}>
                <Text style = {styles.title}>Sign In</Text>
            </View>
            <View style = {{alignItems: 'center', marginTop: 20, height: SCREEN_HEIGHT/20}}>
                <Text style = {styles.text2}>Please enter the name and password</Text>
                <Text style = {styles.text2}>given to your account</Text>
            </View>

            <Formik
                initialValues = {initialValues}
                onSubmit = {(values, {setSubmitting}) => {
                    navigation.navigate('Home')
                    // validate(values)
                    // if(validated) {
                    //     setTimeout(() => {
                    //         setSubmitting(false)
                    //         //handleLogin(values)
                    //     }, 400)
                    // } else {
                    //     setSubmitting(false)
                    // }
                }}
                innerRef = {formikRef}
            >
            {   
                (props) =>
                <View style = {{height: 7*SCREEN_HEIGHT/20}}>
                    <View style = {{padding: 20}}>
                        <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10}}>
                            <View>
                                <Icon
                                    name = 'email'
                                    color = {colors.grey1}
                                    type = 'material'
                                />
                            </View>
                            <View>
                                <TextInput 
                                    placeholder = 'Email'
                                    keyboardType = 'email-address'
                                    autoFocus = {false}
                                    style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                                    onChangeText = {props.handleChange('email')}
                                    value = {props.values.email}
                                    onSubmitEditing = {() => password1.current.focus()}
                                />
                            </View>
                        </View>
                        
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
                                ref = {password1}
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
                            onPress = {props.handleSubmit}
                            loading = {props.isSubmitting}
                            disabled = {props.isSubmitting}
                        />
                    </View>
                </View>
            }      
            </Formik>

            </View>
        </SafeAreaView>
    );
}

export default Signinscreen

const styles = StyleSheet.create({

    text1:{
        display: 'flex',
        top: 26,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    title:{
        color: colors.blue2,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20
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
