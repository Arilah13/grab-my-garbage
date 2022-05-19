import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, MenuItem, Fade } from '@mui/material'
import { useHistory } from 'react-router-dom'

import { logout } from '../../redux/actions/userActions'

import './Topbar.css'

const Topbar = ({setLogin}) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const adminDetail = useSelector((state) => state.adminDetail)
    const { admin } = adminDetail

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        setAnchorEl(null)

        if(event.target.outerText !== 'Logout') {
            history.push('/profile')
        } else {
            dispatch(logout())
            setLogin(false)
        }
    }

    return (
        <div className = 'topbar'>
            <div className = 'topbarWrapper'>
                <div className = 'topLeft'>
                    <span className = 'logo'>grab-my-garbage</span>    
                </div>
                <div className = 'topRight'>
                    <img 
                        src = {admin && admin.admin.image}
                        alt = 'admin' 
                        className = 'topAvatar'
                        id = 'fade-button'
                        aria-controls = {open ? 'fade-menu' : undefined}
                        aria-haspopup = 'true'
                        aria-expanded = {open ? 'true' : undefined}
                        onClick = {handleClick} 
                    />
                </div>
            </div>
            <Menu
                id = 'fade-menu'
                MenuListProps = {{
                    'aria-labelledby': 'fade-button'
                }}
                anchorEl = {anchorEl}
                open = {open}
                onClose = {handleClose}
                TransitionComponent = {Fade}
                anchorOrigin = {{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <MenuItem  
                    onClick = {(event) => handleClose(event)}
                    defaultValue = 'Profile'
                >
                    Profile
                </MenuItem>
                <MenuItem  
                    onClick = {handleClose}
                    default = 'Logout'
                >
                    Logout
                </MenuItem>
            </Menu>
        </div>
    )
}

export default Topbar