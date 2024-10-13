import React, { useEffect, useState } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, CheckCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import CommonDataTable from '../../VendorComponents/ClientSideDataTable'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import DetailsModal from './ViewDetails'
const MySwal = withReactContent(Swal)
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ViewModal from './View'

const Approve = ({ menuSubmenus, TableDataLoading, UserList, refresh, setRefresh }) => {
    const [userInfo, setUserInfo] = useState({})
    const [action, setAction] = useState(0)

    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)

    const [modal2, setModal2] = useState(false)
    const toggleModal2 = () => setModal2(!modal2)
    
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

     // ** Function to handle filter
     const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = UserList.filter(item => {
            const startsWith =
            item.username?.toLowerCase().startsWith(value.toLowerCase()) ||
            item.fullname?.toLowerCase().startsWith(value.toLowerCase()) ||
            item.emailid?.toLowerCase().startsWith(value.toLowerCase())

            const includes =
            item.username?.toLowerCase().includes(value.toLowerCase()) ||
            item.fullname?.toLowerCase().includes(value.toLowerCase()) ||
            item.emailid?.toLowerCase().includes(value.toLowerCase()) 

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
            name: 'Username',
            minWidth: '180px',
            sortable: true,
            selector: 'username'
        },
        {
            name: 'Fullname',
            minWidth: '250px',
            sortable: true,
            selector: 'fullname'
        },
        {
            name: 'Email',
            minWidth: '250px',
            sortable: true,
            selector: 'emailid'
        },
        {
            name: 'Role-Name',
            minWidth: '250px',
            sortable: true,
            selector: (row) => {
                return row['role_info'] ? row['role_info']['role_name'] : ""
            }
        },
        {
            name: 'Operation',
            minWidth: '100px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Created-By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Status',
            minWidth: '100px',
            // sortable: true,
            selector: row => {
                const statusBG = {
                    0: { title: 'Inactive', color: 'light-danger' },
                    1: { title: 'Active', color: 'light-success' }
                }
                return <Badge color={statusBG[row.userstatus].color} pill className='px-1'>
                    {statusBG[row.userstatus].title}
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
                            color='dodgerblue'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setUserInfo(row)
                                setModal2(true)
                            }}
                        />
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;

                    <span title="Approve">
                        <CheckCircle size={15}
                            color='dodgerblue'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setUserInfo(row)
                                setModal(true)
                                setAction(1)
                            }}
                        />
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Reject">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                setUserInfo(row)
                                setModal(true)
                                setAction(2)
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
    const keys = ['username', 'fullname', 'emailid', 'userstatus']
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
        doc.text('Pending User List', 14, 10)
        doc.autoTable({
        body: [...list],
        columns: [
            { header: 'Username', dataKey: 'username' }, { header: 'Full Name', dataKey: 'fullname' }, { header: 'Email', dataKey: 'emailid' },
                { header: 'Status', dataKey: 'userstatus' }
            ],
            // columns: [...Object.keys(list[0]).map(k => { return { header: k.toUpperCase(), dataKey: k } })],
            styles: { cellPadding: 1.5, fontSize: 8 }
        })
        doc.save('export.pdf')
    }

    return (
        <Card>
            <Row className='justify-content-end mx-0'>
                <Col sm='2'>
                    <div className='m-1'>
                            <UncontrolledButtonDropdown>
                                <DropdownToggle color='secondary' caret outline>
                                    <Share size={15} />
                                    <span className='align-middle ml-50'>Export</span>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem className='w-100' onClick={() => downloadCSV(UserList)}>
                                        <FileText size={15} />
                                        <span className='align-middle ml-50'>CSV</span>
                                    </DropdownItem>
                                    <DropdownItem className='w-100' onClick={() => exportToXL(UserList)}>
                                        <Grid size={15} />
                                        <span className='align-middle ml-50'>Excel</span>
                                    </DropdownItem>
                                    <DropdownItem className='w-100' onClick={() => exportPDF(UserList)}>
                                        <File size={15} />
                                        <span className='align-middle ml-50'>
                                            PDF
                                        </span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </div>
                 </Col>
            </Row>
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
            <Row>
                <Col md='12'>
                    <CommonDataTable column={column} TableData={searchValue.length ? filteredData : UserList} TableDataLoading={TableDataLoading} />
                </Col>
            </Row>
            <DetailsModal 
                modal={modal}
                toggleModal={toggleModal}
                userInfo={userInfo} 
                refresh={refresh}
                setRefresh={setRefresh}
                action={action}  
                menuSubmenus={menuSubmenus} 
            />
            <ViewModal 
                modal={modal2}
                toggleModal={toggleModal2}
                userInfo={userInfo}   
                menuSubmenus={menuSubmenus}
            />
        </Card>
    )
}

export default Approve