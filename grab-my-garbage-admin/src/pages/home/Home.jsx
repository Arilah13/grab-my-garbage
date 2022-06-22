import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './Home.css'
import socketIO from 'socket.io-client'

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
import { addSocket } from '../../redux/actions/socketActions'
import { ADD_ONGOING_SCHEDULE_PICKUP, REMOVE_ONGOING_SCHEDULE_PICKUP } from '../../redux/constants/schedulePickupConstants'
import { ADD_ONGOING_SPECIAL_PICKUP, REMOVE_ONGOING_SPECIAL_PICKUP } from '../../redux/constants/specialPickupConstants'

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

    const socketHolder = useSelector(state => state.socketHolder)
    const { socket } = socketHolder

    useEffect(async() => {
        if(admin !== undefined && first.current === true) {
            const list = await returnAdminUsers(admin.users)
            const list1 = await returnAdminHaulers(admin.haulers)
            setUserList(list)
            setHaulerList(list1)
            first.current = false
        }
    }, [admin])

    useEffect(async() => {
        if(admin) {
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

            if(socket === undefined) {
                const socket = await socketIO.connect('https://grab-my-garbage-socket.herokuapp.com/', {
                    reconnection: true
                })
                socket.emit('adminJoined', { adminid: admin._id })
                dispatch(addSocket(socket))
            }
        }
    }, [admin])

    useEffect(() => {
        if(socket) {
            socket.on('userPickup', async({pickup, hauler, time}) => {
                const data = {pickup, hauler, time}
                dispatch({
                    type: ADD_ONGOING_SPECIAL_PICKUP,
                    payload: data
                })
            })
            socket.on('pickupDone', async({pickupid}) => {
                dispatch({
                    type: REMOVE_ONGOING_SPECIAL_PICKUP,
                    payload: pickupid
                })
            })
            socket.on('userSchedulePickup', async({hauler, time, ongoingPickup, pickupid}) => {
                const data = {hauler, time, ongoingPickup, pickupid}
                dispatch({
                    type: ADD_ONGOING_SCHEDULE_PICKUP,
                    payload: data
                })
            })
            socket.on('schedulePickupCompleted', async({pickupid}) => {
                dispatch({
                    type: REMOVE_ONGOING_SCHEDULE_PICKUP,
                    payload: pickupid
                })
            })
        }
    }, [socket])

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