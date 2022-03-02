import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, ImageBackground, TextInput, Pressable, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as ImagePicker from 'expo-image-picker'
import Modal from 'react-native-modal'
import * as Yup from 'yup'

import { colors } from '../../global/styles'
import Headercomponent from '../../components/headerComponent'
import { getUserDetails, updateUserProfile } from '../../redux/actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../../redux/constants/userConstants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Editprofilescreen = ({navigation}) => {

    const userDetail = useSelector((state) => state.userDetail)
    const { user } = userDetail

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { userInfo: info, success } = userUpdateProfile

    const [modalVisible, setModalVisible] = useState(false)
    const [image1, setImage1] = useState(null)
    const [image2, setImage2] = useState(null)
    const [imageSet, setImageSet] = useState(false)

    const dispatch = useDispatch()

    const mobile1 = useRef('mobile')
    const email1 = useRef('email')
    const formikRef = useRef()

    const initialValues = {name: user.name ? user.name : '', phone_number: user.phone ? user.phone : '',
                             email: user.email ? user.email : '', image : imageSet ? image2 : user.image}

    const selectGallery = async() => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          setModalVisible(false)
        }else{
            let image = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,5],
                quality: 0,
                base64: true
            })
            if(!image.cancelled) {
                setImageSet(true)
                setImage1(image.uri)
                setImage2(image.base64)
                formikRef.current.handleChange('image')
            }
            setModalVisible(false)
        }
    }
    const selectCamera = async() => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
            setModalVisible(false)
        }else{
            let image = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,5],
                quality: 0,
                base64: true
            })
            if(!image.cancelled) {
                setImageSet(true)
                setImage1(image.uri)
                setImage2(image.base64)
                formikRef.current.handleChange('image')
            }
            setModalVisible(false)
        }
    }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const profileSchema = Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        phone_number: Yup.string()
          .matches(phoneRegExp, 'Phone number is not valid')
          .min(10, 'Phone number should contain only 10 digits')
          .max(10, 'Phone number should contain only 10 digits'),
        email: Yup.string().email('Invalid email address').required('Email address is required'),
    })

    useEffect(() => {
        if(success === true) {
            dispatch(getUserDetails(user._id))
            dispatch({ type: USER_UPDATE_PROFILE_RESET })
            Alert.alert('Profile Update Successful', 'Profile Details have been updated successfully',
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
    }, [info, success])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Account' />
            <KeyboardAvoidingView behavior = 'position' keyboardVerticalOffset = {-160}>
            <View style = {styles.container}>
                <View style = {styles.view}>
                    <Text style = {styles.text}>Profile</Text>
                    <Pressable onPress = {() => setModalVisible(true)} >
                        <ImageBackground 
                            style = {styles.image} 
                            source = {imageSet ? {uri: image1} : user.image ? {uri: user.image} : require('../../../assets/user.png')}
                        >
                            <Icon
                                type = 'material'
                                name = 'add-a-photo'
                                color = {colors.error}
                                style = {styles.icon}
                            />
                        </ImageBackground>
                    </Pressable>
                </View>

                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    validateOnMount = {false}
                    validateOnBlur = {false}
                    validateOnChange = {false}
                    validationSchema = {profileSchema}
                    onSubmit = {(values, actions) => {
                        if(actions.validateForm) {
                            setTimeout(() => {
                                actions.setSubmitting(false)
                                dispatch(updateUserProfile(values))
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
                        <View style = {styles.view2}>
                            <View style = {{padding: 20}}>
                                <View>
                                    <TextInput 
                                        placeholder = 'Name'
                                        style = {{...styles.textInput, borderColor: colors.blue2, borderWidth: 1}}
                                        autoFocus = {false}
                                        onChangeText = {props.handleChange('name')}
                                        value = {props.values.name}
                                        onSubmitEditing = {() => !props.values.phone_number && mobile1.current.focus()}
                                    />
                                    {props.errors.name && props.touched.name && 
                                        <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.name}</Text>}
                                    <TextInput 
                                        placeholder = 'Mobile Number'
                                        style = {styles.textInput}
                                        keyboardType = 'number-pad'
                                        autoFocus = {false}
                                        onChangeText = {props.handleChange('phone_number')}
                                        value = {props.values.phone_number}
                                        ref = {mobile1}
                                        onSubmitEditing = {() => !props.values.email && email1.current.focus()}
                                    />          
                                    {props.errors.phone_number && props.touched.phone_number && 
                                        <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.phone_number}</Text>}                           
                                </View>
                                <View style = {{flexDirection: 'row', ...styles.textInput, alignItems: 'center', paddingLeft: 10, borderColor: colors.blue2, borderWidth: 1}}>
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
                                            ref = {email1}
                                        />
                                    </View>     
                                </View>
                                {props.errors.email && props.touched.email && 
                                    <Text style = {{marginLeft: SCREEN_WIDTH/20, color: colors.error}}>{props.errors.email}</Text>   
                                }
                            </View>
                        </View>
                        
                        <View style = {{top: SCREEN_HEIGHT/1.35, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                            <Button 
                                title = 'Update Account'
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
            </KeyboardAvoidingView>
            <Modal 
                isVisible = {modalVisible}
                swipeDirection = {'down'}
                style = {{ justifyContent: 'flex-end', margin: 0 }}
                deviceHeight = {SCREEN_HEIGHT}
                deviceWidth = {SCREEN_WIDTH}
                onBackButtonPress = {() => setModalVisible(false)}
                onBackdropPress = {() => setModalVisible(false)}
            >
                <View style = {styles.view3}>
                    <Text style = {styles.text2}>Choose from</Text>
                    <TouchableOpacity
                        onPress = {() => selectGallery()}
                    >
                        <Icon
                            type = 'material'
                            name = 'collections'
                            color = {colors.blue5}
                            size = {20}
                            style = {{
                                alignSelf: 'flex-start',
                                marginTop: '6%',
                                marginLeft: '8%',
                            }}
                        />
                        <Text style = {{...styles.button2, color: colors.blue5, position: 'absolute'}}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => selectCamera()}
                    >
                        <Icon
                            type = 'material'
                            name = 'photo-camera'
                            color = {colors.blue5}
                            size = {20}
                            style = {{
                                alignSelf: 'flex-start',
                                marginTop: '6%',
                                marginLeft: '8%',
                            }}
                        />
                        <Text style = {{...styles.button2, color: colors.blue5, position: 'absolute'}}>Camera</Text>
                    </TouchableOpacity>
                </View>                
            </Modal>

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
        alignItems: 'center',
    },
    view2:{
        height: 6*SCREEN_HEIGHT/10,
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
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    view3:{
        backgroundColor: colors.white,
        height: '25%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    text2:{
        marginTop: '8%',
        marginLeft: '8%',
        fontWeight: 'bold',
        color: colors.blue2,
        fontSize: 15
    },
    button2:{
        marginTop: '6%',
        marginLeft: '18%',
    }
})
