import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'

import Headercomponent from '../../components/HeaderComponent'
import { colors } from '../../global/styles'
import { getAllPickups } from '../../redux/actions/pickupActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Requestsscreen = ({navigation}) => {
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const retrieveAllPickups = useSelector(state => state.retrieveAllPickups)
    const { loading, pickupInfo } = retrieveAllPickups

    const time = (timeC) => {
        const timeA = (((timeC).split('T')[1]).split('.')[0]).split(':')[0]
        const timeB = (parseInt(timeA) + 11) % 12 + 1
        const timeD = timeB + ':' + (((timeC).split('T')[1]).split('.')[0]).split(':')[1] + (parseInt(timeA) >= 12 ? ' PM' : ' AM') 
        return timeD
    }

    useEffect(() => {
        if(userInfo !== undefined) {
            dispatch(getAllPickups())
        }
    }, [userInfo])

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>

            <View style = {styles.container}>   
                {loading === true ?
                    <LottieView 
                        source = {require('../../../assets/animation/truck_loader.json')}
                        style = {{
                            width: 300,
                            height: 400,
                        }}
                        loop = {true}
                        autoPlay = {true}
                    />
                :
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
                                <Text style = {styles.text1}>Selected Date</Text>                 
                                <Text style = {styles.text2}>Selected Time</Text>                 
                                <Text style = {styles.text3}>Total</Text>         
                            </View>
                            <View style = {{...styles.view1, flexDirection: 'row'}}>
                                <Text style = {styles.text4}>{(item.datetime).split('T')[0]}</Text>
                                <Text style = {styles.text5}>{time(item.datetime)}</Text>
                                <Text style = {styles.text6}>Rs {item.payment}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                }
                
            </View>  
        </SafeAreaView>
    );
}

export default Requestsscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        height: '100%',
        paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 10
    },
    card:{
        width: SCREEN_WIDTH/1.2,
        height: 80,
        marginBottom: 20,
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
        marginLeft: 45,
        marginRight: 0
    },
    text2:{
        color: colors.blue2,
        marginRight: 0,
        marginLeft: 35,
        marginTop: 15,
        fontWeight: 'bold'
    },
    text3:{
        color: colors.blue2,
        marginRight: 40,
        marginLeft: 35,
        marginTop: 15,
        fontWeight: 'bold'
    },
    text4:{
        marginTop: 10,
        color: colors.blue2,
        marginLeft: 25,
        marginRight: 15
    },
    text5:{
        marginTop: 10,
        color: colors.blue2,
        marginLeft: 45,
        marginRight: 0
    },
    text6:{
        marginTop: 10,
        color: colors.blue2,
        marginLeft: 45,
        marginRight: 5
    },
    view2:{
        position: 'absolute',
        marginLeft: 265,
        marginTop: 25
    },

})
