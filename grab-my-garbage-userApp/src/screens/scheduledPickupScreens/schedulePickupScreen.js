import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Dropdown, MultiselectDropdown } from 'sharingan-rn-modal-dropdown'
import { DefaultTheme } from 'react-native-paper'
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
 
import { colors } from '../../global/styles'
import { timeIntervalData, dayData } from '../../global/data'

import { storeScheduledPickupTemp } from '../../redux/actions/schedulePickupActions'

import Headercomponent from '../../components/headerComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Schedulepickupscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const [date1, setDate1] = useState(new Date())
    const [showDate1, setShowDate1] = useState(false)
    const [date2, setDate2] = useState(new Date())
    const [showDate2, setShowDate2] = useState(false)
    const [timeInterval, setTimeInterval] = useState(null)
    const [days, setDays] = useState([])
    const [days1, setDays1] = useState([])

    const map = useSelector((state) => state.map)
    const { address, latitude, longitude, city } = map
    
    var array_address = address.split(',')
    var address_new = array_address[0] + ', ' + array_address[1]

    var date_1 = new Date()
    var date_2 = new Date()
    var date_3 = new Date()
    let formattedDate1 = date1.toDateString().split(' ')
    let formattedDate2 = date2.toDateString().split(' ')

    const initialValues = {location: ({latitude, longitude, city}), from: date1, to: date2, 
                            days: days1, time: timeInterval}

    let Days = []

    const handleConfirmDate1 = (date) => {
        setShowDate1(false)
        setDate1(date)
    }
    const handleConfirmDate2 = (date) => {
        setShowDate2(false)
        setDate2(date)
    }
    const changeDate = () => {
        date_1.setDate(date_1.getDate() + 1)
        date_2.setDate(date_2.getDate() + 29)
        date_3.setDate(date_3.getDate() + 360)
    }
    const onChangeTime = (value) => {
        setTimeInterval(timeIntervalData[value].label)
    } 
    const onChangeDays = async(value) => {
        setDays(value)
        await value.map(i => {
            Days.push(dayData[i].label)
        })
        setDays1(Days)
    } 

    const validateForm = () => {
        if (days1.length !== 0 && timeInterval !== null && date1.getTime() >= new Date().getTime() + (500 * 100000) && date2.getTime() >= new Date().getTime() + + (500 * 100000))
            return true
        else
            return false
    }

    const alert = () => {
        if(date1.getDate() < new Date().getDate() + 1 && days1.length !== 0 && timeInterval !== null) {
            alertMsg('Date Not Selected', 'Pickup Date should be selected')
        } else if(days1.length === 0 && date1.getDate() >= new Date().getDate() + 1 && timeInterval !== null) {
            alertMsg('Day Not Selected', 'Atleast one day should be selected')
        } else if(days1.length !== 0 && date1.getDate() >= new Date().getDate() + 1 && timeInterval === null) {
            alertMsg('Time Interval Not Selected', 'Select a time interval')
        } else if(date1.getDate() < new Date().getDate() + 1 && days1.length === 0 && timeInterval !== null) {
            alertMsg('Date and Day Not Selected', 'Pickup Date and Day should be selected')
        } else if(date1.getDate() < new Date().getDate() + 1 && days1.length !== 0 && timeInterval === null) {
            alertMsg('Date and Time Not Selected', 'Pickup Date and Time should be selected')
        } else if(date1.getDate() >= new Date().getDate() + 1 && days1.length === 0 && timeInterval === null) {
            alertMsg('Day and Time Not Selected', 'Pickup Day and Time should be selected')
        } else {
            alertMsg('Day, Time and Date Not Selected', 'Pickup Date, Day and Time should be selected')
        }  
    }

    const alertMsg = (heading, msg) => {
        Alert.alert(heading, msg,
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

    useEffect(() => {
        formattedDate1 = date1.toDateString().split(' ')
        formattedDate2 = date2.toDateString().split(' ')
        changeDate()
    }, [handleConfirmDate1, handleConfirmDate2])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <ScrollView
                stickyHeaderIndices = {[0]}
                showsVerticalScrollIndicator = {false}
                style = {{height: SCREEN_HEIGHT}}
            >
                <Headercomponent name = 'Home' destination = 'Home'/>

                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    validateOnMount = {false}
                    validateOnBlur = {false}
                    validateOnChange = {false}
                    onSubmit = {(values, actions) => {
                        if(validateForm() === true) {
                            setTimeout(() => {
                                dispatch(storeScheduledPickupTemp(values))
                                actions.setSubmitting(false)
                                navigation.navigate('PaymentMethod', {
                                    name: 'Schedule',
                                })
                            }, 400)
                        } else {
                            actions.setSubmitting(false)
                            alert()
                        }
                    }}
                >
                {(props) => 
                    <>
                    <View style = {{backgroundColor: colors.grey8, borderTopRightRadius: 30, borderTopLeftRadius: 30, height: 11*SCREEN_HEIGHT/10}}>
                        <View style = {styles.container2}>
                            <Pressable 
                                onPress = {() => navigation.navigate('Destination', {destination: 'Schedule Pickup'})}
                                style = {{flexDirection: 'row'}}
                            >
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
                                <View style = {{marginTop: 25}}>
                                    <Text style = {styles.text2}>Pick Up Location</Text>
                                    <Text style = {styles.text3}>{address === 'Current Location' ? address : address_new}</Text>
                                </View>                               
                                {/* <Icon 
                                    type = 'material-community'
                                    name = 'dots-vertical'
                                    color = {colors.blue5}
                                    size = {25}
                                    style = {{
                                        alignSelf: 'flex-end',
                                        marginRight: 5,
                                        bottom: 15,
                                        //position: 'absolute'
                                    }}
                                /> */}
                            </Pressable>               
                        </View>

                        <View style = {styles.container3} >
                            <Text style = {styles.text4}>Schedule Service</Text>
                            <View style = {styles.view1}>
                                <View style = {{flexDirection: 'row'}}>
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
                                    <Text style = {{...styles.text5, marginLeft: 10, marginTop: 15}}>Select Service Time</Text>
                                </View>

                                <Text style = {styles.text6}>From</Text>
                                <Pressable onPress = {() => setShowDate1(true)}>
                                    <View style = {styles.view2}>
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
                                        <Text style = {styles.text7}>{formattedDate1[0]} {formattedDate1[1]} {formattedDate1[2]} {formattedDate1[3]}</Text>
                                        <DateTimePickerModal
                                            isVisible = {showDate1}
                                            date = {date1}
                                            mode = 'date'
                                            onConfirm = {(date) => handleConfirmDate1(date)}
                                            onCancel = {() => setShowDate1(false)}
                                            minimumDate = {date_1}
                                            maximumDate = {date_2}
                                        />
                                    </View>
                                </Pressable>

                                <Text style = {{...styles.text6, marginTop: 0}}>To</Text>
                                <Pressable onPress = {() => setShowDate2(true)}>
                                    <View style = {{...styles.view2}}>
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
                                        <Text style = {styles.text7}>{formattedDate2[0]} {formattedDate2[1]} {formattedDate2[2]} {formattedDate2[3]}</Text>
                                        <DateTimePickerModal
                                            isVisible = {showDate2}
                                            date = {date2}
                                            mode = 'date'
                                            onConfirm = {(date) => handleConfirmDate2(date)}
                                            onCancel = {() => setShowDate2(false)}
                                            minimumDate = {date_2}
                                            maximumDate = {date_3}
                                        />
                                    </View>
                                </Pressable>
                            </View>

                            <View style = {{...styles.view1, marginTop: 20, height: 160, backgroundColor: colors.green2}}>
                                <View style = {{flexDirection: 'row', marginTop: 7}}>
                                    <Icon
                                        type = 'material'
                                        name = 'calendar-today'
                                        color = {colors.blue5}
                                        size = {20}
                                        style = {{
                                            alignSelf: 'flex-start',
                                            marginTop: 15,
                                            marginLeft: 10,
                                            display: 'flex' 
                                        }}
                                    />
                                    <Text style = {{...styles.text5, marginTop: 15, marginLeft: 10, marginBottom: 0}}>Select Collection Day</Text>
                                </View>
                                
                                <MultiselectDropdown
                                    label = 'Select Day'
                                    data = {dayData}
                                    enableSearch = {false}
                                    enableAvatar = {false}
                                    chipType = "outlined"
                                    value = {days}
                                    onChange = {onChangeDays}
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
                                        color: colors.blue2
                                    }}       
                                    paperTheme = {DefaultTheme}  
                                    disableSort = {true}   
                                    mainContainerStyle = {{
                                        marginTop: 10,
                                        paddingHorizontal: 20
                                    }}                   
                                />
                            </View>
                            
                            <View style = {{...styles.view1, marginTop: 20, height: 115, backgroundColor: colors.grey8}}>
                                <View style = {{flexDirection: 'row', marginTop: 0}}>
                                    <Icon
                                        type = 'material'
                                        name = 'hourglass-empty'
                                        color = {colors.blue5}
                                        size = {20}
                                        style = {{
                                            alignSelf: 'flex-start',
                                            marginTop: 15,
                                            marginLeft: 10,
                                            display: 'flex'                               
                                        }}
                                    />
                                    <Text style = {{...styles.text5, marginTop: 15, marginLeft: 10, marginBottom: 0}}>Select Time Slot</Text>
                                </View>

                                <Dropdown
                                    label = 'Select Time Slot'
                                    enableSearch = {false}
                                    enableAvatar = {false}
                                    floating = {false}
                                    data = {timeIntervalData}
                                    value = {timeInterval}
                                    onChange = {onChangeTime}
                                    primaryColor = {colors.blue2}
                                    underlineColor = 'transparent'
                                    selectedItemTextStyle = {{ fontWeight: 'bold' }}
                                    textInputStyle = {{ 
                                        backgroundColor: colors.white,
                                        borderTopRightRadius: 20,
                                        borderTopLeftRadius: 20,
                                        borderRadius: 20,
                                        height: 45,
                                        marginLeft: 10,
                                    }}
                                    disabledItemTextStyle = {{
                                        color: colors.black
                                    }}
                                    parentDDContainerStyle = {{
                                        position: 'absolute',
                                        marginTop: 215,
                                        width: SCREEN_WIDTH/1.15,
                                    }}
                                    paperTheme = {DefaultTheme}
                                    disableSort = {true}
                                    mainContainerStyle = {{
                                        marginTop: 10,
                                        paddingHorizontal: 20
                                    }}
                                />
                            </View>

                            <View style = {{top: SCREEN_HEIGHT/1.23, position: 'absolute', width: SCREEN_WIDTH, padding: 15}}>
                                <Button
                                    title = 'Continue'
                                    buttonStyle = {styles.button}
                                    loading = {props.isSubmitting}
                                    disabled = {props.isSubmitting}
                                    onPress = {props.handleSubmit}
                                />
                            </View>

                        </View>
                    </View>
                    </>
                }
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Schedulepickupscreen

