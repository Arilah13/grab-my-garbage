import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TabNavigator from './TabNavigator'
import Signinscreen from '../screens/authScreens/SignInScreen'

const Stack = createNativeStackNavigator()

const AuthNavigator = () => {

    return (
        <Stack.Navigator>       

            <Stack.Screen
                name = 'SignIn'
                component = {Signinscreen}
                options = {{
                    headerShown: false
                }}
            />
        
            <Stack.Screen
                name = 'Navigation'
                component = {TabNavigator}
                options = {{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    );
}

export default AuthNavigator;
