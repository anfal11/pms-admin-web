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
import { formatReadableDate } from '../../../../../helper'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import EditModal from './EditModal'
import PendingTierList from './PendingTierList'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'

const TierList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [tierList, settierList] = useState([])
    const [pendingTierlist, setPendingTierList] = useState()
    const [serviceList, setserviceList] = useState([])
    const [tierInfo, setTierInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const [activeTab, setActiveTab] = useState('1')
    function toggle(tab) {
        setActiveTab(tab)
    }

    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.tierList().then(res => {
            console.log(res)
            settierList(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
            setTableDataLoading(false)
        })
        await useJwt.pendingTierList().then(res => {
            console.log(res)
            setPendingTierList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            setTableDataLoading(false)
        })
        localStorage.setItem('useBMStoken', true)
        await useJwt.getServiceList().then(res => {
            console.log(res)
            setserviceList(res.data)
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
                console.log(err)
                setTableDataLoading(false)
                localStorage.setItem('useBMStoken', false)
            }
        })
    }, [resetData])
    const handlePoPupActions = (id, message) => {
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
                return useJwt.deleteTier(id).then(res => {
                    Success(res)
                    console.log(res)
                    setReset(!resetData)
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
        updatedData = tierList.filter(item => {
            const startsWith = 
            item.tier.toLowerCase().startsWith(value.toLowerCase()) ||
            item.point_required?.toString().toLowerCase().startsWith(value.toLowerCase()) ||
            formatReadableDate(item.created_date).toLowerCase().startsWith(value.toLowerCase()) ||
            item.created_by?.toString().toLowerCase().startsWith(value.toLowerCase())

            const includes = 
            item.tier.toLowerCase().includes(value.toLowerCase()) ||
            item.point_required?.toString().toLowerCase().includes(value.toLowerCase()) || 
            formatReadableDate(item.created_date).toLowerCase().includes(value.toLowerCase()) ||
            item.created_by?.toString().toLowerCase().includes(value.toLowerCase())

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
            name: 'Tier',
            minWidth: '170px',
            sortable: true,
            selector: 'tier'
        },
        {
            name: 'Point Required',
            minWidth: '80px',
            sortable: true,
            selector: 'point_required'
        },
        {
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.created_date ? formatReadableDate(item.created_date) : null
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setTierInfo(row)
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 'Do you want to delete?')}
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
        doc.text('Tier List', 14, 10) 
        doc.autoTable({
        body: [...list],
        columns: [
            { header: 'Tier', dataKey: 'tier' }, { header: 'Point Required', dataKey: 'point_required' }, 
            { header: 'Created Date', dataKey: 'created_date' }, { header: 'Created By', dataKey: 'created_by' }
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
                  <span className='align-middle d-none d-sm-block'>Tiers</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                  <span className='align-middle d-none d-sm-block'>Approve Tiers</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Tiers</CardTitle>
                        <div>
                        {subMenuIDs.includes(18) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/CreateTier' >
                            <div className='d-flex align-items-center'>
                                <Plus size={17} style={{ marginRight: '5px' }} />
                                <span >Create a Tier</span>
                            </div>
                        </Button.Ripple>}
                        <UncontrolledButtonDropdown className='ml-1'>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(tierList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportToXL(tierList)}>
                                    <Grid size={15} />
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportPDF(tierList)}>
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
                        <CommonDataTable column={column} TableData={searchValue.length ? filteredData : tierList} TableDataLoading={TableDataLoading} />
                        <EditModal
                            toggleModal={toggleModal}
                            modal={modal}
                            resetData={resetData}
                            setReset={setReset}
                            tierInfo={tierInfo}
                            setTierInfo={setTierInfo}
                            serviceList={serviceList}
                        />
                </Card>
              </TabPane>
              <TabPane tabId='2'>
                <PendingTierList serviceList={serviceList} TableDataLoading={TableDataLoading} resetData={resetData} setReset={setReset} pendingTierlist={pendingTierlist} setPendingTierList={setPendingTierList}/>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
    )
}

export default TierList