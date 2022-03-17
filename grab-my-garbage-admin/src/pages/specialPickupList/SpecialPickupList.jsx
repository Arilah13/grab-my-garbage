import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import './SpecialPickupList.css'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'

import { getSpecialPickups } from '../../redux/actions/specialPickupActions'
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

    const columns = [
        { field: 'customerId', headerName: 'User', width: 250, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <div className = 'pickupListUser'>
                    <img className = 'pickupListImg' src = {params.row.customerId.image !== undefined ? params.row.customerId.image : require('../../assets/user.png')} alt = '' />
                    {params.row.customerId.name}
                </div>
                );
            },
        },
        { field: 'datetime', headerName: 'Date', width: 250, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {dateHelper(params.row.datetime) + ' - ' + timeHelper(params.row.datetime)}
                    </>
                )
            }
        },
        { field: 'status', headerName: 'Status', width: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <div>
                        {
                            params.row.accepted === 0 ? <Button type = 'Pending'/>  :
                            params.row.accepted === 1 && params.row.completed === 0 ? <Button type = 'Accepted'/> :
                            <Button type = 'Completed'/>
                        }
                    </div>
                )
            }
        },
        { field: 'action', headerName: 'Action', width: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <Link to = {'/specialpickups/' + params.row._id}>
                        <button className = 'pickupListEdit'>View</button>
                    </Link>
                )
            },
        },
    ]

    useEffect(() => {
        if(specialPickup === undefined) {
            dispatch(getSpecialPickups())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specialPickup])

    useEffect(() => {
        if(specialPickup !== undefined) {
            setData(specialPickup)
        }
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