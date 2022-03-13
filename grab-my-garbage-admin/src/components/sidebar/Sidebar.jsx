import React from 'react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'
import { LocalShipping, Timeline, AccessTime, PermIdentity, CalendarMonth } from '@mui/icons-material'

const Sidebar = ({}) => {
    const location = useLocation()

    return (
        <div className = 'sidebar'>
            <div className = 'sidebarWrapper'>
                <div className = 'sidebarMenu'>
                    <h3 className = 'sidebarTitle'>Main</h3>
                    <ul className = 'sidebarList'>
                        <Link to = '/' className = 'link'>
                            <li className = {location.pathname === '/' ? 'sidebarListItemActive' : 'sidebarListItem'}>
                                <Timeline className = 'sidebarIcon'/>
                                Home
                            </li>
                        </Link>
                        <Link to="/users" className = 'link'>
                            <li className = {location.pathname.includes('/users') ? 'sidebarListItemActive' : 'sidebarListItem'}>
                                <PermIdentity className = 'sidebarIcon'/>
                                Users
                            </li>
                        </Link>
                        <Link to="/haulers" className = 'link'>
                            <li className = {location.pathname.includes('/haulers') ? 'sidebarListItemActive' : 'sidebarListItem'}>
                                <LocalShipping className = 'sidebarIcon'/>
                                Haulers
                            </li>
                        </Link>
                        <Link to="/specialpickups" className = 'link'>
                            <li className = {location.pathname.includes('/specialpickups') ? 'sidebarListItemActive' : 'sidebarListItem'}>
                                <AccessTime className = 'sidebarIcon'/>
                                Special Pickups
                            </li>
                        </Link>
                        <Link to="/schedulepickups" className = 'link'>
                            <li className = {location.pathname.includes('/schedulepickups') ? 'sidebarListItemActive' : 'sidebarListItem'}>
                                <CalendarMonth className = 'sidebarIcon'/>
                                Schedule Pickups
                            </li>
                        </Link>
                    </ul>    
                </div>  

          </div>
      </div>
    )
}

export default Sidebar