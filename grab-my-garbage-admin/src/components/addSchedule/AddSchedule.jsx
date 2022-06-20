import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, InputLabel, Select, MenuItem, FormControl } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { LoadingButton } from '@mui/lab'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import GeoCode from 'react-geocode'
import axios from 'axios'

import './AddSchedule.css'

import { RETRIEVE_SCHEDULE_PICKUP_LIST_SUCCESS } from '../../redux/constants/schedulePickupConstants'

const AddSchedule = ({id}) => {
    const dispatch = useDispatch()

    const formik = useRef()
    const location = useRef()

    const schedulePickupList = useSelector((state) => state.schedulePickupList)
    const { schedulePickupList: schedulePickup } = schedulePickupList

    const [from, setFrom] = useState(new Date(new Date().getTime() + 24*60*60*1000))
    const [to, setTo] = useState(new Date(new Date().getTime() + 28*24*60*60*1000))
    const [days, setDays] = useState([])
    const [timeslot, setTimeSlot] = useState('')
    const [address, setAddress] = useState('')
    const [lloading, setLoading] = useState(false)

    const initialValues = {from: from, to: to, days: days, timeslot: timeslot, address: address}

    const haulerSchema = Yup.object().shape({
        timeslot: Yup.string()
            .required('Time is required'),
        address: Yup.string()
            .required('Address is required')
    })

    const getLatLng = async(address) => {
        GeoCode.setApiKey('AIzaSyAbfkVeoFpJ3IFgmb48FSWuKFWQsLYteKA')
        GeoCode.setLanguage('en')
        GeoCode.setRegion('')
        GeoCode.enableDebug()

        GeoCode.fromAddress(address).then(async(response) => {
            const { lat, lng } = await response.results[0].geometry.location
            const city = await response.results[0].address_components[2].long_name
            const data = {latitude: lat, longitude: lng, city}
            location.current = data
            return true
        },
        (error) => {
           
        })
    }

    const handleAdd = async(pickupInfo, id, result) => {
        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const res = await axios.post(`https://grab-my-garbage-server.herokuapp.com/admin/users/schedule`,
        {pickupInfo, id, result}, config)

        if(res.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Schedule Pickup Add Success',
                text: 'Schedule Pickup Details have been successfully added'
            })
            setLoading(false)
            formik.current.resetForm()
            setDays([])
            setFrom(new Date(new Date().getTime() + 24*60*60*1000))
            setTo(new Date(new Date().getTime() + 28*24*60*60*1000))
            setTimeSlot('')
            setAddress('')

            const Data = [...schedulePickup]
            const data = {
                _id: res.data._id,
                location: res.data.location,
                from: res.data.from,
                to: res.data.to,
                days: res.data.days,
                timeslot: res.data.timeslot,
                payment: res.data.payment,
                paymentMethod: res.data.paymentMethod,
                pickerId: res.data.pickerId,
                completed: 0,
                cancelled: 0,
                inactive: 0,
                active: 0,
                customerId: res.data.customerId
            }
            Data.push(data)
            dispatch({
                type: RETRIEVE_SCHEDULE_PICKUP_LIST_SUCCESS,
                payload: data
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Schedule Pickup Add Fail',
                text: res.data.msg
            })
            setLoading(false)
        }
    }

    return (
        <div style = {{padding: '0px'}}>
            <Formik
                initialValues = {initialValues}
                enableReinitialize
                validationSchema = {haulerSchema}
                validateOnMount = {false}
                validateOnChange = {true}
                validateOnBlur = {true}
                onSubmit = {async(values, actions) => {
                    setLoading(true)
                    if(actions.validateForm) {
                        const result = await getLatLng(values.address)
                        setTimeout(() => {
                            handleAdd(values, id, location.current)
                        }, 3000)     
                    } else {
                        setLoading(false)
                    }
                }}
                innerRef = {formik}
            >
            {
                (props) =>
                <>
                <div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <LocalizationProvider dateAdapter = {AdapterDateFns}>
                                <DatePicker 
                                    label = 'Start Date'
                                    value = {from}
                                    onChange = {(value) => {
                                        setFrom(value)
                                    }}
                                    renderInput = {(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className = 'form-field'>
                            <LocalizationProvider dateAdapter = {AdapterDateFns}>
                                <DatePicker 
                                    label = 'End Date'
                                    value = {to}
                                    onChange = {(value) => {
                                        setTo(value)
                                    }}
                                    renderInput = {(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <FormControl>
                                <InputLabel id = 'day'>Select Days</InputLabel>
                                <Select
                                    error = {props.errors.days && props.touched.days}
                                    required
                                    labelId = 'Days'
                                    id = 'day'
                                    label = {props.errors.days && props.touched.days ? props.errors.days : 'Select Day'}
                                    style = {{
                                        width: '250px'
                                    }}
                                    multiple = {true}
                                    onChange = {(event) => setDays(event.target.value)}
                                    value = {days}
                                >
                                    <MenuItem value = 'Monday'>Monday</MenuItem>
                                    <MenuItem value = 'Tuesday'>Tuesday</MenuItem>
                                    <MenuItem value = 'Wednesday'>Wednesday</MenuItem>
                                    <MenuItem value = 'Thursday'>Thursday</MenuItem>
                                    <MenuItem value = 'Friday'>Friday</MenuItem>
                                    <MenuItem value = 'Saturday'>Saturday</MenuItem>
                                    <MenuItem value = 'Sunday'>Sunday</MenuItem>
                                </Select>
                            </FormControl>
                        </div>  

                        <div className = 'form-field'>
                            <FormControl>
                                <InputLabel id = 'time'>Select Time Slot</InputLabel>
                                <Select
                                    error = {props.errors.timeslot && props.touched.timeslot}
                                    required
                                    labelId = 'Time Slot'
                                    id = 'time'
                                    label = {props.errors.timeslot && props.touched.timeslot ? props.errors.timeslot : 'Select Time Slot'}
                                    style = {{
                                        width: '250px'
                                    }}
                                    value = {timeslot}
                                    onChange = {(event) => setTimeSlot(event.target.value)}
                                >
                                    <MenuItem value = '8.00 A.M - 12.00 P.M'>8.00 A.M - 12.00 P.M</MenuItem>
                                    <MenuItem value = '2.00 P.M - 6.00 P.M'>2.00 P.M - 6.00 P.M</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.address && props.touched.address}
                                required
                                id = 'address'
                                label = {props.errors.address && props.touched.address ? props.errors.address : 'Enter Address'}
                                style = {{
                                    width: '250px',
                                }}
                                multiline = {true}
                                rows = {3}
                                value = {address}
                                onChange = {(event) => setAddress(event.target.value)}
                            />
                        </div>
                    </div>
                    
                </div>

                {/* <div className = 'map'>
                    <OverLay polygon = {polygon} />
                            </div> */}
                <div className = 'buttonHolder'>   
                    <LoadingButton 
                        variant = 'contained' 
                        style = {{width: 150, marginTop: 40, backgroundColor: '#00d0f1'}}
                        loading = {lloading}
                        onClick = {props.handleSubmit}
                    >
                        Add
                    </LoadingButton>
                </div>
                </>
            }
            </Formik>
        </div>
    )
}

export default AddSchedule