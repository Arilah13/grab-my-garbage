import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import './SpecialPickupList.css'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

import { getSpecialPickups } from '../../redux/actions/specialPickupActions'
import { RETRIEVE_SPECIAL_PICKUP_LIST_SUCCESS } from '../../redux/constants/specialPickupConstants'
import { timeHelper, dateHelper } from '../../helpers/timeHelpers'

import Loader from '../../components/loader/loader'

const SpecialPickupList = () => {
    const dispatch = useDispatch()

    const specialPickupList = useSelector((state) => state.specialPickupList)
    const { loading, specialPickupList: specialPickup } = specialPickupList

    const [data, setData] = useState(null)

    const Button = ({ type }) => {
        return <button className = {'button ' + type}>{type}</button>
    }

    const handleCancel = (id) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async(result) => {
            if (result.isConfirmed) {
                const res = await axios.put(`https://grab-my-garbage-server.herokuapp.com/admin/specialpickup/${id}`, config)

                if(res.status === 200) {
                    const Data = [...specialPickup]
                    const index = await specialPickup.findIndex(pickup => pickup._id === id)
                    const data = await Data.splice(index, 1)[0]
                    data.cancelled = 1
                    Data.splice(index, 0, data)
                    dispatch({
                        type: RETRIEVE_SPECIAL_PICKUP_LIST_SUCCESS,
                        payload: Data
                    })
                    Swal.fire(
                        'Pickup Cancelled',
                        'Special pickup has been cancelled.',
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Error',
                        res.data.msg,
                        'error'
                    )
                }
            }
        })
    }

    const columns = [
        { field: 'customerId', headerName: 'User', width: 250, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <div className = 'pickupListUser'>
                    <img className = 'pickupListImg' src = {params.row.customerId.image !== undefined ? params.row.customerId.image : require('../../assets/user.png')} alt = '' />
                    {params.row.customerId.name && params.row.customerId.name}
                </div>
                );
            },
        },
        { field: 'datetime', headerName: 'Date', width: 250, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {params.row.datetime && dateHelper(params.row.datetime) + ' - ' + timeHelper(params.row.datetime)}
                    </>
                )
            }
        },
        { field: 'status', headerName: 'Status', width: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <div>
                        {
                            params.row.accepted === 0 && params.row.cancelled === 0 && <Button type = 'Pending'/> 
                        }
                        {
                            params.row.accepted === 1 && params.row.completed === 0 && 
                            params.row.cancelled === 0 &&
                            <Button type = 'Accepted'/>
                        }
                        {
                            params.row.accepted === 1 && params.row.completed === 1 &&
                            params.row.cancelled === 0 &&
                            <Button type = 'Completed'/>
                        }
                        {
                            params.row.cancelled === 1 &&
                            <Button type = 'Cancelled'/>
                        }
                    </div>
                )
            }
        },
        { field: 'action', headerName: 'Action', width: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        <Link to = {{
                            pathname: '/specialpickups/' + params.row._id,
                            state: {
                                datetime: params.row.datetime,
                                category: params.row.category,
                                weight: params.row.weight,
                                image: params.row.image,
                                payment: params.row.payment,
                                paymentMethod: params.row.paymentMethod,
                                customerId: params.row.customerId,
                                pickerId: params.row.pickerId,
                                loc: params.row.location,
                                completed: params.row.completed,
                                accepted: params.row.accepted
                            }
                        }}>
                            <button className = 'pickupListEdit'>View</button>
                        </Link>
                        <>
                        {
                            params.row.completed === 0 && params.row.cancelled === 0 &&
                            <button 
                                className = 'pickupListCancel'
                                onClick = {() => handleCancel(params.row._id)}
                            >Cancel</button> 
                        }
                        </>
                    </>
                )
            },
        },
    ]

    useEffect(() => {
        if(specialPickup === undefined) {
            dispatch(getSpecialPickups())
        } else if(specialPickup !== undefined) {
            setData(specialPickup)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specialPickup])

    return (
        <div className = 'specialPickupList'>
            <div className = 'pageHeading'>Special Pickup List</div>
            <div className = 'breadcrumb'>
                <span className = 'main'>Dashboard&nbsp;</span>
                <span className = 'active'>/&nbsp;SpecialPickupList</span>
            </div>

            {
                loading === true ?
                <Loader /> :
                <DataGrid
                    rows = {data}
                    columns = {columns}
                    pageSize = {8}
                    style = {{
                        backgroundColor: 'white'
                    }}
                    autoHeight
                    getRowId = {(row) => row._id}
                />
            }

        </div>
    )
}

export default SpecialPickupList