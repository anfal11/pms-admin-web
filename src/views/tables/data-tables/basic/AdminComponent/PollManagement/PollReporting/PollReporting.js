import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
    ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import useJwt from '@src/auth/jwt/useJwt2'
import ServerSideDataTable from '../../../ServerSideDataTable'
import { Success, Error } from '../../../../../../viewhelper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../../helper'
import ExportTableData from '../ExportTableData'
const MySwal = withReactContent(Swal)
import { handle401 } from '@src/views/helper'

const PollReporting = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [PollList, setPollList] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)

    const getData = (page, limit) => {
        localStorage.setItem("useAkashtoken", true)
        setTableDataLoading(true)
        useJwt.pollReportingList({ page, limit }).then(res => {
            // console.log('pollReportingList', res.data.payload)
            setRowCount(res.data.payload.count)
            setPollList(res.data.payload.list)
        }).catch(err => {
            console.log(err)
        }).finally(f => {
            localStorage.setItem("useAkashtoken", false)
            setTableDataLoading(false)
        })
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        getData(page.selected + 1, 10)
        setCurrentPage(page.selected)
    }

    useEffect(() => {
        getData(1, 10)
    }, [])
    const handleResponders = (form_id, title) => {
        toast.info('Please wait, \n CSV is processing...', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
        localStorage.setItem("useAkashtoken", true)
        useJwt.pollReportUsers({ form_id }).then(res => {
            const DataArray = res.data.payload.respondedCustomers || []
            ExportCSV(DataArray, ['name', 'email', 'mobile'], title.replaceAll(/\s/g, ''))
            // console.log('pollReportUsers', DataArray)
            localStorage.setItem("useAkashtoken", false)
        }).catch(err => {
            localStorage.setItem("useAkashtoken", false)
            console.log(err)
        })
    }
    const column = [
        {
            name: 'Form Name',
            minWidth: '150px',
            selector: 'title'
        },
        {
            name: 'Effective Date',
            minWidth: '200px',
            selector: row => formatReadableDate(row.effective_date)
        },
        {
            name: 'Expire at',
            minWidth: '200px',
            selector: row => formatReadableDate(row.expire_date)
        },
        {
            name: 'Response',
            minWidth: '50px',
            selector: row => row.poll_answers.length
        },
        {
            name: 'Status',
            minWidth: '100px',
            selector: row => {
                return row.status ? <Badge tag='div' color='light-success' pill>
                    Active
                </Badge> : <Badge tag='div' color='light-danger' pill>
                    Inactive
                </Badge>
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            selector: 'created_by'
        },
        {
            name: 'Created Date',
            minWidth: '200px',
            selector: row => formatReadableDate(row.created_at)
        }
    ]
    const TableOneActions = [
        {
            name: 'Action',
            selector: row => {
                return <>
                    <Eye size={15} color='teal' style={{ cursor: 'pointer' }}
                        onClick={e => {
                            localStorage.setItem('PollReportDetails', JSON.stringify(row))
                            history.push(`/PollReportDetails/${row.id}`)
                        }}
                    />&nbsp;&nbsp;<FileText size={13} color='green' style={{ cursor: 'pointer' }}
                        onClick={e => handleResponders(row.id, row.title)}
                    />
                    {/*&nbsp;&nbsp;<Spinner size={'sm'} color='success' style={{ cursor: 'pointer' }}
                        onClick={e => handleResponders(row.id)}
                    />*/}
                </>
            },
            minWidth: '100px'
        }
    ]
    return (
        <Card>
            <CardHeader>
                <CardTitle>Poll Reporting</CardTitle>
                <ExportTableData DataArray={PollList} dataHeaderKeys={[{ header: 'Title', dataKey: 'title' }, { header: 'Effective Date', dataKey: 'effective_date' }, { header: 'Expire Date', dataKey: 'expire_date' }, { header: 'Created at', dataKey: 'created_at' }, { header: 'Created by', dataKey: 'created_by' }]} InvoiceTitle={'Poll List'} />
            </CardHeader>
            <ServerSideDataTable
                currentPage={currentPage}
                handlePagination={handlePagination}
                RowCount={RowCount}
                column={[...column, ...TableOneActions]}
                TableData={PollList}
                RowLimit={10}
                TableDataLoading={TableDataLoading} />
        </Card>
    )
}

export default PollReporting