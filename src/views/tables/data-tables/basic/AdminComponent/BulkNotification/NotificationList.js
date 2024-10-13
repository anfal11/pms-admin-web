import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
  ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
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
import PendingNotificationList from './PendingNotificationList'
import MyPendingNotificationList from './MyPendingNotificationList'
import NotificationWithoutGroupList from './NotificationWithoutGroup/NotificationWithoutGroupList'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../helper'
import reportIcon from '../../../../../../assets/images/icons/report.png'
import NotificationReport from './NotificationReport'


const NotificationList = () => {
  const history = useHistory()
  const user = JSON.parse(localStorage.getItem('userData'))
  const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
  const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
  const subMenuIDs = [].concat(...Array2D)

  const [activeTab, setActiveTab] = useState('1')
  const [activeTab1, setActiveTab1] = useState('1')
  // ** Function to toggle tabs
  const toggle = tab => setActiveTab(tab)
  const toggle1 = tab => setActiveTab1(tab)

  const [viewReport, setviewReport] = useState(false)
  const [selectedNotificationId, setselectedNotificationId] = useState(0)
  const [TableDataLoading, setTableDataLoading] = useState(true)
  const [resetData, setReset] = useState(true)
  const [notificationList, setNotificationList] = useState([])
  const [myPendingNotificationList, setMyPendingNotificationList] = useState([])
  const [pendingNotificationList, setPendingNotificationList] = useState([])
  useEffect(() => {
    localStorage.setItem('useBMStoken', false) //for token management
    localStorage.setItem('usePMStoken', false) //for token management
    useJwt.getBulkNotificationList().then(res => {
      console.log(res)
      setNotificationList(res.data.payload.NotificationList)
      setMyPendingNotificationList(res.data.payload.myPendingNotificationList)
      setPendingNotificationList(res.data.payload.PendingNotificationList)
      setTableDataLoading(false)
    }).catch(err => {
      Error(err)
      console.log(err)
      setTableDataLoading(false)
    })
  }, [resetData])

  const [modal, setModal] = useState(false)
  const toggleModal = () => setModal(!modal)
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
          item.title.toLowerCase().startsWith(value.toLowerCase()) ||
          item.group_info?.group_name?.toLowerCase().startsWith(value.toLowerCase()) ||
          item.created_by_name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.approved_by.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.group_info?.group_name?.toLowerCase().includes(value.toLowerCase()) ||
          item.created_by_name.toLowerCase().includes(value.toLowerCase()) ||
          item.approved_by.toLowerCase().includes(value.toLowerCase())

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
      minWidth: '150px',
      sortable: true,
      selector: Row => {
        return Row.group_info?.group_name || '---'
      }
    },
    {
      name: 'Channels',
      minWidth: '250px',
      selector: row => {
        const tempChannel = []
        if (row.channel_info) {
          if (row.channel_info.email) {
            tempChannel.push('Email ')
          }
          if (row.channel_info.sms) {
            tempChannel.push('SMS ')
          }
          if (row.channel_info.fb_page_post) {
            tempChannel.push('Fb Page Post ')
          }
          if (row.channel_info.instagram) {
            tempChannel.push('Instagram ')
          }
          if (row.channel_info.push_notification) {
            tempChannel.push('Push Notification ')
          }
          if (row.channel_info.twitter) {
            tempChannel.push('Twitter ')
          }
          if (row.channel_info.whatsapp) {
            tempChannel.push('Whatsapp ')
          }
        }
        return tempChannel.toString()
      }
    },
    {
      name: 'FB Page Post Status',
      minWidth: '150px',
      sortable: true,
      selector: row => {
        return (row.facebook_notification_status && row.facebook_notification_status?.toString() === '201') ? <Badge color='success' pill>Posted</Badge> : <Badge color='danger' pill>Posting Failed</Badge>
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
      name: 'Created By',
      minWidth: '100px',
      sortable: true,
      selector: 'created_by_name'
    },
    {
      name: 'Created Date',
      minWidth: '250px',
      sortable: true,
      selector: row => {
        return formatReadableDate(row.created_at)
      }
    },
    {
      name: 'Approved by',
      minWidth: '170px',
      sortable: true,
      selector: 'approved_by'
    },
    {
      name: 'Action',
      minWidth: '100px',
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
          </span>&nbsp;&nbsp;
          <span title="Report">
              <img 
                  width={'21px'} 
                  style={{color: 'red', cursor:'pointer'}} 
                  src={reportIcon}
                  onClick={() => {
                    setselectedNotificationId(row.id)
                    setviewReport(true)
                  }}
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
          result += item.group_info.group_name
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
      columns: [
        { header: 'Title', dataKey: 'title' }, { header: 'Body', dataKey: 'body' }, { header: 'Group Name', dataKey: 'group_name' },
        { header: 'Approved by', dataKey: 'approved_by' }, { header: 'Created By', dataKey: 'created_by_name' }
      ],
      styles: { cellPadding: 1.5, fontSize: 8 }
    })
    doc.save('export.pdf')
  }
  return (
    viewReport ? <NotificationReport toggleModal={setviewReport} notificationId={selectedNotificationId}/> : <Fragment>
    <Card>
      <CardBody className='pt-2'>
        <Nav pills>
          <NavItem>
            <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
              <span className='align-middle d-none d-sm-block'>Outreach Campaign List</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
              <span className='align-middle d-none d-sm-block'>My Pending Campaigns</span>
            </NavLink>
          </NavItem>
          {subMenuIDs.includes(42) || user.role === 'vendor' ? <NavItem>
            <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
              <span className='align-middle d-none d-sm-block'>Pending Approval(s)</span>
            </NavLink>
          </NavItem> : ''}
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId='1'>
            <Card>
              <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Outreach Campaign List</CardTitle>
                <div>
                  {
                    user.role === 'vendor' ? <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkNotificationVendor' >
                      <div className='d-flex align-items-center'>
                        <Plus size={17} style={{ marginRight: '5px' }} />
                        <span >Create Bulk Notification</span>
                      </div>
                    </Button.Ripple> : <Fragment>
                      {
                      subMenuIDs.includes(41) && <Fragment>
                            <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkNotificationv2' >
                          <div className='d-flex align-items-center'>
                            <Plus size={17} style={{ marginRight: '5px' }} />
                            <span >Create Bulk Notification</span>
                          </div>
                        </Button.Ripple>
                        {/* <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkNotification' >
                          <div className='d-flex align-items-center'>
                            <Plus size={17} style={{ marginRight: '5px' }} />
                            <span >Create Bulk Notification</span>
                          </div>
                        </Button.Ripple> */}
                      </Fragment>
                    }
                    </Fragment>
                  }
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
              <CommonDataTable column={column} TableData={searchValue.length ? filteredData : notificationList} TableDataLoading={TableDataLoading} />
            </Card>
          </TabPane>
          <TabPane tabId='2'>
            <MyPendingNotificationList myPendingNotificationList={myPendingNotificationList} />
          </TabPane>
          <TabPane tabId='3'>
            <PendingNotificationList pendingNotificationList={pendingNotificationList} setPendingNotificationList={setPendingNotificationList} resetData={resetData} setReset={setReset}/>
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
    {/* // <Card>
    //   <CardBody className='pt-2'>
    //     <Nav pills>
    //       <NavItem>
    //         <NavLink active={activeTab1 === '1'} onClick={() => toggle1('1')}>
    //           <span className='align-middle d-none d-sm-block'>Notification With Group</span>
    //         </NavLink>
    //       </NavItem>
    //       <NavItem>
    //         <NavLink active={activeTab1 === '2'} onClick={() => toggle1('2')}>
    //           <span className='align-middle d-none d-sm-block'>Notification Without Group</span>
    //         </NavLink>
    //       </NavItem>
    //     </Nav>
    //     <TabContent activeTab={activeTab1}>
    //       <TabPane tabId='1'>

    //       </TabPane>
    //       <TabPane tabId='2'>
    //         <NotificationWithoutGroupList />
    //       </TabPane>
    //     </TabContent >
    //   </CardBody >
    // </Card > */}
    </Fragment>
  )
}

export default NotificationList