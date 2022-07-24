import React from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Headercomponent = ({name, destination, timeout1, timeout2}) => {

    const navigation = useNavigation()

    return (
        <View style = {styles.container}>    
            <Icon
                type = 'material'
                name = 'arrow-back'
                color = {colors.grey1}
                size = {25}
                onPress = {() => {
                    destination ? navigation.navigate(destination) : navigation.goBack()
                    timeout1 ? clearTimeout(timeout1) : null
                    timeout2 ? clearTimeout(timeout2) : null
                }}
            />
            <Text style = {styles.text}>{name}</Text>
            <View></View>
        </View>
    );
}

export default Headercomponent

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.white,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15
    },
    text:{
        display: 'flex',
        color: colors.grey1,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: -15
    }

})
