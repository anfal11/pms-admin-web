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
import PendingADList from './PendingAdList'
import MyPendingADList from './MyPendingAdList'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import {formatReadableDate} from '../../../../../helper'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import EditModal from './EditModal'

const ADList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [adList, setadList] = useState([])
    const [myPendingadList, setMyPendingadList] = useState([])
    const [pendingadList, setPendingadList] = useState([])
    const [adInfo, setAdInfo] = useState({})
    const [campaignList, setcampaignList] = useState([])

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const userData = JSON.parse(localStorage.getItem('userData'))
    useEffect(async() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.adList().then(res => {
            console.log(res)
            const allAds = []
            const allPendingAds = []
            const myPendingAds = []
            for (const q of res.data.payload) {
                if (q.is_approved === true || q.is_rejected === true) {
                    allAds.push(q)
                } else if (q.is_approved === false && q.is_rejected === false && parseInt(q.action_by) === userData.id) {
                    myPendingAds.push(q)
                } else if (q.is_approved === false && q.is_rejected === false && parseInt(q.action_by) !== userData.id) {
                    allPendingAds.push(q)
                }
            }
            setadList(allAds)
            setMyPendingadList(myPendingAds)
            setPendingadList(allPendingAds)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })

        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', true)
        await useJwt.campaignList().then(res => {
            console.log('campaignList', res)
            setcampaignList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response?.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                    localStorage.setItem('BMStoken', res.data.jwtToken)
                    localStorage.setItem("BMSCall", false)
                    setReset(!resetData)
                }).catch(err => {
                    localStorage.setItem("BMSCall", false)
                    console.log(err)
                })
            } else {
                Error(err)
            }
            console.log(err)
            localStorage.setItem('useBMStoken', false)
        })
    }, [resetData])
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
                    ad_id: id,
                    action_id: status,
                    reject_msg : ""
                }
                return useJwt.approveRejectDeleteAd(data).then(res => {
                    Success(res)
                    setadList(adList.filter(x => x.id !== id))
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
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = adList.filter(item => {
            const startsWith =
            item.title.toLowerCase().startsWith(value.toLowerCase()) ||
            item.approved_by.toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toString().toLowerCase().startsWith(value.toLowerCase()) ||
            item.created_by_name.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.approved_by.toLowerCase().includes(value.toLowerCase()) ||
            formatReadableDate(item.created_at).toString().toLowerCase().includes(value.toLowerCase()) ||
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
            name: 'SL',
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Title',
            minWidth: '250px',
            sortable: true,
            selector: 'title'
        },
        {
            name: 'Status',
            minWidth: '130px',
            sortable: true,
            selector: row => {
                return row.is_approved ? <Badge pill color='success' className='badge-center'>
                Approved
              </Badge> : <Badge pill color='danger' className='badge-center'>
                Rejected
              </Badge>
            }
        },
        {
            name: 'Checked by',
            minWidth: '170px',
            sortable: true,
            selector: 'approved_by'
        },
        {
            name: 'Created by',
            minWidth: '170px',
            sortable: true,
            selector: 'created_by_name'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,     
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: row => {
                return row.created_at ? formatReadableDate(row.created_at) : ''
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                 {
                      (subMenuIDs.includes(32) || userData?.role === 'vendor') &&  row.is_approved && <span title="Edit">
                         <Edit size={15}
                             color='teal'
                             style={{ cursor: 'pointer' }}
                             onClick={(e) => {
                                 setAdInfo(row)
                                 setModal(true)
                             }}
                         />
                     </span>
                     }&nbsp;&nbsp;&nbsp;&nbsp;
                    {(subMenuIDs.includes(32) || userData?.role === 'vendor') && <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?')}
                        />
                    </span>}
                </>
            }
        }
    ]
    const [activeTab, setActiveTab] = useState('1')

  // ** Function to toggle tabs
  const toggle = tab => setActiveTab(tab)

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
    doc.text('All ADs', 14, 10) 
    doc.autoTable({
       body: [...list],
       columns: [{ header: 'title', dataKey: 'title' }, { header: 'body', dataKey: 'body' }, { header: 'created_by_name', dataKey: 'created_by_name' }, { header: 'created_at', dataKey: 'created_at' }], 
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
                  <span className='align-middle d-none d-sm-block'>ADs</span>
                </NavLink>
              </NavItem>
              {(subMenuIDs.includes(33) || userData?.role === 'vendor') && <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                  <span className='align-middle d-none d-sm-block'>My AD Requests</span>
                </NavLink>
              </NavItem>}
              {(subMenuIDs.includes(34) || userData?.role === 'vendor') && <NavItem>
                <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                  <span className='align-middle d-none d-sm-block'>Approve ADs</span>
                </NavLink>
              </NavItem>}
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>All ADs</CardTitle>
                        <div>
                            {(subMenuIDs.includes(31) || userData?.role === 'vendor') && <Button.Ripple className='ml-2' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/creatAdVendor' : '/creatAd'} >
                            <div className='d-flex align-items-center'>
                                    <Plus size={17} style={{marginRight:'5px'}}/>
                                    <span >Create AD</span>
                            </div>
                            </Button.Ripple>}
                            <UncontrolledButtonDropdown className='ml-1'>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(adList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportToXL(adList)}>
                                    <Grid size={15} />
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportPDF(adList)}>
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
                    <CommonDataTable column={column} TableData={searchValue.length ? filteredData : adList} TableDataLoading={TableDataLoading} />
                    <EditModal
                            toggleModal={toggleModal}
                            modal={modal}
                            resetData={resetData}
                            setReset={setReset}
                            adInfo={adInfo}
                            setAdInfo={setAdInfo}
                            campaignList={campaignList}
                        />
                </Card>
              </TabPane>
              <TabPane tabId='2'>
                <MyPendingADList myPendingadList={myPendingadList} />
              </TabPane>
              <TabPane tabId='3'>
                <PendingADList pendingadList={pendingadList} setPendingadList={setPendingadList} resetData={resetData} setReset={setReset}/>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
    )
}

export default ADList