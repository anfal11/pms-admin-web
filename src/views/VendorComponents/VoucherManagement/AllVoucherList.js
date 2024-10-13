import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    CheckSquare, Share, XSquare, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import Modal from './Slider'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { formatReadableDate } from '../../helper'
import classnames from 'classnames'

const AllVoucherList = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [TableDataLoading1, setTableDataLoading1] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [VoucherList, setVoucherList] = useState([])
    const [businessList, setBusinessList] = useState([])
    const [pendingVoucherList, setPendingVoucherList] = useState([])
    const [pms_merchantid, setpms_merchantid] = useState('')
    const [resetData, setReset] = useState(false)
    const [VoucherDetails, setVoucherDetails] = useState({})
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    const getVoucherList = async (/* pms_merchantid */) => {
        // localStorage.setItem('usePMStoken', true)
        // setTableDataLoading(true)
        // setVoucherList({})
        // await useJwt.allVouchersList(/* pms_merchantid */).then(res => {
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(res)
        //     const tempV = []
        //     for (const p in res.data.payload) {
        //         for (const pp of res.data.payload[p]) {
        //             tempV.push(pp)
        //         }
        //     }
        //     setVoucherList(tempV)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     Error(err)
        //     console.log(err.response)
        //     setTableDataLoading(false)
        // })
    }
    const getPendingVoucherList = async (pms_merchantid) => {
        // setTableDataLoading1(true)
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.pendingVouchersList(pms_merchantid).then(res => {
        //     setTableDataLoading1(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(res)
        //     const tempV = []
        //     for (const p in res.data.payload) {
        //         for (const pp of res.data.payload[p]) {
        //             tempV.push(pp)
        //         }
        //     }
        //     setPendingVoucherList(tempV)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     // Error(err)
        //     setPendingVoucherList([])
        //     console.log(err.response)
        //     setTableDataLoading1(false)
        // })
    }

    useEffect(() => {
        const asyncApiCall = async () => {
            await useJwt.customerBusinessList().then(async res => {
                console.log(res)
                const { payload } = res.data
                const filtered = payload.filter(p => p.id !== user.id)
                setBusinessList(filtered)
                setpms_merchantid(filtered[0].pms_merchantid)
                await getPendingVoucherList(filtered[0].pms_merchantid)
              }).catch(err => {
                console.log(err.response)
                Error(err)
              })
            getVoucherList(/* pms_merchantid */)
        }
        asyncApiCall()
    }, [/* pms_merchantid */resetData])

    const handleBusinessChange = (selected) => {
        getPendingVoucherList(selected.value)
        setpms_merchantid(selected.value)
    }

// ** Function to handle filter
const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = VoucherList.filter(item => {
        const startsWith =
          item.Id.toLowerCase().startsWith(value.toLowerCase()) ||
          item.Merchant.MerchantName.toLowerCase().startsWith(value.toLowerCase()) ||
          item.VoucherType.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.Id.toLowerCase().includes(value.toLowerCase()) ||
          item.Merchant.MerchantName.toLowerCase().includes(value.toLowerCase()) ||
          item.VoucherType.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }
  const handleApprovePoPupActions = (voucherId, message) => {
    return MySwal.fire({
        title: message,
        text: `You won't be able to revert this`,
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
            // return true
            // localStorage.setItem('usePMStoken', true)
            // return useJwt.approveVoucher({ voucherId, approvedBy: "fahim" }).then(res => {
            //         localStorage.setItem('usePMStoken', false)
            //         toast.success('voucher approved successfully')
            //         console.log(res)
            //         setReset(!reset)
            //     }).catch(err => {
            //         localStorage.setItem('usePMStoken', false)
            //         Error(err)
            //         console.log(err.response)
            //     })
        },
        buttonsStyling: false,
        allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {
        if (result.isConfirmed) {

        }
    })

}
  const handleRejectPoPupActions = (voucherId, message) => {
    return MySwal.fire({
        title: message,
        text: `You won't be able to revert this`,
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
            // return true
            // localStorage.setItem('usePMStoken', true)
            // return useJwt.rejectVoucher({ voucherId, approvedBy: "fahim" }).then(res => {
            //         localStorage.setItem('usePMStoken', false)
            //         toast.success('voucher rejected successfully')
            //         console.log(res)
            //         setReset(!reset)
            //     }).catch(err => {
            //         localStorage.setItem('usePMStoken', false)
            //         Error(err)
            //         console.log(err)
            //     })
        },
        buttonsStyling: false,
        allowOutsideClick: () => !Swal.isLoading()
    }).then(function (result) {
        if (result.isConfirmed) {

        }
    })

}
    const column = [
        {
            name: 'SL',
            minWidth: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'ID',
            minWidth: '100px',
            sortable: true,
            selector: 'Id'
        },
        {
            name: 'Business Name',
            minWidth: '150px',
            sortable: true,
            selector: row => {
                return row.Merchant.MerchantName
            }
        },
        {
            name: 'Tier',
            minWidth: '100px',
            sortable: true,
            selector: 'Tier'
        },
        {
            name: 'Expiry Date',
            minWidth: '250px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.ExpiryDate) - new Date(a.ExpiryDate)
              },
            selector: (item) => {
                return item.ExpiryDate ? formatReadableDate(item.ExpiryDate) : null
            }
        },
        {
            name: 'Voucher Type',
            minWidth: '100px',
            sortable: true,
            selector: 'VoucherType'
        },
        {
            name: 'Price',
            minWidth: '100px',
            sortable: true,
            selector: 'price'
        },
        {
            name: 'Quota',
            minWidth: '100px',
            sortable: true,
            selector: 'Quota'
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setVoucherDetails(row)
                                setModal(true)
                            }}
                        />
                    </span>
                </>
            }
        }
    ]
  
    const column1 = [
        {
            name: 'Voucher Id',
            minWidth: '100px',
            sortable: true,
            selector: 'VoucherId'
        },
        {
            name: 'Voucher Type',
            minWidth: '100px',
            sortable: true,
            selector: 'VoucherType'
        },
        {
            name: 'Expiry Date',
            minWidth: '200px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.ExpiryDate) - new Date(a.ExpiryDate)
              },
            selector: (item) => {
                return item.ExpiryDate ? formatReadableDate(item.ExpiryDate) : null
            }
        },
        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: 'Operation'
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'CreatedBy'
        },
        {
            name: 'Created At',
            minWidth: '200px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
              },
            selector: (item) => {
                return item.CreatedAt ? formatReadableDate(item.CreatedAt) : null
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return parseInt(row.CreatedBy) === user.id ? 'Pending' : <>
                <span title="Approve">
                    <CheckSquare size={15}
                        color='teal'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => handleApprovePoPupActions(row.VoucherId, 'Do you want to approve?')}
                    />
                </span>&nbsp;&nbsp;
                <span title="Reject">
                    <XSquare size={15}
                        color='red'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => handleRejectPoPupActions(row.VoucherId, 'Do you want to reject?')}
                    />
                </span>
            </>
            }
        }
    ]
     // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = ['Id', 'MerchantName', 'ExpiryDate', 'VoucherType', 'price', 'Quota']
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
    let ctr = 0
    keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter

        if (key === 'MerchantName') {
            result += item.Merchant.MerchantName
          }  else {
            result += item[key]
          } 
       
        ctr++
      })
    result += lineDelimiter
    })

    return result
    }
    // ** Downloads CSV
    function downloadCSV(array) {
        const link = document.createElement('a')
        let csv = convertArrayOfObjectsToCSV(array)
        if (csv === null) return

        const filename = 'export.csv'

        if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`
        }

        link.setAttribute('href', encodeURI(csv))
        link.setAttribute('download', filename)
        link.click()
    }
    // ** Export XL file
    const exportToXL = (arr) => {
        const ws = XLSX.utils.json_to_sheet(arr)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'})
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Voucher List', 14, 10)
        const flist = list.map(l => {
            return {...l, ...l.Merchant}
          })
        doc.autoTable({
        body: [...flist],
        columns: [
            { header: 'ID', dataKey: 'Id' }, { header: 'Business Name', dataKey: 'MerchantName' }, { header: 'Expiry Date', dataKey: 'ExpiryDate' },
                { header: 'Voucher Type', dataKey: 'VoucherType' }, { header: 'Price', dataKey: 'price' }, { header: 'Quota', dataKey: 'Quota' }
            ],
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Fragment>
            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Voucher List
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2') }}
                            >Pending Voucher List
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardBody>
            </Card>
            <Card>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                       <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Vouchers</CardTitle>
                            <div>
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
                            </div>
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
                                    <CommonDataTable column={column} TableData={/* VoucherList */ searchValue.length ? filteredData : VoucherList} TableDataLoading={TableDataLoading} />
                                </Col>
                            </Row>
                        </CardBody>
                        <Modal
                            toggleModal={toggleModal}
                            modal={modal}
                            resetData={resetData}
                            setReset={setReset}
                            VoucherDetails={VoucherDetails}
                        />
                       </Card>
                    </TabPane>
                    <TabPane tabId="2">
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Pending Vouchers</CardTitle>
                            </CardHeader>
                            {businessList.length > 1 && <Card>
                                    <CardBody style={{zIndex: '5'}}>
                                        <Label for="Business">Select a Business</Label>
                                        <Select
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            defaultValue={businessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })[0]}
                                            onChange={handleBusinessChange}
                                            options={businessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })}
                                        />
                                    </CardBody>
                                </Card>}
                            <CardBody>
                                <Row>
                                    <Col md='12'>
                                        <CommonDataTable column={column1} TableData={pendingVoucherList} TableDataLoading={TableDataLoading1} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </TabPane>
                </TabContent>
            </Card>
        </Fragment>
        
        // <>
        //     {BusinessList.length > 1 && <Card>
        //         <CardBody>
        //             <Label for="Business">Select a Business</Label>
        //             <Select
        //                 theme={selectThemeColors}
        //                 maxMenuHeight={200}
        //                 className='react-select'
        //                 classNamePrefix='select'
        //                 defaultValue={BusinessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })[0]}
        //                 onChange={handleBusinessChange}
        //                 options={BusinessList.map(x => { return { value: x.pms_merchantid, label: x.businessname } })}
        //             />
        //         </CardBody>
        //     </Card>}
        //     <Card>
        //         <CardHeader className='border-bottom'>
        //             <CardTitle tag='h4'>Discount Vouchers</CardTitle>
        //         </CardHeader>
        //         <CardBody>
        //             {TableDataLoading && <Spinner size='sm' />}
        //             {VoucherList.discount && <Slider SliderArray={VoucherList.discount} resetData={resetData} setReset={setReset} />}
        //         </CardBody>
        //     </Card>
        //     <Card>
        //         <CardHeader className='border-bottom'>
        //             <CardTitle tag='h4'>product Vouchers</CardTitle>
        //         </CardHeader>
        //         <CardBody>
        //             {TableDataLoading && <Spinner size='sm' />}
        //             {VoucherList.product && <Slider SliderArray={VoucherList.product} resetData={resetData} setReset={setReset} />}
        //         </CardBody>
        //     </Card>
        //     <Card>
        //         <CardHeader className='border-bottom'>
        //             <CardTitle tag='h4'>cash Vouchers</CardTitle>
        //         </CardHeader>
        //         <CardBody>
        //             {TableDataLoading && <Spinner size='sm' />}
        //             {VoucherList.cash && <Slider SliderArray={VoucherList.cash} resetData={resetData} setReset={setReset} />}
        //         </CardBody>
        //     </Card></>
    )
}

export default AllVoucherList