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
// import Pdf from "react-to-pdf"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import EditModal from './EditModal'
import ViewModal from './ViewModal'

const ComplainList = () => {
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [complainList, setComplainList] = useState([])
    const [complainInfo, setComplainInfo] = useState({})

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    
    const [modal1, setModal1] = useState(false)
    const toggleModal1 = () => setModal1(!modal1)

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt.complainList().then(res => {
            console.log(res)
            setComplainList(res.data.payload)
            setTableDataLoading(false)
        }).catch(err => {
                Error(err)
            console.log(err.response)
            setTableDataLoading(false)
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
                return useJwt.deleteComplain({complain_id : id}).then(res => {
                    Success(res)
                    setComplainList(complainList.filter(c => c.id !== id))
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
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = complainList.filter(item => {
            const startsWith =
            item.complain_title.toLowerCase().startsWith(value.toLowerCase()) ||
            item.complain_priority.toLowerCase().startsWith(value.toLowerCase()) ||
            item.category.toLowerCase().startsWith(value.toLowerCase()) || 
            item.created_by_name.toLowerCase().startsWith(value.toLowerCase()) || 
            formatReadableDate(item.created_at).toLowerCase().startsWith(value.toLowerCase()) ||
            item.assign_to?.toLowerCase().startsWith(value.toLowerCase()) ||
            item.status?.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.complain_title.toLowerCase().includes(value.toLowerCase()) ||
            item.complain_priority.toLowerCase().includes(value.toLowerCase()) ||
            item.category.toLowerCase().includes(value.toLowerCase()) ||
            item.created_by_name.toLowerCase().includes(value.toLowerCase()) || 
            formatReadableDate(item.created_at).toLowerCase().includes(value.toLowerCase()) ||
            item.assign_to?.toLowerCase().includes(value.toLowerCase()) ||
            item.status?.toLowerCase().includes(value.toLowerCase())

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
            name: 'Complain Title',
            minWidth: '250px',
            sortable: true,
            selector: 'complain_title'
        },
        {
            name: 'Complain Priority',
            minWidth: '100px',
            sortable: true,
            selector: 'complain_priority'
        },
        {
            name: 'Category',
            minWidth: '100px',
            sortable: true,
            selector: 'category'
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by_name'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.created_at ? formatReadableDate(item.created_at) : null
            }
        },
        {
            name: 'Assign To',
            minWidth: '130px',
            sortable: true,
            selector: (item) => {
                return item.assign_to ? item.assign_to : 'not assigned'
            }
        },
        {
            name: 'Status',
            minWidth: '120px',
            sortable: true,
            selector: row => {
                return row.status === 'pending' ? <Badge pill color='danger' className='badge-center'>
                Pending
              </Badge> : row.status === 'in_progress' ?  <Badge pill color='warning' className='badge-center'>
                In Progress
              </Badge> : <Badge pill color='success' className='badge-center'>
                Solved
              </Badge>
            }
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="View">
                        <Eye size={15}
                            color='green'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setComplainInfo(row)
                                setModal1(true)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                setComplainInfo(row)
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
        const keys = ['id', 'complain_title', 'complain_description', 'image_url', 'category', 'complain_priority', 'assign_to', 'status', 'created_by_name', 'created_at']
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
        doc.text('Complain List', 14, 10)
        doc.autoTable({
            body: [...list],
            columns: [
                { header: 'ID', dataKey: 'id' }, { header: 'Title', dataKey: 'complain_title' }, { header: 'Title', dataKey: 'complain_title' },
                { header: 'Description', dataKey: 'complain_description' }, { header: 'Category', dataKey: 'category' }, { header: 'Priority', dataKey: 'complain_priority' },
                { header: 'Status', dataKey: 'status' }, { header: 'Assigned', dataKey: 'assign_to' }, { header: 'Created By', dataKey: 'created_by_name' }, { header: 'Created At', dataKey: 'created_at' }
            ],
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
          })
        doc.save('export.pdf')
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>All Complains</CardTitle>
                <div className='d-flex mt-md-0 mt-1'>
                    <UncontrolledButtonDropdown>
                    <DropdownToggle color='secondary' caret outline>
                        <Share size={15} />
                        <span className='align-middle ml-50'>Export</span>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem className='w-100' onClick={() => downloadCSV(complainList)}>
                            <FileText size={15} />
                            <span className='align-middle ml-50'>CSV</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportToXL(complainList)}>
                            <Grid size={15} />
                            <span className='align-middle ml-50'>Excel</span>
                        </DropdownItem>
                        <DropdownItem className='w-100' onClick={() => exportPDF(complainList)}>
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
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : complainList} TableDataLoading={TableDataLoading} />
          
            <EditModal
                toggleModal={toggleModal}
                modal={modal}
                resetData={resetData}
                setReset={setReset}
                complainInfo={complainInfo}
                setComplainInfo={setComplainInfo}
            />
            <ViewModal
                toggleModal1={toggleModal1}
                modal1={modal1}
                complainInfo={complainInfo}
            />
        </Card>
    )
}

export default ComplainList