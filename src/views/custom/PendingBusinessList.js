import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, XSquare, CheckSquare, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../viewhelper'
import { formatReadableDate } from '../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const PendingBusinessList = () => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [pendingBusinessList, setPendingBusinessList] = useState([])
    const user = JSON.parse(localStorage.getItem('userData'))

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //tokan management purpose
        localStorage.setItem('usePMStoken', false) //tokan management purpose
        useJwt.PendingBusiness().then(res => {
          console.log(res)
          setPendingBusinessList(res.data.payload)
          setTableDataLoading(false)
        }).catch(err => {
          setTableDataLoading(false)
          console.log(err.response)
          Error(err)
        })
      }, [])

    const handlePoPupActions = (id, status, message) => {
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
                const data = {
                    businessid: id,
                    trigger : status
                }
                return useJwt.ApproveRejectBusiness(data).then(res => {
                    Success(res)
                    console.log(res)
                    setPendingBusinessList(pendingBusinessList.filter(x => parseInt(x.id) !== id))
                }).catch(err => {
                    console.log(err.response)
                    Error(err)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {

            }
        })

    }
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = pendingBusinessList.filter(item => {
            const startsWith =
            item.businessname.toLowerCase().startsWith(value.toLowerCase()) ||
            item.email.toLowerCase().startsWith(value.toLowerCase()) ||
            item.operation.toLowerCase().startsWith(value.toLowerCase()) ||
            item.createdby.toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.createddate).toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.businessname.toLowerCase().includes(value.toLowerCase()) ||
            item.email.toLowerCase().includes(value.toLowerCase()) ||
            item.operation.toLowerCase().includes(value.toLowerCase()) ||
            item.createdby.toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.createddate).toLowerCase().includes(value.toLowerCase())

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

    const column = [
        {
            name: 'Business Name',
            minWidth: '160px',
            sortable: true,
            selector: 'businessname'
        },
        {
            name: 'Email',
            minWidth: '250px',
            sortable: true,
            selector: 'email'
        },
        {
            name: 'Address',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return `${row.thana}, ${row.district}, ${row.city}`
            }
        },
        {
            name: 'Status',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.status ===  1 ? <Badge pill color='light-success' className='badge-center'>
                Active
              </Badge> : <Badge pill color='light-danger' className='badge-center'>
                Inactive
              </Badge>
            }
        },
        {
            name: 'Web Login',
            minWidth: '120px',
            sortable: true,
            selector: row => {
                return row.web_login ? <Badge pill color='success' className='badge-center'>
                Allow
              </Badge> : <Badge pill color='danger' className='badge-center'>
                Not Allow
              </Badge>
            }
        },
        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: 'operation'
        },
        {
            name: 'Created By',
            minWidth: '120px',
            sortable: true,
            selector: 'createdby'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.createddate) - new Date(a.createddate)
              },
            selector: (item) => {
                return item.createddate ? formatReadableDate(item.createddate) : null
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return row.createdby === user.username ? <h6 style={{margin:'0', color:'orange'}}>Pending</h6> : <>
                    <><a href={`/pendingbusinessdetails/${row.id}`}><Eye size={15} color='#2bc871' style={{ cursor: 'pointer' }} /></a> &nbsp;&nbsp;&nbsp;&nbsp;</>
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(parseInt(row.id), 1, 'Do you want to approve?')}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(parseInt(row.id), 2, 'Do you want to reject?')}
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
        const keys = [...Object.keys(array[0])]
        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
        let ctr = 0
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter
    
            result += item[key]
    
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
        doc.text('Pending Business List', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Business Name', dataKey: 'businessname' }, { header: 'Email', dataKey: 'email' },
                { header: 'Operation', dataKey: 'operation' }, { header: 'Created at', dataKey: 'createddate' }, { header: 'Created By', dataKey: 'createdby' }
            ],
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
          })
        doc.save('export.pdf')
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Business List</CardTitle>
                <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(pendingBusinessList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(pendingBusinessList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(pendingBusinessList)}>
                                <File size={15} />
                                <span className='align-middle ml-50'>
                                    PDF
                                </span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </div>
            </CardHeader>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingBusinessList} TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default PendingBusinessList