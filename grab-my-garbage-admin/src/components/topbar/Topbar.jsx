import React from 'react'
import './Topbar.css'
import { NotificationsNone, Settings } from '@mui/icons-material'

const Topbar = () => {
    return (
        <div className = 'topbar'>
            <div className = 'topbarWrapper'>
                <div className = 'topLeft'>
                    <span className = 'logo'>grab-my-garbage</span>    
                </div>
                <div className = 'topRight'>
                    <div className = 'topbarIconContainer'>
                        <NotificationsNone />
                        <span className = 'topIconBadge'>2</span>
                    </div>
                    <div className = 'topbarIconContainer'>
                        <Settings />
                    </div>
                    <img 
                        src = 'https://res.cloudinary.com/rilah/image/upload/v1646563014/grab-my-garbage/photo-by-face-generator_62248ea14ca88a000ddee071_ouipsz.jpg' 
                        alt = '' 
                        className = 'topAvatar' 
                    />
                </div>
            </div>
        </div>
    )
}

export default Topbar