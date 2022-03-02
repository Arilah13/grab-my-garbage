import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { colors } from '../../global/styles'
import Headercomponent from '../../components/headerComponent'
import { updateUserPassword } from '../../redux/actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../../redux/constants/userConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Changepasswordscreen = () => {
    const dispatch = useDispatch()

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)

    const formikRef = useRef()
    const password1 = useRef('password')

    const initialValues = { password: '', password_1: '' }

    const passwordSchema = Yup.object().shape({
        password: Yup.string()
                    .required('Password is required')
                    .min(6, 'Password must be atleast 6 characters')
                    .max(50, 'Password must not be more than 50 characters'),
        password_1: Yup.string()
                    .required('Confirm Password is required')
                    .min(6, 'Password must be atleast 6 characters')
                    .max(50, 'Password must not be more than 50 characters')
                    .oneOf([Yup.ref('password'), null], "Passwords don't match")
    })

    const handleVisibility = () => {
        setShow(!show)
    }
    const handleVisibility1 = () => {
        setShow1(!show1)
    }

    useEffect(() => {
        if(success === true) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET })
            Alert.alert('Profile Password Update Successful', 'Profile Password Detail has been updated successfully',
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
    }, [success])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Account' />

            <View style = {styles.container2}>
                <Text style = {styles.text2}>Change Password</Text>

                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    validateOnMount = {false}
                    validateOnBlur = {false}
                    validateOnChange = {false}
                    validationSchema = {passwordSchema}
                    onSubmit = {(values, actions) => {
                        if(actions.validateForm) {
                            setTimeout(() => {
                                actions.setSubmitting(false)
                                dispatch(updateUserPassword(values.password_1))
                            }, 400)
                        } else {
                            actions.setSubmitting(false)
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
                    {props.errors.password && 
                        <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.password}</Text>}

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
                    {props.errors.password_1 && 
                        <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.password_1}</Text>}
                    
                    <View style = {{top: SCREEN_HEIGHT/1.35, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                        <Button
                            title = 'Update Password'
                            buttonStyle = {styles.button}
                            onPress = {props.handleSubmit}
                            loading = {props.isSubmitting}
                            disabled = {props.isSubmitting}
                        />
                    </View>
                    </>
                }
                </Formik>
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
