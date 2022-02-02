import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'

import { colors } from '../../global/styles'
import { register } from '../../redux/actions/userActions'
import Headercomponent from '../../components/HeaderComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const initialValues = {name:'', email: '', password: '', password_1: ''}

const Signupscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const [show, setShow] = useState(false)
    const [status, setStatus] = useState(false)

    const formikRef = useRef()
    const email1 = useRef('email')
    const password1 = useRef('password')
    const password2 = useRef('password2')

    const userRegister = useSelector(state => state.userRegister)
    const {success, error} = userRegister

    const handleVisibility = () => {
        setShow(!show)
    }

    const SignUp = (values) => {
        dispatch(register(values))
        setTimeout(() => setStatus(true), 200)
    }

    const SignUpSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email address is required'),
        password_1: Yup.string()
            .required('Confirm Password is required')
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters')
            .oneOf([Yup.ref('password'), null], "Passwords don't match")
    })

    useEffect(() => {
        if(status)
        {
            if(success === true)
            {  
                setStatus(false)
                formikRef.current.resetForm()
                setTimeout(() => navigation.navigate('Home'), 800) 
            }
            else
            {
                setStatus(false)
                Alert.alert('Account Creation UnSuccessful', error,
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
        }
    }, [SignUp])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style = {{height: SCREEN_HEIGHT/10}}>
                <Headercomponent name = 'Welcome' />
            </View>
            
            <Formik 
                initialValues = {initialValues} 
                enableReinitialize
                validationSchema = {SignUpSchema}
                validateOnMount = {false}
                validateOnBlur = {false}
                validateOnChange = {false}
                onSubmit = {(values, actions) => {
                    if(actions.validateForm) {
                        setTimeout(() => {
                            actions.setSubmitting(false)
                            SignUp(values)
                        }, 400)
                    } else {
                        actions.setSubmitting(false)
                    }
                }}
                innerRef = {formikRef}
            >
                {
                    (props) => (       
                        <ScrollView 
                            contentContainerStyle = {{height: 9.8*SCREEN_HEIGHT/10}}
                            style = {{backgroundColor: colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, height: 9*SCREEN_HEIGHT/10}}
                            showsVerticalScrollIndicator = {false}
                        >
                            <Text style = {styles.title}>Sign-Up</Text>

                            <Text style = {{fontSize:15, color:colors.grey1, marginHorizontal: 15}}>New on grab-my-trash ?</Text>
 
                            <View style = {styles.view1}>  
                                <TextInput 
                                    placeholder = 'Name'
                                    style = {styles.textInput}
                                    autoFocus = {false}
                                    onChangeText = {props.handleChange('name')}
                                    value = {props.values.name}
                                    onSubmitEditing = {() => email1.current.focus()}
                                />                                   
                                {props.errors.name && 
                                    <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.name}</Text>}

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
                                {props.errors.email && 
                                    <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.email}</Text>}

                                <KeyboardAvoidingView behavior = 'position'> 
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
                                        onSubmitEditing = {() => password2.current.focus()}
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
                                {props.errors.password && 
                                    <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.password}</Text>}

                                <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10}}>
                                    <Icon 
                                        name = 'lock'
                                        color = {colors.grey1}
                                        type = 'material'
                                    />
                                    <TextInput 
                                        placeholder = 'Confirm Password'
                                        secureTextEntry = {show ? false : true}
                                        style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                                        autoFocus = {false}
                                        onChangeText = {props.handleChange('password_1')}
                                        value = {props.values.password_1}
                                        ref = {password2}
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
                                {props.errors.password_1 && 
                                    <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.password_1}</Text>}
                    
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

                                <View style = {styles.view5}>
                                    <Text style = {{fontSize:15, fontWeight:'bold',}}>OR</Text>
                                </View>
                                </KeyboardAvoidingView>
                                <View style = {styles.view6}>
                                    <View>
                                        <Text>Already have an account with grab-my-trash?</Text>
                                    </View>
                                    <View>
                                        <Button
                                            title = 'Sign-In'
                                            buttonStyle = {{...styles.button, marginTop: 5, height: 45, width: SCREEN_WIDTH/3, alignSelf: 'flex-end'}}
                                            onPress = {() => {navigation.navigate('SignIn')}}
                                        />
                                    </View>
                                </View>
                            </View>   
                        </ScrollView> 
                    )
                }
            </Formik>
        </SafeAreaView>
    );
}

export default Signupscreen

const styles = StyleSheet.create({
 
    title:{
        color: colors.blue2,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 35,
        marginTop: 10,
        marginBottom: 10
    },
    view1:{
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        height: 19*SCREEN_HEIGHT/20
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
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    text4:{
        textDecorationLine: 'underline',
        color: 'green',
        fontSize: 13
    },
    button:{
        marginTop: SCREEN_HEIGHT/40,
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    view5:{
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    view6:{
        backgroundColor: 'white',
        paddingHorizontal: 5,   
    },

})
