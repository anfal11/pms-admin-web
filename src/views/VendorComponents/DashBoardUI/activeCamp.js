import React, { Fragment, useState, useEffect } from 'react'
import useJwt from '@src/auth/jwt/useJwt'
import {
    Cast
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap'
import Select from 'react-select'
import { formatReadableDate } from '../../helper'
import CommonDataTable from '../ClientSideDataTable'
import { handle401 } from '@src/views/helper'
import {BMS_USER, BMS_PASS} from '../../../Configurables'

const ActiveCampaignList = ({ getDashBoarddata }) => {
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [resetData, setReset] = useState(true)
    const [activeCampList, setActiveCampList] = useState([])

    useEffect(() => {
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', true)
        setTableDataLoading(true)
        useJwt.activeCampaignList().then(res => {
            console.log('activeCampaign', res)
            setActiveCampList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response?.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                  localStorage.setItem('BMStoken', res.data.jwtToken)
                  localStorage.setItem("BMSCall", false)
                  setReset(!resetData)
                }).catch(err => {
                  localStorage.setItem("BMSCall", false)
                  console.log(err)
                })
            } else {
                Error(err)
                console.log(err)
                localStorage.setItem('useBMStoken', false)
            }
        }).finally(f => {
            setTableDataLoading(false)
        })
    }, [])
    const column = [
        {
            name: 'Campaign Name',
            minWidth: '250px',
            sortable: true,
            selector: 'campaignName'
        },
        {
            name: 'Commission Receiver',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.receiver === 's' ? 'Sender' : row.receiver === 'r' ? 'Reciever' : row.receiver === 'b' ? 'Both' : ''
            }
        },
        {
            name: 'Service ID',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.serviceId
            }
        },
        {
            name: 'Start Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.createDate ? formatReadableDate(item.ruleInfo.startDate) : '---'
            }
        },
        {
            name: 'End Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.createDate ? formatReadableDate(item.ruleInfo.endDate) : '---'
            }
        },
        {
            name: 'Created By',
            minWidth: '100px',
            sortable: true,
            selector: 'createBy'
        },
        {
            name: 'Approved By',
            minWidth: '100px',
            sortable: true,
            selector: 'approvedBy'
        },
        {
            name: 'Approve Date',
            minWidth: '250px',
            sortable: true,
            selector: (item) => {
                return item.approveDate ? formatReadableDate(item.ruleInfo.approveDate) : '---'
            }
        },
        {
            name: 'Status',
            minWidth: '100px',
            sortable: true,
            selector: row => {
                return row.isActive  ? 'Active' : 'Inactive'
            }
        }
    ]
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <div className='d-flex align-items-center'>
                    <Cast color='blue' fill='blue' size={16}/>
                    <h5 style={{margin:'0 0 0 10px', color:'#999999', fontWeight:'bold'}}>Active Campaigns</h5>
                </div>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md='12'>
                        <CommonDataTable column={column} TableData={activeCampList} TableDataLoading={TableDataLoading} />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default ActiveCampaignList