import useJwt from '@src/auth/jwt/useJwt'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useState } from 'react'
import { Edit, File, FileText, Grid, Plus, Share, Trash } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import { Badge, Button, Card, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)

const ServiceservicePointRuleList = ({TableDataLoading, servicePointRuleList, toggleReset, tierList, ServiceList}) => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)
    const history = useHistory()
    const handlePoPupActions = (rule_id, message) => {
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
                // const createdby = localStorage.getItem("username")
                // localStorage.setItem('usePMStoken', true)
                // return useJwt.deleteServicePointRule({ rule_id, createdby }).then(res => {
                //     Success(res)
                //     console.log(res)
                //     // setservicePointRuleList(servicePointRuleList.filter(x => x.id !== rule_id))
                //     localStorage.setItem('usePMStoken', false)
                //     toggleReset()
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
            updatedData = servicePointRuleList.filter(item => {
                const startsWith =
                    (item.user_type === 's' ? 'Source' : item.user_type === 'b' ? 'Both' : item.user_type === 'r' ? 'Reciever' : '')?.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.service_type.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.amount.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.start_range.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.end_range.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.expiry_date).toLowerCase().startsWith(value.toLowerCase()) ||
                    item.receiver_point.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.created_by?.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.sender_point.toString().toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    (item.user_type === 's' ? 'Source' : item.user_type === 'b' ? 'Both' : item.user_type === 'r' ? 'Reciever' : '')?.toLowerCase().includes(value.toLowerCase()) ||
                    item.service_type.toLowerCase().includes(value.toLowerCase()) ||
                    item.amount.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.start_range.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.end_range.toString().toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.expiry_date).toLowerCase().includes(value.toLowerCase()) ||
                    item.receiver_point.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.created_by?.toLowerCase().includes(value.toLowerCase()) ||
                    item.sender_point.toString().toLowerCase().includes(value.toLowerCase())

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
            selector: 'rule_title'
        },
        {
            name: 'User Type',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.user_type === 's' ? 'Sender' : row.user_type === 'b' ? 'Both' : row.user_type === 'r' ? 'Reciever' : ''
            }
        },
        {
            name: 'Service Type',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return ServiceList.find(s => s.serviceId === row.service_id)?.serviceKeyword
            }
        },
        {
            name: 'Point Conversion Rate',
            minWidth: '100px',
            sortable: true,
            selector: 'amount'
        },
        // {
        //     name: 'Is Range',
        //     minWidth: '100px',
        //     sortable: true,
        //     selector: row => {
        //         return row.IsRange ? <Badge pill color='success' className='badge-center'>
        //             True
        //         </Badge> : <Badge pill color='danger' className='badge-center'>
        //             False
        //         </Badge>
        //     }
        // },
        {
            name: 'Start Range',
            minWidth: '100px',
            sortable: true,
            selector: 'start_range'
        },
        {
            name: 'End Range',
            minWidth: '100px',
            sortable: true,
            selector: 'end_range'
        },
        {
            name: 'Is Active',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.is_active ? <Badge pill color='success' className='badge-center'>
                    True
                </Badge> : <Badge pill color='danger' className='badge-center'>
                    False
                </Badge>
            }
        },
        {
            name: 'Receiver Point',
            minWidth: '100px',
            sortable: true,
            selector: 'receiver_point'
        },
        {
            name: 'Sender Point',
            minWidth: '100px',
            sortable: true,
            selector: 'sender_point'
        },
        {
            name: 'Tire',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return tierList.find(t => t.id === row.tire)?.tier
            }
        },
        {
            name: 'Expiry Point',
            minWidth: '100px',
            sortable: true,
            selector: 'expiry_point'
        },
        {
            name: 'Expiry Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.expiry_date ? formatReadableDate(item.expiry_date) : null
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
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='green'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => history.push(`/updateServicePointRule/${row.id}`)}
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
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        FileSaver.saveAs(data, 'export.xlsx')
    }
    const exportPDF = (list) => {
        const doc = new jsPDF()
        doc.text('Service Point Rules', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'User Type', dataKey: 'user_type' }, { header: 'Service Type', dataKey: 'service_type' }, { header: 'Amount', dataKey: 'amount' }, { header: 'Is Range?', dataKey: 'is_range' }, { header: 'Start Range.', dataKey: 'start_range' },
                { header: 'End Range', dataKey: 'end_range' }, { header: 'Is Active?', dataKey: 'is_active' }, { header: 'R Point', dataKey: 'receiver_point' }, { header: 'S Point', dataKey: 'sender_point' }, { header: 'Expiry', dataKey: 'expiry_date' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Service Point Rules</CardTitle>
                <div>
                    {subMenuIDs.includes(18) && <Button.Ripple className='ml-2' color='primary' tag={Link} to='/createServicePointRule' >
                        <div className='d-flex align-items-center'>
                            <Plus size={17} style={{ marginRight: '5px' }} />
                            <span >Create Service Point Rule</span>
                        </div>
                    </Button.Ripple>}
                    <UncontrolledButtonDropdown className='ml-1'>
                        <DropdownToggle color='secondary' caret outline>
                            <Share size={15} />
                            <span className='align-middle ml-50'>Export</span>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem className='w-100' onClick={() => downloadCSV(servicePointRuleList)}>
                                <FileText size={15} />
                                <span className='align-middle ml-50'>CSV</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportToXL(servicePointRuleList)}>
                                <Grid size={15} />
                                <span className='align-middle ml-50'>Excel</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={() => exportPDF(servicePointRuleList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : servicePointRuleList} TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default ServiceservicePointRuleList