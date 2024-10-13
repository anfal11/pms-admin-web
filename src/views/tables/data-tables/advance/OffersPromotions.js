// ** React Imports
import { useState, useEffect, Fragment } from 'react'
//import Avatar from '@components/avatar'
import { Avatar, Image } from 'antd'
import { AntDesignOutlined } from '@ant-design/icons'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Plus, Eye, Edit, Trash, MoreVertical } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, Input, Label, Row, Col, Spinner, Badge, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'antd/dist/antd.css'
import ProductDetailsModal from './productDetailsModal'
const MySwal = withReactContent(Swal)

const OffersPromotions = () => {
    const history = useHistory()
    const [isloading, setisloading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [allDealsList, setAllDealsList] = useState([])
    const [efct, setEfct] = useState(true)

    useEffect(() => {
        useJwt.allDeals({ page: 1, limit: 1500 }).then(res => {
            console.log(res.data.payload)
            setAllDealsList(res.data.payload)
            setisloading(false)
        }).catch(err => {
            console.log(err)
        })
    }, [efct])
    const handleDelete = (ID) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                //fetch business delete api...
                useJwt.deleteHotDeal({ id: ID }).then(res => {
                    console.log(res)
                    //   removedeleteitem(ID)
                    MySwal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The product has been deleted.',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })
                    setEfct(!efct)
                }).catch(err => {
                    console.log(err.response)
                })
            }
        })
    }
    const AllDealsColumns = [
        {
            name: 'Product id',
            sortable: true,
            minWidth: '100px',
            selector: 'id'
        },
        {
            name: 'Photo',
            sortable: true,
            minWidth: '150px',
            cell: row => (
                <div className='d-flex align-items-center'>
                    <Image
                        width={70}
                        src={row.deal_image}
                    />
                </div>
            )
        },
        {
            name: 'Details',
            sortable: true,
            minWidth: '150px',
            selector: 'details'
            //   cell: (row) => {
            //     return row.categoryinfo ? row.categoryinfo.categoryname : ""
            //   }
        },
        {
            name: 'Offerprice',
            sortable: true,
            minWidth: '100px',
            selector: 'offerprice'
            //   cell: (row) => {
            //     return row.categoryinfo ? row.categoryinfo.categoryname : ""
            //   }
        },
        {
            name: 'Startdate',
            sortable: true,
            minWidth: '150px',
            selector: row => row.offer_startdate.substr(0, 10)
            //   cell: (row) => {
            //     return row.categoryinfo ? row.categoryinfo.categoryname : ""
            //   }
        },
        {
            name: 'Enddate',
            sortable: true,
            minWidth: '150px',
            selector: row => row.offer_enddate.substr(0, 10)
            //   cell: (row) => {
            //     return row.categoryinfo ? row.categoryinfo.categoryname : ""
            //   }
        },
        {
            name: 'Actions',
            allowOverflow: true,
            cell: row => {
                return (
                    <div className='d-flex'>
                        {/* <Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => console.log(row.id)} />  */}
                        <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => {
                            e.preventDefault()
                            handleDelete(row.id)
                        }} />&nbsp;&nbsp;
                        <Edit size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => {
                            history.push(`/EditHotDeal/${row.id}`)
                        }} />
                        {/* <UncontrolledDropdown>
                            <DropdownToggle className='pr-1' tag='span'>
                                <MoreVertical size={15} style={{ cursor: 'pointer' }} />
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem tag='a' href={`/EditHotDeal/${row.id}`} className='w-100'>
                                    <Edit size={15} color='#2bc871' style={{ cursor: 'pointer' }} />
                                    <span className='align-middle ml-50'>Edit</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={(e) => {
                                    e.preventDefault()
                                    handleDelete(row.id)
                                }}>
                                    <Trash size={15} color='red' style={{ cursor: 'pointer' }} />
                                    <span className='align-middle ml-50'>Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}
                    </div>
                )
            }
        }
    ]

    // ** Custom Pagination
    const handlePagination = (page) => {
        setCurrentPage(page.selected)
    }
    const CustomPagination = () => {
        const count = allDealsList.length / 10

        return (
            <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                breakLabel='...'
                pageCount={count || 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                activeClassName='active'
                forcePage={currentPage}
                onPageChange={page => handlePagination(page)}
                pageClassName={'page-item'}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName={
                    'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
                }
            />
        )
    }

    return (
        <Fragment>
            <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/AddHotDeal'>
                <Plus size={15} />
                <span className='align-middle ml-50'>Add New</span>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>All Offers & Promotions</CardTitle>
                </CardHeader>
                <DataTable
                    noHeader
                    pagination
                    // paginationServer
                    className='react-dataTable'
                    columns={AllDealsColumns}
                    paginationPerPage={10}
                    paginationDefaultPage={currentPage + 1}
                    sortIcon={<ChevronDown size={10} />}
                    paginationComponent={CustomPagination}
                    data={allDealsList}
                    progressPending={isloading}
                    progressComponent={<Spinner color='primary' />}
                    responsive={true}
                />
            </Card>
        </Fragment>
    )
}

export default OffersPromotions