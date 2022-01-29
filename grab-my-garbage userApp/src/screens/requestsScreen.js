import React from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Headercomponent from '../components/HeaderComponent'
import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Requestsscreen = () => {

    const retrieveAllPickups = useSelector(state => state.retrieveAllPickups)
    const { pickupInfo } = retrieveAllPickups

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Home' />

            <View style = {styles.container}>
                
                <FlatList
                    numColumns = {1}
                    showsHorizontalScrollIndicator = {false}
                    data = {pickupInfo}
                    keyExtractor = {(item) => item._id}
                    renderItem = {({item}) => (
                        <TouchableOpacity style = {styles.card}
                            onPress = {() => navigation.navigate('')}
                        >
                            <View style = {{...styles.view1, flexDirection: 'row'}}>    
                                <Text style = {styles.text1}>Collector name</Text>                 
                                <Text style = {styles.text2}>Total</Text>         
                            </View>
                            <View style = {{...styles.view1, flexDirection: 'row'}}>
                                <Text style = {styles.text3}>Ahamed Rilah</Text>
                                <Text style = {styles.text4}>Rs {item.payment}</Text>
                            </View>
                            <View style = {styles.view2}>
                                <Text style = {{color: colors.blue2}}>Processing</Text>
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
        marginBottom: 20,
        backgroundColor: colors.blue1,
        borderRadius: 20,
        shadowColor: '#171717',
        elevation: 10,
        shadowOffset: { width: -2, height: 4 },
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
        marginRight: 120,
        marginLeft: 65,
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
        marginLeft: 65,
        marginRight: 108
    },
    view2:{
        position: 'absolute',
        marginLeft: 270,
        marginTop: 25
    }

})
