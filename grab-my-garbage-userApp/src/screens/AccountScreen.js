import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../global/styles'
import { accountData } from '../global/data'
import { logout } from '../redux/actions/userActions'


const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Accountscreen = ({navigation}) => {

    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const userDetail = useSelector((state) => state.userDetail)
    const { user } = userDetail

    const handleClick = (path, name) => {
        if(path !== 'Logout') {
            navigation.navigate(path, {destination: name})
        } else if(path === 'Logout') {
            dispatch(logout())      
        }
    }

    return (
        <SafeAreaView>
            <View style = {styles.container1}>
                <View>
                    <Pressable onPress = {() => navigation.navigate('Editprofile')} style = {styles.view1} >
                            <Text style = {styles.text1}>{user.name}</Text>
                            <Image
                                source = {user.image ? {uri: user.image} : require('../../assets/user.png')}
                                resizeMode = 'contain'
                                style = {styles.image1}
                            />
                    </Pressable>
                </View>

                <View style = {styles.container2}>
                    <View style = {styles.view2}>

                        
                    </View>

                    <View style = {styles.view3}>
                        <Text style = {styles.text2}>Information Detail</Text>
                        <View style = {styles.view5}>
                            <FlatList
                                numColumns = {1}
                                showsHorizontalScrollIndicator = {false}
                                data = {accountData}
                                keyExtractor = {(item) => item.id}
                                renderItem = {({item}) => (
                                    <TouchableOpacity style = {styles.card}
                                        onPress = {() => handleClick(item.destination, item.name)}
                                    >
                                        <View style = {styles.view4}>
                                            <Image style = {styles.image2} source = {item.image}/>     
                                            <Text style = {styles.title}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Accountscreen

const styles = StyleSheet.create({

    container1:{
        backgroundColor: colors.blue1,
    },
    container2:{
        backgroundColor: colors.blue2,
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        height: 9*SCREEN_HEIGHT/10
    },
    view1:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: SCREEN_HEIGHT/10,
        width: '40%',
        alignSelf: 'flex-end'
        //width: -SCREEN_WIDTH/3,
    },
    text1:{
        marginTop: SCREEN_HEIGHT/25,
        marginRight: 2,
        color: colors.blue6,
        fontSize: 15,
        fontWeight: 'bold'
    },
    image1:{
        height: 40,
        width: 60,
        marginTop: SCREEN_HEIGHT/35,
        marginRight: SCREEN_WIDTH/20,
        borderRadius: 500,
    },
    view2:{
        height: SCREEN_HEIGHT/7,
        backgroundColor: colors.blue2,
        borderTopRightRadius: 30,
        borderTopStartRadius: 30
    },
    view3:{
        height: 6*SCREEN_HEIGHT/7,
        backgroundColor: colors.white,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 30
    },
    text2:{
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    },
    card:{
        marginTop: 10,
        marginBottom: 10
    },
    image2:{
        height: 45,
        width: 45,
        marginLeft: 10
    },
    title:{
        color: colors.blue6,
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 12,
        marginLeft: 10,
        textAlign: 'center'
    },
    view4:{
        paddingBottom: 15,
        paddingTop: 15,
        borderRadius: 10,
        backgroundColor: colors.grey9,
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    view5:{
        marginTop: 5
    }

})
