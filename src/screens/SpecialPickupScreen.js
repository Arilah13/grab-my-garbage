import React from 'react'
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'
import { menuData } from '../global/data'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Specialpickupscreen = ({navigation}) => {
    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View>
                <TouchableOpacity style = {styles.container}
                    onPress={() => navigation.navigate('Home')}
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
                    <Text style = {styles.text1}>Home</Text>
                </TouchableOpacity>
            </View>

            <View style={{backgroundColor: colors.grey8}}>
                <View style={styles.container2}>
                    <Pressable>
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
                        <Text style = {styles.text3}>Thamarin City Residence, Jakarta</Text>
                        {/* <Icon 
                            type = 'material-community'
                            name = 'dots-vertical'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                alignSelf: 'flex-end',
                                marginRight: 5,
                                bottom: 15
                            }}
                        /> */}
                    </Pressable>               
                </View>
                
                <View style = {styles.container3}>

                </View>
            </View>
        </SafeAreaView>
    );
}

export default Specialpickupscreen

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
        top: 25,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    container2:{
        backgroundColor: colors.grey8,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/7,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
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
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT - (SCREEN_HEIGHT/7 + SCREEN_HEIGHT/10),
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },

})