import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
     CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import ServerSideDataTable from '../../ServerSideDataTable'
import { Success, Error } from '../../../../../viewhelper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
const MySwal = withReactContent(Swal)
import { handle401 } from '@src/views/helper'
import data from './data.json'
import VoucherPurchaseReport from './VoucherPurchaseReport'

const VoucherReport = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [voucherID, setvoucherID] = useState(null)
    const [gotoPurchaseReport, setgotoPurchaseReport] = useState(false)
    const [loadingPurchaseReport, setloadingPurchaseReport] = useState(false)
    //const [VoucherReport, setVoucherReport] = useState(data)
    const [VoucherReport, setVoucherReport] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    function addDays(numDays) {
        const nowDate = new Date()
        nowDate.setDate(nowDate.getDate() + numDays)
        const dd = String(nowDate.getDate()).padStart(2, '0')
        const mm = String(nowDate.getMonth() + 1).padStart(2, '0')
        const y = nowDate.getFullYear()
        return `${y}-${mm}-${dd}`
    }
    function minDays(numDays) {
        const nowDate = new Date()
        nowDate.setDate(nowDate.getDate() - numDays)
        const dd = String(nowDate.getDate()).padStart(2, '0')
        const mm = String(nowDate.getMonth() + 1).padStart(2, '0')
        const y = nowDate.getFullYear()
        return `${y}-${mm}-${dd}`
    }
    const [userInput, setUserInput] = useState({
        startDate: minDays(1),
        endDate: addDays(0)
    })
    const { startDate, endDate } = userInput

    const getData = (page, limit, startDate, endDate) => {
        useJwt2.pmsVoucherReportList().then(res => {
            setVoucherReport(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            setTableDataLoading(false)
            console.log(err.response)
        })
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        // getData(page.selected + 1, 50, startDate, endDate)
        // setCurrentPage(page.selected)
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, 50, startDate, endDate)
    }, [])

    const viewDetails = (e, row) => {

        setvoucherID(row.voucherid)
        setgotoPurchaseReport(true)

    }

    const column = [
        {
            name: 'Title',
            minWidth: '200px',
            selector: 'title',
            wrap: true
        },
        {
            name: 'Voucher ID',
            minWidth: '120px',
            selector: 'voucherid',
            wrap: true
        },
        {
            name: 'Start Date',
            minWidth: '100px',
            selector: 'startdate'
        },
        {
            name: 'Expiry Date',
            minWidth: '100px',
            selector: 'expirydate'
        },
        {
            name: 'Reedem Count',
            minWidth: '100px',
            selector: 'reedem_count'
        },
        {
            name: 'Quota Left',
            minWidth: '100px',
            selector: 'quota'
        },
        {
            name: 'Action',
            minWidth: '200px',
            selector: row => {
                return <Fragment>
                    <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => viewDetails(e, row) }
                        />
                    </span> 
                </Fragment>
            }
        }
    ]

    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        
        getData(1, 50, startDate, endDate)
      
    }
    return (

            gotoPurchaseReport ? <VoucherPurchaseReport voucherid={voucherID} setgotoPurchaseReport={setgotoPurchaseReport} /> : <Fragment>
              {/* <Card>
                <Form className="row p-1" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col md="3" >
                        <FormGroup>
                            <Label for="startDate">Start Date</Label>
                            <Input
                                type="date"
                                name="startDate"
                                id='startDate'
                                value={userInput.startDate}
                                onChange={onChange}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md="3" >
                        <FormGroup>
                            <Label for="endDate">Expiry Date</Label>
                            <Input
                                type="date"
                                name="endDate"
                                id='endDate'
                                value={userInput.endDate}
                                onChange={onChange}
                                required
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
            </Card> */}
            <Card>
                <CardHeader>
                    <CardTitle>Voucher-Report</CardTitle>
                    {/* <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
  
                    ExportCSV(VoucherReport, Object.keys(VoucherReport[0]), 'Voucher Report')
                        }}>
                            Export CSV
                        </Button.Ripple> */}
                </CardHeader>
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={[...column]}
                    TableData={VoucherReport}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>
            </Fragment>
       
    )
}

export default VoucherReport