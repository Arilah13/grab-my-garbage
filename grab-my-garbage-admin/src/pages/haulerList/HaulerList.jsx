import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './HaulerList.css'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { Backdrop, Slide, Modal, Box } from '@mui/material'
import { SpinnerDotted } from 'spinners-react'

import { getHaulers } from '../../redux/actions/haulerActions'

import AddHauler from '../../components/addHauler/AddHauler'

const HaulerList = () => {
    const dispatch = useDispatch()

    const haulerList = useSelector((state) => state.haulerList)
    const { loading, haulerList: haulers } = haulerList

    const [data, setData] = useState()
    const [open, setOpen] = useState(false)

    // const handleDelete = (id) => {
    //     setData(data.filter((item) => item.id !== id))
    // }

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
                    <Link to = {'/user/' + params.row._id}>
                        <button className = 'haulerListEdit'>View</button>
                    </Link>
                    <DeleteOutline
                        className = 'haulerListDelete'
                        //onClick={() => handleDelete(params.row.id)}
                    />
                </>
                )
            },
        },
    ]

    useEffect(() => {
        if(haulers === undefined) {
            dispatch(getHaulers())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [haulers])

    useEffect(() => {
        if(haulers !== undefined) {
            setData(haulers)
        }
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
                <SpinnerDotted 
                    size = {150}
                    color = '#00d0f1'
                    style = {{
                        marginTop: '10%',
                        marginLeft: '40%'
                    }}
                /> :
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
                    <AddHauler />
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