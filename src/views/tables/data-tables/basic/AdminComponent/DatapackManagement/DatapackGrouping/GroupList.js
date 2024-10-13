import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Eye, Edit, Trash} from 'react-feather'
// import CommonDataTable from '../../../../tables/data-tables/basic/AdminComponent/ClientSideDataTable'
import { subMenuIDs } from '../../../../../../../utility/Utils'
import { formatReadableDate } from '../../../../../../helper'
import { Badge, Row, Col, Label, Input } from 'reactstrap'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CommonDataTable from '../../ClientSideDataTable'
import { useHistory } from 'react-router-dom'
const MySwal = withReactContent(Swal)

const GroupList = ({datapackGroupList, rule_type, TableDataLoading, setrefresh, refresh, setgroupEditData}) => {
    const history = useHistory()
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const editDetails = (e, item) => {
        localStorage.setItem('datapackInfo', JSON.stringify(item))
        history.push('/editDatapack')
    }

    const deleteDetails = (e, item) => {
        e.preventDefault()
        return MySwal.fire({
            title: 'Do you want to Delete',
            text: `Information will be delete when another user will approve this operation.`,
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
                return useJwt.datapackGroupDelete({ id: item.id }).then(res => {
                  
                    console.log(res)
                    Success({data: {message : res.data.message}})
                    setrefresh(refresh + 1)
                    
                }).catch(err => {
                    Error(err)
                    console.log(err.response)
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
            updatedData = datapackGroupList.filter(item => {
                const startsWith =
                item.id?.toLowerCase().startsWith(value.toLowerCase()) ||
                item.group_title?.toLowerCase().startsWith(value.toLowerCase())
    
                const includes =
                item.id?.toLowerCase().includes(value.toLowerCase()) ||
                item.group_title?.toLowerCase().includes(value.toLowerCase())
    
                if (startsWith) {
                  return startsWith
                } else if (!startsWith && includes) {
                return includes
                } else return null

            })
            setFilteredData(updatedData)
           // setSearchValue(value)
            }
    }

    const column = [
        {
            name: 'Group ID',
            minWidth: '50px',
            sortable: true,
            selector: 'id',
            wrap: true
        },
        {
            name: 'Group Title',
            minWidth: '150px',
            sortable: true,
            selector: 'group_title',
            wrap: true
        },
        {
            name: 'Operator',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row?.group_items?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e?.keyword}</div>)
            }
        },
        {
            name: 'Pack Code',
            minWidth: '50px',
            sortable: true,
            wrap: true,
            selector: row => {
                return row?.group_items?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{e.pack_code || '--'}</div>)
            }
        },
        {
            name: 'Disburse-Unit',
            minWidth: '50px',
            sortable: true,
            selector: row => {
                return row?.group_items?.map(e => <div style={{padding:'5px 0', borderBottom:'1px solid #E0E0E0', width:'100px'}}>{`${e.number_of_time_api_hit} X` || '--'}</div>)
            }
        },
        {
            name: 'Modified By',
            minWidth: '150px',
            sortable: true,
            selector: 'modified_by',
            cell: (item) => {
                return item.modified_by ? item.modified_by : item.created_by
            },
            wrap: true
        },
        {
            name: 'Modified At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.modified_at) - new Date(a.modified_at)
              },
            selector: 'modified_at',
            cell: (item) => {
                if (item.modified_at) {
                    return  formatReadableDate(item.modified_at)
                } else if (item.created_at) {
                    return  formatReadableDate(item.created_at)

                } else {
                    return '--'
                }
            }
        },
        // {
        //     name: 'Status',
        //     minWidth: '60px',
        //     sortable: true,
        //     wrap: true,
        //     selector: (item) => {
        //         if (item.status === 1) {
        //             return <Badge color= 'light-success'>Active</Badge>
        //         }
        //        return <Badge color= 'light-danger'>Pending</Badge>
        //     }
        // },
        {
            name: 'Action',
            minWidth: '150px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='#3b3acb'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => editDetails(e, row) }
                        />
                    </span> &nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => deleteDetails(e, row) }
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <Fragment>

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
                  <CommonDataTable column={column} TableData={ searchValue.length ? filteredData : datapackGroupList} TableDataLoading={TableDataLoading} />
                </Col>
            </Row>


        </Fragment>
    )
}

export default GroupList