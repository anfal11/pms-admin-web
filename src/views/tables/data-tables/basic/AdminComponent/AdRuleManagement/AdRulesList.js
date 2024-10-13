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
import PendingQuotaList from './PendingAdRules'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../helper'

const AdRulesList = () => {
    const history = useHistory()
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [adRuleList, setAdRuleList] = useState([])
    const [pendingAdRuleList, setPendingAdRuleList] = useState([])

    const userData = JSON.parse(localStorage.getItem('userData'))

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt.adRuleList().then(res => {
            console.log(res)
            const allAdRule = []
            const allPendingAdRule = []
            for (const q of res.data.payload) {
                if (q.is_approved === true || q.is_rejected === true) {
                    allAdRule.push(q)
                } else if (q.is_approved === false && q.is_rejected === false /* && parseInt(q.created_by) !== user.id */) {
                    allPendingAdRule.push(q)
                }
            }
            setAdRuleList(allAdRule)
            setPendingAdRuleList(allPendingAdRule)
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
                    rule_id: id,
                    action_id: status,
                    reject_msg: ""
                }
                return useJwt.approveRejectDeleteAdRule(data).then(res => {
                    Success(res)
                    setAdRuleList(adRuleList.filter(x => x.id !== id))
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
            name: 'Rule Name',
            minWidth: '150px',
            sortable: true,
            selector: 'rule_name'
        },
        {
            name: 'Ad Set Name',
            minWidth: '150px',
            sortable: true,
            selector: 'adSet_name'
        },
        {
            name: 'Age range',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return `${row.min_age} - ${row.max_age}`
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by_name'
        },
        {
            name: 'User Type',
            minWidth: '100px',
            sortable: true,
            selector: Row => {
                return Row.created_user_type === 1 ? 'Admin' : 'Merchant'
            }
        },
        {
            name: 'Start Date',
            minWidth: '200px',
            sortable: true,
            selector: Row => formatReadableDate(Row.start_date)
        },
        {
            name: 'Expiry Date',
            minWidth: '200px',
            sortable: true,
            selector: Row => formatReadableDate(Row.expired_date)
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
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>{(subMenuIDs.includes(32) || userData?.role === 'vendor') && <>
                    {
                        row.is_approved && <span title="Edit">
                            <Edit size={15}
                                color='teal'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    localStorage.setItem('adRuleInfo', JSON.stringify(row))
                                    history.push(userData?.role === 'vendor' ? '/editAdRuleVendor' : '/editAdRule')
                                }}
                            />
                        </span>
                    }&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 3, 'Do you want to delete?')}
                        />
                    </span>
                </>} </>
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
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('AD Rules', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Rule Name', dataKey: 'rule_name' }, { header: 'Ad Set Name', dataKey: 'adSet_name' }, { header: 'Max Age', dataKey: 'max_age' }, { header: 'Min Age', dataKey: 'min_age' },
                { header: 'Created By', dataKey: 'created_by_name' }, { header: 'Status', dataKey: 'is_approved' }, { header: 'Checked By', dataKey: 'action_by_name' }
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
                            <span className='align-middle d-none d-sm-block'>Ad Rules</span>
                        </NavLink>
                    </NavItem>
                    {(subMenuIDs.includes(34) || userData?.role === 'vendor') && <NavItem>
                        <NavLink active={activeTab === '3'} onClick={() => toggle('3')}>
                            <span className='align-middle d-none d-sm-block'>Approve Ad Rules</span>
                        </NavLink>
                    </NavItem>}
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId='1'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Ad Rules</CardTitle>
                                <div>
                                    {(subMenuIDs.includes(31) || userData?.role === 'vendor') && <Button.Ripple className='ml-2' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/createAdRuleVendor' : '/createAdRule'} >
                                        <div className='d-flex align-items-center'>
                                            <Plus size={17} style={{ marginRight: '5px' }} />
                                            <span >Create Ad Rule</span>
                                        </div>
                                    </Button.Ripple>}
                                    <UncontrolledButtonDropdown className='ml-1'>
                                        <DropdownToggle color='secondary' caret outline>
                                            <Share size={15} />
                                            <span className='align-middle ml-50'>Export</span>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem className='w-100' onClick={() => downloadCSV(adRuleList)}>
                                                <FileText size={15} />
                                                <span className='align-middle ml-50'>CSV</span>
                                            </DropdownItem>
                                            <DropdownItem className='w-100' onClick={() => exportToXL(adRuleList)}>
                                                <Grid size={15} />
                                                <span className='align-middle ml-50'>Excel</span>
                                            </DropdownItem>
                                            <DropdownItem className='w-100' onClick={() => exportPDF(adRuleList)}>
                                                <File size={15} />
                                                <span className='align-middle ml-50'>
                                                    PDF
                                                </span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </div>
                            </CardHeader>
                            <CommonDataTable column={column} TableData={adRuleList} TableDataLoading={TableDataLoading} />
                        </Card>
                    </TabPane>
                    <TabPane tabId='3'>
                        <PendingQuotaList pendingAdRuleList={pendingAdRuleList} setPendingAdRuleList={setPendingAdRuleList} setReset={setReset} resetData={resetData} />
                    </TabPane>
                </TabContent>
            </CardBody>
        </Card>
    )
}

export default AdRulesList