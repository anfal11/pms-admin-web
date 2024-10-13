import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import PendingQuotaList from './PendingQuotaList'
import MyPendingQuotaList from './MyPendingQuotaList'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const QuotaList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [quotaList, setQuotaList] = useState([])
    const [myPendingQuotaList, setMyPendingQuotaList] = useState([])
    const [pendingQuotaList, setPendingQuotaList] = useState([])

    const user = JSON.parse(localStorage.getItem('userData'))
    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt.getQuotaList().then(res => {
            console.log(res)
            const allQuotas = []
            const allPendingQuotas = []
            const myPendingQuotas = []
            for (const q of res.data.payload) {
                if (q.is_approved === true || q.is_rejected === true) {
                    allQuotas.push(q)
                } else if (q.is_approved === false && q.is_rejected === false && parseInt(q.created_by) === parseInt(user.id)) {
                    myPendingQuotas.push(q)
                } else if (q.is_approved === false && q.is_rejected === false && parseInt(q.created_by) !== parseInt(user.id)) {
                    allPendingQuotas.push(q)
                }
            }
            setQuotaList(allQuotas)
            setMyPendingQuotaList(myPendingQuotas)
            setPendingQuotaList(allPendingQuotas)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })
    }, [resetData])
    const handlePoPupActions = (id, status, message) => {

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
                const data = {
                    quota_id: id,
                    action_id: status,
                    reject_msg: ""
                }
                return useJwt.quotaApproveRejectDelete(data).then(res => {
                    Success(res)
                    setQuotaList(quotaList.filter(x => x.id !== id))
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
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = quotaList.filter(item => {
                const startsWith =
                    item.title?.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.created_by_name.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.approved_by.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.title?.toLowerCase().includes(value.toLowerCase()) ||
                    item.created_by_name.toLowerCase().includes(value.toLowerCase()) ||
                    item.approved_by.toLowerCase().includes(value.toLowerCase())

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
    const column = [
        {
            name: 'SL',
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Title',
            minWidth: '100px',
            sortable: true,
            selector: 'title'
        },
        {
            name: 'Total Budget',
            minWidth: '100px',
            sortable: true,
            selector: 'total_budget'
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by_name'
        },
        {
            name: 'Status',
            minWidth: '130px',
            sortable: true,
            selector: row => {
                return row.is_approved ? <Badge pill color='success' className='badge-center'>
                    Approved
                </Badge> : <Badge pill color='danger' className='badge-center'>
                    Rejected
                </Badge>
            }
        },
        {
            name: 'Checked by',
            minWidth: '170px',
            sortable: true,
            selector: 'approved_by'
        },
        {
            name: 'Facebook',
            minWidth: '100px',
            sortable: true,
            selector: 'facebook'
        },
        {
            name: 'Google',
            minWidth: '100px',
            sortable: true,
            selector: 'google'
        },
        {
            name: 'Whatsapp',
            minWidth: '100px',
            sortable: true,
            selector: 'whatsapp'
        },
        {
            name: 'SMS',
            minWidth: '100px',
            sortable: true,
            selector: 'sms'
        },
        {
            name: 'Email',
            minWidth: '100px',
            sortable: true,
            selector: 'email'
        },
        {
            name: 'Push Notification',
            minWidth: '100px',
            sortable: true,
            selector: 'push_notification'
        },
        {
            name: 'Instagram',
            minWidth: '100px',
            sortable: true,
            selector: 'instagram'
        },
        {
            name: 'Action',
            minWidth: '100px',
            // sortable: true,
            selector: row => {
                return <>
                    {subMenuIDs.includes(32) && <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?')}
                        />
                    </span>}
                </>
            }
        }
    ]
    const [activeTab, setActiveTab] = useState('1')

    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)

    // ** Converts table to CSV
    function convertArrayOfObjectsToCSV(array) {
        let result

        const columnDelimiter = ','
        const lineDelimiter = '\n'
        const keys = [...Object.keys(array[0])]
        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
            let ctr = 0
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter

                result += item[key]

                ctr++
            })
            result += lineDelimiter
        })

        return result
    }
    // ** Downloads CSV
    function downloadCSV(array) {
        const link = document.createElement('a')
        let csv = convertArrayOfObjectsToCSV(array)
        if (csv === null) return

        const filename = 'export.csv'

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`
        }

        link.setAttribute('href', encodeURI(csv))
        link.setAttribute('download', filename)
        link.click()
    }
    // ** Export XL file
    const exportToXL = (arr) => {
        const ws = XLSX.utils.json_to_sheet(arr)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('All Quotas', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Title', dataKey: 'title' }, { header: 'Total Budget', dataKey: 'total_budget' }, { header: 'Created By', dataKey: 'created_by_name' }, { header: 'Status', dataKey: 'is_approved' }, { header: 'Facebook', dataKey: 'facebook' }, { header: 'Google', dataKey: 'google' }, { header: 'SMS', dataKey: 'sms' },
                { header: 'Whatsapp', dataKey: 'whatsapp' }, { header: 'Email', dataKey: 'email' }, { header: 'Instagram', dataKey: 'instagram' }, { header: 'Push Notification', dataKey: 'push_notification' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <CardBody className='pt-2'>
                <Nav pills>
                    <NavItem>
                        <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                            <span className='align-middle d-none d-sm-block'>Budgets</span>
                        </NavLink>
                    </NavItem>
                    {(subMenuIDs.includes(33) || user.role === 'vendor') && <NavItem>
                        <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                            <span className='align-middle d-none d-sm-block'>My Budget Request</span>
                        </NavLink>
                    </NavItem>}
                    {(subMenuIDs.includes(34) || user.role === 'vendor') && <NavItem>
                        <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                            <span className='align-middle d-none d-sm-block'>Approve Budgets</span>
                        </NavLink>
                    </NavItem>}
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId='1'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Budgets</CardTitle>
                                <div>
                                    {(subMenuIDs.includes(31) || user.role === 'vendor') && <Button.Ripple className='ml-2' color='primary' tag={Link} to={user.role === 'vendor' ? '/createQuotaVendor' : '/createQuota'} >
                                        <div className='d-flex align-items-center'>
                                            <Plus size={17} style={{ marginRight: '5px' }} />
                                            <span >Budget Management</span>
                                        </div>
                                    </Button.Ripple>}
                                    <UncontrolledButtonDropdown className='ml-1'>
                                        <DropdownToggle color='secondary' caret outline>
                                            <Share size={15} />
                                            <span className='align-middle ml-50'>Export</span>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem className='w-100' onClick={() => downloadCSV(quotaList)}>
                                                <FileText size={15} />
                                                <span className='align-middle ml-50'>CSV</span>
                                            </DropdownItem>
                                            <DropdownItem className='w-100' onClick={() => exportToXL(quotaList)}>
                                                <Grid size={15} />
                                                <span className='align-middle ml-50'>Excel</span>
                                            </DropdownItem>
                                            <DropdownItem className='w-100' onClick={() => exportPDF(quotaList)}>
                                                <File size={15} />
                                                <span className='align-middle ml-50'>
                                                    PDF
                                                </span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
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
                            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : quotaList} TableDataLoading={TableDataLoading} />
                        </Card>
                    </TabPane>
                    <TabPane tabId='2'>
                        <MyPendingQuotaList myPendingQuotaList={myPendingQuotaList} />
                    </TabPane>
                    <TabPane tabId='3'>
                        <PendingQuotaList pendingQuotaList={pendingQuotaList} setPendingQuotaList={setPendingQuotaList} resetData={resetData} setReset={setReset} />
                    </TabPane>
                </TabContent>
            </CardBody>
        </Card>
    )
}

export default QuotaList