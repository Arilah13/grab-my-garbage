import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

import { colors } from '../../global/styles'
import { getPendingPickups } from '../../redux/actions/requestActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const PendingPickupscreen = () => {
    const dispatch = useDispatch()
    
    const map = useSelector((state) => state.map)

    useEffect(() => {
        dispatch(getPendingPickups(map.latitude, map.longitude))
    }, [map])
    

    // useEffect(() => {
    //     setTimeout(() => {
    //         getLocation()
    //         getPendingPickups(latlng.latitude, latlng.longitude)
    //     }, 3000)
    // })

    return (
        <SafeAreaView style = {{backgroundColor: colors.blue1}}>
            <FlatList
                
            />
        </SafeAreaView>
    );
}

export default PendingPickupscreen

const styles = StyleSheet.create({

    view1:{
        
    }

})
