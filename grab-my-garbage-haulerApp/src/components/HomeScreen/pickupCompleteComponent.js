import React from 'react'
import { View, Text, Dimensions, Pressable } from 'react-native'
import { Button } from 'react-native-elements'

import { colors } from '../../global/styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Pickupcompletecomponent = ({navigation, choice, setpickupBtn, animate, choiceCall}) => {
    return (
        <View style = {{alignItems: 'center', padding: 50, paddingTop: 35}}>
            <Text style = {{fontWeight: 'bold', fontSize: 15, color: colors.blue2}}>No Pickups Available For Now</Text>
            <Button 
                title = {choice === 'special' ? 'Check Special Pickups' : 'Check Scheduled Pickups'}
                buttonStyle = {{
                    width: SCREEN_WIDTH/1.3,
                    marginTop: 15,
                    borderRadius: 10,
                    height: 45,
                    backgroundColor: colors.darkBlue
                }}
                onPress = {() => {
                    choice === 'special' ?
                        navigation.navigate('HomeScreen', {
                            screen: 'Special',
                            params: {
                                screen: 'upcomingPickup'
                            }
                        }) :
                        navigation.navigate('HomeScreen', {
                            screen: 'Schedule',
                            params: {
                                screen: 'TodaySchedule'
                            }
                        })
                    }}
            />
            <Pressable
                onPress = {() => {
                    choiceCall()
                    setTimeout(() => {
                        setpickupBtn(true)
                    }, 500) 
                    animate(220, 30)
                }}
            >
                <Text style = {{color: colors.darkBlue, marginTop: 10, fontWeight: 'bold'}}>Stop Pickup</Text>
            </Pressable>
        </View>
    );
}

export default Pickupcompletecomponent
