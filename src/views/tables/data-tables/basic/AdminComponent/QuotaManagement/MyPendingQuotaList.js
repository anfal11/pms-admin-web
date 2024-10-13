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

const MyPendingQuotaList = ({ myPendingQuotaList }) => {
    const [TableDataLoading, setTableDataLoading] = useState(false)
    const [resetData, setReset] = useState(true)

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = myPendingQuotaList.filter(item => {
                const startsWith =
                    item.title?.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.facebook.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.whatsapp.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.sms.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.email.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.push_notification.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.instagram.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.google.toString().toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.title?.toLowerCase().includes(value.toLowerCase()) ||
                    item.facebook.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.whatsapp.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.sms.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.email.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.push_notification.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.instagram.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.google.toString().toLowerCase().includes(value.toLowerCase())

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
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Title',
            minWidth: '100px',
            sortable: true,
            selector: 'title'
        },
        {
            name: 'Total Budget',
            minWidth: '100px',
            sortable: true,
            selector: 'total_budget'
        },
        {
            name: 'Facebook',
            minWidth: '100px',
            sortable: true,
            selector: 'facebook'
        },
        {
            name: 'Google',
            minWidth: '100px',
            sortable: true,
            selector: 'google'
        },
        {
            name: 'Whatsapp',
            minWidth: '100px',
            sortable: true,
            selector: 'whatsapp'
        },
        {
            name: 'SMS',
            minWidth: '100px',
            sortable: true,
            selector: 'sms'
        },
        {
            name: 'Email',
            minWidth: '100px',
            sortable: true,
            selector: 'email'
        },
        {
            name: 'Push Notification',
            minWidth: '100px',
            sortable: true,
            selector: 'push_notification'
        },
        {
            name: 'Instagram',
            minWidth: '100px',
            sortable: true,
            selector: 'instagram'
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
        doc.text('My Pending Quotas', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Title', dataKey: 'title' }, { header: 'Total Budget', dataKey: 'total_budget' }, { header: 'Created By', dataKey: 'created_by_name' }, { header: 'Status', dataKey: 'is_approved' }, { header: 'Facebook', dataKey: 'facebook' }, { header: 'Google', dataKey: 'google' }, { header: 'SMS', dataKey: 'sms' },
                { header: 'Whatsapp', dataKey: 'whatsapp' }, { header: 'Email', dataKey: 'email' }, { header: 'Instagram', dataKey: 'instagram' }, { header: 'Push Notification', dataKey: 'push_notification' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>My Pending List</CardTitle>
                <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(myPendingQuotaList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(myPendingQuotaList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(myPendingQuotaList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : myPendingQuotaList} TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default MyPendingQuotaList