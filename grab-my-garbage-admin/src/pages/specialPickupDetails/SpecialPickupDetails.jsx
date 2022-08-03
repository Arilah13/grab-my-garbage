import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import { fromDate, timeHelper } from '../../helpers/timeHelpers'

import './SpecialPickupDetails.css'
import OverLay from '../../components/map/OverLay'

const SpecialPickupDetails = ({history, location}) => {
    const { datetime, category, weight, image, payment, paymentMethod, customerId, pickerId, loc, completed, accepted } = location.state

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
        <div className = 'specialPickup'>
            <div className = 'specialPickupTitleContainer'>
                <Link to = {{pathname: '/specialpickups'}} className = 'back'>
                    <ArrowBack 
                        fontSize = 'large'
                    />
                </Link>
                <h1 className = 'specialPickupTitle'>Special Pickup</h1>
                <div></div>
            </div>

            <div className = 'specialPickupTop'>
                <div className = 'specialPickupTopLeft'>

                <h3>Special Pickup Details</h3>

                    <div className = 'specialPickupFlex'>
                        <div className = 'form-field'>
                            <TextField
                                disabled
                                id = 'date'
                                label = 'Date'
                                style = {{
                                    width: '250px'
                                }}
                                InputLabelProps = {{
                                    shrink: true
                                }}
                                value = {fromDate(datetime)}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                disabled
                                id = 'time'
                                label = 'Time'
                                style = {{
                                    width: '250px'
                                }}
                                InputLabelProps = {{
                                    shrink: true
                                }}
                                value = {timeHelper(datetime)}
                            />
                        </div>
                    </div>

                    <div className = 'specialPickupFlex'>
                        <div className = 'form-field'>
                            <TextField
                                disabled
                                multiline
                                rows = {category.length}
                                id = 'category'
                                label = 'Category'
                                style = {{
                                    width: '250px'
                                }}
                                InputLabelProps = {{
                                    shrink: true
                                }}
                                value = {category.map((pickup) => {
                                    return pickup.replace(/,/g, '') + '\n'
                                })}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                disabled
                                id = 'weight'
                                label = 'Weight'
                                style = {{
                                    width: '250px'
                                }}
                                InputLabelProps = {{
                                    shrink: true
                                }}
                                value = {weight + ' Kg'}
                            />
                        </div>
                    </div>

                    <div className = 'specialPickupFlex'>
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

                    {
                        completed === 1 && 
                        <div className = 'specialPickupFlex'>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    id = 'completedDate'
                                    label = 'Completed Date'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {fromDate(datetime)}
                                />
                            </div>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    id = 'completedTime'
                                    label = 'Completed Time'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {timeHelper(datetime)}
                                />
                            </div>
                        </div>
                    }

                    <div className = 'specialPickupFlex'>
                        <div className = 'form-field'>
                            <h4 className = 'headerOptional'>Optional Image</h4>
                        </div>
                        <div className = 'form-field'>
                            {
                                image !== undefined ?
                                <img 
                                    src = {image}
                                    alt = 'specialPickupImage'
                                    className = 'specialUploadImg' 
                                /> :
                                <div className = 'headerImage'>No Image Available</div>
                            }
                        </div>
                    </div>
                    
                    <div className = 'specialPickupFlex'>
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
                        {
                            accepted === 1 &&
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
                        }
                    </div>

                </div>

                <div className = 'specialPickupTopRight'>
                    <OverLay lat = {loc[0].latitude} lng = {loc[0].longitude} />
                </div>

            </div>
            
        </div>
    )
}

export default SpecialPickupDetails