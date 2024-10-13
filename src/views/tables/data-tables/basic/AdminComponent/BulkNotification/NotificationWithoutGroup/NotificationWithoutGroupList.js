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
import CommonDataTable from '../../ClientSideDataTable'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ViewModal from './ViewModal'

const NotificationWithoutGroupList = () => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [notificationList, setNotificationList] = useState([])
    const [notificationInfo, setNotificationInfo] = useState({})
    useEffect(() => {
        useJwt.getBulkNotificationWithoutGroup().then(res => {
            console.log(res)
            setNotificationList(res.data.payload.NotificationList)
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
        item.email?.toLowerCase().startsWith(value.toLowerCase()) ||
        item.msisdn.toLowerCase().startsWith(value.toLowerCase())

        const includes =
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.email?.toLowerCase().includes(value.toLowerCase()) ||
        item.msisdn.toLowerCase().includes(value.toLowerCase())

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
            minWidth: '50px',
            sortable: true,
            selector: 'title'
        },
        {
            name: 'Email',
            minWidth: '100px',
            sortable: true,
            selector: 'email'
        },
        {
            name: 'MSISDN',
            minWidth: '100px',
            sortable: true,
            selector: 'msisdn'
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
                          onClick={(e) => {
                              setNotificationInfo(row)
                              setModal(true)
                          }}
                      />
                  </span>
              </>
          }
        }
    ]
    const [activeTab, setActiveTab] = useState('1')
    const [activeTab1, setActiveTab1] = useState('1')

  // ** Function to toggle tabs
  const toggle = tab => setActiveTab(tab)
  const toggle1 = tab => setActiveTab1(tab)

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
  doc.text('Notifications Without Group', 14, 10) 
  doc.autoTable({
     body: [...list],
     columns: [
        { header: 'Title', dataKey: 'title' }, { header: 'Body', dataKey: 'body' }, { header: 'Email', dataKey: 'email' },
          { header: 'MSISDN', dataKey: 'msisdn' }
      ],
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
                <span className='align-middle d-none d-sm-block'>Notifications</span>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='1'>
              <Card>
                  <CardHeader className='border-bottom'>
                      <CardTitle tag='h4'>Bulk Notifications without group</CardTitle>
                      {/* {
                        user.role === 'vendor' ? <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkNotificationVendor' >
                        <div className='d-flex align-items-center'>
                                <Plus size={17} style={{marginRight:'5px'}}/>
                                <span >Create Bulk Notification</span>
                        </div>
                        </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBulkNotification' >
                      <div className='d-flex align-items-center'>
                              <Plus size={17} style={{marginRight:'5px'}}/>
                              <span >Create Bulk Notification</span>
                      </div>
                      </Button.Ripple>
                      } */}
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
                  <ViewModal
                      toggleModal={toggleModal}
                      modal={modal}
                      notificationInfo={notificationInfo}
                  />
              </Card>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    )
}

export default NotificationWithoutGroupList