import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Welcomescreen from '../screens/authScreens/WelcomeScreen'
import Signupscreen from '../screens/authScreens/SignUpScreen'
import Signinscreen from '../screens/authScreens/SignInScreen'

const Stack = createNativeStackNavigator()

const Authnavigator = () => {
    return (
        <Stack.Navigator> 
            <Stack.Screen
                name = 'Welcome'
                component = {Welcomescreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'SignUp'
                component = {Signupscreen}
                options = {{
                    headerShown: false
                }}
            />

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

export default Authnavigator
