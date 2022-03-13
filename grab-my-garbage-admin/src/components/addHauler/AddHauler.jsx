import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { TextField, InputLabel, Select, MenuItem, FormControl } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

import './AddHauler.css'
import OverLay from '../map/OverLay'
import polygonData from '../../helpers/polygonData'

const AddHauler = () => {
    const dispatch = useDispatch()

    const [haulerName, setHaulerName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [phone, setPhone] = useState(null)
    const [serviceCity, setServiceCity] = useState(null)
    const [image, setImage] = useState(null)
    const [pic, setPic] = useState(null)

    const polygon = polygonData.map((polygondata) => {
        return({
            area: polygondata.coordinates,
            id: polygondata.id,
            name: polygondata.name
        })
    })

    return (
        <form style = {{padding: '30px'}}>
            <div style = {{
                fontSize: 21,
                fontWeight: 600,
                marginBottom: '30px'
            }}>Add Hauler</div>
            
            <div>

                <div className = 'form-box'>
                    <div className = 'form-field'>
                        <TextField
                            required
                            id = 'haulername'
                            label = 'Hauler Name'
                            style = {{
                                width: '250px'
                            }}
                        />
                    </div>
                    <div className = 'form-field'>
                        <TextField
                            required
                            id = 'email'
                            label = 'Email'
                            style = {{
                                width: '250px'
                            }}
                        />    
                    </div>
                </div>
                <div className = 'form-box'>
                    <div className = 'form-field'>
                        <TextField
                            required
                            id = 'password'
                            type = 'password'
                            label = 'Password'
                            style = {{
                                width: '250px'
                            }}
                        />
                    </div>
                    <div className = 'form-field'>
                        <TextField
                            required
                            id = 'phone'
                            type = 'number'
                            label = 'Phone Number'
                            style = {{
                                width: '250px'
                            }}
                        />
                    </div>  
                    
                </div>
                <div className = 'form-box'>
                    <FormControl>
                        <InputLabel id = 'city'>Select Service City</InputLabel>
                        <Select
                            required
                            labelId = 'city'
                            id = 'cityselect'
                            label = 'Select Service City'
                            style = {{
                                width: '250px'
                            }}
                        >
                            <MenuItem value = {1}>Wellawatte</MenuItem>
                            <MenuItem value = {1}>Bambalapitiya</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <label htmlFor = 'upload-photo'>
                    <image
                        
                    />
                    <input
                        style = {{display: 'none'}}
                        id = 'upload-photo'
                        name = 'upload-photo'
                        type = 'file'
                    />
                    <button
                        className = 'newHaulerButton'
                    >
                        Upload Image
                    </button>
                </label>
                
            </div>

            {/* <div className = 'map'>
                <OverLay polygon = {polygon} />
            </div> */}
            <div className = 'buttonHolder'>   
                <button className = 'newHaulerButton'>Add</button>
            </div>
        </form>
    )
}

export default AddHauler