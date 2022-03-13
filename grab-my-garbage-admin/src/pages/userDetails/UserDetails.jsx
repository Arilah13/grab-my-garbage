import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SpinnerDotted } from 'spinners-react'
import { TextField, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Publish } from "@mui/icons-material"
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

import { getUserScheduledPickups, getUserSpecialPickups, getUserInfo, updateUserDetail } from '../../redux/actions/userActions'
import { USER_DETAIL_UPDATE_RESET } from '../../redux/constants/userConstants'

import { returnPerMonthPickup, moneyreturn } from '../../helpers/userDetailsHelpers'

import './UserDetails.css'
import Chart from '../../components/chart/Chart'

const UserDetails = ({ match }) => {
    const dispatch = useDispatch()

    const first = useRef(true)
    const formik = useRef()

    const [pickupList, setPickupList] = useState(null)
    const [paymentList, setPaymentList] = useState(null)
    const [name, setName] = useState(null)
    const [phone, setPhone] = useState(null)
    const [email, setEmail] = useState(null)
    const [image, setImage] = useState(null)
    const [pic, setPic] = useState(null)

    const userSchedulePickup = useSelector((state) => state.userSchedulePickup)
    const { loading: scheduleLoading, userScheduleList } = userSchedulePickup

    const userSpecialPickup = useSelector((state) => state.userSpecialPickup)
    const { loading: specialLoading, userSpecialList } = userSpecialPickup

    const userDetail = useSelector((state) => state.userDetail)
    const { loading: userLoading, userDetail: user } = userDetail

    const userDetailUpdate = useSelector((state) => state.userDetailUpdate)
    const { loading: updateLoading, success, error } = userDetailUpdate

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

    useEffect(() => {
        if(userScheduleList === undefined || userScheduleList.length === 0 || (userScheduleList.length > 0 && userScheduleList[0].customerId !== match.params.userId)) {
            dispatch(getUserScheduledPickups(match.params.userId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userScheduleList])

    useEffect(() => {
        if(userSpecialList === undefined || userSpecialList.length === 0 || (userSpecialList.length > 0 && userSpecialList[0].customerId !== match.params.userId)) {
            dispatch(getUserSpecialPickups(match.params.userId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSpecialList])

    useEffect(() => {
        if(user === undefined || user._id !== match.params.userId) {
            dispatch(getUserInfo(match.params.userId))
        }
        else if(user !== undefined) {
            setEmail(user.email)
            setName(user.name)
            setImage(user.image)
            setPhone(user.phone)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        if(userSpecialList !== undefined && userScheduleList !== undefined) {
            const list = returnPerMonthPickup(userScheduleList, userSpecialList)
            setPickupList(list)
            const list1 = moneyreturn(userScheduleList, userSpecialList)
            setPaymentList(list1)
            first.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSpecialList, userScheduleList])

    useEffect(() => {
        if(success) {
            Swal.fire({
                icon: 'success',
                title: 'User Update Success',
                text: 'User Details have been successfully updated'
            })
            formik.current.setSubmitting(false)
            dispatch({
                type: USER_DETAIL_UPDATE_RESET
            })
        }
        else if(error) {
            Swal.fire({
                icon: 'error',
                title: 'User Update Fail',
                text: error
            })
            dispatch({
                type: USER_DETAIL_UPDATE_RESET
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateLoading])
 
    return (
        <div className = 'user'>
            <div className = 'userTitleContainer'>
                <h1 className = 'userTitle'>User</h1>
            </div>
            {
                scheduleLoading === true && specialLoading === true && pickupList === null && paymentList === null && userLoading === true && first.current === true ?
                <SpinnerDotted 
                    size = {150}
                    color = '#00d0f1'
                    style = {{
                        marginTop: '10%',
                        marginLeft: '40%'
                    }}
                /> :
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
                                    setTimeout(() => {
                                        dispatch(updateUserDetail(user._id, values))
                                    }, 400)
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
                                            label = {props.errors.name && props.touched.name ? props.errors.username : 'Name'}
                                            style = {{
                                                width: '250px'
                                            }}
                                            InputLabelProps = {{
                                                shrink: true
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
                                                shrink: true
                                            }}
                                            value = {props.values.email}
                                            onChange = {(event) => setEmail(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className = 'userDetailsLeft'>
                                    <div className = 'form-field'>
                                        <TextField
                                            error = {props.errors.phone && props.touched.phone}
                                            id = 'phone'
                                            label = {props.errors.phone && props.touched.phone ? props.errors.phone : 'Phone Number'}
                                            style = {{
                                                width: '250px'
                                            }}
                                            InputLabelProps = {{
                                                shrink: true
                                            }}
                                            value = {props.values.phone}
                                            onChange = {(event) => setPhone(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className = 'userDetailsLeft'>
                                    <div className = 'userFlex'>
                                        <div className = 'form-field'>
                                            <label htmlFor = 'contained-button'>
                                                <input accept = 'image/*' id = 'contained-button' multiple type = 'file' style = {{display: 'none'}} onChange = {handleImage}/>
                                                <Button variant = 'contained' component = 'span' startIcon = {<Publish />} style = {{marginTop: 50, marginLeft: 100}} >
                                                    Upload
                                                </Button>
                                            </label>
                                        </div>
                                        <div className = 'form-field'>
                                            <img 
                                                src = {props.values.image !== undefined ? props.values.image : require('../../assets/user.png')} 
                                                alt = {props.values.username} 
                                                className = 'userUploadImg' 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className = 'userDetailsLeft'>
                                    <div className = 'form-field'>
                                        <LoadingButton 
                                            variant = 'contained' 
                                            style = {{marginLeft: '70%', width: 150, marginTop: 20}}
                                            loading = {props.isSubmitting}
                                            onClick = {props.handleSubmit}
                                        >
                                            Update
                                        </LoadingButton>
                                    </div>
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

export default UserDetails