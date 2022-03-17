import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import './SchedulePickupList.css'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'

import { getSchedulePickups } from '../../redux/actions/schedulePickupActions'
import { fromDate } from '../../helpers/timeHelpers'

import Loader from '../../components/loader/loader'

const SchedulePickupList = () => {
    const dispatch = useDispatch()
    let number = 0

    const schedulePickupList = useSelector((state) => state.schedulePickupList)
    const { loading, schedulePickupList: schedulePickup } = schedulePickupList

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
        { field: 'duration', headerName: 'Duration', width: 250, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {fromDate(params.row.from) + ' - ' + fromDate(params.row.to)}
                    </>
                );
            }
        },
        { field: 'status', headerName: 'Status', width: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <div>
                        {
                            params.row.completed === 0 ? <Button type = 'Ongoing'/> :
                            <Button type = 'Completed'/>
                        }
                    </div>
                );
            }
        },
        { field: 'action', headerName: 'Action', width: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <Link to = {'/user/' + params.row._id}>
                        <button className = 'pickupListEdit'>View</button>
                    </Link>
                );
            },
        },
    ]

    useEffect(() => {
        if(schedulePickup === undefined) {
            dispatch(getSchedulePickups())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedulePickup])

    useEffect(() => {
        if(schedulePickup !== undefined) {
            setData(schedulePickup)
        }
    }, [schedulePickup])

    return (
        <div className = 'schedulePickupList'>
            <div className = 'pageHeading'>Schedule Pickup List</div>
            <div className = 'breadcrumb'>
                <span className = 'main'>Dashboard&nbsp;</span>
                <span className = 'active'>/&nbsp;SchedulePickupList</span>
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

export default SchedulePickupList