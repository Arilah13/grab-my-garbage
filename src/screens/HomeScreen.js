import React from 'react'
import { View, StyleSheet, Text, ScrollView, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../global/styles'
import { menuData } from '../global/data'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = ({navigation}) => {

    return (
        <SafeAreaView>
            <View style={{backgroundColor: colors.blue1}}>
                <View style = {styles.container}>
                    <View style = {styles.view1}>
                        <Text style = {styles.text1}>Hi Johnny</Text>
                        <Text style = {styles.text2}>Have you take out the trash today?</Text>
                        <Image
                            source = {require('../../assets/person.jpg')}
                            style = {styles.image1}
                        />
                    </View>
                </View>

                <View style = {styles.container1}>
                    <View style = {styles.container2}>

                    </View>

                    <ScrollView bounces = {false}>
                        <FlatList
                            numColumns = {2}
                            showsHorizontalScrollIndicator = {false}
                            data = {menuData}
                            keyExtractor = {(item) => item.id}
                            renderItem = {({item}) => (
                                <TouchableOpacity style = {styles.card}
                                    onPress = {() => navigation.navigate(item.destination)}
                                >
                                    <View style = {styles.view2}>
                                        <Image style = {styles.image2} source = {item.image}/>     
                                        <Text style = {styles.title}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView> 
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Homescreen

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/4
    },
    view1:{
        display: 'flex',
        //flex: 1,
        justifyContent: 'space-around',
    },
    text1:{
        color: colors.blue2,
        fontSize: 21,
        //paddingBottom:5,
        paddingTop: 55,
        fontWeight: 'bold'
    },
    text2:{
        color: colors.blue2,
        fontSize: 14
    },
    image1:{
        height: 70,
        width: 70,
        left: 300,
        bottom: 65,
        borderRadius: 50,
    },
    container1:{
        backgroundColor: colors.white,
        borderRadius: 30,
        height: 3*SCREEN_HEIGHT/4,
        padding: 15
    },
    container2:{
        backgroundColor: colors.blue2,
        height: SCREEN_HEIGHT/6.5,
        padding: 10,
        borderRadius: 25,
        marginBottom: 15
    },
    card:{
        margin: SCREEN_WIDTH/22,
        marginTop: 0,
        flex: 1,
        paddingLeft: 2,
        marginLeft: 8,
        marginRight: 8,
    },
    view2:{
        paddingBottom: 10,
        paddingTop: 25,
        borderRadius: 15,
        backgroundColor: colors.blue1,
        alignItems: 'center',
    },
    image2:{
        height: 60,
        width: 60,
        alignItems: 'center'
    },
    title:{
        color: colors.blue2,
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center'
    }

})