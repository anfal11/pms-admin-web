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
import DetailsModal from './DetailsModal'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatReadableDate } from '../../../../../helper'
import DetailsModal1 from './ViewDetails'

const PendingOfflineCommisionRuleList = ({ resetData, setReset, TableDataLoading, pendingOfflineRuleList, setpendingOfflineRuleList, serviceList }) => {
    const username = localStorage.getItem('username')
    const [commisionInfo, setCommisionInfo] = useState({})

    const [action, setAction] = useState(0)
    const [modal1, setModal1] = useState(false)
    const toggleModal1 = () => setModal1(!modal1)

    // const handlePoPupActions = (id, status, message) => {
    //     localStorage.setItem('useBMStoken', true)
    //     return MySwal.fire({
    //         title: message,
    //         text: `You won't be able to revert this`,
    //         icon: 'warning',
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes',
    //         customClass: {
    //             confirmButton: 'btn btn-primary',
    //             cancelButton: 'btn btn-danger ml-1'
    //         },
    //         showLoaderOnConfirm: true,
    //         preConfirm: () => {
    //             return useJwt.approveOrRejectOfflineRule(id, status).then(res => {
    //                 Success(res)
    //                 console.log(res)
    //                 setpendingOfflineRuleList(pendingOfflineRuleList.filter(x => x.id !== id))
    //                 localStorage.setItem('useBMStoken', false)
    //                 setReset(!resetData)
    //             }).catch(err => {
    //                 localStorage.setItem('useBMStoken', false)
    //                 console.log(err.response)
    //                 Error(err)
    //             })
    //         },
    //         buttonsStyling: false,
    //         allowOutsideClick: () => !Swal.isLoading()
    //     }).then(function (result) {
    //         if (result.isConfirmed) {

    //         }
    //     })

    // }

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = pendingOfflineRuleList.filter(item => {
                const startsWith =
                    item.offlineRuleName.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.bonusAmount.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.createdBy.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.offlineRuleName.toLowerCase().includes(value.toLowerCase()) ||
                    item.bonusAmount.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.createdBy.toLowerCase().includes(value.toLowerCase())

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
            name: 'Rule Name',
            minWidth: '250px',
            sortable: true,
            selector: 'offlineRuleName'
        },
        {
            name: 'Amount',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.bonusAmount || '---'
            }
        },
        {
            name: 'Is Active?',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isActive ? <Badge pill color='success' className='badge-center'>True
                </Badge> : <Badge pill color='danger' className='badge-center'>False</Badge>
            }
        },
        {
            name: 'Reward Receiver',
            minWidth: '100px',
            sortable: true,
            selector: row => { return row.userType === 's' ? 'Sender' : row.userType === 'r' ? 'Receiver' : row.userType === 'b' ? 'Both' : '' }
        },
        {
            name: 'Created By',
            minWidth: '250px',
            sortable: true,
            selector: 'createBy'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.createDate ? formatReadableDate(item.createDate) : null
            }
        },
        {
            name: 'Modify By',
            minWidth: '250px',
            sortable: true,
            selector: 'modifyBy'
        },
        {
            name: 'Modify At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.modifyDate ? formatReadableDate(item.modifyDate) : null
            }
        },
        {
            name: 'Operation Type',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.operationType === 1 ? 'Insert' : row.operationType === 2 ? 'Update' : row.operationType === 3 ? 'Delete' : ''
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return row.modifyBy.toLowerCase() === username.toLowerCase() ? <Eye size={15}
                    color='teal'
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        setCommisionInfo(row)
                        setModal(true)
                    }}
                /> : <>
                    <span title="Approve">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setCommisionInfo(row)
                                setModal(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 1, 'Do you want to approve?')}
                            onClick={() => {
                                setCommisionInfo(row)
                                setModal1(true)
                                setAction(1)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            // onClick={(e) => handlePoPupActions(row.id, 0, 'Do you want to reject?')}
                            onClick={() => {
                                setCommisionInfo(row)
                                setModal1(true)
                                setAction(0)
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
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Pending Offline Campaign Rules', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Rule Name', dataKey: 'offlineRuleName' }, { header: 'Is Active?', dataKey: 'isActive' }, { header: 'Amount', dataKey: 'bonusAmount' },
                { header: 'Commision Reciever', dataKey: 'userType' }, { header: 'Created By', dataKey: 'createdBy' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Offline Campaign Rules</CardTitle>
                <UncontrolledButtonDropdown className='ml-1'>
                    <DropdownToggle color='secondary' caret outline>
                        <Share size={15} />
                        <span className='align-middle ml-50'>Export</span>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem className='w-100' onClick={() => downloadCSV(pendingOfflineRuleList)}>
                            <FileText size={15} />
                            <span className='align-middle ml-50'>CSV</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportToXL(pendingOfflineRuleList)}>
                            <Grid size={15} />
                            <span className='align-middle ml-50'>Excel</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportPDF(pendingOfflineRuleList)}>
                            <File size={15} />
                            <span className='align-middle ml-50'>
                                PDF
                            </span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingOfflineRuleList} TableDataLoading={TableDataLoading} />
            <DetailsModal
                toggleModal={toggleModal}
                modal={modal}
                resetData={resetData}
                setReset={setReset}
                commisionInfo={commisionInfo}
                serviceList={serviceList}
            />
            <DetailsModal1 
                modal={modal1}
                toggleModal={toggleModal1}
                commisionInfo={commisionInfo} 
                refresh={resetData}
                setRefresh={setReset}
                action={action}  
            /> 
        </Card>
    )
}

export default PendingOfflineCommisionRuleList