import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Specialpickupscreen from '../screens/SpecialPickupScreen'
import TabNavigator from './TabNavigator'
import Destinationscreen from '../screens/DestinationScreen'
import Paymentmethodscreen from '../screens/PaymentMethodScreen'
import Paymentscreen from '../screens/PaymentScreen'
import Addcardscreen from '../screens/AddCardScreen'
import Schedulescreen from '../screens/ScheduleScreen'
import Welcomescreen from '../screens/authScreens/WelcomeScreen'
import Signupscreen from '../screens/authScreens/SignUpScreen'
import Signinscreen from '../screens/authScreens/SignInScreen'
import Accountscreen from '../screens/AccountScreen'
import Editprofilescreen from '../screens/EditProfileScreen'
import Paymentoptionsscreen from '../screens/PaymentOptionsScreen'

const Stack = createStackNavigator();

const StackNavigator = () => {
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

            <Stack.Screen
                name = 'Home'
                component = {TabNavigator}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'SpecialPickup'
                component = {Specialpickupscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Destination'
                component = {Destinationscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'PaymentMethod'
                component = {Paymentmethodscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Payment'
                component = {Paymentscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'AddCard'
                component = {Addcardscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Schedule'
                component = {Schedulescreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Editprofile'
                component = {Editprofilescreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Paymentoption'
                component = {Paymentoptionsscreen}
                options = {{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default StackNavigator;
