import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Paper, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

import { adminLogin } from '../../redux/actions/userActions'

import './Login.css'

const Login = ({setLogin}) => {
    const dispatch = useDispatch()

    const formik = useRef()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const adminLogin1 = useSelector((state) => state.adminLogin)
    const { loading, admin, error } = adminLogin1

    const initialValues = {email: email, password: password}
    
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid Email address')
            .required('Email address is required'),
        password: Yup.string()
            .required('Password is required'),
    })

    const paperStyle = {
        padding: 20,
        height: '50vh',
        width: 400,
        margin: '20px auto',
        marginTop: 120,
        marginLeft: 550
    }

    useEffect(() => {
        if(admin !== undefined) {
            setLogin(true)
            formik.current.setSubmitting(false)
        } else if(error !== undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Admin Login Fail',
                text: error
            })
            formik.current.setSubmitting(false)
        }
    }, [loading])

    useEffect(() => {
        const adminInfoFromStorage = JSON.parse(localStorage.getItem('admingarbage'))
        if(adminInfoFromStorage) {
            dispatch(adminLogin(adminInfoFromStorage))
            setLogin(true)
        }
    }, [])

    return (
        <Grid>
            <Paper elevation = {10} style = {paperStyle}>
                <div className = 'heading'>
                    <h3>Sign In</h3>
                </div>

                <Formik
                    initialValues = {initialValues}
                    enableReinitialize
                    validationSchema = {loginSchema}
                    validateOnMount = {false}
                    validateOnChange = {false}
                    validateOnBlur = {true}
                    onSubmit = {(values, actions) => {
                        if(actions.validateForm) {
                            setTimeout(() => {
                                dispatch(adminLogin(values))
                            }, 400)
                        } else {
                            actions.setSubmitting(false)
                        }
                    }}
                    innerRef = {formik}
                >
                {
                    (props) =>
                    <div>
                        <TextField
                            error = {props.errors.email && props.touched.email}
                            id = 'email'
                            label = {props.errors.email && props.touched.email ? props.errors.email : 'Email'}
                            style = {{
                                marginTop: 50,
                                marginLeft: 80,
                                width: '250px'
                            }}
                            InputLabelProps = {{
                                shrink: true
                            }}
                            value = {props.values.email}
                            onChange = {(event) => setEmail(event.target.value)}
                        />
                        <TextField
                            error = {props.errors.password && props.touched.password}
                            id = 'password'
                            label = {props.errors.password && props.touched.password ? props.errors.password : 'Password'}
                            type = 'password'
                            style = {{
                                marginTop: 20,
                                marginLeft: 80,
                                width: '250px'
                            }}
                            InputLabelProps = {{
                                shrink: true
                            }}
                            value = {props.values.password}
                            onChange = {(event) => setPassword(event.target.value)}
                        />

                        <LoadingButton
                            variant = 'contained'
                            style = {{
                                marginTop: 30,
                                marginLeft: 150,
                                width: 100
                            }}
                            loading = {props.isSubmitting}
                            onClick = {props.handleSubmit}
                        >
                            Login
                        </LoadingButton>
                    </div>
                }
                </Formik>
            </Paper>
        </Grid>
    )
}

export default Login