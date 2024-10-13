import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, XSquare, CheckSquare, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../helper'

const PendingNotificationList = ({pendingNotificationList, setPendingNotificationList, resetData, setReset}) => {
    const history = useHistory()
    const user = JSON.parse(localStorage.getItem('userData'))
    const [TableDataLoading, setTableDataLoading] = useState(false)
    const [notificationInfo, setNotificationInfo] = useState({})
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

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
                    action_id : status,
                    notification_id : id
                }
                return useJwt.bulkNotificationApproveRejectDelete(data).then(res => {
                    Success(res)
                    console.log(res)
                    setPendingNotificationList(pendingNotificationList.filter(x => x.id !== id))
                    setReset(!resetData)
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
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)
    
        if (value.length) {
        updatedData = pendingNotificationList.filter(item => {
            const startsWith =
            item.title.toLowerCase().startsWith(value.toLowerCase()) ||
            item.group_info?.group_name?.toLowerCase().startsWith(value.toLowerCase()) ||
            item.created_by_name.toLowerCase().startsWith(value.toLowerCase()) 
    
            const includes =
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.group_info?.group_name?.toLowerCase().includes(value.toLowerCase()) ||
            item.created_by_name.toLowerCase().includes(value.toLowerCase()) 
    
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
            name: 'Title',
            width: '100px',
            sortable: true,
            wrap: true,
            selector: 'title'
          },
        {
            name: 'Group Name',
            minWidth: '250px',
            sortable: true,
            selector: Row => {
                return Row.group_info ? Row.group_info['group_name'] : ''
              }
        },
        {
            name: 'Is AD?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
              return row.is_Ad ? 'True' : 'False'
            }
          },
          {
            name: 'Is Repeat?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
              return row.isRepeat ? 'True' : 'False'
            }
          },
          {
            name: 'Is Rule Base Notification?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
              return row.is_rule_base_notification ? 'True' : 'False'
            }
          },
          {
            name: 'Is Scheduled?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
              return row.isScheduled ? 'True' : 'False'
            }
          },
        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by_name'
        },
        {
            name: 'Created Date',
            minWidth: '240px',
            sortable: true,
            selector: row => {
              return formatReadableDate(row.created_at)
            }
          },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="View">
                        <Eye size={15}
                            color='green'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                localStorage.setItem('NotificationInfo', JSON.stringify(row))
                                user.role === 'vendor' ? history.push('/detailsBulkNotificationVendor') : history.push('/detailsBulkNotification')
                              }}
                        />
                     </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 1, 'Do you want to approve?')}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 2, 'Do you want to reject?')}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?')}
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
    
            if (key === 'group_info') {
            result += item.group_info?.group_name
            } else if (key === 'channel_info') {
            let sr = ''
            Object.keys(item.channel_info).map(k => { if (item.channel_info[k]) sr += ` ${k}` })
            result += sr
            } else {
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
        doc.text('Pending Notifications', 14, 10) 
        const flist = list.map(l => { return { ...l, ...l.group_info } })
        doc.autoTable({
        body: [...flist],
        columns: [
            { header: 'Title', dataKey: 'title' }, { header: 'Body', dataKey: 'body' }, { header: 'Group Name', dataKey: 'group_name' },
                { header: 'Approved by', dataKey: 'approved_by' }, { header: 'Created By', dataKey: 'created_by_name' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Approval(s)</CardTitle>
                <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(pendingNotificationList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(pendingNotificationList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(pendingNotificationList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingNotificationList} TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default PendingNotificationList