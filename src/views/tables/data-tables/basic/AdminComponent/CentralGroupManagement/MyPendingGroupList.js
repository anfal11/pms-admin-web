import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Edit, Download, Eye, File, FileText, Grid, Plus, Minus, Trash, RefreshCw, MoreVertical, Trash2  } from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, Input, Label, Row, Col, Badge, Form, FormGroup, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { formatReadableDate } from '../../../../../helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const MyPendingGroupList = ({ myPendingGroupList, ViewDetails, toggleDetailsView, setgroupInfo, viewContacts }) => {
    const [TableDataLoading, setTableDataLoading] = useState(false)

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])


    const [csvloading, setcsvloading] = useState(false)
    const [downloadingItem, setdownloadingItem] = useState({}) 
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
    const contactCSVDownload = (group_id) => {
        if (csvloading) {

            Error({response: { status : 404, data: { message: 'One file is preparing to download, Please wait some time'} }})
            return 0
        }
        setcsvloading(true)
        setdownloadingItem(group_id)
        useJwt2.csvDownloadPending({ group_id: (+group_id) }).then(res => {
            // window.open(res.data.payload.image_url, "_blank")
            // window.open(res.data.payload)
            handleDownloadLinkPoPup(res.data.payload.image_url)
            setcsvloading(false)
            setdownloadingItem()
            console.log('res.data.payload')
        }).catch(err => {
            setcsvloading(false)
            setdownloadingItem()
            console.log(err.response)
            Error(err)
        })
    }

    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = myPendingGroupList.filter(item => {
                const startsWith =
                    item.group_name.toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.created_at).toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.group_name.toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.created_at).toLowerCase().includes(value.toLowerCase())

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
            name: 'SL',
            width: '50px',
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Group Name',
            minWidth: '250px',
            sortable: true,
            selector: 'group_name',
            wrap: true
        },
        // {
        //     name: 'Users',
        //     minWidth: '100px',
        //     sortable: true,
        //     selector: row => {
        //         return row.type === 4 ? 'All' : row.type === 1 ? 'Customer' : row.type === 2 ? 'Agent' : row.type === 3 ? 'Merchant' : '---'
        //     }
        // },
        {
            name: 'Group Creation Type',
            minWidth: '150px',
            sortable: true,
            selector: (item) => (item.creation_type === 1 ? <Badge color="light-primary" pill className='px-1'>Bulk-Upload</Badge> : <Badge color="light-success" pill className='px-1'>Group-Profiling</Badge>),
            wrap: true
        },
        {
            name: 'Member Count',
            minWidth: '100px',
            sortable: true,
            selector: 'group_member_count',
            cell: row => {
                if (row['is_loading']) {
                    return <Fragment>{row.group_member_count || 0}&nbsp;<Spinner type='grow' size='sm' /> </Fragment>
                } else {
                    return row.group_member_count || 0
                }     
            }
        },
        {
            name: 'Sync-Type',
            minWidth: '100px',
            selector: row => (row.creation_type === 2 ? row.sync_type : '--'),
            wrap: true
        },
        {
            name: 'Operation',
            minWidth: '150px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Created At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: 'created_at',
            cell: (item) => {
                return item.created_at ? formatReadableDate(item.created_at) : null
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            cell: row => {

                return <Fragment>
                    <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem
                        className='w-100'
                        onClick={() => ViewDetails(row, false)}
                    >
                        <Eye size={14} className='mr-50' color='teal'/>
                        <span className='align-middle'>Details</span>
                    </DropdownItem>
                {/* <DropdownItem
                    className='w-100'
                    onClick={() => {
                        toggleDetailsView()
                        setgroupInfo(row)
                    }}
                >
                    <Eye size={14} className='mr-50' color='teal'/>
                    <span className='align-middle'>View</span>
                </DropdownItem> */}

                <DropdownItem
                    className='w-100'
                    onClick={() => viewContacts(row)}
                >
                    <FileText size={14} className='mr-50' color='teal'/>
                    <span className='align-middle'>View Contacts</span>
                </DropdownItem>

                {
                    !row['is_loading'] ? csvloading && downloadingItem === row['id'] ? null : <DropdownItem 
                    className='w-100' 
                    onClick={() => contactCSVDownload(row['id'])}
                >
                    <Download size={14} className='mr-50' />
                    <span className='align-middle'>Download</span>
                </DropdownItem> : null
                }

                </DropdownMenu>
               </UncontrolledDropdown>
               {
                  csvloading && downloadingItem === row['id'] ? <Spinner size='sm' /> : null
                }
                </Fragment>
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
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Group List', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'ID', dataKey: 'id' }, { header: 'Group Name', dataKey: 'group_name' }, { header: 'Group Type', dataKey: 'type' },
                { header: 'Is Default', dataKey: 'isDefault' }, { header: 'Created at', dataKey: 'created_at' }
            ],
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }
    return (
        <>
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Groups</CardTitle>
                {/* <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(myPendingGroupList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(myPendingGroupList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(myPendingGroupList)}>
                                <File size={15} />
                                <span className='align-middle ml-50'>
                                    PDF
                                </span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </div> */}
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : myPendingGroupList} TableDataLoading={TableDataLoading} />
        </Card>

        </>
    )
}

export default MyPendingGroupList