const styles = StyleSheet.create({

    container2:{
        backgroundColor: colors.grey8,
        paddingLeft: 25, 
        height: SCREEN_HEIGHT/8,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text2:{
        color: colors.blue7,
        marginLeft: 15,
    },
    text3:{
        color: colors.blue2,
        marginLeft: 15,
        //marginBottom: 30,
        fontWeight: 'bold'
    },
    container3:{
        backgroundColor: colors.white,
        padding: 25, 
        height: SCREEN_HEIGHT,
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
        height: 200,
        borderRadius: 15,
        marginTop: 10,
    },
    view2:{
        width: "82%",
        height: 45,
        marginLeft: 43,
        marginBottom: 10,
        backgroundColor: colors.white,
        borderRadius: 20,
        marginTop: 5
    },
    button:{
        backgroundColor: colors.buttons,
        borderRadius: 10,
        height: 50,
    },
    text5:{
        marginLeft: 40,
        marginBottom: 21,
        color: colors.blue2,
        fontSize: 14,
        fontWeight: 'bold'
    },
    text6:{
        marginLeft: SCREEN_WIDTH/8.2,
        marginTop: -SCREEN_HEIGHT/60,
        color: colors.blue4
    },
    text7:{
        color: colors.blue4,
        marginTop: -20,
        marginLeft: 40,
        fontWeight: 'bold'
    },
    container4:{
        marginTop: 30,
        marginLeft: 35,
        marginRight: 20,
        flex: 1,
    },

})
