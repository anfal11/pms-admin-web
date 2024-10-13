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
import PendingBulkSMS from './PendingBulkSMS'
import ViewPendingDetails from './ViewPendingDetails'
const MySwal = withReactContent(Swal)

const BulkSmsList = () => {
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

  const [TableDataLoading, setTableDataLoading] = useState(true)
  const [refreshLoading, setrefreshLoading] = useState(true)
  const [resetData, setReset] = useState(true)
  const [BulkSMS, setBulkSMS] = useState([])
  const [pendingBulkSMS, setPendingBulkSMS] = useState([])
  const [isPendingDetailsView, setIsPendingDetailsView] = useState(false)
  const [pendingDetails, setPendingDetails] = useState({})


  useEffect(() => {
    localStorage.setItem('useBMStoken', false) //for token management
    localStorage.setItem('usePMStoken', false) //for token management

    Promise.all([
      useJwt.bulkSMSList().then(res => {
        setBulkSMS(res.data.payload)
        setTableDataLoading(false)
      }).catch(err => {
        Error(err)
        console.log(err)
        setTableDataLoading(false)
      }),

      useJwt.pendingBulkSMS().then(res => {
        setPendingBulkSMS(res.data.payload)
        setTableDataLoading(false)
        setrefreshLoading(false)
      }).catch(err => {
        Error(err)
        setTableDataLoading(false)
        setrefreshLoading(false)
      })
    ])

  }, [resetData])

  const [modal, setModal] = useState(false)
  const toggleModal = () => setModal(!modal)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

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
  const handlePoPupActions = async (id, status, message) => {
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
            return useJwt.deleteBulkSMS(id).then(res => {
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
      selector: 'title',
      wrap: true
    },
    {
      name: 'Is Repeat?',
      minWidth: '100px',
      sortable: true,
      selector: row => {
        return row.isRepeat ? 'True' : 'False'
      }
    },
    // {
    //   name: 'Is Rule Base Notification?',
    //   minWidth: '100px',
    //   sortable: true,
    //   selector: row => {
    //     return row.is_rule_base_notification ? 'True' : 'False'
    //   }
    // },
    {
      name: 'Is Scheduled?',
      minWidth: '100px',
      sortable: true,
      selector: row => {
        return row.isScheduled ? 'True' : 'False'
      }
    },
    {
      name: 'Entry Count',
      minWidth: '100px',
      sortable: true,
      selector: row => row.count || 0
    },
    {
      name: 'Created By',
      minWidth: '100px',
      sortable: true,
      selector: 'created_by_name',
      wrap: true
    },
    {
      name: 'Created Date',
      minWidth: '250px',
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
        isPendingDetailsView ? <Fragment>
             <ViewPendingDetails details={pendingDetails} setIsDetailsView={setIsPendingDetailsView}/>
        </Fragment> : <Fragment>
          <Card>
            <CardBody className='pt-2'>
              <Nav pills>
                <NavItem>
                  <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                    <span className='align-middle d-none d-sm-block'>Bulk SMS</span>
                  </NavLink>
                </NavItem>
                {subMenuIDs.includes(42) || user.role === 'vendor' ? <NavItem>
                  <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                    <span className='align-middle d-none d-sm-block'>Approve Bulk SMS</span>
                  </NavLink>
                </NavItem> : ''}
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <Card>
                    <CardHeader className='border-bottom'>
                      <CardTitle tag='h4'>Bulk SMS</CardTitle>
                      <div>
                        {
                          user.role === 'vendor' ? <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkSMSVendor' >
                            <div className='d-flex align-items-center'>
                              <Plus size={17} style={{ marginRight: '5px' }} />
                              <span >Create Bulk SMS</span>
                            </div>
                          </Button.Ripple> : <>{subMenuIDs.includes(41) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkSMS' >
                            <div className='d-flex align-items-center'>
                              <Plus size={17} style={{ marginRight: '5px' }} />
                              <span >Create Bulk SMS</span>
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
                <TabPane tabId='3'>
                  <PendingBulkSMS setDetails={setPendingDetails} isDetailsView={isPendingDetailsView} setIsDetailsView={setIsPendingDetailsView} refreshPendingList={refreshPendingList} refreshLoading={refreshLoading} pendingBulkSMS={pendingBulkSMS} setPendingBulkSMS={setPendingBulkSMS} resetData={resetData} setReset={setReset}/>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Fragment>
    
  )
}

export default BulkSmsList