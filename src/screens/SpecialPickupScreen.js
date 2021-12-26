import React from 'react'
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Icon } from 'react-native-elements'

import { colors } from '../global/styles'
import { menuData } from '../global/data'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Specialpickupscreen = ({navigation}) => {
    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1, marginBottom: 15}}>
            <ScrollView 
            showsVerticalScrollIndicator = {false}
            stickyHeaderIndices={[0]}
            >
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
                
                <View style = {styles.container3} >
                    <Text style = {styles.text4}>Trash Categories</Text>
                    <View style = {styles.view1}>

                    </View>

                    <Text style = {styles.text5}>Weight Estimation</Text>
                    <View style = {styles.view2}>

                    </View>

                    <Text style = {styles.text5}>Payment</Text>
                    <View style = {styles.view3}>

                    </View>
                    
                    <Button
                        title = 'Pick Up Trash'
                        buttonStyle = {styles.button}
                    />
                </View>
            </View>
            </ScrollView>
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
        padding: 25, 
        height: SCREEN_HEIGHT - (SCREEN_HEIGHT/7 + SCREEN_HEIGHT/10),
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
        height: SCREEN_HEIGHT/6,
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
        backgroundColor: colors.grey9,
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
    }

})