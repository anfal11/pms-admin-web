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
import ServerSideDataTable from '../../ServerSideDataTable'
import { Success, Error } from '../../../../../viewhelper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
const MySwal = withReactContent(Swal)
import { handle401 } from '@src/views/helper'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'

const ServicePoinRuleHistory = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [resetData, setReset] =  useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [servicePoinRuleHistory, setServicePoinRuleHistory] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [serviceList, setserviceList] = useState([])
    const [tierList, settierList] = useState([])

    const getData = (page, limit) => {
        console.log({ page, limit })
        setTableDataLoading(true)
        useJwt.servicePoinRuleHistory({ page, limit }).then(res => {
            console.log('servicePoinRuleHistory', res)
            setRowCount(res.data.payload.count)
            setServicePoinRuleHistory(res.data.payload.rows)
        }).catch(err => {
            handle401(err.response?.status)
            console.log(err.response)
        }).finally(f => {
            setTableDataLoading(false)
        })
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        getData(page.selected + 1, 50)
        setCurrentPage(page.selected)
    }

    useEffect(async () => {
        localStorage.setItem('useBMStoken', false)
        await useJwt.getServiceList().then(res => {
            console.log(res)
            setserviceList(res.data.payload)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            Error(err)
            console.log(err.response)
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.tierList().then(res => {
            console.log('tierList', res.data)
            settierList(res.data.payload)
            // setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            // setTableDataLoading(false)
        })
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, 50)
    }, [resetData])
    
    const column = [
        {
            name: 'SL',
            width: '100px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Title',
            minWidth: '250px',
            sortable: true,
            selector: 'rule_title'
        },
        {
            name: 'Details',
            minWidth: '250px',
            sortable: true,
            selector: 'rule_details'
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
                return serviceList.find(s => s.service_id === row.service_id)?.keyword_description
            }
        },
        {
            name: 'Point Conversion Rate',
            minWidth: '100px',
            sortable: true,
            selector: 'amount'
        },
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
                return tierList.find(t => t.id === row.tire)?.Tier
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
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.created_at ? formatReadableDate(item.created_at) : null
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'created_by'
        },
        {
            name: 'Approved Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.approved_date ? formatReadableDate(item.approved_date) : null
            }
        },
        {
            name: 'Approved By',
            minWidth: '100px',
            sortable: true,
            selector: 'approved_by'
        },
        {
            name: 'Operation',
            minWidth: '200px',
            sortable: true,
            selector: 'operation_type'
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
                <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
                    ExportCSV(servicePoinRuleHistory, Object.keys(servicePoinRuleHistory[0]), 'Campaign History')
                    }}>
                        Export CSV
                    </Button.Ripple>
            </CardHeader>
            <ServerSideDataTable
                currentPage={currentPage}
                handlePagination={handlePagination}
                RowCount={RowCount}
                column={[...column]}
                TableData={servicePoinRuleHistory}
                RowLimit={50}
                TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default ServicePoinRuleHistory