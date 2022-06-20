import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import './SchedulePickupList.css'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import { Backdrop, Slide, Modal, Box } from '@mui/material'
import Swal from 'sweetalert2'

import { getSchedulePickups } from '../../redux/actions/schedulePickupActions'
import { fromDate } from '../../helpers/timeHelpers'

import Loader from '../../components/loader/loader'
import AddSchedule from '../../components/addSchedule/AddSchedule'

const SchedulePickupList = () => {
    const dispatch = useDispatch()

    const schedulePickupList = useSelector((state) => state.schedulePickupList)
    const { loading, schedulePickupList: schedulePickup } = schedulePickupList

    const [data, setData] = useState(null)
    const [open, setOpen] = useState(false)

    const Button = ({ type }) => {
        return <button className = {'button ' + type}>{type}</button>
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
        { field: 'duration', headerName: 'Duration', width: 250, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {params.row.from && fromDate(params.row.from) + ' - ' + fromDate(params.row.to)}
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
                    <Link to = {{
                        pathname: '/schedulepickups/' + params.row._id,
                        state: {
                            from: params.row.from,
                            to: params.row.to,
                            timeslot: params.row.timeslot,
                            days: params.row.days,
                            payment: params.row.payment,
                            paymentMethod: params.row.paymentMethod,
                            customerId: params.row.customerId,
                            pickerId: params.row.pickerId,
                            loc: params.row.location
                        }
                    }}>
                        <button className = 'pickupListEdit'>View</button>
                    </Link>
                );
            },
        },
    ]

    useEffect(() => {
        if(schedulePickup === undefined) {
            dispatch(getSchedulePickups())
        } else if(schedulePickup !== undefined) {
            setData(schedulePickup)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedulePickup])

    return (
        <div className = 'schedulePickupList'>
            <div className = 'titleContainer'>
                <div className = 'pageHeading'>Schedule Pickup List</div>
            </div>
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

        <Modal
            aria-labelledby = 'transition-modal-title'
            aria-describedby = 'transition-modal-description'
            open = {open}
            onClose = {() => setOpen(false)}
            closeAfterTransition
            BackdropComponent = {Backdrop}
            BackdropProps = {{
              timeout: 500,
            }}
        >
            <Slide in = {open}>
                <Box sx={style}>
                    <AddSchedule setOpen = {setOpen} />
                </Box>
            </Slide>
        </Modal>

        </div>
    )
}

const style = {
    position: 'absolute',
    top: 50,
    left: 550,
    transform: 'translate(-50%, -50%)',
    width: 580,
    height: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5
};

export default SchedulePickupList