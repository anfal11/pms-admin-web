import useJwt2 from '@src/auth/jwt/useJwt2'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useEffect, useState } from 'react'
import { CheckSquare, Eye, File, FileText, Grid, Share, XSquare } from 'react-feather'
import { Badge, Card, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../helper'
import CommonDataTable from '../ClientSideDataTable'
import ApproveRejectModal from './ApproveRejectModal'
import {BMS_USER, BMS_PASS, CURRENCY_SYMBOL} from '../../../../../../Configurables'

const MySwal = withReactContent(Swal)

const PendingServiceList = ({ resetData, setReset, pendingServiceList, TableDataLoading }) => {

    const [serviceInfo, setserviceInfo] = useState({})
    const [pendingServiceLogicList, setpendingServiceLogicList] = useState([])
    const [serviceLogicInfo, setserviceLogicInfo] = useState({})
    const [action, setAction] = useState(0)
    const username = localStorage.getItem('username')

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = pendingServiceList.filter(item => {
                const startsWith =
                    item.foreign_id.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.service_keyword.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.modify_by.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.foreign_id.toLowerCase().includes(value.toLowerCase()) ||
                    item.service_keyword.toLowerCase().includes(value.toLowerCase()) ||
                    item.modify_by.toLowerCase().includes(value.toLowerCase())

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
            width: '50px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Service Id',
            minWidth: '50px',
            sortable: true,
            selector: 'foreign_id'
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
            minWidth: '50px',
            sortable: true,
            selector: (row) => `${CURRENCY_SYMBOL} ${row.minimum}`,
            wrap: true
        },
        {
            name: 'Maximum',
            minWidth: '120px',
            sortable: true,
            selector: (row) => `${CURRENCY_SYMBOL} ${row.maximum}`,
            wrap: true
        },
        {
            name: 'Financial',
            minWidth: '50px',
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
        //         return row.sub_types?.map(m => <Badge key={m} style={{ marginRight: '5px' }}>{m}</Badge>) || '---'
        //     }
        // },
        {
            name: 'Operation Type',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row.operation_type === 1 ? <Badge color="primary" pill>Insert</Badge> : row.operation_type === 2 ? <Badge color="success" pill>Update</Badge> : row.operation_type === 3 ? <Badge color="danger" pill>Delete</Badge> : ''
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'modify_by',
            wrap: true
        },
        {
            name: 'Created At',
            minWidth: '150px',
            sortable: true,
            wrap: true,
            selector: (item) => {
                return item.modify_date ? formatReadableDate(item.modify_date) : null
            }
        },

        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return row.modify_by?.toLowerCase() === username.toLowerCase() ? '--' : <>
                    <span title="Approve">
                        <CheckSquare size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setserviceInfo(row)
                                // setserviceLogicInfo(pendingServiceLogicList.find(s => s.serviceId === row.foreign_id))
                                setAction(1)
                                setModal(true)
                            }}
                        // onClick={(e) => handlePoPupActions(row.id, 1, 'Do you want to approve?')}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <XSquare size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setserviceInfo(row)
                                // setserviceLogicInfo(pendingServiceLogicList.find(s => s.serviceId === row.foreign_id))
                                setAction(2)
                                setModal(true)
                            }}
                        // onClick={(e) => handlePoPupActions(row.id, 0, 'Do you want to reject?')}
                        />
                    </span>
                </>
            }
        }
    ]

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
        doc.text('Pending Services List', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'Service ID', dataKey: 'foreignId' },
                { header: 'Service Keyword', dataKey: 'serviceKeyword' }, { header: 'Created By', dataKey: 'createdBy' }
            ],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Pending Services</CardTitle>
                <UncontrolledButtonDropdown className='ml-1'>
                    <DropdownToggle color='secondary' caret outline>
                        <Share size={15} />
                        <span className='align-middle ml-50'>Export</span>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem className='w-100' onClick={() => downloadCSV(pendingServiceList)}>
                            <FileText size={15} />
                            <span className='align-middle ml-50'>CSV</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportToXL(pendingServiceList)}>
                            <Grid size={15} />
                            <span className='align-middle ml-50'>Excel</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportPDF(pendingServiceList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : pendingServiceList} TableDataLoading={TableDataLoading} />
            <ApproveRejectModal
                toggleModal={toggleModal}
                modal={modal}
                resetData={resetData}
                setReset={setReset}
                serviceInfo={serviceInfo}
                serviceLogicInfo={serviceLogicInfo}
                action={action}
            />
        </Card>
    )
}

export default PendingServiceList