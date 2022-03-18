import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, Button } from '@mui/material'

import { getSchedulePickupInfo } from '../../redux/actions/schedulePickupActions'
import { fromDate } from '../../helpers/timeHelpers'

import './SchedulePickupDetails.css'
import Loader from '../../components/loader/loader'
import OverLay from '../../components/map/OverLay'

const SchedulePickupDetails = ({history, match}) => {
    const dispatch = useDispatch()

    const schedulePickupDetail = useSelector((state) => state.schedulePickupDetail)
    const { loading, schedulePickupDetail: pickup } = schedulePickupDetail

    useEffect(() => {
        if(pickup === undefined || (pickup !== undefined && pickup._id !== match.params.pickupId)) {
            dispatch(getSchedulePickupInfo(match.params.pickupId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickup])
    
    return (
        <div className = 'schedulePickup'>
            <div className = 'schedulePickupTitleContainer'>
                <h1 className = 'schedulePickupTitle'>Schedule Pickup</h1>
            </div>
            {
                loading === true && pickup === undefined &&
                <Loader /> 
            }
            {   
                loading === false && pickup !== undefined &&
                <div className = 'schedulePickupTop'>
                    <div className = 'schedulePickupTopLeft'>

                    <h3>Schedule Pickup Details</h3>

                        <div className = 'schedulePickupFlex'>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    id = 'startDate'
                                    label = 'Start Date'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {fromDate(pickup.from)}
                                />
                            </div>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    id = 'endDate'
                                    label = 'End Date'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {fromDate(pickup.to)}
                                />
                            </div>
                        </div>

                        <div className = 'schedulePickupFlex'>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    id = 'timeslot'
                                    label = 'Timeslot'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {pickup.timeslot}
                                />
                            </div>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    multiline
                                    rows = {pickup.days.length}
                                    id = 'days'
                                    label = 'Days'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {pickup.days.map((pickup) => {
                                        return pickup.replace(/,/g, '') + '\n'
                                    })}
                                />
                            </div>
                        </div>

                        <div className = 'schedulePickupFlex'>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    id = 'payment'
                                    label = 'Payment'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {'Rs.' + pickup.payment}
                                />
                            </div>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    id = 'paymentMethod'
                                    label = 'Payment Method'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {pickup.paymentMethod}
                                />
                            </div>
                        </div>
                        
                        <div className = 'schedulePickupFlex'>
                            <div className = 'form-field'>
                                <Button 
                                    variant = 'contained' 
                                    component = 'span' 
                                    //startIcon = {<Publish />} 
                                    style = {{marginTop: 10, marginBottom: 10, marginLeft: 10}} 
                                    onClick = {() => history.push(`/users/${pickup.customerId._id}`)}
                                >
                                    View Customer Details
                                </Button>
                            </div>

                            <div className = 'form-field'>
                                <Button 
                                    variant = 'contained' 
                                    component = 'span' 
                                    //startIcon = {<Publish />} 
                                    style = {{marginTop: 10, marginBottom: 10, marginLeft: 20}} 
                                    onClick = {() => history.push(`/haulers/${pickup.pickerId._id}`)}
                                >
                                    View Hauler Details
                                </Button>
                            </div>
                        </div>

                    </div>

                    <div className = 'schedulePickupTopRight'>
                        <OverLay lat = {pickup.location[0].latitude} lng = {pickup.location[0].longitude} />
                    </div>
                </div>
            }
        </div>
    )
}

export default SchedulePickupDetails