import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Icon } from 'react-native-elements'
import { MultiselectDropdown } from 'sharingan-rn-modal-dropdown'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import * as ImagePicker from 'expo-image-picker'
import Modal from 'react-native-modal'
import { DefaultTheme } from 'react-native-paper'
import { Formik } from 'formik'

import { colors } from '../global/styles'
import { trashCategoryData } from '../global/data'
import Headercomponent from '../components/HeaderComponent'
import { storeSpecialPickupTemp } from '../redux/actions/pickupActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Specialpickupscreen = ({navigation}) => {

    const formikRef = useRef()
    const dispatch = useDispatch()

    const [categories, setCategories] = useState([])
    const [weight, setWeight] = useState(0.0)
    const [dateTime, setDateTime] = useState(new Date())
    const [showDateTime, setShowDateTime] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [image1, setImage] = useState(null)
    const [category1, setCategory1] = useState([])

    const map = useSelector((state) => state.map)
    const { address, latitude, longitude } = map

    const specialPickup = useSelector(state => state.specialPickup)
    const { pickupInfo } = specialPickup
    
    let array_address = address.split(',')
    let address_new = array_address[0] + ', ' + array_address[1]
    let date1 = new Date()
    let date2 = new Date()
    let formattedDate = dateTime.toDateString().split(' ')
    let formattedTime = dateTime.toLocaleTimeString().split(':')

    const initialValues = {location: map ? ({latitude, longitude}) : '', date: (dateTime) ? (dateTime) : '', 
                            category: category1 ? category1 : '',  solid_weight: weight ? Math.round(weight*10)/10 : '', 
                            photo: image1 ? image1 :'', categories: categories ? categories : ''}

    let category = []  

    const onChangeCategory = (value) => {
        setCategories(value)
        value.map(i => {
            category.push(trashCategoryData[i].label)
        })
        setCategory1(category)
    } 
    const addWeight = (weight) => {
        setWeight(weight + 0.1)
    }
    const reduceWeight = (weight) => {
        if(weight > 0.1)
            setWeight(weight - 0.1)
        else
            setWeight(0.0)
    }
    const handleConfirmDateTime = (dateTime) => {
        setShowDateTime(false)
        setDateTime(dateTime)
    }
    const changeDate = () => {
        date1.setDate(date1.getDate() + 1)
        date2.setDate(date2.getDate() + 30)
    }
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
            setModalVisible(false)
            setImage(image.base64)
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
            setModalVisible(false)
            setImage(image.base64)
        }
    }

    useEffect(() => {
        formattedDate = dateTime.toDateString().split(' ')
        formattedTime = dateTime.toLocaleTimeString().split(':')
        changeDate()
    }, [handleConfirmDateTime])

    useEffect(() => {
        if(pickupInfo !== undefined) {
            setDateTime(pickupInfo.date)
            setCategory1(pickupInfo.category)
            setWeight(pickupInfo.solid_weight)
            setImage(pickupInfo.photo)
            setCategories(pickupInfo.categories)
        }
    }, [])
 
    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
            >
            <Headercomponent name = 'Home' />    

            <Formik
                initialValues = {initialValues}
                enableReinitialize
                validateOnMount = {false}
                validateOnBlur = {false}
                validateOnChange = {false}
                onSubmit = {(values, actions) => {
                    if(actions.validateForm) {
                        setTimeout(() => {
                            dispatch(storeSpecialPickupTemp(values))
                            actions.setSubmitting(false)
                            navigation.navigate('PaymentMethod', {
                                name: 'Special',
                            })
                        }, 400)
                    } else {
                        actions.setSubmitting(false)
                    }
                }}
                innerRef = {formikRef}
            >
            { (props) =>
                <>
                    <View style = {{backgroundColor: colors.grey8, borderTopStartRadius: 30, borderTopEndRadius: 30}}>
                        <View style = {styles.container2}>
                            <Pressable onPress = {() => navigation.navigate('Destination')}>
                                <Icon 
                                    type = 'feather'
                                    name = 'map-pin'
                                    color = {colors.blue5}
                                    size = {25}
                                    style = {{
                                        marginTop: 30,
                                        alignSelf: 'flex-start'
                                    }}
                                />
                                <Text style = {styles.text2}>Pick Up Location</Text>
                                <Text style = {styles.text3}>{address === ('Current Location' || 'Home') ? address : address_new}</Text>
                                <Icon 
                                    type = 'material-community'
                                    name = 'dots-vertical'
                                    color = {colors.blue5}
                                    size = {25}
                                    style = {{
                                        //alignSelf: 'flex-end',
                                        //marginRight: 5,
                                        //bottom: 15,
                                        position: 'absolute'
                                    }}
                                />
                            </Pressable>               
                        </View>
                        
                        <View style = {styles.container3} >
                            <Text style = {styles.text4}>Schedule Pickup</Text>
                            <View style = {styles.view8}>
                                <Icon
                                    type = 'material'
                                    name = 'schedule'
                                    color = {colors.blue5}
                                    size = {20}
                                    style = {{
                                        alignSelf: 'flex-start',
                                        marginTop: 15,
                                        marginLeft: 10,
                                        display: 'flex'
                                    }}
                                />
                                <Text style = {styles.text6}>Select Time</Text>
                                <Pressable onPress = {() => setShowDateTime(true)}>
                                    <View style = {styles.view7}>
                                        <Icon
                                            type = 'material'
                                            name = 'date-range'
                                            color = {colors.blue5}
                                            size = {20}
                                            style = {{
                                                alignSelf: 'flex-start',
                                                marginTop: 12,
                                                marginLeft: 10
                                            }}
                                        />
                                        <Text style = {styles.text11}>{formattedDate[0]} {formattedDate[1]} {formattedDate[2]}  {formattedTime[0]}:{formattedTime[1]} {formattedTime[2].split(' ')[1]}</Text>
                                        <DateTimePickerModal
                                            isVisible = {showDateTime}
                                            date = {dateTime}
                                            mode = 'datetime'
                                            onConfirm = {(dateTime) => handleConfirmDateTime(dateTime)}
                                            onCancel = {() => setShowDateTime(false)}
                                            minimumDate = {date1}
                                            maximumDate = {date2}
                                            minuteInterval = {15}
                                            is24Hour = {false}
                                        />
                                    </View>
                                </Pressable>
                            </View>

                            <Text style = {styles.text5}>Trash Categories</Text>
                            <View style = {styles.view1}>
                                <Icon
                                    type = 'material'
                                    name = 'unfold-more'
                                    color = {colors.blue5}
                                    size = {20}
                                    style = {{
                                        alignSelf: 'flex-start',
                                        marginTop: 15,
                                        marginLeft: 10,
                                        display: 'flex'
                                    }}
                                />
                                <Text style = {styles.text6}>Select Category</Text>
                                <View style = {styles.container4}>
                                    <MultiselectDropdown
                                        label = 'Select Category'
                                        data = {trashCategoryData}
                                        enableSearch = {false}
                                        enableAvatar
                                        chipType = "outlined"
                                        value = {categories}
                                        onChange = {onChangeCategory}
                                        floating = {false}
                                        primaryColor = {colors.blue2}
                                        underlineColor = 'transparent'
                                        selectedItemTextStyle = {{ fontWeight: 'bold' }}
                                        textInputStyle = {{ 
                                            backgroundColor: colors.white,
                                            borderTopRightRadius: 20,
                                            borderTopLeftRadius: 20,
                                            borderRadius: 20,
                                            height: 55,
                                            marginLeft: 10,
                                        }}
                                        disabledItemTextStyle = {{
                                            color: colors.black
                                        }}
                                        chipTextStyle = {{
                                            color: colors.blue4
                                        }}       
                                        paperTheme = {DefaultTheme}  
                                        disableSort = {true}                      
                                    />
                                </View>
                            </View>                  

                            <Text style = {styles.text5}>Weight Estimation</Text>
                            <View style = {styles.view2}>
                                <View>
                                    <Pressable style = {styles.view4} onPress = {() => reduceWeight(weight)}><Text style = {styles.text8}>-</Text></Pressable>
                                    <View style = {styles.view5}><Text style = {styles.text9}>{weight.toFixed(1)}</Text></View>
                                    <Pressable style = {styles.view6} onPress = {() => addWeight(weight)}><Text style = {styles.text8}>+</Text></Pressable>
                                    <Text style = {styles.text10}>kg</Text>
                                </View>
                            </View>

                            <Text style = {styles.text5}>Optional</Text>
                            <View style = {{...styles.view3, height: 120}}>
                                <Icon
                                    type = 'material'
                                    name = 'add-a-photo'
                                    color = {colors.blue5}
                                    size = {20}
                                    style = {{
                                        alignSelf: 'flex-start',
                                        marginTop: 15,
                                        marginLeft: 10,
                                        display: 'flex'
                                    }}
                                />
                                <Text style = {{...styles.text6, marginLeft: 2}}>Additional Photos</Text>
                                <TouchableOpacity style = {styles.view9} onPress = {() => setModalVisible(true)}>
                                    <Icon
                                        type = 'material-community'
                                        name = 'file-image-outline'
                                        color = {colors.blue5}
                                        size = {20}
                                        style = {{
                                            alignSelf: 'flex-start',
                                            marginTop: 15,
                                            marginLeft: 10,
                                            display: 'flex'
                                        }}
                                    />
                                    <Text style = {styles.text12}>{image1 === null ? 'No photo attached' : 'Photo attached'}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <Button
                                title = 'Continue'
                                buttonStyle = {styles.button}
                                onPress = {props.handleSubmit}
                                loading = {props.isSubmitting}
                                disabled = {props.isSubmitting}
                            />
                        </View>
                    </View>
                </>
                }
                </Formik>
            </ScrollView>

            <Modal 
                isVisible = {modalVisible}
                swipeDirection = {'down'}
                style = {{ justifyContent: 'flex-end', margin: 0 }}
                onBackButtonPress = {() => setModalVisible(false)}
                onBackdropPress = {() => setModalVisible(false)}
            >
                <View style = {styles.view10}>
                    <Text style = {styles.text13}>Choose from</Text>
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

