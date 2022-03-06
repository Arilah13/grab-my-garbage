import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import StackNavigator from './StackNavigator'
import Authnavigator from './AuthNavigator'

const Rootnavigator = ({first, setFirst}) => {
    const userDetail = useSelector((state) => state.userDetail)
    const { loading } = userDetail

    useEffect(() => {
        if(first === true && loading === false) {
            setFirst(false)
        }
    }, [loading])
 
    return (
        <>
            {
                loading === false && userDetail.user !== undefined ? (
                    <StackNavigator />
                ) : (
                    <Authnavigator />
                )
            }
        </>
    );
}

export default Rootnavigator;
