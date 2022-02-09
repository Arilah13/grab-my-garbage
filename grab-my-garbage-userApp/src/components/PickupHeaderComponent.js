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
        <View>
            <TouchableOpacity style = {styles.container}
                onPress = {() => navigation.goBack()}
            >
                <Icon
                    type = 'material'
                    name = 'arrow-back'
                    color = {colors.blue5}
                    size = {20}
                    style = {{
                        alignSelf: 'flex-start',
                        marginTop: 15,
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
        backgroundColor: colors.grey10,
        paddingLeft: 15, 
        //marginBottom: 0,
        height: SCREEN_HEIGHT/15,
        flexDirection: 'row',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    text:{
        display: 'flex',
        top: 15,
        left: 5,
        color: colors.blue2,
        fontWeight: 'bold',
        fontSize: 14
    }

})
