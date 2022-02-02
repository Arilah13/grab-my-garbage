import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Specialpickupscreen from '../screens/SpecialPickupScreen'
import TabNavigator from './TabNavigator'
import Destinationscreen from '../screens/DestinationScreen'
import Paymentmethodscreen from '../screens/paymentScreens/PaymentMethodScreen'
import Paymentscreen from '../screens/paymentScreens/PaymentScreen'
import Schedulepickupscreen from '../screens/SchedulePickupScreen'
import Editprofilescreen from '../screens/EditProfileScreen'
import Changepasswordscreen from '../screens/ChangePasswordScreen'
import Paymentsuccessscreen from '../screens/paymentScreens/paymentSuccessScreen'
import Paymentpresuccessscreen from '../screens/paymentScreens/PaymentPreSuccessScreen'
import Topnavigator from './TopNavigator'

import { getPaymentIntent } from '../redux/actions/paymentActions'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPaymentIntent())
    }, [])

    return (
        <Stack.Navigator>      
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
                name = 'Requests'
                component = {Topnavigator}
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
                component = {Schedulepickupscreen}
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

            <Stack.Screen
                name = 'Paymentpresuccess'
                component = {Paymentpresuccessscreen}
                options = {{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name = 'Paymentsuccess'
                component = {Paymentsuccessscreen}
                options = {{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default StackNavigator;
