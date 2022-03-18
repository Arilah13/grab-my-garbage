import React, { useState } from 'react'
import { Menu, MenuItem, Fade } from '@mui/material'
import { useHistory } from 'react-router-dom'


import './Topbar.css'

const Topbar = () => {
    const history = useHistory()

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        setAnchorEl(null)
        console.log(event.target.outerText)
        if(event.target.outerText !== 'Logout') {
            history.push('/profile')
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
                        src = 'https://res.cloudinary.com/rilah/image/upload/v1646563014/grab-my-garbage/photo-by-face-generator_62248ea14ca88a000ddee071_ouipsz.jpg' 
                        alt = '' 
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