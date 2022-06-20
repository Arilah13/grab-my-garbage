import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import './UserList.css'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

import { getUsers } from '../../redux/actions/userActions'
import { RETRIEVE_USER_LIST_SUCCESS } from '../../redux/constants/userConstants'

import Loader from '../../components/loader/loader'

const UserList = () => {
    const dispatch = useDispatch()

    const userList = useSelector((state) => state.userList)
    const { loading, userList: users } = userList

    const [data, setData] = useState()

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
                const res = await axios.delete(`https://grab-my-garbage-server.herokuapp.com/admin/users/${id}`, config)
    
                if(res.status === 200) {
                    const Data = [...users]
                    await Data.splice(Data.findIndex(user => user._id === id), 1)[0]
                    dispatch({
                        type: RETRIEVE_USER_LIST_SUCCESS,
                        payload: Data
                    })
                    //setData(users)
                    Swal.fire(
                        'User Deleted',
                        'User details has been deleted.',
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
                    <Link to = {{
                        pathname: '/users/' + params.row._id,
                        state: {
                            _id: params.row._id,
                            name: params.row.name,
                            email: params.row.email,
                            role: params.row.role,
                            image: params.row.image,
                            phone: params.row.phone,
                            paymentId: params.row.paymentId,
                            pushId: params.row.pushId,
                            specialPickups: params.row.specialPickups,
                            schedulePickups: params.row.schedulePickups
                        }
                    }}>
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

    return (
        <div className = 'userList'>
            <div className = 'pageHeading'>User List</div>
            <div className = 'breadcrumb'>
                <span className = 'main'>Dashboard&nbsp;</span>
                <span className = 'active'>/&nbsp;UserList</span>
            </div>

            {
                loading === true && users === undefined &&
                <Loader /> 
            }
            {
                loading === false && users !== undefined &&
                <DataGrid
                    rows = {data}
                    columns = {columns}
                    rowsPerPageOptions = {[5, 8, 10]}
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