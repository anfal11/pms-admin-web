// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, Eye
} from 'react-feather'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner,
    CardBody, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { formatReadableDate, thousandSeparator } from '../../../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error } from '../../../viewhelper'
const MySwal = withReactContent(Swal)
import './cashierStyles/payment.css'

const Payment = () => {
    const history = useHistory()
    const [searchValue, setSearchValue] = useState('')
    const [SearchBy, setSearchBy] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)
    const [isloading, setisloading] = useState(true)
    const [data, setdata] = useState([])
    const [Serveddata, setServeddata] = useState({})
    const [mobileErr, setMobileErr] = useState(false)
    const [maxLength, setMaxLength] = useState(10)

    useEffect(() => {
        useJwt.customerCheckedInvoicesSummaryList({ page: 1, limit: 10000 }).then(res => {
            console.log(res.data.payload)
            setdata(res.data.payload)
            setisloading(false)
        }).catch(err => {
            console.log(err)
        })

        useJwt.cashierServedSummeryInfo().then(res => {
            // console.log(res.data.payload)
            setServeddata(res.data.payload || {})
        }).catch(err => {
            console.log(err)
        })

    }, [])

    const handleSearchBy = (option, { action }) => {
        setSearchValue('')
        setMobileErr(false)
        if (action === 'clear') {
            setSearchBy(0)
        } else {
            setSearchBy(option.value)
        }
    }
    const onsubmit = (e) => {
        e.preventDefault()

        if (!SearchBy || !searchValue.length) {
            return 0
        }

        if (SearchBy === 2 && searchValue.length !== maxLength) {
            setMobileErr(true)
            console.log(searchValue.length, SearchBy)
            return 0
        }
        setMobileErr(false)
        setisloading(true)
        const data = { input: searchValue, input_type_id: SearchBy, page: 1, limit: 10000 }
        useJwt.customerCheckedInvoicesSummaryList(data).then(res => {

            console.log(res.data.payload)
            setdata(res.data.payload)
            setisloading(false)

        }).catch(err => {
            setisloading(false)
            setdata([])
            console.log(err)
            Error(err)
        })
    }
    const onChange = (e) => {
        if (searchValue.substr(0, 1) === "0") {
            setMaxLength(11)
        } else {
            setMaxLength(10)
        }

        setSearchValue(e.target.value)

        if (e.target.value.length === maxLength) {
            setMobileErr(false)
        }
        console.log(searchValue.substr(0, 1) === "0", searchValue.substr(0, 1))
    }

    const columns = [
        {
            name: 'Time',
            selector: (row) => formatReadableDate(row.createdat),
            minWidth: '200px'
        },
        {
            name: 'Customer ID',
            selector: 'customer_id',
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Customer',
            selector: 'customername',
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Tendered Amount',
            selector: (row, index) => {
                const arr = row.invoices.map((x) => x.subtotal_amount)
                return `${window.CURRENCY_SYMBOL} ${thousandSeparator((+Number(arr.reduce((total, num) => total + num))).toFixed(2))}`
            },
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Due Amount',
            selector: (row, index) => {
                const arr = row.invoices.map((x) => x.subtotal_amount)
                return `${window.CURRENCY_SYMBOL} ${thousandSeparator((+Number(arr.reduce((total, num) => total + num))).toFixed(2))}`
            },
            // selector: 'Due',
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Actions',
            allowOverflow: true,
            cell: (row) => {
                return (
                    <div className='d-flex'>
                        {/* <Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => console.log(e)} /> */}
                        <Button.Ripple className='ml-0' color='primary' onClick={() => history.push(`/Payment/${row.receipt_id}`)}>
                            <span className='align-middle ml-50'>Payment</span>
                        </Button.Ripple>
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
            pageCount={1}
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
        <Fragment>
           
            <Card>
                <CardHeader className='border-bottom d-flex flex-wrap justify-content-between'>
                    <CardTitle tag='h4'>You have served</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <div className="d-flex flex-wrap">
                        <div className="payment-card m-2 pt-1">
                            <p>{thousandSeparator(Serveddata['number_of_customer'] ? Serveddata.number_of_customer : 0)}</p>
                            <p>Cutomers</p>
                        </div>
                        <div className="payment-card m-2 pt-1">
                            <p>{thousandSeparator(Serveddata['number_of_customer'] ? Serveddata.number_of_invoice : 0)}</p>
                            <p>Invoices</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

             <Card>
                <Form className="py-2 px-1 " style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                    <Row>
                        <Col md='6'>
                            {mobileErr && <Label className='text-danger'>Mobile number must be {maxLength} digit</Label>}
                            <Input
                                required
                                style={mobileErr ? { width: '100%' } : { width: '100%', marginTop: '22px' }}
                                placeholder="Search a Customer "
                                type={SearchBy === 3 ? 'text' : 'number'}
                                id='search-input'
                                value={searchValue}
                                onChange={onChange}
                            />
                        </Col>
                        <Col md='3'>
                            <Label for="Searchby">Search by </Label>
                            <Select
                                style={{ width: '100%' }}
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                name="Searchby"
                                onChange={handleSearchBy}
                                defaultValue={{ value: 1, label: 'Customer ID' }}
                                options={[
                                    { value: 1, label: 'Customer ID' },
                                    { value: 2, label: 'Mobile Number' },
                                    { value: 3, label: 'Business Name' }
                                ]}
                                isClearable={false}
                                isLoading={false}
                            />
                        </Col>
                        <Col md='3'>
                            {isloading ? <Button.Ripple className='ml-1' color='primary' disabled={true} style={{ marginTop: '22px' }}>
                                <Spinner color='white' size='sm' />
                                <small className='ml-50'>Loading...</small>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '22px' }}>
                                <Search size={15} />
                                <span className='align-middle ml-50'>Search</span>
                            </Button.Ripple>
                            }

                        </Col>
                    </Row>

                </Form>
            </Card>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Incomplete Payments</CardTitle>
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
        </Fragment>
    )
}

export default Payment