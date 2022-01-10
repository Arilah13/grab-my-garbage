import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Icon, Button } from 'react-native-elements'
import { showMessage } from 'react-native-flash-message'
import * as Yup from 'yup'

import { colors } from '../../global/styles'
import { register } from '../../redux/actions/userActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const initialValues = {name:'', email: '', password: '', phone_number:''}

const Signupscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const [status, setStatus] = useState(false)
    const [validated, setValidated] = useState(false)

    const formikRef = useRef()
    const mobile1 = useRef('mobile')
    const email1 = useRef('email')
    const password1 = useRef('password')

    const userRegister = useSelector(state => state.userRegister)
    const {success, error} = userRegister

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

        if(!values.name) {
            errors.name = 'Name is required'
        } else if(values.name) {
            errors.name = null
        }

        const isNum = /^\d+$/
        if(!isNum.test(values.phone_number)) {
            errors.phone = 'Must be only digits'
        } else if(isNum.test(values.phone_number)) {
            errors.phone = null
        }

        if(errors.email !== null && errors.password !== null && errors.name !== null && errors.phone !== null){
            displayMessage(errors.email, errors.password, errors.name, errors.phone)
        } else if (errors.password !== null && errors.name === null && errors.email === null && errors.phone === null) {
            displayMessage(errors.password, null, null, null)
        } else if (errors.email !== null, errors.password === null && errors.name === null && errors.phone === null) {
            displayMessage(errors.email, null, null, null)
        } else if (errors.name !== null, errors.password === null && errors.email === null && errors.phone === null) {
            displayMessage(errors.name, null, null, null)
        } else if (errors.password !== null && errors.name !== null && errors.email === null && error.phone === null) {
            displayMessage(errors.password, errors.name, null, null)
        } else if (errors.password !== null && errors.name !== null && errors.email !== null && error.phone === null) {
            displayMessage(errors.password, errors.name, errors.email, null)
        } else if (errors.password !== null && errors.name === null && errors.email !== null && error.phone === null) {
            displayMessage(errors.password, errors.email, null, null)
        } else if (errors.password !== null && errors.name === null && errors.email === null && error.phone !== null) {
            displayMessage(errors.password, errors.phone, null, null)
        } else if (errors.password !== null && errors.name !== null && errors.email === null && error.phone !== null) {
            displayMessage(errors.password, errors.name, errors.phone, null)
        } else if (errors.password !== null && errors.name === null && errors.email !== null && error.phone !== null) {
            displayMessage(errors.password, errors.email, errors.phone, null)
        } else if (errors.password === null && errors.name !== null && errors.email !== null && error.phone === null) {
            displayMessage(errors.name, errors.email, null, null)
        } else if (errors.password === null && errors.name !== null && errors.email === null && error.phone !== null) {
            displayMessage(errors.name, errors.phone, null, null)
        } else if (errors.password === null && errors.name !== null && errors.email !== null && error.phone !== null) {
            displayMessage(errors.name, errors.phone, errors.email, null)
        } else if (errors.password === null && errors.name === null && errors.email !== null && error.phone !== null) {
            displayMessage(errors.email, errors.phone, null, null)
        }

        if(errors.email === null && errors.password === null && errors.name === null && errors.phone === null)
            setValidated(true)

    }

    const SignUp = (values) => {
        dispatch(register(values))
        setTimeout(() => setStatus(true), 200)
    }

    const displayMessage = (error, error1, error2, error3) => {
        if(error !== null && error1 === null && error2 === null && error3 === null)
            showMessage({
                message: error,
                type: 'danger',
                autoHide: true,
                animated: true,
                animationDuration: 150,
                duration: 800,
            })
        else if(error !== null && error1 !== null && error2 === null && error3 === null)
            showMessage({
                message: error + '\n' + error1,
                type: 'danger',
                autoHide: true,
                animated: true,
                animationDuration: 150,
                duration: 1200,
                style: {
                    height: 70
                }
            })
        else if(error !== null && error1 !== null && error2 !== null && error3 === null)
            showMessage({
                message: error + '\n' + error1 + '\n' + error2,
                type: 'danger',
                autoHide: true,
                animated: true,
                animationDuration: 150,
                duration: 1200,
                style: {
                    height: 70
                }
            })
        else
            showMessage({
                message: error + '\n' + error1 + '\n' + error2 + '\n' + error3,
                type: 'danger',
                autoHide: true,
                animated: true,
                animationDuration: 150,
                duration: 1500,
                style: {
                    height: 80
                }
            })
    }

    useEffect(() => {
        if(status)
        {
            if(success === true)
            {  
                setStatus(false)
                showMessage({
                    message: 'Account Creation Successful',
                    type: 'success',
                    autoHide: true,
                    animated: true,
                    animationDuration: 150,
                    duration: 800,
                })
                formikRef.current.resetForm()
                setTimeout(() => navigation.navigate('Home'), 800) 
            }
            else
            {
                setStatus(false)
                displayMessage(error, null, null, null)
            }
        }
    }, [SignUp])

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
            <View style = {{backgroundColor: colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                <View style = {styles.view1}>
                    <Text style = {styles.title}>Sign-Up</Text>
                </View>
                <KeyboardAvoidingView behavior = 'position'>
                <Formik 
                    initialValues = {initialValues} 
                    onSubmit = {(values, {setSubmitting}) => {
                        validate(values)
                        if(validated) {
                            setTimeout(() => {
                                setSubmitting(false)
                                SignUp(values)
                            }, 400)
                        } else {
                            setSubmitting(false)
                        }
                    }}
                    innerRef = {formikRef}
                >
                    {
                        (props) => (
                            <View style = {styles.view2}>
                                <View>
                                    <Text style = {{fontSize:15, color:colors.grey1}}>New on XpressFood ?</Text>
                                </View>
                                    <View>
                                        <TextInput 
                                            placeholder = 'Name'
                                            style = {styles.textInput}
                                            autoFocus = {false}
                                            onChangeText = {props.handleChange('name')}
                                            value = {props.values.name}
                                            onSubmitEditing = {() => mobile1.current.focus()}
                                        />
                                        <TextInput 
                                            placeholder = 'Mobile Number'
                                            style = {styles.textInput}
                                            keyboardType = 'number-pad'
                                            autoFocus = {false}
                                            onChangeText = {props.handleChange('phone_number')}
                                            value = {props.values.phone_number}
                                            ref = {mobile1}
                                            onSubmitEditing = {() => email1.current.focus()}
                                        />                                     
                                    </View>

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
                                                style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                                                autoFocus = {false}
                                                keyboardType = 'email-address'
                                                onChangeText = {props.handleChange('email')}
                                                value = {props.values.email}
                                                ref = {email1}
                                                onSubmitEditing = {() => password1.current.focus()}
                                            />
                                        </View>
                                    </View>

                                    <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10}}>
                                        <Icon 
                                            name = 'lock'
                                            color = {colors.grey1}
                                            type = 'material'
                                        />
                                        <TextInput 
                                            placeholder = 'Password'
                                            secureTextEntry = {show ? false : true}
                                            style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                                            autoFocus = {false}
                                            onChangeText = {props.handleChange('password')}
                                            value = {props.values.password}
                                            ref = {password1}
                                        />
                                        {
                                            show ? (
                                                <Icon 
                                                name = 'visibility-off'
                                                onPress = {handleVisibility}
                                                color = {colors.grey1}
                                                type = 'material'
                                                />
                                                ) : (
                                                <Icon 
                                                name = 'visibility'
                                                onPress = {handleVisibility}
                                                color = {colors.grey1}
                                                type = 'material'
                                                />
                                            )
                                        } 
                                    </View>

                                    <View style = {styles.view3}>
                                        <Text style = {{fontSize:13}}>By Creating or logging into an account you are</Text>
                                        <View style = {{flexDirection:'row'}}>
                                            <Text style = {{fontSize:13}}>agreeing with our </Text>
                                            <Text style = {styles.text4}> Terms & Conditions</Text>
                                            <Text style = {{fontSize:13}}> and </Text>
                                        </View>
                                        <Text style = {styles.text4}> Privacy Statement</Text>
                                    </View>
                                    <View>
                                        <Button 
                                            title = 'Create my account'
                                            buttonStyle = {styles.button}
                                            onPress = {props.handleSubmit}
                                            loading = {props.isSubmitting}
                                            disabled = {props.isSubmitting}
                                        />
                                    </View>
                            </View>
                        )
                    }
                </Formik>
                </KeyboardAvoidingView>
                <View style = {styles.view5}>
                    <Text style = {{fontSize:15, fontWeight:'bold',}}>OR</Text>
                </View>
                <View style = {styles.view6}>
                    <View>
                        <Text>Already have an account with XpressFood?</Text>
                    </View>
                    <View>
                        <Button
                            title = 'Sign-In'
                            buttonStyle = {{...styles.button, marginTop: 5, height: 45, width: SCREEN_WIDTH/3.5, alignSelf: 'flex-end'}}
                            onPress = {() => {navigation.navigate('SignIn')}}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Signupscreen

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row',
        zIndex: 10
    },
    text1:{
        display: 'flex',
        top: 26,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    view1:{
        justifyContent:'center',
        alignItems:'flex-start',
        marginTop:10,
        marginBottom:10,
        paddingHorizontal:15,
        height: SCREEN_HEIGHT/20
    },
    title:{
        color: colors.blue2,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20
    },
    view2:{
        justifyContent:'flex-start',
        backgroundColor:'white',
        paddingHorizontal:15,
        height: 6.3*SCREEN_HEIGHT/10
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
    view3:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    text4:{
        textDecorationLine:'underline',
        color:'green',
        fontSize:13
    },
    button:{
        marginTop: SCREEN_HEIGHT/40,
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    view5:{
        justifyContent:'flex-start',
        alignItems:'center',
        paddingTop:15,
        height: 0.5*SCREEN_HEIGHT/10
    },
    view6:{
        backgroundColor:'white',
        paddingHorizontal:15,   
        height: 2.2*SCREEN_HEIGHT/10 
    },

})
