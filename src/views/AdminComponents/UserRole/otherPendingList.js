import React, { useState } from 'react'
import { FileText, Share, Trash, CheckCircle, Eye } from 'react-feather'
import { Card, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown, CardBody } from 'reactstrap'
import CommonDataTable from '../../VendorComponents/ClientSideDataTable'
import { ExportCSV, formatReadableDate } from '../../helper'
import { Error, Success } from '../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
const MySwal = withReactContent(Swal)
import DetailsModal from './ViewDetails'

const OtherPendingListView = ({TableDataLoading, roleList, history, setRefresh, refresh}) => {
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const user = JSON.parse(localStorage.getItem('userData'))
    const [action, setAction] = useState(0)
    const [roleInfo, setRoleInfo] = useState({})
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    
    const column = [
        {
            name: 'Role Name',
            minWidth: '100px',
            sortable: true,
            selector: 'role_name'
        },
        {
            name: 'Assign-user-count',
            minWidth: '100px',
            sortable: true,
            selector: (row) => row['users'].length
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Created At',
            minWidth: '250px',
            sortable: true,
            sortType: (a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)
              },
            selector: row => {
                return row.created_at ? formatReadableDate(row.created_at) : ''
            }
        },
        {
            name: 'Request Action',
            minWidth: '100px',
            sortable: true,
            selector: 'action'
        },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return user.id === row.created_by ? 'Pending (You created this.)' : <>
                <span title="View">
                        <Eye size={15}
                            color='dodgerblue'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                history.push(`/viewUserPendingRole/${row.id}`)
                            }}
                        />
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span title="Approve">
                        <CheckCircle size={15}
                            color='dodgerblue'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                // handlePoPupActions(row.id, 1)
                                setRoleInfo(row)
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
                                // handlePoPupActions(row.id, 2)
                                setRoleInfo(row)
                                setModal(true)
                                setAction(2)
                            }}
                        />
                    </span>
                </>
            }
        }
    ]
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
        updatedData = roleList.filter(item => {
            const startsWith =
            item.role_name?.toLowerCase().startsWith(value.toLowerCase()) 

            const includes =
            item.role_name?.toLowerCase().includes(value.toLowerCase())

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
    return (
        <Card>

            <CardHeader>

            <Row style={{width: '100%'}}>
                    <Col className='d-flex align-items-center mt-1' sm='6'>
                        <Label className='mr-1' for='search-input'>
                        Search
                        </Label>
                            <Input
                                style={{maxWidth: 300}}
                                className='dataTable-filter mb-50'
                                type='text'
                                bsSize='sm'
                                id='search-input'
                                value={searchValue}
                                onChange={handleFilter}
                                />
                    </Col>
                    <Col className='d-flex align-items-center justify-content-end mt-1' sm='6'>
                            <UncontrolledButtonDropdown className='ml-1'>
                                            <DropdownToggle color='secondary' caret outline>
                                                <Share size={15} />
                                                <span className='align-middle ml-50'>Export</span>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem className='w-100' onClick={() => ExportCSV(roleList, Object.keys(roleList[0] || {}), 'User Role')}>
                                                    <FileText size={15} />
                                                    <span className='align-middle ml-50'>CSV</span>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                    </Col>
                </Row>

            </CardHeader>
            <CardBody>
            <Row>
                <Col md='12'>
                    <CommonDataTable column={column} TableData={searchValue.length ? filteredData : roleList} TableDataLoading={TableDataLoading} />
                </Col>
            </Row>
            </CardBody>
            <DetailsModal 
                modal={modal}
                toggleModal={toggleModal}
                roleInfo={roleInfo} 
                refresh={refresh}
                setRefresh={setRefresh}
                action={action}  
            />
        </Card>
    )
}

export default OtherPendingListView