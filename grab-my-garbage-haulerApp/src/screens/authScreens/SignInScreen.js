import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TextInput, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'

import { colors } from '../../global/styles'
import { getPushToken } from '../../helpers/notificationHelper'

import { Login } from '../../redux/actions/userActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const initialValues = {email: '', password: ''}

const Signinscreen = () => {
    const dispatch = useDispatch()

    const [show, setShow] = useState(false)

    const formikRef = useRef()
    const password1 = useRef('password')

    const userLogin = useSelector(state => state.userLogin)
    const {success, error} = userLogin

    const signInSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email address is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters'),
    })

    const handleLogin = async(values) => {
        dispatch(Login({email: values.email, password: values.password, pushId: await getPushToken()}))
    }

    useEffect(() => {
        if(error)
        {
            Alert.alert('Login Failed', error,
                [
                    {
                        text: 'Ok',
                    }
                ],
                {
                    cancelable: true
                }
            )
            formikRef.current.setSubmitting(false)
        } else if(success === true) {
            formikRef.current.setSubmitting(false)
        }
    }, [error])

    return (
        <SafeAreaView>
            <View style = {styles.view1}>
                <Text style = {styles.text1}>Login</Text>
            </View>
            <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.grey9}}>
                <View style = {{alignItems: 'center', marginTop: 20, height: SCREEN_HEIGHT/20}}>
                    <Text style = {styles.text2}>Please enter the name and password</Text>
                    <Text style = {styles.text2}>given to your account</Text>
                </View>

                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    validationSchema = {signInSchema}
                    validateOnMount = {false}
                    validateOnBlur = {false}
                    validateOnChange = {false}
                    onSubmit = {(values, actions) => {
                        if(actions.validateForm) {
                            setTimeout(() => {
                                handleLogin(values)
                            }, 400)
                        } else {
                            actions.setSubmitting(false)
                        }
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
                            {props.errors.email && 
                                <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.email}</Text>}

                            <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10}}>
                                <Icon
                                    name = 'lock'
                                    type = 'material'
                                    color = {colors.grey1}
                                />
                                <TextInput
                                    secureTextEntry = {show ? false : true}
                                    placeholder = 'Password'
                                    autoCapitalize = 'none'
                                    autoComplete = {false}
                                    autoCorrect = {false}
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
                                            onPress = {() => setShow(!show)}
                                            type = 'material'
                                            iconStyle = {{marginLeft: 10}}
                                            color = {colors.grey1}
                                        />) : (
                                        <Icon
                                            name= 'visibility'
                                            onPress = {() => setShow(!show)}
                                            type = 'material'
                                            iconStyle = {{marginLeft: 10}}
                                            color = {colors.grey1}
                                        /> )
                                    }
                            </View>
                            {props.errors.password && 
                                <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.password}</Text>}

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
    button:{
        marginTop: SCREEN_HEIGHT/40,
        backgroundColor: colors.darkBlue,
        borderRadius: 10,
        height: 50,
    },
    view1:{
        backgroundColor: colors.white,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    text1:{
        color: colors.grey1,
        fontWeight: 'bold',
        fontSize: 23,
        marginTop: 15
    },

})
