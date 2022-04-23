import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TextInput, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Icon, SocialIcon, Button } from 'react-native-elements'
import * as Google from 'expo-google-app-auth'
import * as Facebook from 'expo-facebook'
import * as Yup from 'yup'

import { colors } from '../../global/styles'
import { ANDROID_CLIENT_ID } from '@env'
import { getPushToken } from '../../helpers/notificationHelper'

import { specialLogin, specialLoginFB ,Login } from '../../redux/actions/userActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const initialValues = {email: '', password: ''}

const Signinscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const [googleSubmitting, setGoogleSubmitting] = useState(false)
    const [fbSubmitting, setFbSubmitting] = useState(false)
    const [status, setStatus] = useState(false)

    const formikRef = useRef()
    const password1 = useRef('password')

    const userLogin = useSelector(state => state.userLogin)
    const {success, error} = userLogin

    const handleVisibility = () => {
        setShow(!show)
    }

    const signInSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email address is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters'),
    })

    const handleLogin = (values) => {
        dispatch(Login(values.email, values.password))
        setTimeout(() => setStatus(true), 200)
    }

    const handleGoogleSignIn = async() => {
        setGoogleSubmitting(true)
        const config = {
            androidClientId: ANDROID_CLIENT_ID,
            scopes: ['profile', 'email']
        }

        Google
            .logInAsync(config)
            .then(async(result) => {
                const {type, user} = result

                dispatch(specialLogin({user, notification_token: await getPushToken()}))

                if(type === 'success') 
                {          
                    setGoogleSubmitting(false)  
                }
                else
                {
                    setGoogleSubmitting(false)
                    Alert.alert('Google SignIn UnSuccessful',
                    [
                        {
                            text: 'Ok',
                        }
                    ],
                    {
                        cancelable: true
                    }
                    )
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const handleFacebookSignIn = async() => {
        setFbSubmitting(true)
        try {
            await Facebook.initializeAsync({
                appId: '619829139115277',
            });
            const { type, token } =
                await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
                });
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${token}`)
            setFbSubmitting(false)
            if (type === 'success') {
                const data = await response.json()
                dispatch(specialLoginFB({email: data.email, name: data.name, id: data.id, token, notification_token: await getPushToken()}))
            }
        } catch ({ message }) {
            Alert.alert(`Facebook Login Error: ${message}`);
        }
    }

    useEffect(() => {
        if(status)
        {
            if(success === true)
            {  
                setStatus(false)
                formikRef.current.setSubmitting(false)
                formikRef.current.resetForm()
            }
            else
            {
                setStatus(false)
                formikRef.current.setSubmitting(false)
                // Alert.alert(error,
                //     [
                //         {
                //             text: 'Ok',
                //         }
                //     ],
                //     {
                //         cancelable: true
                //     }
                // )
            }
        }
    }, [userLogin])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style = {{marginTop: SCREEN_HEIGHT/10}}>

            </View>
            <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.white, borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
            <View style = {{marginLeft: 4, marginTop: 20, height: SCREEN_HEIGHT/20 }}>
                <Text style = {styles.title}>Sign In</Text>
            </View>
            <View style = {{alignItems: 'center', marginTop: 0, height: SCREEN_HEIGHT/20}}>
                <Text style = {styles.text2}>Please enter the name and password</Text>
                <Text style = {styles.text2}>registered with your account</Text>
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
                    onPress = {handleFacebookSignIn}
                    loading = {fbSubmitting}
                    disabled = {fbSubmitting}
                />
                <SocialIcon
                    title = 'Sign In With Google'
                    button
                    type = 'google'
                    style = {styles.SocialIcon}
                    onPress = {handleGoogleSignIn}
                    loading = {googleSubmitting}
                    disabled = {googleSubmitting}
                />
            </View>

            <View style = {{marginLeft: 5, height: 2*SCREEN_HEIGHT/20, flexDirection: 'row'}}>
                <Text style={{...styles.text1, top: 10}}>New on grab-my-trash?</Text>
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
