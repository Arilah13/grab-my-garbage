import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import StackNavigator from './StackNavigator'
import Authnavigator from './AuthNavigator'

const Rootnavigator = ({first, setFirst}) => {
    const userDetail = useSelector((state) => state.userDetail)
    const { loading } = userDetail

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading: conversations } = getAllConversation

    const retrieveAcceptedPickups = useSelector(state => state.retrieveAcceptedPickups)
    const { loading: acceptedLoading } = retrieveAcceptedPickups

    const retrieveScheduledPickup = useSelector(state => state.retrieveScheduledPickup)
    const { loading: scheduleLoading } = retrieveScheduledPickup

    useEffect(() => {
        if(first === true && loading === false) {
            setFirst(false)
        }
    }, [loading])
 
    return (
        <>
            {
                loading === false && userDetail.user !== undefined && (conversations === false || 
                    acceptedLoading === false || scheduleLoading === false) ? (
                    <StackNavigator />
                ) : (
                    <Authnavigator />
                )
            }
        </>
    );
}

export default Rootnavigator;
