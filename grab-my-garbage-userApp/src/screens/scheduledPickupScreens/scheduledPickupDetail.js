import React from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Button } from 'react-native-elements'

import Headercomponent from '../../components/HeaderComponent'
import { colors } from '../../global/styles'
import { dayConverter } from '../../helpers/schedulepickupHelper'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Scheduledpickupdetail = ({navigation, route}) => {

    const { item, from, to } = route.params

    return (
        <SafeAreaView>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {styles.container}
            >
                <Headercomponent name = 'Scheduled Pickups' />

                <View style = {{height: 9*SCREEN_HEIGHT/10, backgroundColor: colors.grey8, borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                    <Pressable style = {styles.container2} onPress = {() => navigation.navigate('Location', {location: item.location[0], item})}>
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
                        <Text style = {styles.text1}>Pick Up Location</Text>
                        <Text style = {styles.text2}>{item.location[0].city}</Text>
                        <Icon 
                            type = 'material-community'
                            name = 'dots-vertical'
                            color = {colors.blue5}
                            size = {25}
                            style = {{
                                //alignSelf: 'flex-end',
                                //marginRight: 5,
                                //bottom: 15,
                                position: 'absolute'
                            }}
                        />
                    </Pressable>
                    <View style = {{flex: 1, backgroundColor: colors.white, borderTopRightRadius: 30, borderTopLeftRadius: 30, padding: 15}}>
                        <View style = {styles.container3}>
                            <Text style = {styles.text3}>Pickup Scheduled Duration:</Text>
                            <Text style = {styles.text4}>{from + ' - ' + to}</Text>
                        </View>
                        <View style = {{...styles.container5, paddingTop: 0}}>
                            <Text style = {styles.text3}>Collection Days:</Text>
                            <Text style = {styles.text4}>
                                {
                                    item.days.map((day) => {
                                        return(
                                            dayConverter(day) + '   '
                                        )
                                    })
                                }
                            </Text>
                        </View>
                        <View style = {{...styles.container5, paddingBottom: 0, paddingTop: 0}}>
                            <Text style = {styles.text5}>Time Slot:</Text>
                            <Text style = {styles.text4}>{item.timeslot}</Text>
                        </View>
                        <View style = {{...styles.container5, paddingBottom: 0}}>
                            <Text style = {styles.text3}>Payment:</Text>
                            <Text style = {styles.text4}>Rs. {item.payment}</Text>
                        </View>
                        <View style = {styles.container5}>
                            <Text style = {styles.text3}>Payment Method:</Text>
                            <Text style = {styles.text4}>{item.paymentMethod}</Text>
                        </View>

                        <View style = {{...styles.container5, paddingTop: 0}}>
                            <Text style = {styles.text3}>Hauler Name:</Text>
                            <Text style = {styles.text4}></Text>
                        </View> 
                        <TouchableOpacity 
                            style = {{...styles.container5, paddingTop: 30, justifyContent: 'center'}}
                            onPress = {() => navigation.navigate('Chat', {haulerid: item.pickerId, name: 'Pickup Detail', pickupid: item._id})}
                        >
                            <Icon
                                type = 'material'
                                name = 'chat'
                                color = {colors.darkBlue}
                                size = {27}
                            />    
                            <Text style = {styles.text7}>Chat With Hauler</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Scheduledpickupdetail

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.blue1,
        //paddingLeft: 10,
        //paddingTop: 10,
    },
    container2:{
        backgroundColor: colors.grey8,
        paddingLeft: 25, 
        marginBottom: 10,
        height: SCREEN_HEIGHT/9,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text1:{
        color: colors.blue7,
        left: 40,
        bottom: 30
    },
    text2:{
        color: colors.blue2,
        left: 40,
        bottom: 30,
        fontWeight: 'bold'
    },
    container3:{
        backgroundColor: colors.white,
        padding: 25,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        flexDirection: 'row'
    },
    text3:{
        color: colors.blue2,
        fontWeight: 'bold',
    },
    text4:{
        color: colors.grey,
        fontWeight: 'bold',
        marginLeft: 20
    },
    text5:{
        color: colors.blue2,
        fontWeight: 'bold',
        marginBottom: 8
    },
    container4:{
        backgroundColor: colors.white,
        paddingLeft: 25,
    },
    text6:{
        color: colors.grey,
        fontWeight: 'bold',
        marginLeft: 130,
        marginTop: 5
    },
    container5:{
        backgroundColor: colors.white,
        padding: 25,
        flexDirection: 'row'
    },
    image:{
        height: 200,
        width: 200,
        //borderRadius: 500,
        alignContent: 'center'
    },
    text7:{
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkBlue
    }

})
