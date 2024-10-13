import React, { Fragment, useState, useEffect } from 'react'
import useJwt2 from '@src/auth/jwt/useJwt2'
import {
    Bell
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap'
import Select from 'react-select'
import { formatReadableDate } from '../../helper'
import ServerSideDataTable from '../ServerSIdeDataTable'
import { handle401 } from '@src/views/helper'

const TransactionList = ({ getDashBoarddata }) => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [NotificationReport, setNotificationReport] = useState([])
    const [RowCount, setRowCount] = useState(1)
    const [currentPage, setCurrentPage] = useState(0)
    function addDays(numDays) {
        const nowDate = new Date()
        nowDate.setDate(nowDate.getDate() + numDays)
        const dd = String(nowDate.getDate()).padStart(2, '0')
        const mm = String(nowDate.getMonth() + 1).padStart(2, '0')
        const y = nowDate.getFullYear()
        return `${y}-${mm}-${dd}`
    }
    function minDays(numDays) {
        const nowDate = new Date()
        nowDate.setDate(nowDate.getDate() - numDays)
        const dd = String(nowDate.getDate()).padStart(2, '0')
        const mm = String(nowDate.getMonth() + 1).padStart(2, '0')
        const y = nowDate.getFullYear()
        return `${y}-${mm}-${dd}`
    }
    const [userInput, setUserInput] = useState({
        startDate: minDays(180),
        endDate: addDays(0)
    })
    const { startDate, endDate } = userInput
    const getData = (page, limit, startDate, endDate) => {
        console.log({ page, limit, startDate, endDate })
        setTableDataLoading(true)
        useJwt2.getNotificationReport({ page, limit, startDate, endDate }).then(res => {
            console.log('NotificationReport', res)
            setRowCount(res.data.payload.count)
            setNotificationReport(res.data.payload.rows)
        }).catch(err => {
            handle401(err.response?.status)
            console.log(err.response)
        }).finally(f => {
            setTableDataLoading(false)
        })
    }
    const handlePagination = page => {
        getData(page.selected + 1, 5, startDate, endDate)
        setCurrentPage(page.selected)
    }

    useEffect(() => {
        getData(1, 5, startDate, endDate)
    }, [])

    const column = [
        {
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.created_at ? formatReadableDate(row.created_at) : 'N/A' }
        },
        {
            name: 'Created By',
            minWidth: '120px',
            selector: 'created_by_name'
        },
        {
            name: 'Is Ad Scheduled?',
            minWidth: '100px',
            selector: row => {
                return row.isAdScheduled ? 'True' : 'False'
            }
        },
        {
            name: 'Is Repeat?',
            minWidth: '100px',
            selector: row => {
                return row.isRepeat ? 'True' : 'False'
            }
        },
        {
            name: 'Is Scheduled?',
            minWidth: '100px',
            selector: row => {
                return row.isScheduled ? 'True' : 'False'
            }
        },
        {
            name: 'Is Ad?',
            minWidth: '100px',
            selector: row => {
                return row.is_Ad ? 'True' : 'False'
            }
        },
        {
            name: 'Is Rule Base Notification?',
            minWidth: '100px',
            selector: row => {
                return row.is_rule_base_notification ? 'True' : 'False'
            }
        }
    ]
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <div className='d-flex align-items-center'>
                    <Bell color='blue' fill='blue' size={16}/>
                    <h5 style={{margin:'0 0 0 10px', color:'#999999', fontWeight:'bold'}}>Recent Notification</h5>
                </div>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md='12'>
                    <ServerSideDataTable
                        currentPage={currentPage}
                        handlePagination={handlePagination}
                        RowCount={RowCount}
                        column={column}
                        TableData={NotificationReport}
                        TableDataLoading={TableDataLoading} />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default TransactionList