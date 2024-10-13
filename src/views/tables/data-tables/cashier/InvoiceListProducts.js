// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
    ChevronDown, Share, Printer, FileText, File, ChevronLeft, Copy, Plus, MoreVertical,
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

const InvoiceListProducts = () => {
    const history = useHistory()
    const { receipt_id } = useParams()
    const [currentPage, setCurrentPage] = useState(0)
    const [isloading, setisloading] = useState(true)
    const [data, setdata] = useState([])
    const [infoData, setIinfo] = useState({})
    const [invoiceids, setinvoiceids] = useState([])
    const [count, setCount] = useState({
        subTotal: 0,
        vat: 0,
        total: 0
    })

    useEffect(() => {
        useJwt.invoiceDetails({ receipt_id }).then(res => {
            console.log(res.data.payload)
            setisloading(false)
            const invoiceids = []
            const productsArray = [].concat.apply([], res.data.payload.invoices.map((x, index) => {
                invoiceids[index] = x.invoice_id
                return x.items
            }))
            console.log('productsArray ', productsArray)
            setIinfo(res.data.payload)
            setinvoiceids(invoiceids)
            setdata([...productsArray])
            const subTotal = productsArray.map(x => x.total_exclude_vat).reduce((total, newAmount) => total + newAmount)
            const vat = productsArray.map(x => x.vat).reduce((total, newAmount) => total + newAmount)
            setCount({ subTotal: Number(subTotal).toFixed(2), vat: Number(vat).toFixed(2), total: Number(subTotal + vat).toFixed(2) })
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const columns = [
        {
            name: 'Product name',
            selector: (row, index) => {

                if (row.productinfo) {
                    return row.productinfo.productname
                } else {
                    return ""
                }
            },
            minWidth: '200px',
            sortable: true
        },
        {
            name: 'Product code',
            selector: (row, index) => row.product_code,
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Quantity',
            selector: 'quantity',
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Vat',
            selector: (row) => `${window.CURRENCY_SYMBOL} ${(+row.vat).toFixed(2)}`,
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Price',
            selector: (row) => `${window.CURRENCY_SYMBOL} ${thousandSeparator((+row.total_exclude_vat).toFixed(2))}`,
            minWidth: '100px',
            sortable: true
        },
        {
            name: 'Price + Vat',
            selector: (row) => `${window.CURRENCY_SYMBOL} ${thousandSeparator((+(row.total_exclude_vat + row.vat)).toFixed(2))}`,
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
            pageCount={data.length / 7 || 1}
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
            <Button.Ripple className='ml-2' color='primary' onClick={() => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back to Invoice List</span>
            </Button.Ripple>
            <Card className='p-1 my-2'>
                <p>Receipt id: {infoData.receipt_id}</p>
                <p>Invoice id: {invoiceids.toString()}</p>
                <p>Invoice to : {infoData.customer_business_name}</p>
                <p>Store name: {infoData.store_name}</p>
                <p>Date : { infoData.createdat ? formatReadableDate(infoData.createdat) : null} </p>
            </Card>

            <Card>
                <DataTable
                    noHeader
                    pagination
                    columns={columns}
                    paginationPerPage={7}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10} />}
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={CustomPagination}
                    data={data}
                    progressPending={isloading}
                    progressComponent={<Spinner color='primary' />}
                    responsive={true}
                />
                <div className="w-100 p-2 d-flex justify-content-end">
                    <div style={{ width: '150px', textAlign: 'right' }}>
                        <p>Subtotal : {`${window.CURRENCY_SYMBOL} ${thousandSeparator((+count.subTotal).toFixed(2))}`}</p>
                        <p>Vat : {`${window.CURRENCY_SYMBOL} ${thousandSeparator((+count.vat).toFixed())}`}</p>
                        <hr />
                        <p>Total : {`${window.CURRENCY_SYMBOL} ${thousandSeparator((+count.total).toFixed(2))}`}</p>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default InvoiceListProducts