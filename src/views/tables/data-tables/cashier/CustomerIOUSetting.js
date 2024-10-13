// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
    ChevronDown, Share, Printer, ChevronLeft, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, Eye, Settings, RefreshCw, Check, X 
} from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
    CardBody, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { Skeleton } from 'antd'
import 'antd/dist/antd.css'
import useJwt from '@src/auth/jwt/useJwt'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { formatReadableDate } from '../../../helper'
import { Error, Success } from '../../../viewhelper'

const CustomerIOUSetting = () => {
    const { customerID } = useParams()
    const history = useHistory()
    // const SettingData2 = JSON.parse(sessionStorage.getItem('CIOUSettingData'))[0]
    const [SettingData, setSettingData] = useState({
        iou_limit : 0,
        iou_used : 0
    })
    const [searchValue, setSearchValue] = useState('')
    const [newCustomerID, setnewCustomerID] = useState(customerID)
    const [currentPage, setCurrentPage] = useState(0)
    const [isloading, setisloading] = useState(true)
    const [data, setdata] = useState([])
    const [change, setChange] = useState(0)
    const [inputDates, setInputDates] = useState({})
    const [changeLoader, setChangeLoader] = useState(false)
    const [callEffect, setCallEffect] = useState(false)
    const [iouerror, setiouerror] = useState('')
    const [isdircetdebitset, setisdircetdebitset] = useState(false)
    const [firsttime, setfirsttime] = useState(true)


    const getDataByCustomerID = (id) => {
        setisloading(true)
        useJwt.customerIOUsettingInfo({ customerid: id }).then(res => {
            console.log(res.data.payload)
            if (res.data.payload.businessinfo) {
                setSettingData(res.data.payload.businessinfo)
            } else {
                setSettingData({})
            }
            setnewCustomerID(searchValue ? searchValue : customerID)
            setisloading(false)
            setfirsttime(false)
            setisdircetdebitset(res.data.payload.directdebitset)
            setdata(res.data.payload.ioulogs)
        }).catch(err => {
            console.log(err)
            Error(err)
            setisdircetdebitset(false)
            setSettingData({})
            setdata([])
            setnewCustomerID(id)
            setfirsttime(false)
            setisloading(false)
        })
    }
    useEffect(() => {
        getDataByCustomerID(customerID)
    }, [callEffect])

    const Remaining = +(SettingData.iou_limit ? SettingData.iou_limit  - SettingData.iou_used : SettingData.iou_used ? SettingData.iou_used : 0)

    const onChange = (e) => {
        setSearchValue(e.target.value)
    }
    const onsubmit = (e) => {
        e.preventDefault()
        if (searchValue !== '') {
            getDataByCustomerID(searchValue)
        }
    }
    const handleChange = (e) => {
        setChange(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setiouerror('')
         console.log({ change, typeid: 1, busnessid: SettingData['id'] })
         if (typeof SettingData.id === 'undefined' || change === 'e') {
            return 0
         }
         if (parseFloat(change) === 0 || parseFloat(change) <= parseFloat(SettingData.iou_used)) {
            setiouerror('IOU Allowance amount can not less than Used amount.')
            return 0
         }

         setChangeLoader(true)
        if (change !== 0 && change !== '') {
            const amount = parseFloat(change)
            useJwt.customerIOUmanage({ change:amount, typeid: 1, busnessid: SettingData.id }).then(res => {
                console.log(res)
                setCallEffect(!callEffect)
                // Success(res)
                setChange('')
                setChangeLoader(false)
            }).catch(err => {
                console.log(err)
                Error(err)
                setChangeLoader(false)
            })
        } else { setChangeLoader(false) }
    }
    const handleDateChange = (e) => {
        setInputDates({ ...inputDates, [e.target.name]: e.target.value })
    }
    const handleDateSubmit = (e) => {
        e.preventDefault()
        // console.log(inputDates)
        const { startdate, enddate } = inputDates
        setisloading(true)
        useJwt.customerIOUsettingInfo({ customerid: customerID, startdate, enddate }).then(res => {
            // console.log(res.data.payload)
            setisloading(false)
            setdata(res.data.payload.ioulogs)
        }).catch(err => {
            console.log(err)
            Error(err)
            setisloading(false)
        })
    }
    // data table column
    const columns = [
        {
            name: 'Time',
            selector: (row) => formatReadableDate(row.created_at),
            minWidth: '200px'
            // sortable: true
        },
        {
            name: 'Store',
            selector: (row) => row.storeinfo['storename'] || "",
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'User',
            selector: 'created_by',
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Type',
            selector: 'type',
            minWidth: '130px',
            sortable: true
        },
        {
            name: `Change(${window.CURRENCY_SYMBOL})`,
            selector: (row) => `${row.change_sign}${row.change.toFixed(2)}`,
            minWidth: '100px',
            sortable: true
        },
        {
            name: `Balance(${window.CURRENCY_SYMBOL})`,
            selector: (row) =>  row.balance.toFixed(2),
            // selector: 'Due',
            minWidth: '100px',
            sortable: true
        }
    ]
    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
    }
    // ** Custom Pagination
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel=''
            nextLabel=''
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={data.length ? data.length / 3 : 1}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            nextLinkClassName='page-link'
            nextClassName='page-item next'
            previousClassName='page-item prev'
            previousLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        />
    )

    return (
        <>
            <Button.Ripple className='mb-2 ml-2' color='primary' onClick={() => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back to list</span>
            </Button.Ripple>
            <Card>
                <Form className="d-flex my-2 mx-1 justify-content-center" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                    <Input
                        style={{ width: '50%' }}
                        placeholder="Search a Customer by ID"
                        type='number'
                        id='search-input'
                        value={searchValue}
                        onChange={onChange}
                    />
                    <Button.Ripple className='ml-2' color='primary' type="submit" >
                        <Search size={15} />
                        <span className='align-middle ml-50'>Search</span>
                    </Button.Ripple>
                </Form>
            </Card>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Customer IOU Setting</CardTitle>
                </CardHeader>
                <Row>
                    <Col md='5'>
                        <Form className="d-flex mb-2 mx-1 justify-content-center" style={{ width: '100%' }} onSubmit={handleSubmit} autoComplete="off">
                       
                        <FormGroup style={{ width: '70%' }}>
                        <Label style={{color:'red'}}>{iouerror}</Label>
                            <Input
                                
                                placeholder="Enter allowance amount"
                                type='number'
                                id='saveIOU'
                                
                                onChange={handleChange}
                            />
                        </FormGroup>
                            {changeLoader ? <Button.Ripple className='ml-md-2' color='primary' style={{height:'40px', marginTop:iouerror === '' ? '20px' : '40px'}}  disabled>
                                <Spinner size='sm' />
                                
                            </Button.Ripple> : <Button.Ripple className='ml-md-2' style={{height:'40px', marginTop:iouerror === '' ? '20px' : '40px'}} color='primary' type="submit">
                                <span className='align-middle ml-50'>Save</span>
                            </Button.Ripple>}

                           
                        </Form>
                        <div className='ml-1 p-2 mt-2 mb-2' style={{ border: '1px solid lightgray', borderRadius: '5px', margin: 'auto', fontWeight: 'bold' }}>
                            <p>Customer ID : {newCustomerID}</p>
                            <p>Business Name : {SettingData.businessname ? SettingData.businessname : ''}</p>
                            <p>Customer Name : {SettingData.customerinfo ? `${SettingData.customerinfo.firstname} ${SettingData.customerinfo.lastname}` : ''}</p>
                            <p>Allowance : {window.CURRENCY_SYMBOL}{(SettingData.iou_limit ? SettingData.iou_limit : 0).toFixed(2)}</p>
                            <p>Used : {window.CURRENCY_SYMBOL}{(SettingData.iou_used ? SettingData.iou_used : 0).toFixed(2)}</p>
                            <p>Remaining : {window.CURRENCY_SYMBOL}{Remaining.toFixed(2)}</p>
                            <p>Direct Debit Setup : {!firsttime ? isdircetdebitset ? <Check color="#4BB543"/> : <X color="red"/> : null}</p>
                        </div>
                    </Col>
                    <Col md='7'>
                        <Form className="d-flex justify-content-between p-2" style={{ width: '100%' }} onSubmit={handleDateSubmit} autoComplete="off">
                            <Row style={{ width: '100%' }}>
                                <Col sm='5'>
                                    <span>From</span>
                                    <Input
                                        type='date'
                                        id='from'
                                        name='startdate'
                                        required
                                        // value={searchValue}
                                        onChange={handleDateChange}
                                    />
                                </Col>
                                <Col sm='5'>
                                    <span>To</span>
                                    <Input
                                        type='date'
                                        id='to'
                                        name='enddate'
                                        required
                                        // value={searchValue}
                                        onChange={handleDateChange}
                                    />
                                </Col>
                                <Col sm='2'>
                                    <Button.Ripple color='primary' type="submit" style={{ marginTop: '19px' }}>
                                        <span className='align-middle ml-50'>Submit</span>
                                    </Button.Ripple>
                                </Col>
                            </Row>
                        </Form>
                        <div className='mr-2' style={{ border: '1px solid lightgray', borderRadius: '5px' }}>
                            <DataTable
                                noHeader
                                pagination
                                columns={columns}
                                paginationPerPage={3}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                paginationDefaultPage={currentPage + 1}
                                paginationComponent={CustomPagination}
                                data={data}
                                progressPending={isloading}
                                progressComponent={<Spinner color='primary' />}
                                responsive={true}
                            />
                        </div>
                        {/*<Button.Ripple className='m-2 float-right' color='primary' disabled>
                            <RefreshCw size={15} />
                            <span className='align-middle ml-50'>Pay off</span>
                        </Button.Ripple>*/}
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default CustomerIOUSetting