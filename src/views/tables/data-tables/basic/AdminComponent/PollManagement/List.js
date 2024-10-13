import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import { useHistory, Link } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt2'
import CommonDataTable from '../ClientSideDataTable'
import { Success, Error } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { formatReadableDate } from '../../../../../helper'
import ExportTableData from './ExportTableData'
const MySwal = withReactContent(Swal)

const AllUsersTabs = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const history = useHistory()
    const [refresh, setRefresh] = useState(false)

    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const [PollList, setPollList] = useState([])
    const [PollLogList, setPollLogList] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    useEffect(() => {
        useJwt.pollFormList().then(res => {
            console.log('pollFormList', res.data.payload)
            setPollList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            setTableDataLoading(false)
            console.log(err)
        })
    }, [])
    useEffect(() => {
        useJwt.pollLogs().then(res => {
            console.log('pollLogs', res.data.payload)
            setPollLogList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            setTableDataLoading(false)
            console.log(err)
        })
    }, [refresh])

    const handlePoPupActions = (id, effective_date, message) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: message,
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
                console.log({ id, effective_date: new Date(effective_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') })
                return useJwt.deletePollForm({ id, effective_date: new Date(effective_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') }).then(res => {
                    Success(res)
                    setPollList(PollList.filter(x => x.id !== id))
                    console.log(res)
                    setRefresh(!refresh)
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
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = PollList.filter(item => {
            const startsWith =
            item.title.toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.effective_date).toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.expire_date).toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toLowerCase().startsWith(value.toLowerCase()) ||
            item.created_by?.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.effective_date).toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.expire_date).toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toLowerCase().includes(value.toLowerCase()) ||
            item.created_by?.toLowerCase().includes(value.toLowerCase())

            if (startsWith) {
            return startsWith
            } else if (!startsWith && includes) {
            return includes
            } else return null
        })
        setFilteredData(updatedData)
        setSearchValue(value)
        }
    }
    const [searchValue1, setSearchValue1] = useState('')
    const [filteredData1, setFilteredData1] = useState([])
    const handleFilter1 = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue1(value)

        if (value.length) {
        updatedData = PollLogList.filter(item => {
            const startsWith =
            item.title.toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.effective_date).toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.expire_date).toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toLowerCase().startsWith(value.toLowerCase()) ||
            item.created_by?.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.effective_date).toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.expire_date).toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toLowerCase().includes(value.toLowerCase()) ||
            item.created_by?.toLowerCase().includes(value.toLowerCase())

            if (startsWith) {
            return startsWith
            } else if (!startsWith && includes) {
            return includes
            } else return null
        })
        setFilteredData1(updatedData)
        setSearchValue1(value)
        }
    }
    const column = [
        {
            name: 'Form Name',
            minWidth: '250px',
            selector: 'title'
        },
        {
            name: 'Effective Date',
            minWidth: '250px',
            selector: row => formatReadableDate(row.effective_date)
        },
        {
            name: 'Expire at',
            minWidth: '250px',
            selector: row => formatReadableDate(row.expire_date)
        },
        {
            name: 'Status',
            minWidth: '100px',
            selector: row => {
                return row.status ? <Badge tag='div' color='light-success' pill>
                    Active
                </Badge> : <Badge tag='div' color='light-danger' pill>
                    Inactive
                </Badge>
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            selector: 'created_by'
        },
        {
            name: 'Created Date',
            minWidth: '200px',
            selector: row => formatReadableDate(row.created_at)
        }
    ]
    const TableOneActions = [
        {
            name: 'Action',
            selector: row => {
                return (<div className="d-flex cursor-pointer">
                    <Edit size={15} color='dodgerblue'
                        onClick={e => {
                            localStorage.setItem('PollDetails', JSON.stringify(row))
                            history.push(`/EditPoll/${row.id}`)
                        }}
                    />&nbsp;&nbsp;&nbsp;&nbsp;<Trash size={15} color='crimson'
                        onClick={e => handlePoPupActions(row.id, row.effective_date, 'This poll will be Deleted')}
                    />
                </div>)
            },
            minWidth: '100px'
        }
    ]
    const TableTwoActions = [
        {
            name: 'Start Date',
            minWidth: '250px',
            selector: row => formatReadableDate(row.start_date)
        },
        {
            name: 'Action',
            minWidth: '100px',
            selector: 'action'
        }
        // {
        //     name: 'Action',
        //     selector: row => {
        //         return (<div className="d-flex cursor-pointer">
        //             <Edit size={15} color='dodgerblue'
        //                 onClick={e => {
        //                     localStorage.setItem('userInfo', JSON.stringify(row))
        //                     history.push(`/EditUser/${row.username}`)
        //                 }}
        //             />&nbsp;&nbsp;<Trash size={15} color='crimson'
        //                 onClick={e => handleDelete(row.username, 'This user will be Deleted')}
        //             />
        //         </div>)
        //     },
        //     minWidth: '100px'
        // }
    ]
    return (
        <Fragment>
            {/* <div className="text-right">
                <Button.Ripple className='mr-2 mb-2' color='primary' onClick={e => history.push('/CreateUser')}>
                    <PlusCircle size={18} /> Create Poll
                </Button.Ripple>
            </div> */}
            <Card>
                <CardBody>
                    <Nav tabs>
                        <><NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Recent Polls
                            </NavLink>
                        </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2') }}
                                >Poll Logs
                                </NavLink>
                            </NavItem></>
                        {/* <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '3' })}
                                onClick={() => { toggle('3') }}
                            > Approve Users
                            </NavLink>
                        </NavItem> */}
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <>
                        <TabPane tabId="1">
                            <Card>
                                <CardHeader>
                                    <CardTitle></CardTitle>
                                    <div className='d-flex'>
                                    {subMenuIDs.includes(16) && <Button.Ripple className='mr-1' color='primary' tag={Link} to='/CreatePolls' >
                                        <div className='d-flex align-items-center'>
                                            <Plus size={17} style={{ marginRight: '5px' }} />
                                            <span >Create Poll</span>
                                        </div>
                                    </Button.Ripple>}
                                    <ExportTableData DataArray={PollList} keys={['title', 'effective_date', 'expire_date', 'created_at', 'created_by']} InvoiceTitle={'Poll List'} />
                                    </div>
                                </CardHeader>
                                <Row className='justify-content-end mx-0'>
                                    <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                                        <Label className='mr-1' for='search-input'>
                                        Search
                                        </Label>
                                        <Input
                                        className='dataTable-filter mb-50'
                                        type='text'
                                        bsSize='sm'
                                        id='search-input'
                                        value={searchValue}
                                        onChange={handleFilter}
                                        />
                                    </Col>
                                </Row>
                                <CommonDataTable column={[...column, ...TableOneActions]} TableData={searchValue.length ? filteredData : PollList} TableDataLoading={TableDataLoading} />
                            </Card>
                        </TabPane>
                        <TabPane tabId="2">
                            <div className='d-flex justify-content-end m-1'>
                                <ExportTableData DataArray={PollLogList} keys={['title', 'effective_date', 'expire_date', 'created_at', 'created_by']} InvoiceTitle={'Poll Logs'} />
                            </div>
                            <Row className='justify-content-end mx-0'>
                                    <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                                        <Label className='mr-1' for='search-input'>
                                        Search
                                        </Label>
                                        <Input
                                        className='dataTable-filter mb-50'
                                        type='text'
                                        bsSize='sm'
                                        id='search-input'
                                        value={searchValue1}
                                        onChange={handleFilter1}
                                        />
                                    </Col>
                                </Row>
                            <CommonDataTable column={[...column, ...TableTwoActions]} TableData={searchValue1.length ? filteredData1 : PollLogList} TableDataLoading={TableDataLoading} />
                        </TabPane>
                    </>
                </TabContent>
            </Card>
        </Fragment>
    )
}

export default AllUsersTabs