import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Publish } from "@mui/icons-material"
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import axios from 'axios'

import { RETRIEVE_HAULER_LIST_SUCCESS } from '../../redux/constants/haulerConstants'

import { returnPerMonthPickup, moneyreturn } from '../../helpers/userDetailsHelpers'

import './HaulerDetails.css'
import Chart from '../../components/chart/Chart'
import Loader from '../../components/loader/loader'

const HaulerDetails = ({location}) => {
    const dispatch = useDispatch()

    const formik = useRef()

    const [pickupList, setPickupList] = useState(null)
    const [paymentList, setPaymentList] = useState(null)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [pic, setPic] = useState('')
    const [service_city, setService_city] = useState('')
    const [password, setPassword] = useState('')
    const [password1, setPassword1] = useState('')

    const haulerList = useSelector((state) => state.haulerList)
    const { haulerList: haulers } = haulerList

    const initialValues = {email: email, name: name, phone: phone, image: image, pic: pic, 
                           service_city: service_city, password: password, password1: password1 }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const haulerSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid Email address')
            .required('Email address is required'),
        name: Yup.string()
            .required('Name is required'),
        phone: Yup.string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, 'Should contain only 10 digits')
            .max(10, 'Should contain only 10 digits'),
        image: Yup.string().required('Image is required'),
        password: Yup.string()
            .notRequired()
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters'),
        password1: Yup.string()
            .when('password', {
                is: (password) => password !== undefined,
                then: Yup.string()
                        .required('Password is required')
                        .min(6, 'Password must be atleast 6 characters')
                        .max(50, 'Password must not be more than 50 characters')
                        .oneOf([Yup.ref('password'), null], "Passwords don't match")
            }),
        service_city: Yup.string().required('Choose a service city')
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
        setImage(URL.createObjectURL(event.target.files[0]))
        const base64 = await convertBase64(event.target.files[0])
        setPic(base64)
    }

    const handleUpdate = async() => {
        //const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const image = pic

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/admin/haulers/${location.state._id}`, 
        {email, name, phone, image, password, service_city}, config)

        if(res.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Hauler Update Success',
                text: 'Hauler Details have been successfully updated'
            })
            formik.current.setSubmitting(false)
            const Data = [...haulers]
            const index = await haulers.findIndex(hauler => hauler._id === location.state._id)
            const data = await Data.splice(index, 1)[0]
            data.email = res.data.email
            data.name = res.data.name
            data.phone = res.data.phone
            data.image = res.data.image
            data.service_city = res.data.service_city
            Data.splice(index, 0, data)
            dispatch({
                type: RETRIEVE_HAULER_LIST_SUCCESS,
                payload: Data
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Hauler Update Fail',
                text: res.data.msg
            })
            formik.current.setSubmitting(false)
        }
    }

    useEffect(() => {
        setEmail(location.state.email)
        setName(location.state.name)
        setImage(location.state.image)
        setPhone(location.state.phone)
        setService_city(location.state.service_city)
        const list = returnPerMonthPickup(location.state.schedulePickups, location.state.specialPickups)
        setPickupList(list)
        const list1 = moneyreturn(location.state.schedulePickups, location.state.specialPickups)
        setPaymentList(list1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className = 'hauler'>
            <div className = 'haulerTitleContainer'>
                <h1 className = 'haulerTitle'>Hauler</h1>
            </div>

            {
                pickupList === null && paymentList === null ?
                <Loader /> :
                <>
                <div className = 'haulerTop'>
                    <div className = 'haulerTopLeft'>
                        <Chart 
                            dataKey = 'Schedule Pickups' 
                            title = 'Special and Scheduled Pickups Collection' 
                            data = {pickupList !== undefined ? pickupList : 0}
                            dataKey1 = 'Special Pickups'
                        />
                    </div>
                    <div className = 'haulerTopRight'>
                        <Chart 
                            dataKey = 'Schedule Pickups' 
                            title = 'Special and Scheduled Pickups Payment' 
                            dataKey1 = 'Special Pickups'
                            data = {paymentList}
                        />
                    </div>
                </div>
                <div className = 'haulerBottom'>
                    <h3>Hauler Details</h3>
                    <div className = 'haulerDetails'>

                        <Formik
                            initialValues = {initialValues}
                            enableReinitialize
                            validationSchema = {haulerSchema}
                            validateOnMount = {false}
                            validateOnChange = {false}
                            validateOnBlur = {true}
                            onSubmit = {(values, actions) => {
                                if(actions.validateForm) {
                                    handleUpdate()
                                } else {
                                    actions.setSubmitting(false)
                                }
                            }}
                            innerRef = {formik}
                        >
                        {
                            (props) =>
                            <div className = 'haulerDetailsLeft'>
                                <div className = 'haulerFlex'>
                                    <div className = 'form-field'>
                                        <TextField
                                            error = {props.errors.name && props.touched.name}
                                            id = 'name'
                                            label = {props.errors.name && props.touched.name ? props.errors.name : 'Name'}
                                            style = {{
                                                width: '250px'
                                            }}
                                            InputLabelProps = {{
                                                shrink: props.values.name !== '' ? true : false
                                            }}
                                            value = {props.values.name}
                                            onChange = {(event) => setName(event.target.value)}
                                        />
                                    </div>
                                    <div className = 'form-field'>
                                        <TextField
                                            error = {props.errors.email && props.touched.email}
                                            id = 'email'
                                            label = {props.errors.email && props.touched.email ? props.errors.email : 'Email'}
                                            style = {{
                                                width: '250px'
                                            }}
                                            InputLabelProps = {{
                                                shrink: props.values.email !== '' ? true : false
                                            }}
                                            value = {props.values.email}
                                            onChange = {(event) => setEmail(event.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className = 'haulerFlex'>
                                    <div className = 'form-field'>
                                        <TextField
                                            error = {props.errors.phone && props.touched.phone}
                                            id = 'phone'
                                            label = {props.errors.phone && props.touched.phone ? props.errors.phone : 'Phone Number'}
                                            style = {{
                                                width: '250px'
                                            }}
                                            InputLabelProps = {{
                                                shrink: props.values.phone !== '' ? true : false
                                            }}
                                            value = {props.values.phone}
                                            onChange = {(event) => setPhone(event.target.value)}
                                        />
                                    </div>
                                    <div className = 'form-field'>
                                        <FormControl>
                                            <InputLabel id = 'city'>Select Service City</InputLabel>
                                            <Select
                                                error = {props.errors.service_city && props.touched.service_city}
                                                required
                                                labelId = 'city'
                                                id = 'cityselect'
                                                label = {props.errors.service_city && props.touched.service_city ? props.errors.service_city : 'Select Service City'}
                                                style = {{
                                                    width: '250px'
                                                }}
                                                value = {props.values.service_city}
                                                onChange = {(event) => setService_city(event.target.value)}
                                            >
                                                <MenuItem value = 'wellwatte'>Wellawatte</MenuItem>
                                                <MenuItem value = 'bambalapitiya'>Bambalapitiya</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className = 'haulerFlex'>
                                    <div className = 'form-field'>
                                        <TextField
                                            error = {props.errors.password && props.touched.password}
                                            id = 'password'
                                            label = {props.errors.password && props.touched.password ? props.errors.password : 'Password'}
                                            style = {{
                                                width: '250px'
                                            }}
                                            InputLabelProps = {{
                                                shrink: props.values.password !== '' ? true : false
                                            }}
                                            type = 'password'
                                            onChange = {(event) => setPassword(event.target.value)}
                                        />
                                    </div>
                                    <div className = 'form-field'>
                                        <TextField
                                            error = {props.errors.password1 && props.touched.password1}
                                            id = 'password1'
                                            label = {props.errors.password1 && props.touched.password1 ? props.errors.password1 : 'Confirm Password'}
                                            style = {{
                                                width: '250px'
                                            }}
                                            InputLabelProps = {{
                                                shrink: props.values.password1 !== '' ? true : false
                                            }}
                                            type = 'password'
                                            onChange = {(event) => setPassword1(event.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className = 'haulerFlex'>
                                    <div className = 'form-field'>
                                        <label htmlFor = 'contained-button'>
                                            <input 
                                                accept = 'image/*' 
                                                id = 'contained-button' 
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
                                                    marginLeft: 100,
                                                    backgroundColor: props.errors.image && 'red'
                                                }} 
                                            >
                                                { props.errors.image ? 'Image Needed' : 'Upload'}
                                            </Button>
                                        </label>
                                    </div>
                                    <div className = 'form-field'>
                                        <img 
                                            src = {props.values.image !== undefined ? props.values.image : require('../../assets/user.png')} 
                                            alt = {props.values.name} 
                                            className = 'haulerUploadImg' 
                                        />
                                    </div>
                                </div>

                                <div className = 'form-field'>
                                    <LoadingButton 
                                        variant = 'contained' 
                                        style = {{marginLeft: '70%', width: 150, marginTop: 20, backgroundColor: '#00d0f1'}}
                                        loading = {props.isSubmitting}
                                        onClick = {props.handleSubmit}
                                    >
                                        Update
                                    </LoadingButton>
                                </div>

                            </div>
                        }
                        </Formik>
                    </div>    
                </div>
                </>
            }
        </div>
    )
}

export default HaulerDetails