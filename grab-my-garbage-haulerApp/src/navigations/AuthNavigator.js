import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Signinscreen from '../screens/authScreens/signInScreen'

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

        </Stack.Navigator>
    );
}

export default AuthNavigator
