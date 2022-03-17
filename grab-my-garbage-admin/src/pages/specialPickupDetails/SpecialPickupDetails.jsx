import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, Button } from '@mui/material'

import { getSpecialPickupInfo } from '../../redux/actions/specialPickupActions'
import { fromDate, timeHelper } from '../../helpers/timeHelpers'

import './SpecialPickupDetails.css'
import Loader from '../../components/loader/loader'
import OverLay from '../../components/map/OverLay'

const SpecialPickupDetails = ({history, match}) => {
    const dispatch = useDispatch()

    const specialPickupDetail = useSelector((state) => state.specialPickupDetail)
    const { loading, specialPickupDetail: pickup } = specialPickupDetail

    useEffect(() => {
        if(pickup === undefined || (pickup !== undefined && pickup._id !== match.params.pickupId)) {
            dispatch(getSpecialPickupInfo(match.params.pickupId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickup])

    return (
        <div className = 'specialPickup'>
            <div className = 'specialPickupTitleContainer'>
                <h1 className = 'specialPickupTitle'>Special Pickup</h1>
            </div>
            {
                loading === true && pickup === undefined &&
                <Loader /> 
            }
            {   
                loading === false && pickup !== undefined &&
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
                                    value = {fromDate(pickup.datetime)}
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
                                    value = {timeHelper(pickup.datetime)}
                                />
                            </div>
                        </div>

                        <div className = 'specialPickupFlex'>
                            <div className = 'form-field'>
                                <TextField
                                    disabled
                                    multiline
                                    rows = {pickup.category.length}
                                    id = 'category'
                                    label = 'Category'
                                    style = {{
                                        width: '250px'
                                    }}
                                    InputLabelProps = {{
                                        shrink: true
                                    }}
                                    value = {pickup.category.map((pickup) => {
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
                                    value = {pickup.weight + ' Kg'}
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

                        {
                            pickup.completed === 1 && 
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
                                        value = {fromDate(pickup.datetime)}
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
                                        value = {timeHelper(pickup.datetime)}
                                    />
                                </div>
                            </div>
                        }
                        
                        <div className = 'specialPickupFlex'>
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
                            {
                                pickup.accepted === 1 &&
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
                            }
                        </div>

                    </div>

                    <div className = 'specialPickupTopRight'>
                        <OverLay lat = {pickup.location[0].latitude} lng = {pickup.location[0].longitude} />
                    </div>

                </div>
            }
        </div>
    )
}

export default SpecialPickupDetails