import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import EditModal from './EditModal'

const MysubUserList = () => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [subUserList, setsubUserList] = useState([])
    const [subUserInfo, setsubUserInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    useEffect(() => {
        useJwt.SubUserListVendor().then(res => {
            console.log(res.data.payload)
            setsubUserList(res.data.payload.map(x => {
                if (x.mobileno.length === 9) {
                    x.mobileno = `0${x.mobileno}`
                    return x
                } else { return x }
            }))
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })
    }, [resetData])
    const handlePoPupActions = (mobile, message) => {
        return MySwal.fire({
            title: message,
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
                // return true
                return useJwt.deleteSubUserVendor({ mobile }).then(res => {
                    Success(res)
                    console.log(res)
                    setsubUserList(subUserList.filter(x => x.mobileno !== mobile))
                }).catch(err => {
                    console.log(err.response)
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
            name: 'Name',
            minWidth: '100px',
            sortable: true,
            selector: row => `${row.firstname} ${row.lastname}`
        },
        {
            name: 'Email',
            minWidth: '100px',
            sortable: true,
            selector: 'email'
        },
        {
            name: 'Mobile',
            minWidth: '100px',
            sortable: true,
            selector: 'mobileno'
        },
        {
            name: 'Status',
            minWidth: '100px',
            // sortable: true,
            selector: row => {
                const statusBG = {
                    0: { title: 'Inactive', color: 'light-danger' },
                    1: { title: 'Active', color: 'light-success' }
                }
                return <Badge color={statusBG[row.userstatus].color} pill className='px-1'>
                    {statusBG[row.userstatus].title}
                </Badge>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setsubUserInfo(row)
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.mobileno, 'Do you want to delete?')}
                        />
                    </span>
                </>
            }
        }
    ]
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>My users</CardTitle>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md='12'>
                        <CommonDataTable column={column} TableData={subUserList} TableDataLoading={TableDataLoading} />
                    </Col>
                </Row>
                <EditModal
                    toggleModal={toggleModal}
                    modal={modal}
                    resetData={resetData}
                    setReset={setReset}
                    subUserInfo={subUserInfo}
                    setsubUserInfo={setsubUserInfo}
                />
            </CardBody>
        </Card>
    )
}

export default MysubUserList