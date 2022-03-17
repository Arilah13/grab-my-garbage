import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './HaulerList.css'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { Backdrop, Slide, Modal, Box } from '@mui/material'
import Swal from 'sweetalert2'

import { getHaulers, deleteHauler } from '../../redux/actions/haulerActions'

import AddHauler from '../../components/addHauler/AddHauler'
import Loader from '../../components/loader/loader'
import { HAULER_DELETE_RESET } from '../../redux/constants/haulerConstants'

const HaulerList = () => {
    const dispatch = useDispatch()

    const haulerList = useSelector((state) => state.haulerList)
    const { loading, haulerList: haulers } = haulerList

    const haulerDelete = useSelector((state) => state.haulerDelete)
    const { success, error } = haulerDelete

    const [data, setData] = useState()
    const [open, setOpen] = useState(false)

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteHauler(id))
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
                    <Link to = {'/haulers/' + params.row._id}>
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

    useEffect(() => {
        if(success === true) {
            Swal.fire(
                'Hauler Deleted',
                'Hauler details has been deleted.',
                'success'
            )
            dispatch({
                type: HAULER_DELETE_RESET
            })
            dispatch(getHaulers())
        } else if(success === false) {
            Swal.fire(
                'Error',
                error,
                'error'
            )
            dispatch({
                type: HAULER_DELETE_RESET
            })
        }
    }, [haulerDelete])

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