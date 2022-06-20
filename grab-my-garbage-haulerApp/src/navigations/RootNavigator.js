import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Stacknavigator from './StackNavigator'
import AuthNavigator from './AuthNavigator'

const Rootnavigator = ({first, setFirst}) => {
    const userLogin = useSelector((state) => state.userLogin)
    const { loading } = userLogin

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading: conversations } = getAllConversation

    const upcomingPickups = useSelector((state) => state.upcomingPickups)
    const { loading: upcomingLoading } = upcomingPickups

    const scheduledPickups = useSelector((state) => state.retrieveSchedulePickup)
    const { loading: scheduleLoading } = scheduledPickups
    
    useEffect(() => {
        if(first === true && loading === false) {
            setFirst(false)
        }
    }, [loading])

    return (
        <>
            {
                loading === false && userLogin.userInfo !== undefined && (
                    conversations === false || upcomingLoading === false || scheduleLoading === false
                ) ? (
                    <Stacknavigator />
                ) : (
                    <AuthNavigator />
                )
            }
        </>
    );
}

export default Rootnavigator
