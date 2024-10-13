import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput, UncontrolledDropdown } from 'reactstrap'
import { ChevronDown, Share, Printer, Table, Trash2, Download, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft} from 'react-feather'
import CommonDataTable from '../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { VoucherStatusSet } from '../../statusdb'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import useJwt2 from '@src/auth/jwt/useJwt2'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const systemV = {
    false: { title: 'False', color: 'light-primary' },
    true: { title: 'True', color: 'light-success' }
}

const VoucherList = ({setnewcustomecodeadded, VoucherListData, TableDataLoading, bulkPurchase, setrefresh, refresh, setisviewDetails, setvoucherid, setisvoucherEdit}) => {

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const viewDetails = (e, item) => {

        setvoucherid(item.voucherid)
        setisviewDetails(true)
    }

    const editDetails = (e, item) => {

        setvoucherid(item.voucherid)
        setisvoucherEdit(true)
    }

    const deleteDetails = (e, item) => {
        e.preventDefault()
        return MySwal.fire({
            title: 'Do you want to Delete',
            text: `Information will be delete when another user will approve this operation.`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return useJwt2.pmsVoucherDelete({ voucherid: item.voucherid }).then(res => {
                  
                    console.log(res)
                    Success({data: {message : res.data.payload.msg}})
                    setrefresh(refresh + 1)
                    
                }).catch(err => {
                    Error(err)
                    console.log(err.response)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {
    
            }
        })
    }
    // pmsVoucherUnusedcodecsvDownload
    const releaseCode = (e, item) => {
        e.preventDefault()
        return MySwal.fire({
            title: 'Do you want to Delete',
            text: `Custom Code will release when another user will approve this operation.`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return useJwt2.pmsVoucherRelease({ voucherid: item.voucherid }).then(res => {
                  
                    console.log(res)
                    Success({data: {message : res.data.payload.msg}})
                    setrefresh(refresh + 1)
                    
                }).catch(err => {
                    Error(err)
                    console.log(err.response)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {
    
            }
        })
    }
    
    const handleDownloadLinkPoPup = (link) => {
        return MySwal.fire({
            title: `Please click below link`,
            html: `<a href="${link}" target="_blank"> ${link}</a>`,
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: false,
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: false,
            buttonsStyling: false
        })

}
    const voucherUnusedCodeDownload = (e, item) => {
        e.preventDefault()
        return MySwal.fire({
            title: 'Do you want to Download',
            text: '',
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return useJwt2.pmsVoucherUnusedcodecsvDownload({ voucherid: item.voucherid }).then(res => {
                  
                    console.log(res)
                    handleDownloadLinkPoPup(res.data.payload.file_url)
                    // Success({data: {message : res.data.payload.msg}})
                    // setrefresh(refresh + 1)
                    
                }).catch(err => {
                    Error(err)
                    console.log(err.response)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {
    
            }
        })
    }
    // voucherCustomCodeAdded
    const voucherCustomCodeAdded = (e, item) => {
        e.preventDefault()
        setvoucherid(item.voucherid)
        setnewcustomecodeadded(true)
    }
       // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = VoucherListData.filter(item => {
            const startsWith =
            item.voucherid?.toLowerCase().startsWith(value.toLowerCase()) ||
            item.title?.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.voucherid?.toLowerCase().includes(value.toLowerCase()) ||
            item.title?.toLowerCase().includes(value.toLowerCase())

            if (startsWith) {
            return startsWith
            } else if (!startsWith && includes) {
            return includes
            } else return null
        })
        setFilteredData(updatedData)
       // setSearchValue(value)
        }
    }

    const column = [
        // {
        //     name: 'SL',
        //     minWidth: '100px',
        //     sortable: true,
        //     cell: (row, index) => index + 1 
        // },
        {
            name: 'ID',
            minWidth: '100px',
            sortable: true,
            selector: 'voucherid'
        },
        {
            name: 'Title',
            minWidth: '150px',
            sortable: true,
            selector: 'title',
            wrap: true
        },
        {
            name: 'Business Name',
            minWidth: '250px',
            sortable: true,
            selector: 'businessname'
        },
        {
            name: 'Voucher Type',
            minWidth: '80px',
            sortable: true,
            selector: 'vouchertype'
        },
        {
            name: 'System-Voucher',
            minWidth: '80px',
            sortable: true,
            selector: row => {
                return <Badge color={systemV[row.is_system_voucher].color} pill className='px-1'>
                    {systemV[row.is_system_voucher].title}
                </Badge>
            }
        },
        {
            name: 'Start Date',
            minWidth: '130px',
            sortable: true,
            selector: 'startdate'
        },
        {
            name: 'Expiry Date',
            minWidth: '130px',
            sortable: true,
            selector: 'expirydate'
        }, 
        {
            name: 'Quota',
            minWidth: '80px',
            sortable: true,
            selector: 'quota'
        },
        {
            name: 'Reedem',
            minWidth: '80px',
            sortable: true,
            selector: 'reedem_count'
        },
        {
            name: 'Use',
            minWidth: '80px',
            sortable: true,
            selector: 'use_count'
        },
        {
            name: 'Tier',
            minWidth: '100px',
            sortable: true,
            selector: 'tier_name'
        },
        {
            name: 'Status',
            minWidth: '120px',
            sortable: true,
            selector: (item) => <Badge color={VoucherStatusSet(item['status']).color} pill className='px-1'> {VoucherStatusSet(item['status']).title} </Badge>
        }, 
        {
            name: 'Action',
            minWidth: '200px',
            // sortable: true,
            cell: row => {
    
                return <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                  <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    className='w-100'
                    onClick={(e) => viewDetails(e, row)}
                  >
                    <FileText size={14} className='mr-50' />
                    <span className='align-middle'>Details</span>
                  </DropdownItem>
                  <DropdownItem
                    className='w-100'
                    onClick={(e) => editDetails(e, row) }
                  >
                    <Archive size={14} className='mr-50' />
                    <span className='align-middle'>Edit</span>
                  </DropdownItem>
                  <DropdownItem className='w-100' 
                        onClick={(e) => deleteDetails(e, row) }
                     >
                       <Trash2 size={14} className='mr-50' />
                       <span className='align-middle'>Delete</span>
                  </DropdownItem>
                  <DropdownItem className='w-100' 
                        onClick={(e) => releaseCode(e, row) }
                     >
                       <Trash2 size={14} className='mr-50' />
                       <span className='align-middle'>Unused-Code-Release</span>
                  </DropdownItem>
                  <DropdownItem className='w-100' 
                        onClick={(e) => voucherUnusedCodeDownload(e, row) }
                     >
                       <Download size={14} className='mr-50' />
                       <span className='align-middle'>Unused-Code-Download</span>
                  </DropdownItem>
                  <DropdownItem className='w-100' 
                        onClick={(e) => voucherCustomCodeAdded(e, row) }
                     >
                       <Plus size={14} className='mr-50' />
                       <span className='align-middle'>Add-Custom-Code</span>
                  </DropdownItem>

                   <DropdownItem
                    className='w-100'
                    onClick={(e) => bulkPurchase(e, row) }
                  >
                    <Table size={14} className='mr-50' />
                    <span className='align-middle'>Bulk-Purchase</span>
                  </DropdownItem>
                
                </DropdownMenu>
              </UncontrolledDropdown>
            }
        }
    ]

    return (
        <Fragment>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Vouchers</CardTitle>
                    {/* <div>
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(VoucherList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportToXL(VoucherList)}>
                                    <Grid size={15} />
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportPDF(VoucherList)}>
                                    <File size={15} />
                                    <span className='align-middle ml-50'>
                                        PDF
                                    </span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    </div> */}
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md='12'>
                            <Row className='justify-content-end mx-0'>
                                <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                                    <Label className='mr-1' for='search-input'>
                                    Search
                                    </Label>
                                    <Input
                                    className='dataTable-filter mb-50'
                                    type='text'
                                    bsSize='sm'
                                    id='search-input'
                                    value={searchValue}
                                    onChange={handleFilter}
                                    />
                                </Col>
                            </Row>
                            {/* <CommonDataTable column={column} TableData={searchValue.length ? filteredData : VoucherListData} TableDataLoading={TableDataLoading} /> */}
                            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : VoucherListData} TableDataLoading={TableDataLoading} />

                        </Col>
                    </Row>
                </CardBody>

            </Card>

        </Fragment>
    )
}

export default VoucherList