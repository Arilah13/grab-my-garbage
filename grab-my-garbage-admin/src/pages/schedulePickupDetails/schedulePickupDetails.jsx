import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, Button } from '@mui/material'

import { getSchedulePickupInfo } from '../../redux/actions/schedulePickupActions'
import { fromDate, timeHelper } from '../../helpers/timeHelpers'

import './SchedulePickupDetails.css'
import Loader from '../../components/loader/loader'
import OverLay from '../../components/map/OverLay'

const schedulePickupDetails = ({history, match}) => {
    const dispatch = useDispatch()

    
    return (
        <div>schedulePickupDetails</div>
    )
}

export default schedulePickupDetails