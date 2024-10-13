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
import EditModal from './EditModal'
import { formatReadableDate } from '../../../../../helper'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import PendingPointRuleList from './PendingPointRuleList'

const PointRuleList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const user = JSON.parse(localStorage.getItem('userData'))
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [TableDataLoading1, setTableDataLoading1] = useState(false)
    const [resetData, setReset] = useState(true)
    const [pointRuleList, setPointRuleList] = useState([])
    const [pendingPointRuleList, setPendingPointRuleList] = useState([])
    const [pointRuleInfo, setPointRuleInfo] = useState({})
    const [businessList, setBusinessList] = useState([])

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const getPendingPointRuleList = async (pms_merchantid) => {
        // setTableDataLoading1(true)
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.getPendingRules(pms_merchantid).then(res => {
        //     setTableDataLoading1(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(res)
        //     setPendingPointRuleList(res.data.data)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     // Error(err)
        //     setPendingPointRuleList([])
        //     console.log(err.response)
        //     setTableDataLoading1(false)
        // })
    }
    const handleBusinessChange = (value) => {
        getPendingPointRuleList(value)
    }
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.getAllPointRules().then(res => {
        //     console.log(res)
        //     setPointRuleList(res.data.data)
        //     localStorage.setItem('usePMStoken', false)
        //     setTableDataLoading(false)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        // })
        await useJwt.customerBusinessList().then(async res => {
            console.log(res)
            const { payload } = res.data
            setBusinessList(payload)
            await getPendingPointRuleList(payload[0].pms_merchantid)
          }).catch(err => {
            console.log(err)
            Error(err)
          })
    }, [resetData])
    const handlePoPupActions = (rule_id, merchantId, message) => {
        localStorage.setItem('usePMStoken', true)
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
                // console.log({ rule_id, createdby: user.username })
                // return useJwt.deleteMyRule(merchantId, { rule_id, createdby: user.username }).then(res => {
                //     Success(res)
                //     console.log(res)
                //     setPointRuleList(pointRuleList.filter(x => x.Id !== rule_id))
                //     localStorage.setItem('usePMStoken', false)
                //     setReset(!resetData)
                // }).catch(err => {
                //     localStorage.setItem('usePMStoken', false)
                //     console.log(err.response)
                //     Error(err)
                // })

                localStorage.setItem('usePMStoken', false)
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
        updatedData = pointRuleList.filter(item => {
            const startsWith =
            item.MerchantName.toLowerCase().startsWith(value.toLowerCase()) ||
            item.SKUPoints.toLowerCase().startsWith(value.toLowerCase()) ||
            item.SKUAmount.toLowerCase().startsWith(value.toLowerCase()) || 
            item.SKUStartRange.toLowerCase().startsWith(value.toLowerCase()) || 
            item.SKUEndRange.toLowerCase().startsWith(value.toLowerCase()) || 
            formatReadableDate(item.CreatedAt).toLowerCase().startsWith(value.toLowerCase()) ||
            item.product_id?.toLowerCase().startsWith(value.toLowerCase()) ||
            item.CreatedBy?.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.MerchantName.toLowerCase().includes(value.toLowerCase()) ||
            item.SKUPoints.toLowerCase().includes(value.toLowerCase()) ||
            item.SKUAmount.toLowerCase().includes(value.toLowerCase()) ||
            item.SKUStartRange.toLowerCase().includes(value.toLowerCase()) || 
            item.SKUEndRange.toLowerCase().includes(value.toLowerCase()) || 
            formatReadableDate(item.CreatedAt).toLowerCase().includes(value.toLowerCase()) ||
            item.product_id?.toLowerCase().includes(value.toLowerCase()) ||
            item.CreatedBy?.toLowerCase().includes(value.toLowerCase())

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
            name: 'Merchant Name',
            minWidth: '150px',
            sortable: true,
            selector: 'MerchantName'
        },
        {
            name: 'SKU Points',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUPoints'
        },
        {
            name: 'Is Range',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.IsRange ? <Badge pill color='success' className='badge-center'>
                True
              </Badge> : <Badge pill color='danger' className='badge-center'>
                False
              </Badge>
            }
        },
        {
            name: 'SKU Amount',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUAmount'
        },
        {
            name: 'SKU Start Range',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUStartRange'
        },
        {
            name: 'SKU End Range',
            minWidth: '100px',
            sortable: true,
            selector: 'SKUEndRange'
        },
        {
            name: 'Product ID',
            minWidth: '250px',
            sortable: true,
            selector: 'product_id'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.CreatedAt ? formatReadableDate(item.CreatedAt) : null
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'CreatedBy'
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
                                setPointRuleInfo(row)
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.Id, row.merchantid, 'Do you want to delete?')}
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
        doc.text('SKU Rule List', 14, 10) 
        doc.autoTable({
        body: [...list],
        columns: [
            { header: 'Merchant', dataKey: 'MerchantName' }, { header: 'Is Range?', dataKey: 'IsRange' }, { header: 'Amount', dataKey: 'SKUAmount' }, { header: 'Points', dataKey: 'SKUPoints' }, { header: 'Start Range.', dataKey: 'SKUStartRange' },
                { header: 'End Range', dataKey: 'SKUEndRange' }, { header: 'Product ID', dataKey: 'product_id' }, { header: 'Created At', dataKey: 'CreatedAt' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    const [activeTab, setActiveTab] = useState('1')

    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)

    return (
        <Card>
            <CardHeader>
                <Nav tabs>
                <NavItem>
                    <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                    <span className='align-middle d-none d-sm-block'>SKU Rules</span>
                    </NavLink>
                </NavItem>
                {subMenuIDs.includes(34) && <NavItem>
                    <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                    <span className='align-middle d-none d-sm-block'>Pending SKU Rules</span>
                    </NavLink>
                </NavItem>}
                </Nav>
            </CardHeader>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>SKU Rules</CardTitle>
                        <div>
                        {subMenuIDs.includes(16) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createPointRuleForAdmin' >
                            <div className='d-flex align-items-center'>
                                <Plus size={17} style={{ marginRight: '5px' }} />
                                <span >Create SKU Rule</span>
                            </div>
                        </Button.Ripple>}
                        <UncontrolledButtonDropdown className='ml-1'>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ml-50'>Export</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem className='w-100' onClick={() => downloadCSV(pointRuleList)}>
                                    <FileText size={15} />
                                    <span className='align-middle ml-50'>CSV</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportToXL(pointRuleList)}>
                                    <Grid size={15} />
                                    <span className='align-middle ml-50'>Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => exportPDF(pointRuleList)}>
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
                        <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pointRuleList} TableDataLoading={TableDataLoading} />
                        
                        <EditModal
                            toggleModal={toggleModal}
                            modal={modal}
                            resetData={resetData}
                            setReset={setReset}
                            pointRuleInfo={pointRuleInfo}
                            setPointRuleInfo={setPointRuleInfo}
                        />
                </Card>
              </TabPane>
              <TabPane tabId='3'>
                <PendingPointRuleList pendingPointRuleList={pendingPointRuleList} setPendingPointRuleList={setPendingPointRuleList} businessList={businessList} handleBusinessChange={handleBusinessChange} TableDataLoading1={TableDataLoading1} resetData={resetData} setReset={setReset} />
              </TabPane>
            </TabContent>
        </Card>
    )
}

export default PointRuleList