export default Specialpickupscreen

const styles = StyleSheet.create({

    container2:{
        backgroundColor: colors.grey8,
        paddingLeft: 25, 
        height: SCREEN_HEIGHT/8,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30
    },
    text2:{
        color: colors.blue7,
        left: 40,
        bottom: 30
    },
    text3:{
        color: colors.blue2,
        left: 40,
        bottom: 30,
        fontWeight: 'bold'
    },
    container3:{
        backgroundColor: colors.white,
        padding: 25, 
        height: "87%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text4:{
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16,
    },
    view1:{
        backgroundColor: colors.grey9,
        height: 150,
        borderRadius: 15,
        marginTop: 10,
    },
    text5:{
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 20
    },
    view2:{
        backgroundColor: colors.blue1,
        height: SCREEN_HEIGHT/8,
        borderRadius: 15,
        marginTop: 10,
    },
    view3:{
        backgroundColor: colors.blue1,
        height: SCREEN_HEIGHT/7,
        borderRadius: 15,
        marginTop: 10,
    },
    button:{
        marginTop: 20,
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50
    },
    text6:{
        left: 40,
        bottom: 21,
        color: colors.blue2,
        fontSize: 14,
        fontWeight: 'bold'
    },
    container4:{
        top: -15,
        marginLeft: 35,
        marginRight: 20,
        flex: 1,
    },
    view4:{
        backgroundColor: colors.green1,
        position: 'absolute',
        marginLeft: SCREEN_WIDTH/4,
        marginTop: SCREEN_HEIGHT/42,
        width: 40,
        height: 60,
        borderRadius: 15,
        zIndex: 1
    },
    view5:{
        backgroundColor: colors.grey8,
        height: 60,
        width: 70,
        marginLeft: SCREEN_WIDTH/3.2,
        marginTop: SCREEN_HEIGHT/44
    },
    view6: {
        backgroundColor: colors.green1,
        position: 'absolute',
        marginLeft: SCREEN_WIDTH/2.17,
        marginTop: SCREEN_HEIGHT/42,
        width: 40,
        height: 60,
        borderRadius: 15,
        zIndex: 1
    },
    text8:{
        left: 17,
        top: 16,
        fontSize: 19,
        fontWeight: 'bold',
        color: colors.blue2
    },
    text9:{
        left: 27,
        top: 18,
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.blue2
    },
    text10:{
        left: "70%",
        bottom: 40,
        color: colors.grey
    },
    view7:{
        width: "82%",
        height: 45,
        left: 43,
        bottom: 10,
        backgroundColor: colors.white,
        borderRadius: 20
    },
    view8:{
        backgroundColor: colors.grey9,
        height: 110,
        borderRadius: 15,
        marginTop: 10,
    },
    text11:{
        color: colors.blue4,
        marginTop: -20,
        marginLeft: 40,
        fontWeight: 'bold'
    },
    view9:{
        position: 'absolute',
        height: 55,
        width: '78%',
        left: '12%',
        top: '40%',
        borderRadius: 15,
        backgroundColor: colors.white
    },
    text12:{
        color: colors.blue4,
        marginTop: -20,
        marginLeft: 40,
    },
    view10:{
        backgroundColor: colors.white,
        height: '25%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    text13:{
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