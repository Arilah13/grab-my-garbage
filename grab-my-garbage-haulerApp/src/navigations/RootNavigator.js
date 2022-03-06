import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Stacknavigator from './StackNavigator'
import AuthNavigator from './AuthNavigator'

const Rootnavigator = ({first, setFirst}) => {
    const userLogin = useSelector((state) => state.userLogin)
    const { loading, userInfo } = userLogin
    
    useEffect(() => {
        if(first === true && loading === false) {
            setFirst(false)
        }
    }, [loading])

    return (
        <>
            {
                loading === false && userLogin.userInfo !== undefined ? (
                    <Stacknavigator />
                ) : (
                    <AuthNavigator />
                )
            }
        </>
    );
}

export default Rootnavigator
