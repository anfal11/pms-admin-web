import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import { formatReadableDate } from '../../helper'

const ComplainList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [complainList, setComplainList] = useState([])

    useEffect(() => {
        useJwt.complainList().then(res => {
            console.log(res)
            setComplainList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
                Error(err)
            console.log(err.response)
            setTableDataLoading(false)
        })
    }, [resetData])
    const handlePoPupActions = (id, message) => {
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
                return useJwt.deleteComplain({complain_id : id}).then(res => {
                    Success(res)
                    setComplainList(complainList.filter(c => c.id !== id))
                    console.log(res)
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
            name: 'SL',
            minWidth: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Complain Title',
            minWidth: '200px',
            sortable: true,
            selector: 'complain_title'
        },
        {
            name: 'Complain Priority',
            minWidth: '100px',
            sortable: true,
            selector: 'complain_priority'
        },
        {
            name: 'Category',
            minWidth: '100px',
            sortable: true,
            selector: 'category'
        },
        {
            name: 'Created At',
            minWidth: '100px',
            sortable: true,
            selector: (item) => {
                return item.created_at ? formatReadableDate(item.created_at) : null
            }
        },
        {
            name: 'Status',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.status === 'pending' ? <Badge pill color='danger' className='badge-center'>
                Pending
              </Badge> : row.status === 'in_progress' ?  <Badge pill color='warning' className='badge-center'>
                In Progress
              </Badge> : <Badge pill color='success' className='badge-center'>
                Solved
              </Badge>
            }
        },
        {
            name: 'Action',
            minWidth: '100px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 'Do you want to delete?')}
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>My Complains</CardTitle>
                <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createComplain' >
                <div className='d-flex align-items-center'>
                        <Plus size={17} style={{marginRight:'5px'}}/>
                        <span >Create Complain</span>
                </div>
                </Button.Ripple>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md='12'>
                        <CommonDataTable column={column} TableData={complainList} TableDataLoading={TableDataLoading} />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default ComplainList