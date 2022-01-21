import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Specialpickupscreen from '../screens/SpecialPickupScreen'
import TabNavigator from './TabNavigator'
import Destinationscreen from '../screens/DestinationScreen'
import Paymentmethodscreen from '../screens/PaymentMethodScreen'
import Paymentscreen from '../screens/PaymentScreen'
import Schedulescreen from '../screens/ScheduleScreen'
import Welcomescreen from '../screens/authScreens/WelcomeScreen'
import Signupscreen from '../screens/authScreens/SignUpScreen'
import Signinscreen from '../screens/authScreens/SignInScreen'
import Editprofilescreen from '../screens/EditProfileScreen'
import Changepasswordscreen from '../screens/ChangePasswordScreen'
import { uploadDetails } from '../redux/actions/userActions'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {

    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(async() => {
        const result = await AsyncStorage.getItem('userInfo')
        //console.log(result)
        if(result !== null) {
            dispatch(uploadDetails(JSON.parse(result)))
        }
    }, [])

    return (
        <Stack.Navigator>       
            {
                userLogin.userInfo === undefined ? (
                    <>
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
                    </>
                ) : (
                    <>
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
                        name = 'Changepassword'
                        component = {Changepasswordscreen}
                        options = {{
                            headerShown: false
                        }}
                    />
                </>
        )
                    }
        </Stack.Navigator>
    );
}

export default StackNavigator;
