import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Stacknavigator from './StackNavigator'
import AuthNavigator from './AuthNavigator'

const Rootnavigator = ({first, setFirst}) => {
    const userLogin = useSelector((state) => state.userLogin)

    const getAllConversation = useSelector((state) => state.getAllConversation)
    const { loading, conversation } = getAllConversation
    
    useEffect(() => {
        if(first === true && loading === false) {
            setFirst(false)
        }
    }, [loading])

    return (
        <>
            { 
                userLogin.userInfo !== undefined && conversation !== undefined ? 
                <Stacknavigator />
                : 
                <AuthNavigator />
            }
        </>
    );
}

export default Rootnavigator
