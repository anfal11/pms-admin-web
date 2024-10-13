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
import PendingPlanList from './PendingPlanList'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import { formatReadableDate } from '../../../../../helper'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const PlanList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const history = useHistory()

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [PlanList, setPlanList] = useState([])
    const [myPendingPlanList, setMyPendingPlanList] = useState([])
    const [pendingPlanList, setPendingPlanList] = useState([])
    const [adInfo, setAdInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const userData = JSON.parse(localStorage.getItem('userData'))
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.planList().then(res => {
            const { payload } = res.data
            console.log('planList', payload)
            setPlanList(payload)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })
        await useJwt.pendingPlan().then(async res => {
            const { payload } = res.data
            console.log('pendingPlan', payload)
            await useJwt.myPendingPlan().then(res => {
                const { payload: payload1 } = res.data
                console.log('myPendingPlan', payload)
                setPendingPlanList([...payload, ...payload1])
                // setMyPendingPlanList(payload)
            }).catch(err => {
                Error(err)
                console.log(err)
                setTableDataLoading(false)
            })
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })

    }, [resetData])
    const handlePoPupActions = (plan_id, action_id, message) => {
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
                    plan_id : parseInt(plan_id)
                }
                return useJwt.deletePlan(data).then(res => {
                    Success(res)
                    // setPlanList(PlanList.filter(x => x.id !== plan_id))
                    console.log(res)
                    setReset(!resetData)
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
            updatedData = PlanList.filter(item => {
                const startsWith =
                    item.title.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.approved_by.toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.created_at).toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.created_by.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.title.toLowerCase().includes(value.toLowerCase()) ||
                    item.approved_by.toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.created_at).toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.created_by.toLowerCase().includes(value.toLowerCase())

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
            name: 'Details',
            minWidth: '250px',
            sortable: true,
            selector: 'details'
        },
        {
            name: 'Approved by',
            minWidth: '170px',
            sortable: true,
            selector: 'approved_by'
        },
        {
            name: 'Created by',
            minWidth: '170px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return row.created_date ? formatReadableDate(row.created_date) : ''
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                        <span title="View">
                            <Eye size={15}
                                color='green'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    localStorage.setItem('planDetails', JSON.stringify(row))
                                    history.push('/planDetails')
                                }}
                            />
                        </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    {
                        (subMenuIDs.includes(32) || userData?.role === 'vendor') && <span title="Edit">
                            <Edit size={15}
                                color='teal'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    localStorage.setItem('planDetails', JSON.stringify(row))
                                    history.push(`/editPlan/${row.id}`)
                                }}
                            />
                        </span>
                    }&nbsp;&nbsp;&nbsp;&nbsp;
                    {(subMenuIDs.includes(32) || userData?.role === 'vendor') && <span title="Delete">
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
        doc.text('All ADs', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [{ header: 'title', dataKey: 'title' }, { header: 'body', dataKey: 'body' }, { header: 'created_by', dataKey: 'created_by' }, { header: 'created_at', dataKey: 'created_at' }],
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
                            <span className='align-middle d-none d-sm-block'>Plans</span>
                        </NavLink>
                    </NavItem>
                    {(subMenuIDs.includes(34) || userData?.role === 'vendor') && <NavItem>
                        <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                            <span className='align-middle d-none d-sm-block'>Approve Plans</span>
                        </NavLink>
                    </NavItem>}
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId='1'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>All Plans</CardTitle>
                                <div>
                                    {(subMenuIDs.includes(31) || userData?.role === 'vendor') && <Button.Ripple className='ml-2' color='primary' tag={Link} to={'/createPlan'} >
                                        <div className='d-flex align-items-center'>
                                            <Plus size={17} style={{ marginRight: '5px' }} />
                                            <span >Create Plan</span>
                                        </div>
                                    </Button.Ripple>}
                                    <UncontrolledButtonDropdown className='ml-1'>
                                        <DropdownToggle color='secondary' caret outline>
                                            <Share size={15} />
                                            <span className='align-middle ml-50'>Export</span>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem className='w-100' onClick={() => downloadCSV(PlanList)}>
                                                <FileText size={15} />
                                                <span className='align-middle ml-50'>CSV</span>
                                            </DropdownItem>
                                            <DropdownItem className='w-100' onClick={() => exportToXL(PlanList)}>
                                                <Grid size={15} />
                                                <span className='align-middle ml-50'>Excel</span>
                                            </DropdownItem>
                                            <DropdownItem className='w-100' onClick={() => exportPDF(PlanList)}>
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
                            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : PlanList} TableDataLoading={TableDataLoading} />
                        </Card>
                    </TabPane>
                    <TabPane tabId='3'>
                        <PendingPlanList pendingPlanList={pendingPlanList} setPendingPlanList={setPendingPlanList} setReset={setReset} />
                    </TabPane>
                </TabContent>
            </CardBody>
        </Card>
    )
}

export default PlanList