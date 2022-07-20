import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Headercomponent = ({name, destination}) => {
    const navigation = useNavigation()

    return (
        <View style = {styles.container}>    
            <TouchableOpacity style = {{width: '40%', flexDirection: 'row'}}
                onPress = {() => destination ? navigation.navigate(destination) : navigation.goBack()}
            >
                <Icon
                    type = 'material'
                    name = 'arrow-back'
                    color = {colors.grey1}
                    size = {25}
                    style = {{
                        alignSelf: 'flex-start',
                        marginTop: 13,
                        display: 'flex'
                    }}
                />
                <Text style = {styles.text}>{name}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Headercomponent

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.white,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: 45,
    },
    text:{
        display: 'flex',
        marginTop: 15,
        left: 15,
        color: colors.grey1,
        fontWeight: 'bold',
        fontSize: 16
    }

})
