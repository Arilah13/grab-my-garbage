import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Publish } from "@mui/icons-material"
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import axios from 'axios'

import { RETRIEVE_USER_LIST_SUCCESS } from '../../redux/constants/userConstants'

import { returnPerMonthPickup, moneyreturn } from '../../helpers/userDetailsHelpers'

import './UserDetails.css'
import Chart from '../../components/chart/Chart'
import Loader from '../../components/loader/loader'
import AddSchedule from '../../components/addSchedule/AddSchedule'
import AddSpecial from '../../components/addSpecial/AddSpecial'

const UserDetails = ({ match, location }) => {
    const dispatch = useDispatch()

    const formik = useRef()

    const [pickupList, setPickupList] = useState(null)
    const [paymentList, setPaymentList] = useState(null)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [pic, setPic] = useState('')

    const userList = useSelector((state) => state.userList)
    const { userList: users } = userList

    //const { userLogin: { userInfo } } = getState()

    const initialValues = {email: email, name: name, phone: phone, image: image, pic: pic}

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const userSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid Email address')
            .required('Email address is required'),
        name: Yup.string()
            .required('Name is required'),
        phone: Yup.string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, 'Should contain only 10 digits')
            .max(10, 'Should contain only 10 digits')
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
        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const image = pic

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/admin/users/${location.state._id}`, 
        {email, name, phone, image}, config)
        
        if(res.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'User Update Success',
                text: 'User Details have been successfully updated'
            })
            formik.current.setSubmitting(false)
            const Data = [...users]
            const index = await users.findIndex(user => user._id === location.state._id)
            const data = await Data.splice(index, 1)[0]
            data.email = res.data.email
            data.name = res.data.name
            data.phone = res.data.phone
            data.image = res.data.image
            Data.splice(index, 0, data)
            dispatch({
                type: RETRIEVE_USER_LIST_SUCCESS,
                payload: Data
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'User Update Fail',
                text: res.data.msg
            })
            formik.current.setSubmitting(false)
        }
    }

    useEffect(() => {
        setName(location.state.name)
        setEmail(location.state.email)
        setImage(location.state.image)
        setPhone(location.state.phone)
        const list = returnPerMonthPickup(location.state.schedulePickups, location.state.specialPickups)
        setPickupList(list)
        const list1 = moneyreturn(location.state.schedulePickups, location.state.specialPickups)
        setPaymentList(list1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
 
    return (
        <div className = 'user'>
            <div className = 'userTitleContainer'>
                <h1 className = 'userTitle'>User</h1>
            </div>
            {
                pickupList === null && paymentList === null ?
                <Loader /> :
                <> 
                <div className = 'userTop'>
                    <div className = 'userTopLeft'>
                        <Chart 
                            dataKey = 'Schedule Pickups' 
                            title = 'Special and Scheduled Pickups Collection' 
                            data = {pickupList !== undefined ? pickupList : 0}
                            dataKey1 = 'Special Pickups'
                        />
                    </div>
                    <div className = 'userTopRight'>
                        <Chart 
                            dataKey = 'Schedule Pickups' 
                            title = 'Special and Scheduled Pickups Payment' 
                            dataKey1 = 'Special Pickups'
                            data = {paymentList}
                        />
                    </div>
                </div>

                <div className = 'userBottom'>
                    <h3>User Details</h3>
                    <div className = 'userDetails'>

                        <Formik
                            initialValues = {initialValues}
                            enableReinitialize
                            validationSchema = {userSchema}
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
                            <div className = 'userDetailsLeft'>
                                <div className = 'userFlex'>
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

                                <div className = 'userFlex'>
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
                                                style = {{marginTop: 50, marginLeft: 100}} 
                                            >
                                                Upload
                                            </Button>
                                        </label>
                                    </div>
                                    <div className = 'form-field'>
                                        <img 
                                            src = {props.values.image !== undefined ? props.values.image : require('../../assets/user.png')} 
                                            alt = {props.values.name} 
                                            className = 'userUploadImg' 
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
                
                <div className = 'userTop'>
                    <div className = 'userBottom1'>
                        <h3>Add Special Pickup</h3>
                        <div className = 'userDetails1'>
                            <AddSpecial id = {match.params.userId}/>
                        </div>
                    </div>

                    <div className = 'userBottom1'>
                        <h3>Add Schedule Pickup</h3>
                        <div className = 'userDetails1'>
                            <div className = ''>
                                <AddSchedule id = {match.params.userId}/>
                            </div>
                            
                        </div>
                    </div>
                </div>
                </>   
            }
        </div>
    )
}

export default UserDetails