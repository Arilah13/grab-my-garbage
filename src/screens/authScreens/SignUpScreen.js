import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Formik } from 'formik'
import { Icon, Button } from 'react-native-elements'

import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const initialValues = {phone_number:'', name:'', family_name:'', password: '', email: '', username: ''}

const Signupscreen = ({navigation}) => {

    const [passwordFocussed, setPasswordFocussed] = useState(false)
    const [passwordBlured, setPasswordBlured] = useState(false)

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
            <ScrollView 
                keyboardShouldPersistTaps = 'always' 
                style = {{backgroundColor: colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30}}
                showsVerticalScrollIndicator = {false}
            >
                <View style = {styles.view1}>
                    <Text style = {styles.title}>Sign-Up</Text>
                </View>
                <Formik initialValues = {initialValues} onSubmit = {(values) => {SignUp(values)}}>
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
                                        />
                                        <TextInput 
                                            placeholder = 'Mobile Number'
                                            style = {styles.textInput}
                                            keyboardType = 'number-pad'
                                            autoFocus = {true}
                                            onChangeText = {props.handleChange('phone_number')}
                                            value = {props.values.phone_number}
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
                                                onChangeText = {props.handleChange('email')}
                                                value = {props.values.email}
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
                                            style = {{width: SCREEN_WIDTH/1.6, paddingLeft: 10, color: colors.grey1}}
                                            autoFocus = {false}
                                            onChangeText = {props.handleChange('password')}
                                            value = {props.values.password}
                                            onFocus = {()=>{setPasswordFocussed(true)}}
                                            onBlur = {()=>{setPasswordBlured(true)}}
                                        />
                                        <Icon 
                                            name = 'visibility-off'
                                            color = {colors.grey1}
                                            type = 'material'
                                        />
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
                                        />
                                    </View>
                            </View>
                        )
                    }
                </Formik>
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
            </ScrollView>
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
        flexDirection: 'row'
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
