import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, InputLabel, Select, MenuItem, FormControl, Button } from '@mui/material'
import { Publish } from '@mui/icons-material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { LoadingButton } from '@mui/lab'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import GeoCode from 'react-geocode'
import axios from 'axios'

import './AddSpecial.css'

import { RETRIEVE_SPECIAL_PICKUP_LIST_SUCCESS } from '../../redux/constants/specialPickupConstants'

const AddSpecial = ({id}) => {
    const dispatch = useDispatch()

    const formik = useRef()
    const location = useRef()

    const specialPickupList = useSelector((state) => state.specialPickupList)
    const { specialPickupList: specialPickup } = specialPickupList

    const [datetime, setDateTime] = useState(new Date())
    const [category, setCategory] = useState([])
    const [weight, setWeight] = useState('')
    const [image, setImage] = useState('')
    const [pic, setPic] = useState('')
    const [address, setAddress] = useState('')
    const [lloading, setLoading] = useState(false)

    const initialValues = {datetime: datetime, category: category, weight: weight, image: image, pic: pic, address: address}

    const haulerSchema = Yup.object().shape({
        weight: Yup.string()
            .required('Weight is required'),
        address: Yup.string()
            .required('Address is required'),
        image: Yup.string()
            .required('Address is required'),
    })

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    const handleImage = async(event) => {
        setPic(URL.createObjectURL(event.target.files[0]))
        const base64 = await convertBase64(event.target.files[0])
        setImage(base64)
    }

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

        const res = await axios.post(`https://grab-my-garbage-server.herokuapp.com/admin/users/special`,
        {pickupInfo, id, result}, config)

        if(res.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Special Pickup Add Success',
                text: 'Special Pickup Details have been successfully added'
            })
            setLoading(false)
            setWeight('')
            setCategory([])
            setAddress('')
            setPic('')

            const Data = [...specialPickup]
            const data = {
                _id: res.data._id,
                location: res.data.location,
                datetime: res.data.datetime,
                category: res.data.category,
                weight: res.data.weight,
                image: res.data.image,
                payment: res.data.payment,
                paymentMethod: res.data.paymentMethod,
                accepted: 0,
                completed: 0,
                cancelled: 0,
                inactive: 0,
                active: 0,
                declinedHaulers: [],
                customerId: res.data.customerId
            }
            Data.push(data)
            dispatch({
                type: RETRIEVE_SPECIAL_PICKUP_LIST_SUCCESS,
                payload: data
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Spcial Pickup Add Fail',
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
                        }, 400)
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
                                <DateTimePicker 
                                    label = 'Select Date Time'
                                    value = {datetime}
                                    onChange = {(value) => {
                                        setDateTime(value)
                                    }}
                                    renderInput = {(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className = 'form-field'>
                            <FormControl>
                                <InputLabel id = 'day'>Select Category</InputLabel>
                                <Select
                                    error = {props.errors.category && props.touched.category}
                                    required
                                    labelId = 'Days'
                                    id = 'day'
                                    label = {props.errors.category && props.touched.category ? props.errors.category : 'Select Category'}
                                    style = {{
                                        width: '250px'
                                    }}
                                    multiple = {true}
                                    onChange = {(event) => setCategory(event.target.value)}
                                    value = {category}
                                >
                                    <MenuItem value = 'Loose Bags'>Loose Bags</MenuItem>
                                    <MenuItem value = 'Appliances'>Appliances</MenuItem>
                                    <MenuItem value = 'Electronics'>Electronics</MenuItem>
                                    <MenuItem value = 'Furniture'>Furniture</MenuItem>
                                </Select>
                            </FormControl>  
                        </div>
                    </div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.weight && props.touched.weight}
                                required
                                id = 'password'
                                label = {props.errors.weight && props.touched.weight ? props.errors.weight : 'Weight'}
                                style = {{
                                    width: '250px'
                                }}
                                value = {weight}
                                onChange = {(event) => setWeight(event.target.value)}
                            />
                        </div>  
                        
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
                    
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <label htmlFor = 'upload-photo'>
                                <input 
                                    accept = 'image/*' 
                                    id = 'upload-photo' 
                                    multiple 
                                    type = 'file' 
                                    style = {{display: 'none'}} 
                                    onChange = {handleImage}
                                />
                                <Button 
                                    variant = 'contained' 
                                    component = 'span' 
                                    startIcon = {<Publish />} 
                                    style = {{
                                        marginTop: 50, 
                                        marginLeft: 70,
                                        backgroundColor: props.errors.image && 'red'
                                    }} 
                                >
                                    { props.errors.image ? 'Image Needed' : 'Upload'}
                                </Button>
                            </label>
                        </div>

                        <div className = 'form-field'>
                        {
                            props.values.pic !== '' &&
                            <img 
                                src = {props.values.pic} 
                                alt = {props.values.name} 
                                className = 'haulerUploadImg' 
                            />
                        }
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

export default AddSpecial