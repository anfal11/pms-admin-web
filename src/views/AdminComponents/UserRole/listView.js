import React, { Fragment, useState } from 'react'
import { FileText, Share, Edit, Trash, Eye } from 'react-feather'
import { Badge, Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown } from 'reactstrap'
import CommonDataTable from '../../VendorComponents/ClientSideDataTable'
import { ExportCSV, formatReadableDate } from '../../helper'
import { Error, Success } from '../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
const MySwal = withReactContent(Swal)

const ListView = ({TableDataLoading, roleList, history, setRefresh, refresh}) => {
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleDelete = (id, message) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: message,
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
                return useJwt.deleteRole({ role_id: id }).then(res => {
                    Success(res)
                    console.log(res)
                    setRefresh(!refresh)
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

    const handleDeleteWarning = () => {
        return MySwal.fire({
            title: 'Delete assigned users first',
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            showConfirmButton : false,
            customClass: {
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: false,
            buttonsStyling: false
        }).then(function (result) {
            if (result.isConfirmed) {
            }
        })
    }

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
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return row.user_type === 200 ? 'Super Admin' : <Fragment>
                <span title="View">
                        <Eye size={15}
                            color='dodgerblue'
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                history.push(`/viewUserRole/${row.id}`)
                            }}
                        />
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                <span title="Edit">
                    <Edit size={15} color='blue'
                     style={{ cursor: 'pointer' }}
                        onClick={e => {
                            history.push(`/editUserRole/${row.id}`)
                        }}
                    />
                </span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span title="Delete">
                    <Trash size={15}
                        color='red'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            if (row['users'].length === 0) {
                                handleDelete(row.id, 'Do you want to delete?')
                            } else {
                                handleDeleteWarning()
                            }
                        }}
                    />
                </span>
            </Fragment>
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

        </Card>
    )
}

export default ListView