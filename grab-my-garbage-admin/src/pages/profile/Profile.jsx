import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, Button } from '@mui/material'
import { Publish } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import axios from 'axios'

import { ADMIN_LOGIN_SUCCESS } from '../../redux/constants/userConstants'

import './Profile.css'

const Profile = () => {
    const dispatch = useDispatch()

    const formik = useRef()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirm_Password] = useState('')
    const [image, setImage] = useState('')
    const [pic, setPic] = useState('')

    const adminLogin = useSelector((state) => state.adminLogin)
    const { admin } = adminLogin

    const initialValues = {email: email, password: password, confirm_password: confirm_password, image: image, pic: pic}

    const adminSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid Email address')
            .required('Email address is required'),
        image: Yup.string().required('Image is required'),
        password: Yup.string()
            .notRequired()
            .min(6, 'Password must be atleast 6 characters')
            .max(50, 'Password must not be more than 50 characters'),
        confirm_password: Yup.string()
            .when('password', {
                is: (password) => password !== undefined,
                then: Yup.string()
                        .required('Password is required')
                        .min(6, 'Password must be atleast 6 characters')
                        .max(50, 'Password must not be more than 50 characters')
                        .oneOf([Yup.ref('password'), null], "Passwords don't match")
            }),
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

        const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/admin/users`,
        {email, password, image}, config)

        if(res.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Admin Update Success',
                text: 'Admin Details have been successfully updated'
            })
            formik.current.setSubmitting(false)
            dispatch({
                type: ADMIN_LOGIN_SUCCESS,
                payload: res.data
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Admin Update Fail',
                text: res.data.msg
            })
            formik.current.setSubmitting(false)
        }
    }

    useEffect(() => {
        setEmail(admin.admin.email)
        setImage(admin.admin.image)
    }, [])

    return (
        <div className = 'profile'>
            <div className = 'profileTitleContainer'>
                <h1 className = 'userTitle'>Profile</h1>
            </div>

            {   
                admin !== undefined &&
                    <div className = 'profileTop'>

                    <Formik
                        initialValues = {initialValues}
                        enableReinitialize
                        validationSchema = {adminSchema}
                        validateOnMount = {false}
                        validateOnChange = {false}
                        validateOnBlur = {true}
                        onSubmit = {(values, actions) => {
                            if(actions.validateForm) {
                                setTimeout(() => {
                                    handleUpdate()
                                }, 400)
                            } else {
                                actions.setSubmitting(false)
                            }
                        }}
                        innerRef = {formik}
                    >
                    {
                        (props) =>
                        <div className = 'profileTopLeft'>

                            <div className = 'specialPickupFlex'>
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

                            <div className = 'specialPickupFlex'>
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
                                        value = {props.values.password}
                                        onChange = {(event) => setPassword(event.target.value)}
                                    />
                                </div>
                                <div className = 'form-field'>
                                    <TextField
                                        error = {props.errors.confirm_password && props.touched.confirm_password}
                                        id = 'c_password'
                                        label = {props.errors.confirm_password && props.touched.confirm_password ? props.errors.confirm_password : 'Confirm Password'}
                                        style = {{
                                            width: '250px'
                                        }}
                                        InputLabelProps = {{
                                            shrink: props.values.confirm_password !== '' ? true : false
                                        }}
                                        type = 'password'
                                        value = {props.values.confirm_password}
                                        onChange = {(event) => setConfirm_Password(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className = 'specialPickupFlex'>
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
                                            src = {props.values.image !== '' ? props.values.image : require('../../assets/user.png')} 
                                            className = 'userUploadImg' 
                                            style = {{
                                                resize: 'block'
                                            }}
                                            alt = 'admin'
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
            }

        </div>
    )
}

export default Profile