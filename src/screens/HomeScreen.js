import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet, Text, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../global/styles'
import { menuData } from '../global/data'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Homescreen = ({navigation}) => {

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    return (
        <SafeAreaView>
            <View style={{backgroundColor: colors.blue1}}>
                <View style = {styles.container}>
                    <View style = {styles.view1}>
                        <Text style = {styles.text1}>Hi {userInfo.name}</Text>
                        <Text style = {styles.text2}>Have you taken out the trash today?</Text>
                        <Image
                            source = {userInfo.image ? {uri: userInfo.image} : require('../../assets/user.png')}
                            style = {styles.image1}
                        />
                    </View>
                </View>

                <View style = {styles.container1}>
                    <View style = {styles.container2}>

                    </View>

                    <View>
                        <FlatList
                            numColumns = {2}
                            showsHorizontalScrollIndicator = {false}
                            data = {menuData}
                            keyExtractor = {(item) => item.id}
                            renderItem = {({item}) => (
                                <TouchableOpacity style = {styles.card}
                                    onPress = {() => navigation.navigate(item.destination, {destination: item.name})}
                                >
                                    <View style = {styles.view2}>
                                        <Image style = {styles.image2} source = {item.image}/>     
                                        <Text style = {styles.title}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View> 
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
        height: SCREEN_HEIGHT/3.5
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
        left: "75%",
        bottom: 65,
        borderRadius: 50,
    },
    container1:{
        backgroundColor: colors.white,
        borderRadius: 30,
        height: "75%",
        padding: 15
    },
    container2:{
        backgroundColor: colors.blue2,
        height: SCREEN_HEIGHT/6.5,
        padding: 10,
        borderRadius: 25,
        marginBottom: SCREEN_HEIGHT/40,
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