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

const OverallPointRuleList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [overallPointRuleList, setoverallPointRuleList] = useState([])
    const [overallPointRuleInfo, setoverallPointRuleInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        // localStorage.setItem('usePMStoken', true)
        // useJwt.getAllOverallRules().then(res => {
        //     console.log(res)
        //     setoverallPointRuleList(res.data.data)
        //     localStorage.setItem('usePMStoken', false)
        //     setTableDataLoading(false)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        // })
    }, [resetData])
    const handlePoPupActions = (Id, merchantid, message) => {
        //localStorage.setItem('usePMStoken', true)
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
                // return true
                // const merchantId = merchantid
                // return useJwt.deleteOverallRule(merchantId, { rule_id: Id }).then(res => {
                //     Success(res)
                //     console.log(res)
                //     setoverallPointRuleList(overallPointRuleList.filter(x => x.Id !== Id))
                //     localStorage.setItem('usePMStoken', false)
                // }).catch(err => {
                //     localStorage.setItem('usePMStoken', false)
                //     console.log(err.response)
                //     Error(err)
                // })
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
            updatedData = overallPointRuleList.filter(item => {
                const startsWith =
                    String(item.MerchantName).toLowerCase().startsWith(value.toLowerCase()) ||
                    String(item.PointRateSetupName).toLowerCase().startsWith(value.toLowerCase()) ||
                    String(item.PurchaseAmount).toLowerCase().startsWith(value.toLowerCase()) ||
                    String(item.Points).toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.ExpiryDate).toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.OfferStartDate).toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.OfferEndDate).toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.CreatedAt).toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    String(item.MerchantName).toLowerCase().includes(value.toLowerCase()) ||
                    String(item.PointRateSetupName).toLowerCase().includes(value.toLowerCase()) ||
                    String(item.PurchaseAmount).toLowerCase().includes(value.toLowerCase()) ||
                    String(item.Points).toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.ExpiryDate).toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.OfferStartDate).toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.OfferEndDate).toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.CreatedAt).toLowerCase().includes(value.toLowerCase())

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
            name: 'SL.',
            width: '60px',
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
            name: 'Point Rate Setup Name',
            minWidth: '150px',
            sortable: true,
            selector: 'PointRateSetupName'
        },
        {
            name: 'Purchase Amount',
            minWidth: '100px',
            sortable: true,
            selector: 'PurchaseAmount'
        },
        {
            name: 'Points',
            minWidth: '100px',
            sortable: true,
            selector: 'Points'
        },
        {
            name: 'Expiry Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.ExpiryDate ? formatReadableDate(item.ExpiryDate) : null
            }
        },
        {
            name: 'Offer Rate',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.OfferRate ? <Badge pill color='success' className='badge-center'>
                    True
                </Badge> : <Badge pill color='danger' className='badge-center'>
                    False
                </Badge>
            }
        },
        {
            name: 'Offer Start Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.OfferStartDate ? formatReadableDate(item.OfferStartDate) : null
            }
        },
        {
            name: 'Offer End Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.OfferEndDate ? formatReadableDate(item.OfferEndDate) : null
            }
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
                                setoverallPointRuleInfo(row)
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
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Global Rule List', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Merchant', dataKey: 'MerchantName' }, { header: 'Rate Name', dataKey: 'PointRateSetupName' }, { header: 'Amount', dataKey: 'PurchaseAmount' }, { header: 'Points', dataKey: 'Points' }, { header: 'Expiry Date', dataKey: 'ExpiryDate' },
                { header: 'Offer Rate?', dataKey: 'OfferRate' }, { header: 'Start Date', dataKey: 'OfferStartDate' }, { header: 'End Date', dataKey: 'OfferEndDate' }, { header: 'Created At', dataKey: 'CreatedAt' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Global Rules</CardTitle>
                <div>
                    {subMenuIDs.includes(17) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createOverallPointRuleForAdmin' >
                        <div className='d-flex align-items-center'>
                            <Plus size={17} style={{ marginRight: '5px' }} />
                            <span >Create Global Rule</span>
                        </div>
                    </Button.Ripple>}
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(overallPointRuleList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(overallPointRuleList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(overallPointRuleList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : overallPointRuleList} TableDataLoading={TableDataLoading} />

            <EditModal
                toggleModal={toggleModal}
                modal={modal}
                resetData={resetData}
                setReset={setReset}
                overallPointRuleInfo={overallPointRuleInfo}
                setoverallPointRuleInfo={setoverallPointRuleInfo}
            />
        </Card>
    )
}

export default OverallPointRuleList