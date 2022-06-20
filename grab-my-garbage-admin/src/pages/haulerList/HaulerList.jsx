import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './HaulerList.css'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { Backdrop, Slide, Modal, Box } from '@mui/material'
import Swal from 'sweetalert2'
import axios from 'axios'

import { getHaulers } from '../../redux/actions/haulerActions'
import { RETRIEVE_HAULER_LIST_SUCCESS } from '../../redux/constants/haulerConstants'

import AddHauler from '../../components/addHauler/AddHauler'
import Loader from '../../components/loader/loader'

const HaulerList = () => {
    const dispatch = useDispatch()

    const haulerList = useSelector((state) => state.haulerList)
    const { loading, haulerList: haulers } = haulerList

    const [data, setData] = useState()
    const [open, setOpen] = useState(false)

    //const { userLogin: { userInfo } } = getState()

    const config = {
        headers: {
            'Content-type': 'application/json',
            //Authorization: `Bearer ${userInfo.token}`
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async(result) => {
            if (result.isConfirmed) {
                const res = await axios.delete(`https://grab-my-garbage-server.herokuapp.com/admin/haulers/${id}`, config)
                if(res.status === 200) {
                    const Data = [...haulers]
                    await Data.splice(Data.findIndex(hauler => hauler._id === id), 1)[0]
                    dispatch({
                        type: RETRIEVE_HAULER_LIST_SUCCESS,
                        payload: Data
                    })
                    //setData(Data)
                    Swal.fire(
                        'Hauler Deleted',
                        'Hauler details has been deleted.',
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
        { field: '_id', hide: true },
        { field: 'hauler', headerName: 'Hauler', width: 250, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <div className = 'haulerListUser'>
                    <img className = 'haulerListImg' src = {params.row.image !== undefined ? params.row.image : require('../../assets/user.png')} alt = '' />
                    {params.row.name}
                </div>
                );
            },
        },
        { field: 'email', headerName: 'Email', width: 250, headerAlign: 'center', align: 'center' },
        { field: 'phone', headerName: 'Phone Number', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'action', headerName: 'Action', width: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <>
                    <Link to = {{
                        pathname: '/haulers/' + params.row._id,
                        state: {
                            _id: params.row._id,
                            name: params.row.name,
                            email: params.row.email,
                            role: params.row.role,
                            image: params.row.image,
                            phone: params.row.phone,
                            pushId: params.row.pushId,
                            limit: params.row.limit,
                            location: params.row.location,
                            service_city: params.row.service_city,
                            specialPickups: params.row.specialPickups,
                            schedulePickups: params.row.schedulePickups
                        }
                    }}>
                        <button className = 'haulerListEdit'>View</button>
                    </Link>
                    <DeleteOutline
                        className = 'haulerListDelete'
                        onClick={() => handleDelete(params.row._id)}
                    />
                </>
                )
            },
        },
    ]

    useEffect(() => {
        if(haulers === undefined) {
            dispatch(getHaulers())
        } else if(haulers !== undefined) {
            setData(haulers)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [haulers])

    return (
        <>
        <div className = 'haulerList'>
            <div className = 'titleContainer'>
                <div className = 'pageHeading'>Hauler List</div>
                <button className = 'haulerAddButton' onClick = {() => setOpen(true)}>Add</button>
            </div>
            <div className = 'breadcrumb'>
                <span className = 'main'>Dashboard&nbsp;</span>
                <span className = 'active'>/&nbsp;Hauler List</span>
            </div>

            {
                loading === true ?
                <Loader /> :
                <DataGrid
                    rows = {data}
                    columns = {columns}
                    pageSize = {8}
                    style = {{
                        backgroundColor: 'white',
                        
                    }}
                    autoHeight
                    getRowId = {(row) => row._id}
                />
            }
        </div>

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
                    <AddHauler setOpen = {setOpen} />
                </Box>
            </Slide>
        </Modal>
        </>
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

export default HaulerList