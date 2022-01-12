import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, ImageBackground, TextInput, Pressable, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as ImagePicker from 'expo-image-picker'
import Modal from 'react-native-modal'

import { colors } from '../global/styles'
import Headercomponent from '../components/HeaderComponent'
import { getUserDetails } from '../redux/actions/userActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Editprofilescreen = ({navigation}) => {

    const userDetail = useSelector((state) => state.userDetail)
    const { user } = userDetail

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const [modalVisible, setModalVisible] = useState(false)
    const [name, setName] = useState('')
    const [phone_number, setPhone_number] = useState('')
    const [email, setEmail] = useState('')
    const [image1, setImage] = useState(null)

    const dispatch = useDispatch()

    const formikRef = useRef()
    const mobile1 = useRef('mobile')
    const email1 = useRef('email')

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
            })
            setModalVisible(false)
            setImage(image.uri)
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
            })
            setModalVisible(false)
            setImage(image.uri)
        }
    }

    const initialValues = {name: name ? name : '', phone_number: phone_number ? phone_number : '',
                             email: email ? email : ''}

    useEffect(() => {
        dispatch(getUserDetails(userInfo._id))
        setName(user.name)
        setPhone_number(user.phone)
        setEmail(user.email)
        setImage(user.image)
    }, [navigation])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Account' />

            <View style = {styles.container}>
                <View style = {styles.view}>
                    <Text style = {styles.text}>Profile</Text>
                    <Pressable onPress = {() => setModalVisible(true)} >
                        <ImageBackground 
                            style = {styles.image} 
                            source = {user.image ? {uri: image1} : require('../../assets/user.png')}
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

                <View style = {styles.view2}>
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
                        <View style = {{padding: 20}}>
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
                                        keyboardType = 'email-address'
                                        autoFocus = {false}
                                        style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                                        onChangeText = {props.handleChange('email')}
                                        value = {props.values.email}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                    </Formik> 
                </View>
                <View style = {{top: SCREEN_HEIGHT/1.35, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                    <Button 
                        title = 'Update Account'
                        buttonStyle = {styles.button}
                        onPress = {formikRef.handleSubmit}
                        loading = {formikRef.isSubmitting}
                        disabled = {formikRef.isSubmitting}
                    />
                </View>
            </View>

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
        alignItems: 'center'
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
