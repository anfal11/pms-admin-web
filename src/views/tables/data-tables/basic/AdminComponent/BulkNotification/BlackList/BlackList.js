import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
  ChevronDown, Download, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
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
import PendingBlackList from './PendingBlackList'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../../helper'

const BlackList = () => {
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
  const [csvloading, setcsvloading] = useState(false)
  const [downloadingItem, setdownloadingItem] = useState({})
  const [TableDataLoading, setTableDataLoading] = useState(true)
  const [resetData, setReset] = useState(true)
  const [BlackList, setBlackList] = useState([])
  const [pendingBlackList, setPendingBlackList] = useState([])


  useEffect(() => {
    localStorage.setItem('useBMStoken', false) //for token management
    localStorage.setItem('usePMStoken', false) //for token management
    useJwt.allBlackList().then(res => {
      console.log(res)
      setBlackList(res.data.payload)
      setTableDataLoading(false)
    }).catch(err => {
      Error(err)
      console.log(err)
      setTableDataLoading(false)
    })
    useJwt.pendingBlackList().then(async res => {
      console.log(res)
      setPendingBlackList([...res.data.payload])
      setTableDataLoading(false)
    }).catch(err => {
      Error(err)
      console.log(err)
      setTableDataLoading(false)
    })
  }, [resetData])

  const handlePoPupActions = (id, status, message) => {
    return MySwal.fire({
        title: message,
        text: `By deleting, you cannot undo the activity!`,
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        confirmButtonText: 'Continue',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ml-1'
        },
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return useJwt.deleteBlackList(id).then(res => {
                Success(res)
                // setBlackList(BlackList.filter(c => c.id !== id))
                console.log(res)
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
      updatedData = BlackList.filter(item => {
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
  const contactCSVDownload = (group_id) => {

    setcsvloading(true)
    setdownloadingItem(group_id)
    useJwt.exportBlackListCSV({ id: group_id }).then(res => {
        window.open(res.data.payload.csv_url, "_blank")
        setcsvloading(false)
        setdownloadingItem()

    }).catch(err => {
        setcsvloading(false)
        setdownloadingItem()
        console.log(err.response)
        Error(err)
    })

}
  const column = [

    {
      name: 'Group Name',
      minWidth: '250px',
      sortable: true,
      wrap: true,
      selector: Row => {
        return Row.group_name || '---'
      }
    },
    {
      name: 'Members',
      minWidth: '70px',
      sortable: true,
      selector: Row => {
        return Row.contacts.length
      }
    },
    {
      name: 'Action',
      minWidth: '100px',
      // sortable: true,
      selector: row => {
        return <>
          <span title="Edit">
            <Edit size={15}
              color='green'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                user.role === 'vendor' ? history.push('/editBlackListVendor') : history.push(`/editBlackList/${row.id}`)
              }}
            />
          </span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span title="Delete">
            <Trash size={15}
              color='red'
              style={{ cursor: 'pointer' }}
              onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?')}
            />
          </span>&nbsp;&nbsp;&nbsp;&nbsp;
          {
                        csvloading && downloadingItem === row['id'] ? <Spinner size='sm' /> : <Download size={15}
                        style={{ cursor: 'pointer' }}
                        color='#3b3acb'
                        onClick={() => contactCSVDownload(row['id'])}
                        
                    />
                    }
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
    <Card>
      <CardBody className='pt-2'>
        <Nav pills>
          <NavItem>
            <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
              <span className='align-middle d-none d-sm-block'>DND List</span>
            </NavLink>
          </NavItem>
          {subMenuIDs.includes(42) || user.role === 'vendor' ? <NavItem>
            <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
              <span className='align-middle d-none d-sm-block'>DND List Pending Approval</span>
            </NavLink>
          </NavItem> : ''}
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId='1'>
            <Card>
              <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>DND List</CardTitle>
                <div>
                  {
                    user.role === 'vendor' ? <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBlackListVendor' >
                      <div className='d-flex align-items-center'>
                        <Plus size={17} style={{ marginRight: '5px' }} />
                        <span >Create Black List</span>
                      </div>
                    </Button.Ripple> : <>{subMenuIDs.includes(41) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createBlackList' >
                      <div className='d-flex align-items-center'>
                        <Plus size={17} style={{ marginRight: '5px' }} />
                        <span >Create Black List</span>
                      </div>
                    </Button.Ripple>}</>
                  }
                  <UncontrolledButtonDropdown className='ml-1'>
                    <DropdownToggle color='secondary' caret outline>
                      <Share size={15} />
                      <span className='align-middle ml-50'>Export</span>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem className='w-100' onClick={() => downloadCSV(BlackList)}>
                        <FileText size={15} />
                        <span className='align-middle ml-50'>CSV</span>
                      </DropdownItem>
                      <DropdownItem className='w-100' onClick={() => exportToXL(BlackList)}>
                        <Grid size={15} />
                        <span className='align-middle ml-50'>Excel</span>
                      </DropdownItem>
                      <DropdownItem className='w-100' onClick={() => exportPDF(BlackList)}>
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
              <CommonDataTable column={column} TableData={searchValue.length ? filteredData : BlackList} TableDataLoading={TableDataLoading} />
            </Card>
          </TabPane>
          <TabPane tabId='3'>
            <PendingBlackList pendingBlackList={pendingBlackList} setPendingBlackList={setPendingBlackList} resetData={resetData} setReset={setReset}/>
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  )
}

export default BlackList