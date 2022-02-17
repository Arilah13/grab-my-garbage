import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../../global/styles'
import Headercomponent from '../../components/HeaderComponent'
import Mapcomponent from '../../components/MapComponent'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Locationscreen = ({route}) => {

    const { location } = route.params

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <Headercomponent name = 'Pickup Detail' />
            <View style = {{padding: 10}}>
                <View style  = {styles.container}>
                    <Mapcomponent latlng = {location}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Locationscreen

const styles = StyleSheet.create({

    container:{
        display: 'flex',
        backgroundColor: colors.grey9,
        //paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        //paddingTop: 10,
        overflow: 'hidden'
    },

})
