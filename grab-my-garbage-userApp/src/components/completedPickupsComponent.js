import React from 'react'
import { View, Text, StyleSheet, Pressable, Dimensions, FlatList } from 'react-native'
import { Icon } from 'react-native-elements'

import { colors } from '../global/styles'
import { fromDate } from '../helpers/schedulepickupHelper'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const CompletedPickupsComponent = ({item, setModalVisible2}) => {
    return (
        <View style = {{backgroundColor: colors.white, borderTopRightRadius: 15, borderTopLeftRadius: 15, overflow: 'hidden'}}>
            <View style = {{height: 1*SCREEN_HEIGHT/10, flexDirection: 'row', backgroundColor: colors.white}}>
                <Pressable onPress = {() => setModalVisible2(false)}>
                    <Icon 
                        type = 'font-awesome-5'
                        name = 'angle-left'
                        size = {32}
                        color = {colors.darkBlue}
                        style = {{
                            marginLeft: 15,
                            marginTop: 17,
                            marginRight: 45
                        }}
                    />
                </Pressable>
            </View>
                
            <View style = {{justifyContent: 'center', alignItems: 'center'}}>

                <View style = {{flexDirection: 'row', marginBottom: 10, paddingHorizontal: 30}}>
                    <View style = {{width: '50%'}}>
                        <Text style = {styles.title3}>PickupDate</Text>
                    </View>

                    <View>
                        <Text style = {styles.title3}>Hauler Name</Text>
                    </View>
                </View> 

                <FlatList
                    numColumns = {1}
                    showsHorizontalScrollIndicator = {true}
                    data = {item.completedPickups}
                    keyExtractor = {(item) => item.date}
                    renderItem = {({item}) => (
                        <View style = {styles.card}>
                            <View style = {styles.view2}>   
                                <View style = {{flexDirection: 'row'}}>
                                    <View style = {{width: '50%'}}>
                                        <Text style = {styles.title}>{fromDate(item.date)}</Text>
                                    </View>

                                    <View>
                                        <Text style = {styles.title2}>{item.completedHauler.name}</Text>
                                    </View>
                                </View> 
                            </View>
                        </View>
                    )}
                />
            </View>

        </View>
    );
}

export default CompletedPickupsComponent


const styles = StyleSheet.create({

    card:{
        flex: 1,
        margin: 5,
    },
    view2:{
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 15,
        backgroundColor: colors.white,
        elevation: 5,
        width: SCREEN_WIDTH/1.5,
        paddingHorizontal: 0,
    },
    title:{
        marginLeft: 25,
        fontSize: 15,
        color: colors.darkBlue
    },
    title2:{
        marginLeft: 45,
        fontSize: 15,
        color: colors.darkBlue
    },
    title3:{
        fontSize: 16,
        color: colors.blue4,
        fontWeight: 'bold',
    }

})
