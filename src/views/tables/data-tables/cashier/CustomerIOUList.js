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
import {Error} from '../../../viewhelper'
const MySwal = withReactContent(Swal)

const CustomerIOUList = () => {
    const history = useHistory()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [isloading, setisloading] = useState(true)
    const [data, setdata] = useState([])

    const handleDetails = (id) => {
        // const selectedData = data.filter(x => x.id === id)
        // sessionStorage.setItem("CIOUSettingData", JSON.stringify(selectedData))
        history.push(`/CustomerIOUSetting/${id}`)
        // console.log(selectedData)
    }
    const Customerbusinesslist = (data = {}) => {
        setisloading(true)
        useJwt.customerBusinessList(data).then(res => {
            setisloading(false)
            setdata(res.data.payload)
            // console.log(res.data.payload)
        }).catch(err => {
            setisloading(false)
            console.log(err)
            Error(err)
        })
    }
    useEffect(() => {
        Customerbusinesslist()
    }, [])

    const columns = [
        {
            name: 'Customer ID',
            selector: (row, index) => row.storemap.customerid,
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Customer Name',
            selector: (row, index) => `${row.customerinfo.firstname} ${row.customerinfo.lastname}`,
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'Business Name',
            selector: 'businessname',
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'Allowance',
            selector: (row, index) => `${window.CURRENCY_SYMBOL} ${(+row.iou_limit).toFixed(2)}`,
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Used',
            selector: (row, index) => `${window.CURRENCY_SYMBOL} ${(+row.iou_used).toFixed(2)}`,
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Remaining',
            selector: (row, index) => `${window.CURRENCY_SYMBOL} ${(+(row.iou_limit ? row.iou_limit - row.iou_used : row.iou_used ? row.iou_used : 0)).toFixed(2)}`,
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
                        <Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={() => handleDetails(row.storemap.customerid)} />
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
            pageCount={data.length ? data.length / 20 : 1}
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
    const onsubmit = (e) => {
        e.preventDefault()
        //alert(searchValue)
        Customerbusinesslist({customerid:searchValue})

    }
    const onChange = (e) => {
        setSearchValue(e.target.value)
    }

    return (
        <>
            <Card>
                <Form className="d-flex my-2 mx-1 justify-content-center" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                    <Input
                        style={{ width: '50%' }}
                        placeholder="Search a Customer by ID"
                        type='number'
                        id='search-input'
                        required
                        value={searchValue}
                        onChange={onChange}
                    />
                    {
                        isloading ? <Button.Ripple className='ml-2' color='primary'  disabled={true} >
                        <Spinner color='white' size='sm' />
                                <small className='ml-50'>Loading...</small>
                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit"  >
                        <Search size={15} />
                        <span className='align-middle ml-50'>Search</span>
                    </Button.Ripple>
                    }
                    
                </Form>
            </Card>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Customer IOU List</CardTitle>
                </CardHeader>
                <DataTable
                    noHeader
                    pagination
                    columns={columns}
                    paginationPerPage={20}
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

export default CustomerIOUList