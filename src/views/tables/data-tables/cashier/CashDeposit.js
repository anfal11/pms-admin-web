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
import { formatReadableDate, thousandSeparator } from '../../../helper'

const CashDeposit = () => {
    const history = useHistory()
    const [currentPage, setCurrentPage] = useState(0)
    const [isloading, setisloading] = useState(true)
    const [data, setdata] = useState([])
    const [searchValue, setSearchValue] = useState({
        from: null,
        to: null,
        startdate: null,
        enddate: null
    })
    const [fromToStore, setFTS] = useState({
        from: [],
        to: [],
        storename: ''
    })

    useEffect(() => {
        useJwt.depositFromTo().then(res => {
            // console.log(res.data.payload)
            const Fromdata = res.data.payload.from_data.map(type => { return { value: type, label: type } })
            const Todata = res.data.payload.to_data.map(type => { return { value: type, label: type } })
            const newFTS = {
                from: Fromdata,
                to: Todata,
                storename: res.data.payload.storename
            }
            setFTS(newFTS)
        }).catch(err => {
            console.log(err)
        })
        useJwt.cashDepositLogList(searchValue).then(res => {
            setisloading(false)
            setdata(res.data.payload)
            // console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const onChange = (e) => {
        setSearchValue({ ...searchValue, [e.target.name]: e.target.value })
    }
    const handleFrom = (option, { action }) => {
        if (action === 'clear') {
            setSearchValue({ ...searchValue, from: null })
        } else {
            setSearchValue({ ...searchValue, from: option.value })
        }
    }
    const handleTo = (option, { action }) => {
        if (action === 'clear') {
            setSearchValue({ ...searchValue, to: null })
        } else {
            setSearchValue({ ...searchValue, to: option.value })
        }
    }
    const onsubmit = (e) => {
        e.preventDefault()
        setisloading(true)
        console.log(searchValue)
        useJwt.cashDepositLogList(searchValue).then(res => {
            setisloading(false)
            setdata(res.data.payload)
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const columns = [
        {
            name: 'Time',
            selector: (row) => formatReadableDate(row.created_at),
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'From',
            selector: 'from',
            minWidth: '50px',
            sortable: true
        },
        {
            name: 'To',
            selector: 'to',
            minWidth: '50px',
            sortable: true
        },
        {
            name: 'Deposit Amount',
            selector: (row) => `${window.CURRENCY_SYMBOL} ${thousandSeparator((+row.deposit_amount).toFixed(2))}`,
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'Till Balance',
            selector: (row) => `${window.CURRENCY_SYMBOL} ${thousandSeparator((+row.current_balance).toFixed(2))}`,
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'User',
            selector: 'created_by',
            minWidth: '100px',
            sortable: true
        }/*,
        {
            name: 'Transaction ID',
            selector: 'transection_id',
            minWidth: '100px',
            sortable: true
        }*/
        // {
        //     name: 'Actions',
        //     allowOverflow: true,
        //     cell: (row) => {
        //         return (
        //             <div className='d-flex'>
        //                 <Printer size={15} color='SlateBlue' style={{ cursor: 'pointer' }} onClick={() => alert('404')} />&nbsp;&nbsp;
        //                 <Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={() => alert('404')} />
        //             </div>
        //         )
        //     }
        // }
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
                        {/* <Col md='3'>
                            <Input
                                disabled
                                style={{ width: '100%', marginTop: '22px' }}
                                placeholder="Search a customer or Scan a QR code"
                                type='text'
                                id='search-input'
                                value={searchValue}
                                onChange={onChange}
                            />
                        </Col> */}

                        <Col md='5'>
                            <div className="d-flex">
                                <div style={{ width: '50%' }}>
                                    <Label for="startdate">Start date</Label>
                                    <Input
                                        required
                                        style={{ width: '100%' }}
                                        placeholder="startdate"
                                        type='date'
                                        id='startdate'
                                        name='startdate'
                                        onChange={onChange}
                                    />
                                </div>
                                <div style={{ width: '50%' }}>
                                    <Label for="enddate">End date</Label>
                                    <Input
                                        required
                                        style={{ width: '100%' }}
                                        placeholder="enddate"
                                        type='date'
                                        id='enddate'
                                        name='enddate'
                                        onChange={onChange}
                                    />

                                </div>
                            </div>
                        </Col>

                        <Col md='5'>
                            <div className="d-flex">
                                <div style={{ width: '50%' }}>
                                    <Label for="From">From</Label>
                                    <Select
                                        style={{ width: '100%' }}
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        name="From"
                                        onChange={handleFrom}
                                        options={fromToStore.from}
                                        isClearable
                                        isLoading={false}
                                    />
                                </div>
                                <div style={{ width: '50%' }}>
                                    <Label for="To">To</Label>
                                    <Select
                                        style={{ width: '100%' }}
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        name="To"
                                        onChange={handleTo}
                                        options={fromToStore.to}
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

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Cash Deposit at {fromToStore.storename ? fromToStore.storename : ''}</CardTitle>
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

export default CashDeposit