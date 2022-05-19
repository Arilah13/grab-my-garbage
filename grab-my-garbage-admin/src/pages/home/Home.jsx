import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './Home.css'

import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo'
import Chart from '../../components/chart/Chart'
// import WidgetSm from '../../components/widgetSm/WidgetSm'
// import WidgetLg from '../../components/widgetLg/WidgetLg'
import Loader from '../../components/loader/loader'

import { returnAdminHaulers, returnAdminUsers, getSum } from '../../helpers/adminDetailsHelpers'

const Home = () => {
    const first = useRef(true)

    const [userList, setUserList] = useState(null)
    const [haulerList, setHaulerList] = useState(null)

    const adminLogin = useSelector((state) => state.adminLogin)
    const { admin } = adminLogin

    useEffect(async() => {
        if(admin !== undefined) {
            const list = await returnAdminUsers(admin.users)
            const list1 = await returnAdminHaulers(admin.haulers)
            setUserList(list)
            setHaulerList(list1)
            first.current = false
        }
    }, [admin])

    return (
      <div className="home">
        {
            userList === null && first.current === true && admin === undefined && haulerList === null ?
            <Loader /> :
            <>
                <FeaturedInfo />   
                <Chart 
                    data = {userList} 
                    title = 'User Analytics' 
                    grid 
                    dataKey = 'User'
                />
                <Chart 
                    data = {haulerList} 
                    title = 'Hauler Analytics' 
                    grid 
                    dataKey = 'Hauler'
                />
                {/* <div className="homeWidgets">
                    <WidgetSm/>
                    <WidgetLg/>
                </div> */}
            </> 
        }
      </div>
    )
}

export default Home