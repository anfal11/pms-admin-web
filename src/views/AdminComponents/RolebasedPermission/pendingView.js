import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../viewhelper'
import { CheckSquare, ChevronLeft, XSquare } from 'react-feather'
import CommonDataTable from '../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { formatReadableDate } from '../../helper'
import Swal from 'sweetalert2'
import { OperationStatusSet } from '../../statusdb'

const PendingView = ({TableDataLoading, roleList, setRefresh, refresh}) => {
    const userName = localStorage.getItem('username')
    const { id } = useParams()
    const history = useHistory()
    const [featureIDs, setFeatureIDs] = useState([])
    const [sub_menu_ids, setSubmenuIDs] = useState([])
    const [addUserloading, setaddUserloading] = useState(false)
    const [allMenuList, setallMenuList] = useState([])
    const [isValid, setIsValid] = useState(false)
    const [internalrefresh, setinternalrefresh] = useState(false)
    const [othersPendingMenu, setOthersPendingMenu] = useState([])
    const [userInput, setUserInput] = useState({
        role_name:"",
        sub_menu_ids:[],
        menu_ids:[]
    })
    console.log(allMenuList)
    useEffect(() => {
        localStorage.setItem('useBMStoken', false)
        localStorage.setItem('usePMStoken', false)

        useJwt.roleBasedPending().then(res => {
            // setaddUserloading(false)
            console.log('getAdminMenuSubmenuList', res)
            setallMenuList(res.data.payload)
            // Success(res)
        }).catch(err => {
            // setaddUserloading(false)
            Error(err)
            console.log(err)
        })
    }, [])
    const handlePoPupActions = (id, status) => {
        return Swal.fire({
            title: `Are you sure?`,
            text: `You won't be able to revert this`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const data = {
                    module_id:id,
                    action:status
                }
                console.log(data)
                return useJwt.roleBasedAction(data).then(res => {
                    Success(res)
                    console.log(res)
                    //setOthersPendingMenu(othersPendingMenu.filter(x => x.id !== id))
                    setinternalrefresh(!internalrefresh)
                    // setReset(!reset)
                }).catch(err => {
                    console.log(err)
                    Error(err)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {
            }
        })
    }
    const column = [

        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: (item) => {
                return item.created_at ? formatReadableDate(item.created_at) : null
            }
        },
        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: (item) => <Badge color={OperationStatusSet(item['action']).color} pill className='px-1'> {OperationStatusSet(item['action']).title} </Badge>
        },
        {
            name: 'Module Name',
            minWidth: '200px',
            sortable: true,
            selector: item => {
                return item.module?.module_name
            }
        },
        {
            name: 'Role Name',
            minWidth: '150px',
            sortable: true,
            selector: item => {
                return `${item.role_id}-${item.roles?.role_name}`
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return row.created_by === userName ? 'Pending' : <>
                        <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 'Do you want to approve?', 1)}
                            onClick={() => {
                                handlePoPupActions(row.module_id, 'approve')
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 'Do you want to reject?', 2)}
                            onClick={(e) => {
                                handlePoPupActions(row.module_id, 'reject')
                            }}
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <Fragment>
            <CommonDataTable column={column} TableData={allMenuList} TableDataLoading={TableDataLoading}></CommonDataTable>
        </Fragment>
    )
}

export default PendingView