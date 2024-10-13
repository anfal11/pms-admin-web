import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle, Bell
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import { Link, useHistory, useParams } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import ServerSideDataTable from '../../ServerSideDataTable'
import { Success, Error } from '../../../../../viewhelper'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
const MySwal = withReactContent(Swal)
import { handle401 } from '@src/views/helper'
import ss from '../../../../../../assets/images/avatars/1.png'
import ActiveUserBarChart from '../../../../../VendorComponents/DashBoardUI/ActiveUserBarChart'

const DetailsNotification = () => {
    const history = useHistory()
    const {notification_id} = useParams()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [NotificationReport, setNotificationReport] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)

    const [userInput, setUserInput] = useState({
        notification_status: 0, //notificaion_status: 0=pending || 1=sent || 2= failed || 3=quota exceeded
        notification_type:"email" //notification_type":"sms" || "email" || "push_notification
    })
    const { notification_status, notification_type } = userInput

    const getData = (page, limit, notification_id, notification_status, notification_type) => {
        console.log({ page, limit, notification_id: parseInt(notification_id), notification_status, notification_type })
        setTableDataLoading(true)
        useJwt.getDetailsNotificationReport({ page, limit, notification_id: parseInt(notification_id), notification_status, notification_type }).then(res => {
            console.log('NotificationReport', res)
            setRowCount(res.data.payload.count)
            setNotificationReport(res.data.payload.rows)
        }).catch(err => {
            handle401(err.response?.status)
            console.log(err.response)
        }).finally(f => {
            setTableDataLoading(false)
        })
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        getData(page.selected + 1, 50, notification_id, notification_status, notification_type)
        setCurrentPage(page.selected)
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, 50, notification_id, notification_status, notification_type)
    }, [])
    const channelData = [{channel: 'Facebook', ra: '60%'}, {channel: 'SMS', ra: '70%'}, {channel: 'Email', ra: '65%'}, {channel: 'Push Notificaiton', ra: '94%'}, {channel: 'Instagram', ra: '14%'}]
    const column = [
        {
            name: 'Channel',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return row.channel || '---'
            }
        },
        {
            name: 'Reachability',
            minWidth: '250px',
            sortable: true,
            selector: 'ra'
        }
    ]
    // const column = [
    //     {
    //         name: 'Title',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: row => {
    //             return row.title || '---'
    //         }
    //     },
    //     {
    //         name: 'Body',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: 'body'
    //     },
    //     {
    //         name: 'Attachment',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: row => {
    //             return <img src={row.attachment} width='30%'/>
    //         }
    //     },
    //     {
    //         name: 'Receiver',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: 'receiver_id'
    //     },
    //     {
    //         name: 'Repeat Start Date',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: row => { return row.repeat_start_date ? formatReadableDate(row.repeat_start_date) : 'N/A' }
    //     },
    //     {
    //         name: 'Next Repeat Date',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: row => { return row.next_repeat_date ? formatReadableDate(row.next_repeat_date) : 'N/A' }
    //     },
    //     {
    //         name: 'Sent Date',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: row => { return row.sent_at ? formatReadableDate(row.sent_at) : 'N/A' }
    //     }
    // ]

    const onSubmit = e => {
        e.preventDefault()
        
        getData(1, 50, notification_id, notification_status, notification_type)
      
    }
    return (
        <>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/notificationReport' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
            </Button.Ripple>
            {/* <Card>
                <Form className="row p-1" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col md="3" >
                        <FormGroup>
                            <Label for="startDate">Status</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={{ value: 0, label: 'Pending' }}
                                onChange={(selected) => {
                                    setUserInput({ ...userInput, notification_status: selected.value })
                                }}
                                options={[{ value: 0, label: 'Pending' }, { value: 1, label: 'Sent' }, { value: 2, label: 'Failed' }, { value: 3, label: 'Quota Exceeded' }]}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="3" >
                        <FormGroup>
                            <Label for="endDate">Channel</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={{ value: 'email', label: 'Email' }}
                                onChange={(selected) => {
                                    setUserInput({ ...userInput, notification_type: selected.value })
                                }}
                                options={[{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }, { value: 'push_notification', label: 'Push Notification' }]}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="3" className='text-center'>
                        {
                            TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Search</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                    <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
  
                    ExportCSV(NotificationReport, Object.keys(NotificationReport[0]), 'Notification Report')
                        }}>
                            Export CSV
                        </Button.Ripple>
                </CardHeader>
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={[...column]}
                    TableData={NotificationReport}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card> */}
            <Card>
                <CardHeader>
                    <CardTitle><Bell style={{color:'blue'}}/> Notification</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row className='p-4'>
                        <Col sm='6' style={{margin:'0 20px 0 -40px'}}>
                            <Card>
                                <CardBody>
                                {/* <Row>
                                    <Col sm='8'></Col>
                                    <Col className='d-flex align-items-center justify-content-end' sm='4'>
                                        <Label className='mr-1' for='search-input'>
                                        Search
                                        </Label>
                                        <Input
                                        className='dataTable-filter mb-50'
                                        type='text'
                                        bsSize='sm'
                                        id='search-input'
                                        // value={searchValue}
                                        // onChange={handleFilter}
                                        />
                                    </Col>
                                </Row> */}
                                <ServerSideDataTable
                                    currentPage={currentPage}
                                    handlePagination={handlePagination}
                                    RowCount={RowCount}
                                    column={[...column]}
                                    TableData={channelData}
                                    RowLimit={50}
                                    TableDataLoading={TableDataLoading} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm='6' style={{position:'relative', border:'2px solid blue', borderRadius:'15px', padding:'40px'}}>
                            <h6 style={{position:'absolute', transform: 'rotate(-90deg)', top:'150px', left:'-35px', color: 'blue', fontWeight:'900'}}>Success Rate (%)</h6>
                            <ActiveUserBarChart style={{minHeight:'400px'}} labels={['Facebook', 'SMS', 'P_Notification', 'Email']} dataCount={[50, 45, 77, 34]} datalabel={'Notification'} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}

export default DetailsNotification