import React from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Icon } from 'react-native-elements'

import Headercomponent from '../../components/HeaderComponent'
import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Pickupdetailscreen = ({route}) => {

    const { item, time, date } = route.params

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <View style = {{overflow: 'hidden', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
            <ScrollView 
                showsVerticalScrollIndicator = {false}
                stickyHeaderIndices = {[0]}
                style = {styles.container}
            >
                <Headercomponent name = 'Pending Pickups' />    

                <View style = {{height: 14*SCREEN_HEIGHT/15, backgroundColor: colors.grey8}}>
                    <View style = {styles.container2}>
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
                    </View>
                    <View style = {{flex: 1, backgroundColor: colors.white, borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
                        <View style = {styles.container3}>
                            <Text style = {styles.text3}>Collect Pickup Before:</Text>
                            <Text style = {styles.text4}>{date + ' ' + time}</Text>
                        </View>
                        <View style = {styles.container4}>
                            <Text style = {styles.text5}>Trash Categories:</Text>
                            <View style = {{position: 'absolute'}}>
                                <Text style = {{...styles.text6, marginLeft: 155, marginTop: 0}}>{item.category[0]}</Text>
                            </View>
                            { item.category.length > 1 ?
                                <View style = {{marginTop: -8}}> 
                                    {(item.category).slice(1).map(trash =>
                                        <Text style = {styles.text6}>{trash}</Text>        
                                    )}
                                </View> : null
                            }
                        </View>
                        <View style = {styles.container5}>
                            <Text style = {styles.text3}>Weight:</Text>
                            <Text style = {styles.text4}>{item.weight} kg</Text>
                        </View>
                        <View style = {styles.container5}>
                            <Text style = {styles.text3}>Optional Images:</Text>
                            {
                                item.image === null ? 
                                <Text style = {styles.text4}>No Images Attached</Text>
                                : ''
                            }
                        </View>
                        <View style = {{...styles.container5, flex: 1, flexWrap: 'wrap'}}>
                            <Button
                                title = 'Accept'
                                buttonStyle = {{
                                    width: 100,
                                    height: 40,
                                    marginTop: 18,
                                    borderRadius: 15,
                                    marginLeft: 35,
                                    backgroundColor: colors.buttons
                                }}
                            />
                            <Button
                                title = 'Decline'
                                buttonStyle = {{
                                    width: 100,
                                    height: 40,
                                    marginTop: 18,
                                    borderRadius: 15,
                                    marginLeft: 25,
                                    backgroundColor: colors.buttons
                                }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Pickupdetailscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        //paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        //paddingTop: 10,
    },
    container2:{
        backgroundColor: colors.grey8,
        paddingLeft: 25, 
        height: SCREEN_HEIGHT/9,
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

})
