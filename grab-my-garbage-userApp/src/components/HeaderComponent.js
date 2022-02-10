import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

import { colors } from '../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Headercomponent = ({name}) => {

    const navigation = useNavigation()

    return (
        <View style = {styles.container}>    
            <TouchableOpacity style = {{width: '35%', flexDirection: 'row'}}
                onPress = {() => navigation.goBack()}
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
                <Text style = {styles.text}>{name}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Headercomponent

const styles = StyleSheet.create({

    container:{
        backgroundColor: colors.blue1,
        paddingLeft: 25, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/10,
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
