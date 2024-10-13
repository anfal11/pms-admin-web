import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../../helper'
import CommonDataTable from '../../ClientSideDataTable'

const NotificationList = () => {
    const history = useHistory()
    const user = JSON.parse(localStorage.getItem('userData'))
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [notificationList, setNotificationList] = useState([])
    useEffect(() => {
        setTableDataLoading(false)
        // useJwt.notificationTemplateLogs().then(res => {
        //     console.log('notificationTemplateLogs', res.data.payload)
        //     setNotificationList(res.data.payload)
        //     setTableDataLoading(false)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        // })
    }, [resetData])

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = notificationList.filter(item => {
                const startsWith =
                    String(item.Keyword).toLowerCase().startsWith(value.toLowerCase()) ||
                    String(item.Notification_Template).toLowerCase().startsWith(value.toLowerCase()) ||
                    String(item.Template_Description).toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    String(item.Keyword).toLowerCase().includes(value.toLowerCase()) ||
                    String(item.Notification_Template).toLowerCase().includes(value.toLowerCase()) ||
                    String(item.Template_Description).toLowerCase().includes(value.toLowerCase())

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
            name: 'Keyword',
            minWidth: '70px',
            sortable: true,
            selector: 'Keyword'
        },
        {
            name: 'Notification Template',
            minWidth: '250px',
            sortable: true,
            selector: 'Notification_Template'
        },
        {
            name: 'Template Description',
            minWidth: '250px',
            sortable: true,
            selector: 'Template_Description'
        },
        {
            name: 'Templete Type',
            minWidth: '250px',
            sortable: true,
            selector: 'Templete_Type'
        },
        {
            name: 'Send Sms',
            minWidth: '50px',
            sortable: true,
            selector: 'SendSms'
        },
        {
            name: 'Msg For',
            minWidth: '50px',
            sortable: true,
            selector: 'MsgFor'
        },
        {
            name: 'Language',
            minWidth: '80px',
            sortable: true,
            selector: 'Language'
        },
        {
            name: 'Is Financial',
            minWidth: '50px',
            sortable: true,
            selector: 'Is_Financial'
        },
        {
            name: 'Has Unicode',
            minWidth: '50px',
            sortable: true,
            selector: 'HasUnicode'
        },
        {
            name: 'Modified By',
            minWidth: '100px',
            sortable: true,
            selector: 'Modified_By'
        },
        {
            name: 'Modified Date',
            minWidth: '250px',
            sortable: true,
            selector: row => formatReadableDate(row.Modified_Date)
        },
        {
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => formatReadableDate(row.Created_Date)
        },
        {
            name: 'Action',
            minWidth: '60px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="View">
                        <Edit size={15}
                            color='green'
                            style={{ cursor: 'pointer' }}
                            onClick={() => { }}
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
                    result += item.group_info.Group
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
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Notifications', 14, 10)
        const flist = list.map(l => { return { ...l, ...l.group_info } })
        doc.autoTable({
            body: [...flist],
            columns: [{ header: 'Notification_ID', dataKey: 'Notification_ID' }, { header: 'Notification_Template', dataKey: 'Notification_Template' }, { header: 'Template_Description', dataKey: 'Template_Description' }, { header: 'Templete_Type', dataKey: 'Templete_Type' }, { header: 'Keyword', dataKey: 'Keyword' }, { header: 'Is_Financial', dataKey: 'Is_Financial' }, { header: 'SendSms', dataKey: 'SendSms' }, { header: 'Modified_By', dataKey: 'Modified_By' }],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }
    return (
        <Card>
            {/* {
    "Notification_ID": 1,
    "Keyword": "ADCT",
    "Notification_Template": "",
    "Templete_Type": "",
    "Template_Description": "",
    "Language": "English",
    "HasUnicode": false,
    "Is_Financial": "Y",
    "SendSms": "Y",
    "MsgFor": "A-A",
    "Modified_By": "admin"
            } */}
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Notification Template Log</CardTitle>
                <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(notificationList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(notificationList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(notificationList)}>
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
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' sm='3'>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            placeholder='Search'
                            bsSize='sm'
                            id='search-input'
                            value={searchValue}
                            onChange={handleFilter}
                        />
                    </Col>
                </Row>
                <CommonDataTable column={column} TableData={searchValue.length ? filteredData : notificationList} TableDataLoading={TableDataLoading} />
            </CardBody>
        </Card>
    )
}

export default NotificationList