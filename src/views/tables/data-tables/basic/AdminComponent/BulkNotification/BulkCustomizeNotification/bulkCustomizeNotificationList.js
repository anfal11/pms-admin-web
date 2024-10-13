import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useEffect, useState, Fragment } from 'react'
import {
  Eye,
  File,
  FileText,
  Grid,
  Plus,
  Share, Trash
} from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader, CardTitle,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input, Label,
  Nav, NavItem, NavLink,
  Row,
  TabContent, TabPane,
  UncontrolledButtonDropdown
} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../../helper'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
import CommonDataTable from '../../ClientSideDataTable'
import MyCustomizePendingList from './MyCustomizePendingList'
import NeedApproveList from './NeedApproveList'
const MySwal = withReactContent(Swal)

const bulkCustomizeNotificationList = () => {
  const history = useHistory()
  const user = localStorage.getItem('username')
  const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
  const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
  const subMenuIDs = [].concat(...Array2D)

  const [activeTab, setActiveTab] = useState('1')
  const [activeTab1, setActiveTab1] = useState('1')
  // ** Function to toggle tabs
  const toggle = tab => setActiveTab(tab)
  const toggle1 = tab => setActiveTab1(tab)

  const [TableDataLoading, setTableDataLoading] = useState(true)
  const [refreshLoading, setrefreshLoading] = useState(true)
  const [resetData, setReset] = useState(true)
  const [refresh, setRefresh] = useState(1)
  const [BulkSMS, setBulkSMS] = useState([])
  const [bulkEmail, setBulkEmail] = useState([])
  const [pendingBulkSMS, setPendingBulkSMS] = useState([])
  const [pendingApproveList, setPendingApproveList] = useState([])
  const [isPendingDetailsView, setIsPendingDetailsView] = useState(false)
  const [pendingDetails, setPendingDetails] = useState({})

  const [modal, setModal] = useState(false)
  const toggleModal = () => setModal(!modal)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  console.log(BulkSMS)
  console.log(pendingBulkSMS)
  useEffect(() => {
    localStorage.setItem('useBMStoken', false) //for token management
    localStorage.setItem('usePMStoken', false) //for token management

    Promise.all([
      useJwt.bulkSMSList().then(res => {
        setBulkSMS(res.data.payload)
        console.log('sms', res.data.payload)
        setTableDataLoading(false)
      }).catch(err => {
        Error(err)
        console.log(err)
        setTableDataLoading(false)
      }),
      useJwt.pendingBulkSMS().then(res => {
        setPendingBulkSMS(res.data.payload.filter(item => item.created_by_name === user))
        setPendingApproveList(res.data.payload.filter(item => item.created_by_name !== user))
        setTableDataLoading(false)
        setrefreshLoading(false)
      }).catch(err => {
        Error(err)
        setTableDataLoading(false)
        setrefreshLoading(false)
      })
    ])

  }, [resetData])

  const handlePoPupActions = async (row, status, message) => {
    if (row.notification_type === 'sms') {
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
          return useJwt.deleteBulkSMS(row.id).then(res => {
            Success(res)
            console.log(res)
            // setPendingBulkSMS(pendingBulkSMS.filter(x => x.id !== id))
            setReset(!resetData)
          }).catch(err => {
            console.log(err)
            Error(err)
          })
        },
        buttonsStyling: false,
        allowOutsideClick: () => !Swal.isLoading()
      }).then(function (result) {
        if (result.isConfirmed) {

        }
      })
    } else {
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
          return useJwt.deleteBulkEmail(row.id).then(res => {
            Success(res)
            console.log(res)
            // setPendingBulkSMS(pendingBulkSMS.filter(x => x.id !== id))
            setReset(!resetData)
          }).catch(err => {
            console.log(err)
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

  }

  const refreshPendingList = () => {
    setrefreshLoading(true)
    useJwt.pendingBulkSMS().then(res => {
      setPendingBulkSMS(res.data.payload)
      setrefreshLoading(false)
    }).catch(err => {
      Error(err)
      setrefreshLoading(false)
    })
  }
  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = BulkSMS.filter(item => {
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
      name: 'SL',
      width: '50px',
      sortable: true,
      cell: (row, index) => index + 1  //RDT provides index by default
    },
    {
      name: 'Title',
      minWidth: '200px',
      sortable: true,
      selector: 'title',
      wrap: true
    },
    {
      name: 'Notification Type',
      minWidth: '100px',
      sortable: true,
      selector: 'notification_type',
      wrap: true
    },
    {
      name: 'Is Repeat?',
      minWidth: '100px',
      sortable: true,
      selector: row => (
        <div style={{ transform: 'scale(0.6)' }}>
          <CustomInput
            type='switch'
            disabled={true}
            id='isRepeat'
            checked={row.isRepeat}
          />
        </div>
      )
    },
    // {
    //   name: 'Is Rule Base Notification?',
    //   minWidth: '100px',
    //   sortable: true,
    //   selector: row => {
    //     return row.is_rule_base_notification ? 'True' : 'False'
    //   }
    // },
    // {
    //   name: 'Is Scheduled?',
    //   minWidth: '100px',
    //   sortable: true,
    //   selector: row => {
    //     return row.isScheduled ? 'True' : 'False'
    //   }
    // },
    {
      name: 'Is Scheduled?',
      minWidth: '100px',
      sortable: true,
      selector: row => (
        <div style={{ transform: 'scale(0.6)' }}>
          <CustomInput
            type='switch'
            disabled={true}
            id='isScheduled'
            checked={row.isScheduled}
          />
        </div>
      )
    },
    // {
    //   name: 'Schedule Date',
    //   minWidth: '200px',
    //   sortable: true,
    //   selector: row => {
    //     return row.isScheduled ? formatReadableDate(row.effective_date) : '-'
    //   },
    //   wrap: true
    // },
    {
      name: 'Schedule Date',
      minWidth: '200px',
      sortable: true,
      wrap: true,
      sortType: (a, b) => {
        return new Date(b.effective_date) - new Date(a.effective_date)
      },
      selector: 'effective_date',
      cell: (item) => {
        return item.effective_date ? formatReadableDate(item.effective_date) : '--'
      }
    },
    {
      name: 'Target Individual',
      minWidth: '100px',
      sortable: true,
      selector: row => row.count || 0
    },
    {
      name: 'Created By',
      minWidth: '150px',
      sortable: true,
      selector: 'created_by_name',
      wrap: true
    },
    // {
    //   name: 'Created Date',
    //   minWidth: '250px',
    //   sortable: true,
    //   selector: row => {
    //     return formatReadableDate(row.created_at)
    //   },
    //   wrap: true
    // },
    {
      name: 'Created At',
      minWidth: '200px',
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
      name: 'Approved by',
      minWidth: '170px',
      sortable: true,
      selector: 'approved_by',
      wrap: true
    },
    {
      name: 'Action',
      minWidth: '100px',
      // sortable: true,
      selector: row => {
        return <>
          {/* <span title="View">
                <Eye size={15}
                  color='green'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    localStorage.setItem('NotificationInfo', JSON.stringify(row))
                    user.role === 'vendor' ? history.push('/detailsBulkNotificationVendor') : history.push('/detailsBulkNotification')
                  }}
                />
              </span>&nbsp;&nbsp;&nbsp;&nbsp; */}
          <span title="Delete">
            <Trash size={15}
              color='red'
              style={{ cursor: 'pointer' }}
              onClick={(e) => handlePoPupActions(row, 3, 'Do you want to delete?')}
            />
          </span>
        </>
      }
    }
  ]
  return (
    <Fragment>
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
            {subMenuIDs.includes(41) || user.role === 'vendor' ? <NavItem>
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
                      user.role === 'vendor' ? <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkSMSVendor' >
                        <div className='d-flex align-items-center'>
                          <Plus size={17} style={{ marginRight: '5px' }} />
                          <span >Create New</span>
                        </div>
                      </Button.Ripple> : <>{subMenuIDs.includes(41) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createCustomizeNotification' >
                        <div className='d-flex align-items-center'>
                          <Plus size={17} style={{ marginRight: '5px' }} />
                          <span >Create New</span>
                        </div>
                      </Button.Ripple>}</>
                    }
                    {/* <UncontrolledButtonDropdown className='ml-1'>
                          <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(BulkSMS)}>
                              <FileText size={15} />
                              <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(BulkSMS)}>
                              <Grid size={15} />
                              <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(BulkSMS)}>
                              <File size={15} />
                              <span className='align-middle ml-50'>
                                PDF
                              </span>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown> */}
                  </div>
                </CardHeader>
                {/* <Row className='justify-content-end mx-0'>
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
                    </Row> */}
                <CommonDataTable column={column} TableData={searchValue.length ? filteredData : BulkSMS} TableDataLoading={TableDataLoading} />
              </Card>
            </TabPane>
            <TabPane tabId='2'>
              {/* < myPendingNotificationList={myPendingNotificationList} /> */}
              <MyCustomizePendingList pendingBulkSMS={pendingBulkSMS} TableDataLoading={TableDataLoading} setTableDataLoading={setTableDataLoading} refresh={refresh} setRefresh={setRefresh}></MyCustomizePendingList>

            </TabPane>
            <TabPane tabId='3'>
              <NeedApproveList pendingApproveList={pendingApproveList} setPendingApproveList={setPendingApproveList} TableDataLoading={TableDataLoading} setTableDataLoading={setTableDataLoading} resetData={resetData} setReset={setReset}></NeedApproveList>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default bulkCustomizeNotificationList