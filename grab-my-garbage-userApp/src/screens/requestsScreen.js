import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements'

import Headercomponent from '../components/HeaderComponent'
import { colors } from '../global/styles'
import { getAllPickups } from '../redux/actions/pickupActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Requestsscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const retrieveAllPickups = useSelector(state => state.retrieveAllPickups)
    const { loading, pickupInfo } = retrieveAllPickups

    useEffect(() => {
        if(userInfo !== undefined) {
            dispatch(getAllPickups())
        }
    }, [userInfo])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View>
                <TouchableOpacity 
                    style = {styles.container1}
                    onPress = {() => navigation.navigate('Home')}
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
                    <Text style = {styles.text}>Home</Text>
                </TouchableOpacity>
            </View>

            <View style = {styles.container}>
                <Text style = {styles.text5}>Requests</Text>
                
                <FlatList
                    numColumns = {1}
                    showsHorizontalScrollIndicator = {false}
                    showsVerticalScrollIndicator = {false}
                    data = {pickupInfo}
                    keyExtractor = {(item) => item._id}
                    renderItem = {({item}) => (
                        <TouchableOpacity style = {styles.card}
                            onPress = {() => navigation.navigate('')}
                        >
                            <View style = {{...styles.view1, flexDirection: 'row'}}>    
                                <Text style = {styles.text1}>Date</Text>                 
                                <Text style = {styles.text2}>Total</Text>         
                            </View>
                            <View style = {{...styles.view1, flexDirection: 'row'}}>
                                <Text style = {styles.text3}>{(item.datetime).split('T')[0]}</Text>
                                <Text style = {styles.text4}>Rs {item.payment}</Text>
                            </View>
                            <View style = {styles.view2}>
                                <Text style = {{color: colors.blue2}}>Pending</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                
            </View>  
        </SafeAreaView>
    );
}

export default Requestsscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: 9*SCREEN_HEIGHT/10,
        paddingTop: 30,
        paddingLeft: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    card:{
        width: SCREEN_WIDTH/1.1,
        height: 80,
        marginTop: 20,
        backgroundColor: colors.blue1,
        borderRadius: 20,
        shadowColor: '#171717',
        elevation: 5,
        shadowOpacity: 0.7,
        shadowRadius: 30
    },
    view1:{
        alignContent: 'center',
        justifyContent: 'center',
    },
    text1:{
        color: colors.blue2,
        fontWeight: 'bold',
        marginTop: 15,
        marginLeft: 5,
        marginRight: 10
    },
    text2:{
        color: colors.blue2,
        marginRight: 100,
        marginLeft: 75,
        marginTop: 15,
        fontWeight: 'bold'
    },
    text3:{
        marginTop: 10,
        color: colors.blue2,
        marginLeft: 5,
        marginRight: 10
    },
    text4:{
        marginTop: 10,
        color: colors.blue2,
        marginLeft: 50,
        marginRight: 115
    },
    view2:{
        position: 'absolute',
        marginLeft: 265,
        marginTop: 25
    },
    text5:{
        position: 'absolute',
        color: colors.blue2,
        fontSize: 17,
        fontWeight: 'bold',
        margin: 10,
        marginLeft: 22
    },
    container1:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
        flexDirection: 'row'
    },
    text:{
        display: 'flex',
        top: 26,
        left: 15,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 16
    }

})
