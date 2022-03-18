import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, InputLabel, Select, MenuItem, FormControl, Button } from '@mui/material'
import { Publish } from '@mui/icons-material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { LoadingButton } from '@mui/lab'

import './AddHauler.css'
import OverLay from '../map/OverLay'
import polygonData from '../../helpers/polygonData'
import { addHauler } from '../../redux/actions/haulerActions'
import { HAULER_ADD_RESET } from '../../redux/constants/haulerConstants'

const AddHauler = ({setOpen}) => {
    const dispatch = useDispatch()

    const formik = useRef()

    const haulerAdd = useSelector((state) => state.haulerAdd)
    const { loading, success, error } = haulerAdd

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [c_password, setC_password] = useState('')
    const [phone, setPhone] = useState('')
    const [serviceCity, setServiceCity] = useState('')
    const [image, setImage] = useState('')
    const [pic, setPic] = useState('')

    const initialValues = {email: email, name: name, phone: phone, image: image, pic: pic, password: password, confirm_password: c_password, service_city: serviceCity}

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const haulerSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid Email address')
            .required('Email address is required'),
        name: Yup.string()
            .required('Name is required'),
        phone: Yup.string()
            .required('Phone number is required')
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, 'Should contain only 10 digits')
            .max(10, 'Should contain only 10 digits'),
        image: Yup.string().required('Image is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters'),
        confirm_password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters')
            .oneOf([Yup.ref('password'), null], "Passwords don't match"),
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

    const polygon = polygonData.map((polygondata) => {
        return({
            area: polygondata.coordinates,
            id: polygondata.id,
            name: polygondata.name
        })
    })

    useEffect(() => {
        if(success === true) {
            Swal.fire({
                icon: 'success',
                title: 'Hauler Registration Success',
                text: 'Hauler Details have been successfully added'
            })
            formik.current.setSubmitting(false)
            dispatch({
                type: HAULER_ADD_RESET
            })
            setOpen(false)
        }
        else if(error) {
            Swal.fire({
                icon: 'error',
                title: 'Hauler Registration Fail',
                text: error
            })
            dispatch({
                type: HAULER_ADD_RESET
            })
            formik.current.setSubmitting(false)
        }
    }, [loading])

    return (
        <div style = {{padding: '30px'}}>
            <div style = {{
                fontSize: 21,
                fontWeight: 600,
                marginBottom: '30px'
            }}>Add Hauler</div>
            
            <Formik
                initialValues = {initialValues}
                enableReinitialize
                validationSchema = {haulerSchema}
                validateOnMount = {false}
                validateOnChange = {true}
                validateOnBlur = {true}
                onSubmit = {(values, actions) => {
                    if(actions.validateForm) {
                        setTimeout(() => {
                            dispatch(addHauler(values))
                        }, 400)
                    } else {
                        actions.setSubmitting(false)
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
                            <TextField
                                error = {props.errors.name && props.touched.name}
                                required
                                id = 'haulername'
                                label = {props.errors.name && props.touched.name ? props.errors.name : 'Hauler Name'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setName(event.target.value)}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.email && props.touched.email}
                                required
                                id = 'email'
                                label = {props.errors.email && props.touched.email ? props.errors.email : 'Email'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setEmail(event.target.value)}
                            />    
                        </div>
                    </div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.phone && props.touched.phone}
                                required
                                id = 'phone'
                                type = 'number'
                                label = {props.errors.phone && props.touched.phone ? props.errors.phone : 'Phone Number'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setPhone(event.target.value)}
                            />
                        </div>  
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
                                onChange = {(event) => setServiceCity(event.target.value)}
                            >
                                <MenuItem value = 'wellwatte'>Wellawatte</MenuItem>
                                <MenuItem value = 'bambalapitiya'>Bambalapitiya</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className = 'form-box'>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.password && props.touched.password}
                                required
                                id = 'password'
                                type = 'password'
                                label = {props.errors.password && props.touched.password ? props.errors.password : 'Password'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className = 'form-field'>
                            <TextField
                                error = {props.errors.confirm_password && props.touched.confirm_password}
                                required
                                id = 'confirmpassword'
                                type = 'password'
                                label = {props.errors.confirm_password && props.touched.confirm_password ? props.errors.confirm_password : 'Confirm Password'}
                                style = {{
                                    width: '250px'
                                }}
                                onChange = {(event) => setC_password(event.target.value)}
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
                            props.values.image !== '' &&
                            <img 
                                src = {props.values.image} 
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
                        loading = {props.isSubmitting}
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

export default AddHauler