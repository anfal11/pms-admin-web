import React, { Fragment, useEffect, useState, useMemo } from 'react'
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
import TemplateLogs from './Logs'

const NotificationList = () => {
    const history = useHistory()
    const user = JSON.parse(localStorage.getItem('userData'))
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const [activeTab, setActiveTab] = useState('1')
    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [notificationList, setNotificationList] = useState([])
    useEffect(() => {
        setTableDataLoading(false)
        // useJwt.notificationTemplateList().then(res => {
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
            minWidth: '350px',
            sortable: true,
            cell: (row, i) => <Input
                className='p-0'
                type='textarea'
                // placeholder='Search'
                id={`${row.Notification_Template}-${i}`}
                value={row.Notification_Template}
                onChange={e => {
                    const copyData = [...notificationList.map(item => { return item.Notification_ID === row.Notification_ID ? { ...item, Notification_Template: e.target.value } : item })]
                    // console.log(copyData, e.target.value)
                    setNotificationList(() => copyData)
                }}
            />
        },
        {
            name: 'Template Description',
            minWidth: '250px',
            sortable: true,
            selector: 'Template_Description'
        },
        {
            name: 'Templete Type',
            minWidth: '150px',
            sortable: true,
            selector: 'Templete_Type'
        },
        {
            name: 'Send Sms',
            minWidth: '100px',
            sortable: true,
            selector: 'SendSms',
            cell: (row, i) => <CustomInput
                type='switch'
                id={`${row.Notification_Template}-${i + 10000}`}
                //  name='RTL'
                checked={row.SendSms === 'Y'}
                onChange={e => {
                    const copyData = [...notificationList.map(item => { return item.Notification_ID === row.Notification_ID ? { ...item, SendSms: e.target.checked ? 'Y' : 'N' } : item })]
                    // console.log(copyData, e.target.checked)
                    setNotificationList(() => copyData)
                }}
            />
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
            minWidth: '120px',
            // sortable: true,
            selector: row => <Button.Ripple className='' color='primary' size='sm' disabled={row.loading} onClick={() => {
                // const copyData = notificationList.map(x => { return x.Notification_ID === row.Notification_ID ? { ...x, Notification_ID: row.Notification_ID, Notification_Template: row.Notification_Template, SendSms: row.SendSms, loading: true } : x })
                // setNotificationList(copyData)
                const { Notification_ID, Keyword, Notification_Template, Templete_Type, Template_Description, Language, HasUnicode, Is_Financial, SendSms, MsgFor } = row

                const Modified_By = JSON.parse(localStorage.getItem('userData')).username

                console.log({ Notification_ID, Keyword, Notification_Template, Templete_Type, Template_Description, Language, HasUnicode, Is_Financial, SendSms, MsgFor, Modified_By })

                // useJwt.notificationTemplateEdit({ Notification_ID, Keyword, Notification_Template, Templete_Type, Template_Description, Language, HasUnicode, Is_Financial, SendSms, MsgFor, Modified_By }).then(res => {
                //     console.log('notificationTemplateEdit', res.data.payload)
                //     Success(res)
                // }).catch(err => {
                //     Error(err)
                //     console.log(err)
                // }).finally(() => {
                //     const copyData = notificationList.map(x => { return x.Notification_ID === row.Notification_ID ? { ...x, Notification_ID: row.Notification_ID, Notification_Template: row.Notification_Template, SendSms: row.SendSms, loading: false } : x })
                //     setNotificationList(copyData)
                // })
            }}>
                {row.loading ? 'loading' : 'update'}
            </Button.Ripple>
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
      <CardBody className='pt-2'>
        <Nav pills>
          <NavItem>
            <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
              <span className='align-middle d-none d-sm-block'>Notification Management</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
              <span className='align-middle d-none d-sm-block'>Template Logs</span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId='1'>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Reward Notification Management</CardTitle>
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
                    {/* <Row className='justify-content-end mx-0'>
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
                    </Row> */}
                    <CommonDataTable column={useMemo(() => column, [notificationList.length])} TableData={searchValue.length ? filteredData : notificationList} TableDataLoading={TableDataLoading} />
                </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId='3'>
             <TemplateLogs/>
          </TabPane>
        </TabContent>
        </CardBody>
    </Card>
    )
}

export default NotificationList