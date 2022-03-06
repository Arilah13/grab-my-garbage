import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import socketIO from 'socket.io-client'

import { addSocket } from  '../redux/actions/socketActions'

import Specialpickupscreen from '../screens/specialPickupScreens/specialPickupScreen'
import TabNavigator from './TabNavigator'
import Destinationscreen from '../screens/destinationScreen'
import Paymentmethodscreen from '../screens/paymentScreens/paymentMethodScreen'
import Paymentscreen from '../screens/paymentScreens/paymentScreen'
import Schedulepickupscreen from '../screens/scheduledPickupScreens/schedulePickupScreen'
import Editprofilescreen from '../screens/accountScreens/editProfileScreen'
import Changepasswordscreen from '../screens/accountScreens/changePasswordScreen'
import Paymentsuccessscreen from '../screens/paymentScreens/paymentSuccessScreen'
import Paymentpresuccessscreen from '../screens/paymentScreens/paymentPreSuccessScreen'
import Topnavigator from './TopNavigator'
import Prerequestscreen from '../screens/preRequestScreen'
import Schedulepickuprequestscreen from '../screens/scheduledPickupScreens/schedulePickupRequestScreen'
import Scheduledpickupdetail from '../screens/scheduledPickupScreens/scheduledPickupDetail'

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
    const dispatch = useDispatch()

    useEffect(async() => {
        const socket = await socketIO.connect('https://grab-my-garbage-socket.herokuapp.com/')
        dispatch(addSocket(socket))
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
                name = 'PreRequest'
                component = {Prerequestscreen}
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
                name = 'ScheduleRequest'
                component = {Schedulepickuprequestscreen}
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
                name = 'PickupScheduleDetail'
                component = {Scheduledpickupdetail}
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
