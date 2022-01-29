import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AuthNavigator from './AuthNavigator'
import TabNavigator from './TabNavigator';

const Rootnavigator = () => {

    // const dispatch = useDispatch()

    // const userLogin = useSelector((state) => state.userLogin)
    // const { userInfo } = userLogin

    // useEffect(async() => {
    //     const result = await AsyncStorage.getItem('userInfo')
    //     //console.log(result)
    //     if(result !== null) {
    //         dispatch(uploadDetails(JSON.parse(result)))
    //     }
    // }, [])

    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
}

export default Rootnavigator
