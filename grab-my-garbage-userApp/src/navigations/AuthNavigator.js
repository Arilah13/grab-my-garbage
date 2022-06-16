import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Signupscreen from '../screens/authScreens/signUpScreen'
import Signinscreen from '../screens/authScreens/signInScreen'

const Stack = createNativeStackNavigator()

const Authnavigator = () => {
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
                name = 'SignUp'
                component = {Signupscreen}
                options = {{
                    headerShown: false
                }}
            />
        </Stack.Navigator> 
    );
}

export default Authnavigator
