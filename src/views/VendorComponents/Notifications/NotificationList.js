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

const NotificationList = () => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [notificationList, setNotificationList] = useState([])
    const [notificationInfo, setnotificationInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    useEffect(() => {
        useJwt.getNotifications().then(res => {
            console.log(res)
            setNotificationList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
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
                const notificationId = parseInt(id)
                return useJwt.deleteNotifications({id: notificationId}).then(res => {
                    Success(res)
                    console.log(res)
                    setNotificationList(notificationList.filter(x => x.id !== id))
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
            name: 'Title',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.Notification_Title.slice(0, 20)
            }
        },
        {
            name: 'Message',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.Notification_Body.slice(0, 20)
            }
        },
        {
            name: 'Send Via SMS',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                const status = {
                    true: { title: 'True' },
                    false: { title: 'False'}
                }
                return status[row.viaSMS].title
            }
        },
        {
            name: 'Send Via Email',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                const status = {
                    true: { title: 'True' },
                    false: { title: 'False'}
                }
                return status[row.viaEmail].title
            }
        },
        {
            name: 'Send Via Push Notification',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                const status = {
                    true: { title: 'True' },
                    false: { title: 'False'}
                }
                return status[row.viaPushNotification].title
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setnotificationInfo(row)
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;
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
                <CardTitle tag='h4'>All Notifications</CardTitle>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md='12'>
                        <CommonDataTable column={column} TableData={notificationList} TableDataLoading={TableDataLoading} />
                    </Col>
                </Row>
                <EditModal
                    toggleModal={toggleModal}
                    modal={modal}
                    resetData={resetData}
                    setReset={setReset}
                    notificationInfo={notificationInfo}
                    setnotificationInfo={setnotificationInfo}
                />
            </CardBody>
        </Card>
    )
}

export default NotificationList