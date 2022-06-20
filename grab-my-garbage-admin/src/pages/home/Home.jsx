import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './Home.css'

import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo'
import Chart from '../../components/chart/Chart'
// import WidgetSm from '../../components/widgetSm/WidgetSm'
// import WidgetLg from '../../components/widgetLg/WidgetLg'
import Loader from '../../components/loader/loader'

import { returnAdminHaulers, returnAdminUsers, getSum } from '../../helpers/adminDetailsHelpers'
import { getUsers } from '../../redux/actions/userActions'
import { getHaulers } from '../../redux/actions/haulerActions'
import { getSchedulePickups } from '../../redux/actions/schedulePickupActions'
import { getSpecialPickups } from '../../redux/actions/specialPickupActions'

const Home = () => {
    const dispatch = useDispatch()

    const first = useRef(true)

    const [userList, setUserList] = useState(null)
    const [haulerList, setHaulerList] = useState(null)

    const adminLogin = useSelector((state) => state.adminLogin)
    const { admin } = adminLogin

    const user = useSelector((state) => state.userList)
    const { userList: users } = user

    const hauler = useSelector((state) => state.haulerList)
    const { haulerList: haulers } = hauler

    const schedulePickupList = useSelector((state) => state.schedulePickupList)
    const { schedulePickupList: schedulePickup } = schedulePickupList

    const specialPickupList = useSelector((state) => state.specialPickupList)
    const { specialPickupList: specialPickup } = specialPickupList

    useEffect(async() => {
        if(admin !== undefined && first.current === true) {
            const list = await returnAdminUsers(admin.users)
            const list1 = await returnAdminHaulers(admin.haulers)
            setUserList(list)
            setHaulerList(list1)
            first.current = false
        }
    }, [admin])

    useEffect(() => {
        if(users === undefined) {
            dispatch(getUsers())
        }
        if(haulers === undefined) {
            dispatch(getHaulers())
        }
        if(schedulePickup === undefined) {
            dispatch(getSchedulePickups())
        }
        if(specialPickup === undefined) {
            dispatch(getSpecialPickups())
        }
    }, [])

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