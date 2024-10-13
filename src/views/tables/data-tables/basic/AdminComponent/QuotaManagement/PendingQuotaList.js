import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useState } from 'react'
import { CheckSquare, File, FileText, Grid, Share, XSquare } from 'react-feather'
import {
    Card, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown
} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)

const PendingQuotaList = ({ pendingQuotaList, setPendingQuotaList, resetData, setReset }) => {
    const [TableDataLoading, setTableDataLoading] = useState(false)
    // const [resetData, setReset] = useState(true)

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
                    quota_id: id,
                    action_id: status,
                    reject_msg: ""
                }
                return useJwt.quotaApproveRejectDelete(data).then(res => {
                    Success(res)
                    console.log(res)
                    setPendingQuotaList(pendingQuotaList.filter(x => x.id !== id))
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
            updatedData = pendingQuotaList.filter(item => {
                const startsWith =
                    item.created_by_name.toLowerCase().startsWith(value.toLowerCase())

                const includes =
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
            minWidth: '100px',
            sortable: true,
            selector: 'title'
        },
        {
            name: 'Total Budget',
            minWidth: '100px',
            sortable: true,
            selector: 'total_budget'
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
            name: 'Facebook',
            minWidth: '100px',
            sortable: true,
            selector: 'facebook'
        },
        {
            name: 'Google',
            minWidth: '100px',
            sortable: true,
            selector: 'google'
        },
        {
            name: 'Whatsapp',
            minWidth: '100px',
            sortable: true,
            selector: 'whatsapp'
        },
        {
            name: 'SMS',
            minWidth: '100px',
            sortable: true,
            selector: 'sms'
        },
        {
            name: 'Email',
            minWidth: '100px',
            sortable: true,
            selector: 'email'
        },
        {
            name: 'Push Notification',
            minWidth: '100px',
            sortable: true,
            selector: 'push_notification'
        },
        {
            name: 'Instagram',
            minWidth: '100px',
            sortable: true,
            selector: 'instagram'
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 1, 'Do you want to approve?')}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => handlePoPupActions(row.id, 2, 'Do you want to reject?')}
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
        doc.text('Pending Quotas', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Title', dataKey: 'title' }, { header: 'Total Budget', dataKey: 'total_budget' }, { header: 'Created By', dataKey: 'created_by_name' }, { header: 'Status', dataKey: 'is_approved' }, { header: 'Facebook', dataKey: 'facebook' }, { header: 'Google', dataKey: 'google' }, { header: 'SMS', dataKey: 'sms' },
                { header: 'Whatsapp', dataKey: 'whatsapp' }, { header: 'Email', dataKey: 'email' }, { header: 'Instagram', dataKey: 'instagram' }, { header: 'Push Notification', dataKey: 'push_notification' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending List</CardTitle>
                <div>
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(pendingQuotaList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(pendingQuotaList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(pendingQuotaList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingQuotaList} TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default PendingQuotaList