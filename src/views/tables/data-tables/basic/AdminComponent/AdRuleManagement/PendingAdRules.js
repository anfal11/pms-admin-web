import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, XSquare, CheckSquare, Share, Printer, FileText, File, Grid, CheckCircle, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
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
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../helper'
import DetailsModal from './ViewDetails'

const PendingAdRules = ({pendingAdRuleList, setPendingAdRuleList, setReset, resetData}) => {
    const [TableDataLoading, setTableDataLoading] = useState(false)
    const user = JSON.parse(localStorage.getItem('userData'))

    const [modal, setModal] = useState(false)
    const [action, setAction] = useState(1)
    const toggleModal = () => {
        setModal(!modal)
    }
    const [roleInfo, setRoleInfo] = useState({})

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
                    reject_msg : ""
                }
                return useJwt.approveRejectDeleteAdRule(data).then(res => {
                    Success(res)
                    console.log(res)
                    setPendingAdRuleList(pendingAdRuleList.filter(x => x.id !== id))
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
    const column = [
        {
            name: 'SL',
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Rule Name',
            minWidth: '250px',
            sortable: true,
            selector: 'rule_name'
        },
        {
            name: 'Ad Set Name',
            minWidth: '100px',
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
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Action Date',
            minWidth: '250px',
            sortable: true,
            selector: Row => formatReadableDate(Row.action_at)
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
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return parseInt(row.action_by) === user.id ? <h6 style={{margin:'0', color:'orange'}}>Pending</h6> : <>
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 1, 'Do you want to approve?')}
                            onClick= {() => {
                                setModal(true)
                                setAction(1)
                                setRoleInfo(row)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 2, 'Do you want to reject?')}
                            onClick= {() => {
                                setModal(true)
                                setAction(2)
                                setRoleInfo(row)
                            }}
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
    doc.text('Pending AD Rules', 14, 10) 
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
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Ad Rules</CardTitle>
                <UncontrolledButtonDropdown className='ml-1'>
                    <DropdownToggle color='secondary' caret outline>
                        <Share size={15} />
                        <span className='align-middle ml-50'>Export</span>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem className='w-100' onClick={() => downloadCSV(pendingAdRuleList)}>
                            <FileText size={15} />
                            <span className='align-middle ml-50'>CSV</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportToXL(pendingAdRuleList)}>
                            <Grid size={15} />
                            <span className='align-middle ml-50'>Excel</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportPDF(pendingAdRuleList)}>
                            <File size={15} />
                            <span className='align-middle ml-50'>
                                PDF
                            </span>
                        </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
            </CardHeader>
            <CommonDataTable column={column} TableData={pendingAdRuleList} TableDataLoading={TableDataLoading} />
            <DetailsModal modal = {modal} toggleModal = {toggleModal} action={action} refresh= {resetData} setRefresh= {setReset} roleInfo = {roleInfo}/>
        </Card>
    )
}

export default PendingAdRules