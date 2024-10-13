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
import { Error, Success, ErrorMessage } from '../../../viewhelper'

const SafeDeposit = () => {
    const history = useHistory()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [isloading, setisloading] = useState(true)
    const [submitLoader, setsubmitLoader] = useState(false)
    const [data, setdata] = useState([])
    const [till, setTill] = useState(0)
    const ip = localStorage.getItem('ip')
    const [callEffect, setCallEffect] = useState(false)  

    const removedeleteitem = (id) => {
        const updatedData = data.filter(item => {
          if (item.id === id) {
            return false
          } else {
            return true
          }
        })
    
        setdata(updatedData)
      }

    const handleConfirmText = (id) => {
        return MySwal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonText: 'Yes, delete it!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1'
          },
          buttonsStyling: false,
          preConfirm: () => {
            return useJwt.depositDelete({deposit_id : id}).then(res => {
                const {balance = 0} = res.data.payload
                setTill(balance)
                return res
            }).catch(err => {
                console.log(err)
                Error(err)
                return false
            })
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
    
          if (result.isConfirmed) {
            removedeleteitem(id)
            MySwal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The Deposit has been deleted.',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
          }
    
        })
    }

    useEffect(() => {
         useJwt.depositLogList({
            page: 1,
            limit: 30,
            from_id: 1,
            to_id: 2,
            ip
        }).then(res => {
            setisloading(false)
            setdata(res.data.payload.data)
            console.log(res.data.payload.data)
            setTill(res.data.payload.current_balance)
        }).catch(err => {
            console.log(err)
            Error(err)
        })
        // submitDeposit depositLogList
    }, [])

    const columns = [
        {
            name: 'Time',
            selector: (row) => formatReadableDate(row.created_at),
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'Till',
            selector: 'till_id',
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Deposit Amount',
            selector: (row, index) => `${window.CURRENCY_SYMBOL} ${thousandSeparator((+row.deposit_amount).toFixed(2))}`,
            minWidth: '150px',
            sortable: true
        },
        {
            name: 'Till Balance',
            selector: (row, index) => `${window.CURRENCY_SYMBOL} ${thousandSeparator((+row.current_balance).toFixed(2))}`,
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'User',
            selector: 'created_by',
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'Actions',
            allowOverflow: true,
            cell: (row) => {
                return (
                    <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => handleConfirmText(row.id)} />
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

    const onChange = (e) => {
        setSearchValue(e.target.value)
    }
    const onsubmit = (e) => {
        e.preventDefault()
        if (searchValue === '' || Number(searchValue) === 0) {
            return
        }
        setsubmitLoader(true)
        // console.log({ deposit_amount: Number(searchValue), from_id: 1, to_id: 2, ip })
        useJwt.submitDeposit({
            deposit_amount: searchValue,
            from_id: 1,
            to_id: 2,
            ip
        }).then(res => {
            // console.log(res)
            Success(res)
            const { current_balance = 0, deposit_amount, till_balance, till_id, username, id } = res.data.payload
            const newObj = {
                id,
                created_at: new Date().toISOString(),
                till_id,
                deposit_amount,
                created_by: username,
                current_balance: till_balance
            }
            setTill(till_balance)
            setdata([newObj, ...data])
            setSearchValue('')
            setsubmitLoader(false)
        }).catch(err => {
            Error(err)
            setsubmitLoader(false)
        })
    }

    return (
        <>
            <Card className="py-0 px-1">
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Deposit to Safe</CardTitle>
                </CardHeader>
                <Form className="my-2" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                    <Row>
                        <Col md='6'>
                            <Label for="From">Amount</Label>
                            <Input
                                style={{ width: '100%' }}
                                placeholder="1000"
                                type='number'
                                min='0'
                                id='search-input'
                                value={searchValue}
                                onChange={onChange}
                            />
                        </Col>
                        <Col md='2'>
                            {
                                submitLoader ? <Button.Ripple color='primary' style={{ marginTop: '22px' }} disabled={true}>
                                    <Spinner color='white' size='sm' />
                                    <small className='ml-50'>Loading...</small>
                                </Button.Ripple> : <Button.Ripple color='primary' style={{ marginTop: '22px' }} type='submit'>
                                    <span className='align-middle ml-50'>Deposit</span>
                                </Button.Ripple>
                            }
                        </Col>
                        <Col md='4'>
                            <Label for="From">Current Till Cash Balance</Label>
                            <h2>{`${window.CURRENCY_SYMBOL} ${thousandSeparator((+till).toFixed(2))}`}</h2>
          
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Last 30 Items</CardTitle>
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

export default SafeDeposit