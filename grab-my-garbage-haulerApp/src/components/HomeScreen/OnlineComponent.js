import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, Dimensions } from 'react-native'
import ToggleButton from 'react-native-toggle-element'
import * as Location from 'expo-location'
import { Icon } from 'react-native-elements'

import { colors } from '../../global/styles'
import { getLocation } from '../../helpers/homehelper'

import { TASK_FETCH_LOCATION } from '../../redux/constants/mapConstants'
import { addOrigin } from '../../redux/actions/mapActions'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Onlinecomponent = ({animation, online, setOnline, pickupBtn, choice, order}) => {
    const dispatch = useDispatch()

    const socketHolder = useSelector((state) => state.socketHolder)
    const { socket } = socketHolder

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const handleOnline = async() => {
        if(online === false) {
            await getLocation()
            setOnline(true)
            
            if(pickupBtn === true)
                animation(220, 2.8*SCREEN_HEIGHT/110)
            else if(choice === null && pickupBtn === false)
                animation(2.8*SCREEN_HEIGHT/10, 2.8*SCREEN_HEIGHT/110)
            else if(choice !== null && order === null) {
                animation(2.8*SCREEN_HEIGHT/11, 0)
            }

            const {
                coords: {latitude, longitude, heading}
            } = await Location.getCurrentPositionAsync()

            await socket.emit('online', {haulerid: userInfo._id, 
                latitude: latitude, longitude: longitude,
                heading: heading
            })

            dispatch(addOrigin(latitude, longitude, heading))

            setTimeout(() => {
                Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 2,
                    deferredUpdatesInterval: 0,
                    showsBackgroundLocationIndicator: true,
                    foregroundService: {
                        notificationTitle: 'Using your location',
                        notificationBody: 'As long as you are online, location will be used',
                    }
                })
            }, 1000)
        } else {
            if(pickupBtn === true) {
                animation(2.8*SCREEN_HEIGHT/110, 2.8*SCREEN_HEIGHT/10)
            }
            else if(choice === null && pickupBtn === false) {
                animation(2.8*SCREEN_HEIGHT/110, 2.8*SCREEN_HEIGHT/10)
            }
            else if(choice !== null && order === null) {
                animation(0, 220)
            }
            setOnline(false)
            socket.emit('haulerDisconnect')
            Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
                if(value) {
                    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
                }
            })
        }
    }

    return (
        <>
            <ToggleButton
                value = {online}
                disabled = {order !== null ? true : false}
                onPress = {handleOnline}
                leftComponent = {
                <Text style = {{color: colors.white, fontWeight: 'bold', marginLeft: 8}}>
                    {online === true ? 'Online' : ''}
                </Text>                          
                }
                rightComponent = {
                    <Text style = {{color: colors.blue2, fontWeight: 'bold', marginRight: 7}}>
                        {online === false ? 'Offline' : ''}
                    </Text>
                }
                thumbActiveComponent = {
                    <Icon
                        type = 'font-awesome'
                        name = 'truck'
                        color = {colors.darkBlue}
                        style = {{
                            margin: 9
                        }}
                    />
                }
                thumbInActiveComponent = {
                    <Icon
                        type = 'font-awesome'
                        name = 'truck'
                        color = {colors.darkBlue}
                        style = {{
                            margin: 9
                        }}
                    />
                }
                trackBar = {{
                    activeBackgroundColor: colors.darkBlue,
                    inActiveBackgroundColor: colors.darkGrey,
                    borderActiveColor: colors.darkBlue,
                    borderInActiveColor: colors.darkGrey,
                    borderWidth: 1,
                    width: 140,
                }}
                thumbStyle = { online === true ? {
                    backgroundColor: colors.white
                } : {
                    backgroundColor: colors.white,
                }}
                thumbButton = {{
                    height: 50,
                    width: 60
                }}
            />
        </>
    );
}

export default Onlinecomponent
