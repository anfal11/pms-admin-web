// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, Eye, Settings
} from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
    CardBody, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import Select from 'react-select'
import { formatReadableDate } from '../../../helper'


const InvoiceList = () => {
    const history = useHistory()
    const [currentPage, setCurrentPage] = useState(0)
    const [isloading, setisloading] = useState(true)
    const [data, setdata] = useState([])
    const [userInput, setUserInput] = useState({
        customer_real_id: null,
        fromDate: new Date().toLocaleDateString('fr-CA'),
        toDate: new Date().toLocaleDateString('fr-CA'),
        status_id: null,
        type_id: null
    })

    useEffect(() => {
        useJwt.invoiceList({
            customer_real_id: null,
            fromDate: new Date().toLocaleDateString('fr-CA'),
            toDate: new Date().toLocaleDateString('fr-CA'),
            status_id: null,
            type_id: null
        }).then(res => {
            setisloading(false)
            setdata(res.data.payload)
            // console.log(res.data.payload)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handleType = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, type_id: null })
        } else {
            setUserInput({ ...userInput, type_id: option.value })
        }
    }
    const handleStatus = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, status_id: null })
        } else {
            setUserInput({ ...userInput, status_id: option.value })
        }
    }

    const onChange = (e) => {
        if (e.target.name === 'customer_real_id') {
            setUserInput({ ...userInput, [e.target.name]: e.target.value === '' ? null : e.target.value })

        } else {
            setUserInput({ ...userInput, [e.target.name]: e.target.value })
        }
    }
    const onsubmit = (e) => {
        e.preventDefault()
        setisloading(true)
        // console.log(userInput)
        const { customer_real_id, fromDate, toDate, status_id, type_id } = userInput
        useJwt.invoiceList({ customer_real_id, fromDate, toDate, status_id, type_id }).then(res => {
            setisloading(false)
            setdata(res.data.payload)
            console.log(res.data.payload)
        }).catch(err => {
            console.log(err)
        })
    }

    const status = {
        9: { title: 'Paid', color: 'light-success' },
        11: { title: 'Unpaid', color: 'light-danger' },
        Invoice: { title: 'Invoice', color: 'light-info' },
        Refund: { title: 'Refund', color: 'light-secondary' }
    }

    const columns = [
        {
            name: 'Date',
            selector: (row, index) => formatReadableDate(row.createdat),
            minWidth: '200px'
            // sortable: true
        },
        {
            name: 'Receipt ID',
            selector: 'receipt_id',
            minWidth: '150px'
            // sortable: true
        },
        {
            name: 'Customer ID',
            selector: (row, index) => row.customer_id,
            minWidth: '150px'
            // sortable: true
        },
        {
            name: 'Customer Name',
            selector: 'customername',
            minWidth: '150px'
            // sortable: true
        },
        {
            name: 'Business Name',
            selector: 'customer_business_name',
            minWidth: '150px'
            // sortable: true
        },
        // {
        //     name: 'Till',
        //     selector: (row, index) => row.iou_limit - row.iou_used,
        //     // selector: 'Due',
        //     minWidth: '100px',
        //     sortable: true
        // },
        {
            name: 'Amount',
            selector: (row) => {
                const subTotals = row.invoices.map(x => x.subtotal_amount)
                return `${window.CURRENCY_SYMBOL} ${(+(subTotals.reduce((total, newAmount) => total + newAmount))).toFixed(2)}`
            },
            minWidth: '100px'
            // sortable: true
        },
        {
            name: 'Type',
            selector: (row) => {
                return (
                    <Badge color={status[row.typename].color} pill className='px-1'>
                        {status[row.typename].title}
                    </Badge>
                )
            },
            minWidth: '100px'
            // sortable: true
        },
        {
            name: 'Status',
            selector: (row) => {
                return (
                    <Badge color={status[row.status].color} pill className='px-1'>
                        {status[row.status].title}
                    </Badge>
                )
            },
            // selector: 'Due',
            minWidth: '100px'
            // sortable: true
        },
        {
            name: 'Actions',
            allowOverflow: true,
            cell: (row) => {
                return (
                    <div className='d-flex'>
                        {/* <Printer size={15} color='SlateBlue' style={{ cursor: 'pointer' }} onClick={() => alert('404')} />&nbsp;&nbsp; */}
                        <Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={() => history.push(`/InvoiceListProducts/${row.receipt_id}`)} />
                    </div>
                )
            }
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
            pageCount={data.length ? data.length / 5 : 1}
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
            <Card className="py-0 px-1 px-md-0 pl-md-1">
                <Form className="my-2" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                    <Row>
                        <Col md='3'>
                            <Input
                                style={{ width: '100%', marginTop: '22px' }}
                                placeholder="Customer ID"
                                type='number'
                                name="customer_real_id"
                                id='customer_real_id'
                                // value={userInput.customer_real_id ? userInput.customer_real_id : null}
                                onChange={onChange}
                            />
                        </Col>

                        <Col md='4'>
                            <div className="d-flex">
                                <div style={{ width: '49%' }}>
                                    {/* <span>From</span> */}
                                    <Label for="From">From</Label>
                                    <Input
                                        required
                                        style={{ width: '100%' }}
                                        placeholder="From"
                                        type='date'
                                        id='From'
                                        name='fromDate'
                                        // value={userInput.fromDate}
                                        onChange={onChange}
                                    />
                                </div>
                                <div style={{ width: '49%', marginLeft:'2%' }}>
                                    {/* <span>To</span> */}
                                    <Label for="To">To</Label>
                                    <Input
                                        required
                                        style={{ width: '100%' }}
                                        placeholder="To"
                                        type='date'
                                        id='To'
                                        name='toDate'
                                        // value={userInput.toDate}
                                        onChange={onChange}
                                    />

                                </div>
                            </div>
                        </Col>

                        <Col md='3'>
                            <div className="d-flex">
                                <div style={{ width: '49%' }}>
                                    <Label for="Status">Status</Label>
                                    <Select
                                        style={{ width: '100%' }}
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        name="Status"
                                        onChange={handleStatus}
                                        options={[{ value: 9, label: 'Paid' }, { value: 11, label: 'Unpaid' }]}
                                        isClearable
                                        isLoading={false}
                                    />
                                </div>
                                <div style={{ width: '49%', marginLeft:'2%' }}>
                                    <Label for="Type">Type</Label>
                                    <Select
                                        style={{ width: '100%' }}
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        name="Type"
                                        onChange={handleType}
                                        options={[{ value: 1, label: 'Invoice' }, { value: 2, label: 'Refund' }]}
                                        isClearable
                                        isLoading={false}
                                    />

                                </div>
                            </div>
                        </Col>
                        <Col md='2'>
                            <Button.Ripple className='ml-lg-2' color='primary' type='submit' style={{ marginTop: '22px' }}>
                                <Search size={15} />
                                <span className='align-middle ml-50'>Search</span>
                            </Button.Ripple>
                        </Col>
                    </Row>
                </Form>
            </Card>
            {/* <Card>
                <Row className='p-2' style={{ alignItems: 'center' }}>
                    <Col sm='2'>
                        <Button.Ripple color='primary' disabled>
                            <Printer size={15} />
                            <span className='align-middle ml-50'>Bulk Print</span>
                        </Button.Ripple>
                    </Col>
                    <Col sm='10'>
                        <span style={{ float: 'right', fontWeight: 'bold', fontSize: ' 20px' }}>Total Amount : $10000,00</span>
                    </Col>
                </Row>
            </Card> */}

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Invoice List</CardTitle>
                </CardHeader>
                <DataTable
                    noHeader
                    pagination
                    columns={columns}
                    paginationPerPage={5}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10} />}
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={CustomPagination}
                    data={data}
                    progressPending={isloading}
                    progressComponent={<Spinner color='primary' />}
                    responsive={true}
                />
                <CardBody style={{ paddingTop: '15px' }}>
                </CardBody>
            </Card>
        </>
    )
}

export default InvoiceList