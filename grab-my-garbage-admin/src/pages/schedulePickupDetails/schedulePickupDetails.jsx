import React from 'react'
import { useSelector } from 'react-redux'
import { TextField, Button } from '@mui/material'

import { fromDate } from '../../helpers/timeHelpers'

import './SchedulePickupDetails.css'
import OverLay from '../../components/map/OverLay'

const SchedulePickupDetails = ({history, location}) => {
    const { from, to, timeslot, days, payment, paymentMethod, customerId, pickerId, loc } = location.state
    
    const user = useSelector((state) => state.userList)
    const { userList: users } = user

    const hauler = useSelector((state) => state.haulerList)
    const { haulerList: haulers } = hauler

    const gotoUser = async(id) => {
        const user = await users.find(user => user._id === id)
        history.push({
            pathname: `/users/${id}`,
            state: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                phone: user.phone,
                paymentId: user.paymentId,
                pushId: user.pushId,
                specialPickups: user.specialPickups,
                schedulePickups: user.schedulePickups
            }
        })
    }

    const gotoHauler = async(id) => {
        const hauler = await haulers.find(hauler => hauler._id === id)
        history.push({
            pathname: `/haulers/${id}`,
            state: {
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                role: hauler.role,
                image: hauler.image,
                phone: hauler.phone,
                pushId: hauler.pushId,
                limit: hauler.limit,
                location: hauler.location,
                service_city: hauler.service_city,
                specialPickups: hauler.specialPickups,
                schedulePickups: hauler.schedulePickups
            }
        })
    }

    return (
        <div className = 'schedulePickup'>
            <div className = 'schedulePickupTitleContainer'>
                <h1 className = 'schedulePickupTitle'>Schedule Pickup</h1>
            </div>

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
                                value = {fromDate(from)}
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
                                value = {fromDate(to)}
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
                                value = {timeslot}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                disabled
                                multiline
                                rows = {days.length}
                                id = 'days'
                                label = 'Days'
                                style = {{
                                    width: '250px'
                                }}
                                InputLabelProps = {{
                                    shrink: true
                                }}
                                value = {days.map((pickup) => {
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
                                value = {'Rs.' + payment}
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
                                value = {paymentMethod}
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
                                onClick = {() => gotoUser(customerId._id)}
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
                                onClick = {() => gotoHauler(pickerId)}
                            >
                                View Hauler Details
                            </Button>
                        </div>
                    </div>

                </div>

                <div className = 'schedulePickupTopRight'>
                    <OverLay lat = {loc[0].latitude} lng = {loc[0].longitude} />
                </div>
            </div>

        </div>
    )
}

export default SchedulePickupDetails