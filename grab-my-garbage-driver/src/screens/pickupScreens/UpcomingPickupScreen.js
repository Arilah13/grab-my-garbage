import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const UpcomingPickupscreen = () => {
    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <FlatList
                
            />
        </SafeAreaView>
    );
}

export default UpcomingPickupscreen

const styles = StyleSheet.create({

    view1:{
        
    }

})
