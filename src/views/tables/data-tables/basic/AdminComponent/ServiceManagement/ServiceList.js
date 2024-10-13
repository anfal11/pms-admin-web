import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CommonDataTable from '../ClientSideDataTable'
import EditModal from './EditModal'
import PendingServiceList from './PendingServiceList'
import {BMS_USER, BMS_PASS, CURRENCY_SYMBOL} from '../../../../../../Configurables'
import ApproveRejectModal from './ApproveRejectModal'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const ServiceList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const [action, setAction] = useState(0)
    const username = localStorage.getItem('username')

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [pendingServiceList, setpendingServiceList] = useState([])
    const [serviceList, setserviceList] = useState([])
    const [serviceInfo, setserviceInfo] = useState({})
    const [serviceLogicList, setserviceLogicList] = useState([])
    const [serviceLogicInfo, setserviceLogicInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const [modal1, setModal1] = useState(false)
    const toggleModal1 = () => setModal1(!modal1)

    useEffect(() => {
        setTableDataLoading(true)
        Promise.all([
            useJwt2.getServiceList().then(res => {
                setserviceList(res.data.payload)
            }).catch(err => {
                Error(err)        
            }),
            useJwt2.getPendingServiceList().then(res => {
                setpendingServiceList(res.data.payload)
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => {
            setTableDataLoading(false)
        })
    }, [resetData])

    const handlePoPupActions = (id, message) => {
        localStorage.setItem('useBMStoken', true)
        return MySwal.fire({
            title: message,
            text: `This service will be deleted with it's service logic. You won't be able to revert this`,
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
                return useJwt.deleteService(id).then(res => {
                    // Success(res)
                    setReset(!resetData)
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
                useJwt.deleteServiceLogic(serviceLogicList.find(s => s.serviceId === id)?.id).then(res => {
                    Success(res)
                    console.log(res)
                    localStorage.setItem('useBMStoken', false)
                }).catch(err => {
                    localStorage.setItem('useBMStoken', false)
                    console.log(err.response)
                    Error(err)
                })
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
            updatedData = serviceList.filter(item => {
                const startsWith =
                item.service_id.toLowerCase().startsWith(value.toLowerCase()) ||
                item.service_keyword.toLowerCase().startsWith(value.toLowerCase()) 

                const includes =
                item.service_id.toLowerCase().includes(value.toLowerCase()) ||
                item.service_keyword.toLowerCase().includes(value.toLowerCase())

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

    const onAction = (e, row, action) => {
        let pendingExist = false, pendingDataInfo = {}
        pendingServiceList.map(item => {
            if (item.foreign_id === row.service_id) {
                pendingExist = true
                pendingDataInfo = item
            }
        })
        if (pendingExist) {
            return MySwal.fire({
                title: 'You can not update!',
                text: `The service has already requested for ${pendingDataInfo['operation_type'] === 2 ? 'Update' : pendingDataInfo['operation_type'] ? 'Delete' : ''} by ${pendingDataInfo['modify_by']?.toUpperCase() === username.toUpperCase() ? 'you' : pendingDataInfo['modify_by']}.`,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: false,
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-danger ml-1'
                },
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return 0
                },
                buttonsStyling: false,
                allowOutsideClick: () => !Swal.isLoading()
            }).then(function (result) {
                if (result.isConfirmed) {}
            })
        }
        
        // Edit trigger...
        if (action === 1) {
            setserviceInfo(row)
            setserviceLogicInfo(row)
            setModal(true)
        } else {
            // delete trigger...
            return MySwal.fire({
                title: 'Are you sure?',
                text: `The service will be deleted along with all campaigns where it was tagged.`,
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
                    return useJwt2.deleteServiceKeyword({serviceId:row.service_id}).then(res => {
                        Success(res)
                        setReset(!resetData)
                    }).catch(err => {
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

    const column = [
        {
            name: 'SL',
            width: '50px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Service Id',
            minWidth: '50px',
            sortable: true,
            selector: 'service_id'
        },
        {
            name: 'Service Keyword',
            minWidth: '150px',
            sortable: true,
            selector: 'service_keyword',
            wrap: true
        },
        {
            name: 'Keyword Description',
            minWidth: '200px',
            sortable: true,
            selector: 'keyword_description',
            wrap: true
        },
        {
            name: 'Minimum',
            minWidth: '70px',
            sortable: true,
            selector: (row) => `${CURRENCY_SYMBOL} ${row.minimum}`,
            wrap: true
        },
        {
            name: 'Maximum',
            minWidth: '70px',
            sortable: true,
            selector: (row) => `${CURRENCY_SYMBOL} ${row.maximum}`,
            wrap: true
        },
        {
            name: 'Financial',
            minWidth: '70px',
            sortable: true,
            selector: (row) => {
                if (row.is_financial) {
                    return 'Yes'
                } else {
                    return 'No'
                }

            },
            wrap: true
        },
        // {
        //     name: 'Subtype',
        //     minWidth: '250px',
        //     sortable: true,
        //     selector: row => {
        //         return row.sub_types?.map(m => <Badge key={m} style={{marginRight:'5px'}}>{m}</Badge>)
        //     }
        // },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    {/* <span title="View">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setserviceInfo(row)
                                setserviceLogicInfo(serviceLogicList.find(s => s.serviceId === row.service_id))
                                setAction(3)
                                setModal1(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp; */}
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => onAction(e, row, 1)}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => onAction(e, row, 2)}
                        />
                    </span>
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
    doc.text('Services List', 14, 10) 
    doc.autoTable({
       body: [...list],
       columns: [
          { header: 'Service ID', dataKey: 'serviceId' },
            { header: 'Service Keyword', dataKey: 'serviceKeyword' }
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
                  <span className='align-middle d-none d-sm-block'>Services</span>
                </NavLink>
              </NavItem>
              {subMenuIDs.includes(21) && <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                  <span className='align-middle d-none d-sm-block'>Approve Services</span>
                </NavLink>
              </NavItem>}
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Services</CardTitle>
                        <div>
                        {subMenuIDs.includes(20) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createService' >
                        <div className='d-flex align-items-center'>
                                <Plus size={17} style={{marginRight:'5px'}}/>
                                <span >Add Service</span>
                        </div>
                        </Button.Ripple>}
                        <UncontrolledButtonDropdown className='ml-1'>
                                <DropdownToggle color='secondary' caret outline>
                                    <Share size={15} />
                                    <span className='align-middle ml-50'>Export</span>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem className='w-100' onClick={() => downloadCSV(serviceList)}>
                                        <FileText size={15} />
                                        <span className='align-middle ml-50'>CSV</span>
                                    </DropdownItem>
                                    <DropdownItem className='w-100' onClick={() => exportToXL(serviceList)}>
                                        <Grid size={15} />
                                        <span className='align-middle ml-50'>Excel</span>
                                    </DropdownItem>
                                    <DropdownItem className='w-100' onClick={() => exportPDF(serviceList)}>
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
                        <CommonDataTable column={column} TableData={searchValue.length ? filteredData : serviceList} TableDataLoading={TableDataLoading} />
                        <EditModal
                            toggleModal={toggleModal}
                            modal={modal}
                            resetData={resetData}
                            setReset={setReset}
                            serviceInfo={serviceInfo}
                            setserviceInfo={setserviceInfo}
                            serviceLogicInfo={serviceLogicInfo}
                            setserviceLogicInfo={setserviceLogicInfo}
                            username={username}
                        />
                        <ApproveRejectModal
                            toggleModal={toggleModal1}
                            modal={modal1}
                            resetData={resetData}
                            setReset={setReset}
                            serviceInfo={serviceInfo}
                            serviceLogicInfo={serviceLogicInfo}
                            action={action}
                        />
                </Card>
              </TabPane>
              <TabPane tabId='2'>
                <PendingServiceList 
                    resetData={resetData} 
                    setReset={setReset} 
                    pendingServiceList={pendingServiceList}
                    TableDataLoading={TableDataLoading}
                />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
    )
}

export default ServiceList