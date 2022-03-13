import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux' 
import './UserList.css'
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { SpinnerDotted } from 'spinners-react'

import { getUsers } from '../../redux/actions/userActions'

const UserList = () => {
    const dispatch = useDispatch()

    const userList = useSelector((state) => state.userList)
    const { loading, userList: users } = userList

    const [data, setData] = useState()

    // const handleDelete = (id) => {
    //     setData(data.filter((item) => item.id !== id))
    // }

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
                        //onClick={() => handleDelete(params.row.id)}
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users])

    useEffect(() => {
        if(users !== undefined) {
            setData(users)
        }
    }, [users])

    return (
        <div className = 'userList'>
            <div className = 'pageHeading'>User List</div>
            <div className = 'breadcrumb'>
                <span className = 'main'>Dashboard&nbsp;</span>
                <span className = 'active'>/&nbsp;UserList</span>
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