import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import './UserList.css'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import { getUsers, deleteUser } from '../../redux/actions/userActions'
import { USER_DELETE_RESET } from '../../redux/constants/userConstants'

import Loader from '../../components/loader/loader'

const UserList = () => {
    const dispatch = useDispatch()

    const userList = useSelector((state) => state.userList)
    const { loading, userList: users } = userList

    const userDelete = useSelector((state) => state.userDelete)
    const { success, error } = userDelete

    const [data, setData] = useState()

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
                dispatch(deleteUser(id))
            }
        })
    }

    const columns = [
        { field: 'id', hide: true },
        { field: 'name', headerName: 'User', width: 280, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <div className = 'userListUser'>
                    <img className = 'userListImg' src = {params.row.image !== undefined ? params.row.image : require('../../assets/user.png')} alt = '' />
                    {params.row.name}
                </div>
                );
            },
        },
        { field: 'email', headerName: 'Email', width: 280, headerAlign: 'center', align: 'center' },
        { field: 'phone', headerName: 'Phone Number', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'action', headerName: 'Action', width: 230, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                <>
                    <Link to = {'/users/' + params.row._id}>
                        <button className = 'userListEdit'>View</button>
                    </Link>
                    <DeleteOutline
                        className = 'userListDelete'
                        onClick={() => handleDelete(params.row._id)}
                    />
                </>
                )
            },
        },
    ]

    useEffect(() => {
        if(users === undefined) {
            dispatch(getUsers())
        }
        else if(users !== undefined) {
            setData(users)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users])

    useEffect(() => {
        if(success === true) {
            Swal.fire(
                'User Deleted',
                'User details has been deleted.',
                'success'
            )
            dispatch({
                type: USER_DELETE_RESET
            })
            dispatch(getUsers())
        } else if(success === false) {
            Swal.fire(
                'Error',
                error,
                'error'
            )
            dispatch({
                type: USER_DELETE_RESET
            })
        }
    }, [userDelete])

    return (
        <div className = 'userList'>
            <div className = 'pageHeading'>User List</div>
            <div className = 'breadcrumb'>
                <span className = 'main'>Dashboard&nbsp;</span>
                <span className = 'active'>/&nbsp;UserList</span>
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

export default UserList