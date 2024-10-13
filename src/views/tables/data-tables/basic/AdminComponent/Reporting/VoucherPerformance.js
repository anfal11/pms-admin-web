import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
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
import data from './data2.json'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const businessListd  = [
    {
        id : 1677495583531,
        name : 'Showpno Uttara'
    },
    {
        id : 1677495583539,
        name : 'Showpno'
    },
    {
        id : 1677495583532,
        name : 'Test bussiness'
    }
]

const VoucherReport = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [VoucherReport, setVoucherReport] = useState(data)
    const [TableDataLoading, setTableDataLoading] = useState(false)
    const [vr, setvr] = useState({
        total: 0,
        discount: 0,
        cash: 0,
        product: 0
    })

    const [businessList, setBusinessList] = useState([])
    const [businessid, setBusinessid] = useState('')
    const [selectedBusiness, setselectedBusiness] = useState({})

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
      
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        // getData(page.selected + 1, 50, startDate, endDate)
        // setCurrentPage(page.selected)
    }

    // const [vr, setvr] = useState({
    //     total: 0,
    //     discount: 0,
    //     cash: 0,
    //     product: 0
    // })
    useEffect(() => {

        const b = businessListd.map(x => { return {value: x.id, label: x.name} })
        setBusinessList(b)
        setBusinessid(b[0].id)
        setselectedBusiness(b[0])
        const dd = []
        let  d = 0, c = 0, p = 0
        data.map(item => {
             if (item.merchantid === businessListd[0].id) {
                dd.push(item)

                if (item.vouchertype === 'cash') { c++ }
                if (item.vouchertype === 'discount') { d++ }
                if (item.vouchertype === 'product') { p++ }
             }
        })
        setVoucherReport(dd)
        setvr({total: (d + c + p), discount: d, product: p, cash: c})
    }, [])


    const column = [
        {
            name: 'Voucher ID',
            minWidth: '120px',
            selector: 'voucherid'
        },
   
        {
            name: 'Voucher Type',
            minWidth: '120px',
            selector: 'vouchertype'
        },
        {
            name: 'Reward-Point',
            minWidth: '120px',
            selector: 'rewardpoint'
        },
        {
            name: 'Click',
            minWidth: '100px',
            sortable: true,
            selector: 'click'
        },
        {
            name: 'Quota',
            minWidth: '100px',
            sortable: true,
            selector: (item) => (item.quota + item.reedem_count)
        },
        {
            name: 'Reedem count',
            minWidth: '100px',
            sortable: true,
            selector: 'reedem_count'
        },
        {
            name: 'Use count',
            minWidth: '100px',
            sortable: true,
            selector: 'use_count'
        },
        {
            name: 'Customer reedem point',
            minWidth: '250px',
            sortable: true,
            selector: (item) => (item.rewardpoint * item.reedem_count)
        },
        {
            name: 'Rating',
            minWidth: '250px',
            sortable: true,
            selector: (item) => `${((item.reedem_count / item.click) * 100).toFixed(2)} %`
        }
        
    ]

    const handleBusinessChange = (selected) => {
        setBusinessid(selected.value)
        setselectedBusiness(selected)
        const dd = []
        let  d = 0, c = 0, p = 0
        data.map(item => {
             if (item.merchantid === selected.value) {
                dd.push(item)

                if (item.vouchertype === 'cash') { c++ }
                if (item.vouchertype === 'discount') { d++ }
                if (item.vouchertype === 'product') { p++ }
             }

        })
        setVoucherReport(dd)
        setvr({total: (d + c + p), discount: d, product: p, cash: c})
    }
    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        
        getData(1, 50, startDate, endDate)
      
    }

    return (
        <>
            <Card>
                <Row>
                    <Col md="2"></Col>
                 <Col md="3" >
                        <FormGroup>
                            <Label for="Business">Select a Business <span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                onChange={handleBusinessChange}
                                value={selectedBusiness}
                                options={businessList}
                                
                            />
                        </FormGroup>
                    </Col>
                </Row>

            </Card>

            <Card>
                <CardBody>

                <Row>
                    <Col md="3">
                    <div className='d-flex align-items-center justify-content-between border-bottom pb-2'>
                    <div className='d-flex align-items-center'>
                        <h4 style={{margin:'0 0 0 20px', color:'#6E6B7B', fontWeight:'normal'}}>Total Voucher</h4>
                    </div>
                    <h4 style={{margin:'0', color:'#5E5873', fontWeight:'bold'}}>{vr.total}</h4>
                </div>
                    </Col>

                    <Col md="3">
                    <div className='d-flex align-items-center justify-content-between border-bottom pb-2'>
                    <div className='d-flex align-items-center'>
                        <h4 style={{margin:'0 0 0 20px', color:'#6E6B7B', fontWeight:'normal'}}>Total Cash Voucher</h4>
                    </div>
                    <h4 style={{margin:'0', color:'#5E5873', fontWeight:'bold'}}>{vr.cash}</h4>
                </div>
                    </Col>

                    <Col md="3">
                    <div className='d-flex align-items-center justify-content-between border-bottom pb-2'>
                    <div className='d-flex align-items-center'>
                        <h4 style={{margin:'0 0 0 20px', color:'#6E6B7B', fontWeight:'normal'}}>Total Discount Voucher</h4>
                    </div>
                    <h4 style={{margin:'0', color:'#5E5873', fontWeight:'bold'}}>{vr.discount}</h4>
                </div>
                    </Col>

                    <Col md="3">
                    <div className='d-flex align-items-center justify-content-between border-bottom pb-2'>
                    <div className='d-flex align-items-center'>
                        <h4 style={{margin:'0 0 0 20px', color:'#6E6B7B', fontWeight:'normal'}}>Total Product Voucher</h4>
                    </div>
                    <h4 style={{margin:'0', color:'#5E5873', fontWeight:'bold'}}>{vr.product}</h4>
                </div>
                    </Col>
                </Row>
                </CardBody>

            </Card>

            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
     
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
        </>
    )
}

export default VoucherReport