import React from 'react'
import { View, Text, ActivityIndicator, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../../global/styles'

const Splashscreen = () => {
    return (
        <SafeAreaView style = {{height: '100%', backgroundColor: colors.blue1}}>
            <Image 
                source = {require('../../../assets/app/splash.png')}
                resizeMode = 'cover'
                style = {{
                    height: 200,
                    width: '100%',
                    marginTop: '50%',
                    marginBottom: 0
                }}
            />
            <View style = {{marginTop: -70}}>
                <ActivityIndicator color = {colors.darkBlue} />
                <Text style = {{alignSelf: 'center', color: colors.darkBlue, fontSize: 11}}>Loading Information</Text>
            </View>
        </SafeAreaView>
    );
}

export default Splashscreen

