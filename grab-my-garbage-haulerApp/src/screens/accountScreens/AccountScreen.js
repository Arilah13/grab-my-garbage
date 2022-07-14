import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { accountData } from '../../global/data'

import { logout } from '../../redux/actions/userActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Accountscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

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
                <Pressable onPress = {() => navigation.navigate('Changepassword')} style = {styles.view1} >
                            <Text style = {styles.text1}>{userInfo.name}</Text>
                            <Image
                                source = {userInfo.image ? {uri: userInfo.image} : require('../../../assets/user.png')}
                                resizeMode = 'contain'
                                style = {styles.image1}
                            />
                </Pressable>

                <View style = {styles.container2}>
                    <Text style = {styles.text2}>Information Detail</Text>
                    <View style = {styles.view5}>
                        <FlatList
                            numColumns = {1}
                            showsHorizontalScrollIndicator = {false}
                            data = {accountData}
                            keyExtractor = {(item) => item.id}
                            renderItem = {({item}) => (
                                <TouchableOpacity 
                                    style = {styles.card}
                                    onPress = {() => handleClick(item.destination, item.name)}
                                >
                                    <View style = {styles.view4}>
                                        <Icon
                                            type = 'material-community'
                                            name = {item.image}
                                            color = {colors.darkBlue}
                                            size = {30}
                                            style = {styles.image2}
                                        /> 
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

export default Accountscreen

const styles = StyleSheet.create({

    container1:{
        backgroundColor: colors.grey9,
    },
    container2:{
        height: 9*SCREEN_HEIGHT/10,
        backgroundColor: colors.white,
        padding: 30,
        paddingHorizontal: 0
    },
    view1:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: SCREEN_HEIGHT/10,
        width: '40%',
        alignSelf: 'flex-end'
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
    view3:{
        height: 9*SCREEN_HEIGHT/10,
        backgroundColor: colors.grey9,
        padding: 30,
        paddingHorizontal: 0
    },
    text2:{
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 30
    },
    card:{
        marginTop: 15,
        borderBottomWidth: 0.2,
        borderBottomColor: colors.darkGrey
    },
    image2:{
        marginLeft: 40
    },
    title:{
        color: colors.blue6,
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 4,
        marginLeft: 10,
    },
    view4:{
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: 15
    },
    view5:{
        marginTop: 5
    }

})
