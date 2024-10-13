import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt'
import ServerSideDataTable from '../../../ServerSideDataTable'
import { Success, Error } from '../../../../../../viewhelper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../../helper'
const MySwal = withReactContent(Swal)
import { BMS_PASS, BMS_USER } from '../../../../../../../Configurables'
import CommonDataTable from '../../ClientSideDataTable'

const DatapackList = ({datapackList, TableDataLoading, refresh, setrefresh}) => {
    const [searchValue, setsearchValue] = useState('')
    const history = useHistory()
    const deleteFunc = (id) => {
        return MySwal.fire({
            title: 'Do you want to Delete?',
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
                return useJwt.datapackDelete({ id: parseInt(id) }).then(res => {
                  
                    console.log(res)
                    Success(res)
                    setrefresh(!refresh)
                    
                }).catch(err => {
                    Error(err)
                    console.log(err)
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
            name: 'Name',
            minWidth: '250px',
            sortable: true,
            selector: 'name',
            wrap: true
        },
        {
            name: 'Operator',
            minWidth: '100px',
            sortable: true,
            selector: 'operator'
        },
        {
            name: 'Volume In MB',
            minWidth: '100px',
            sortable: true,
            selector: 'volumeInMB'
        },
        {
            name: 'Pack Code',
            minWidth: '100px',
            sortable: true,
            selector: 'packcode',
            wrap: true
        },
        {
            name: 'Created By',
            minWidth: '150px',
            sortable: true,
            selector: 'createdBy',
            wrap: true
        },
        {
            name: 'Created At',
            minWidth: '170px',
            sortable: true,
            wrap: true,
            sortType: (a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
              },
            selector: 'created_at',
            cell: (item) => {
                return item.createdAt ? formatReadableDate(item.createdAt) : null
            }
        },
        {
            name: 'Action',
            minWidth: '100px',
            // sortable: true,
            selector: row => {
                return <>
                    <span title="Edit">
                        <Edit size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                history.push('/editDatapackList')
                                localStorage.setItem('datapackInfo', JSON.stringify(row))
                            }}
                        />
                    </span> &nbsp;&nbsp;
                    <span title="Delete">
                        <Trash size={15}
                            color='red'
                            style={{ cursor: 'pointer' }}
                            onClick={() => deleteFunc(row.id)}
                        />
                    </span>
                </>
            }
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
                <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
                    ExportCSV(datapackList, Object.keys(datapackList[0]), 'Datapack List')
                }}>
                    Export CSV
                </Button.Ripple>
            </CardHeader>
            <CommonDataTable column={column} TableData={searchValue.length ? filteredData : datapackList} TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default DatapackList