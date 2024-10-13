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

const LoyaltyReport = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [RowCount1, setRowCount1] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [currentPage1, setCurrentPage1] = useState(0)
    const [LoyaltyReport, setLoyaltyReport] = useState([])
    const [LoyaltyReport1, setLoyaltyReport1] = useState([])
    const [voucherList, setVoucherList] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [serviceList, setserviceList] = useState([])
    const [activeTab, setActiveTab] = useState('1')
    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
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
        startDate: minDays(1),
        endDate: addDays(0)
    })
    const { startDate, endDate } = userInput

    const getData = (page, limit, startDate, endDate) => {
        console.log({ page, limit, startDate, endDate })
        setTableDataLoading(true)
        // useJwt.earnedTransactionHistory({ page, limit, startDate, endDate }).then(res => {
        //     console.log('LoyaltyReport', res)
        //     setRowCount(res.data.payload.count)
        //     setLoyaltyReport(res.data.payload.rows)
        //     // setLoyaltyReport(res.data.payload)
        // }).catch(err => {
        //     handle401(err.response?.status)
        //     console.log(err.response)
        // }).finally(f => {
        //     setTableDataLoading(false)
        // })

        setTableDataLoading(false)
    }
    const getData1 = (page, limit, startDate, endDate) => {
        console.log({ page, limit, startDate, endDate })
        setTableDataLoading(true)
        // useJwt.redeemedTransactionHistory({ page, limit, startDate, endDate }).then(res => {
        //     console.log('LoyaltyReport1', res)
        //     setRowCount1(res.data.payload.count)
        //     setLoyaltyReport1(res.data.payload.rows)
        //     // setLoyaltyReport(res.data.payload)
        // }).catch(err => {
        //     handle401(err.response?.status)
        //     console.log(err.response)
        // }).finally(f => {
        //     setTableDataLoading(false)
        // })
        setTableDataLoading(false)
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        getData(page.selected + 1, 50, startDate, endDate)
        setCurrentPage(page.selected)
    }
    const handlePagination1 = page => {
        getData1(page.selected + 1, 50, startDate, endDate)
        setCurrentPage1(page.selected)
    }

    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(1, 50, startDate, endDate)
        getData1(1, 50, startDate, endDate)
        localStorage.setItem('useBMStoken', true)
        await useJwt.getServiceList().then(res => {
            console.log(res)
            setserviceList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response.status === 401) {
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
            }
            console.log(err.response)
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
        //localStorage.setItem('usePMStoken', true)
        // await useJwt.allVouchersList().then(res => {
        //     setTableDataLoading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(res)
        //     const tempV = []
        //     for (const p in res.data.payload) {
        //         for (const pp of res.data.payload[p]) {
        //             tempV.push(pp)
        //         }
        //     }
        //     setVoucherList(tempV)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     Error(err)
        //     console.log(err.response)
        //     setTableDataLoading(false)
        // })
    }, [])
    const column = [
        {
            name: 'Rule Title',
            minWidth: '150px',
            selector: row => {
                return row.title ? row.title : '---' 
            }
        },
        {
            name: 'service type',
            minWidth: '120px',
            sortable: true,
            selector: row => {
                return serviceList.find(s => s.serviceId === row.servicetype)?.serviceKeyword
            }
        },
        {
            name: 'Type',
            minWidth: '120px',
            selector: 'Type'
        },
        {
            name: 'Point',
            minWidth: '100px',
            selector: 'Point'
        },
        {
            name: 'Payment TransactionId',
            minWidth: '250px',
            selector: 'PaymentTransactionId'
        },
        {
            name: 'Payment Amount',
            minWidth: '80px',
            selector: 'PaymentAmount'
        },
        {
            name: 'Operation',
            minWidth: '80px',
            selector: 'Operation'
        },
        {
            name: 'Is Refunded?',
            minWidth: '80px',
            selector: row => {
                return row.IsRefunded ? 'True' : 'False'
            }
        },
        {
            name: 'Refund Transaction ID',
            minWidth: '120px',
            selector: row => { return row.RefundTransactionId ? row.RefundTransactionId : 'N/A' }
        },
        {
            name: 'Refunded Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.RefundedAt ? formatReadableDate(row.RefundedAt) : 'N/A' }
        },
        {
            name: 'Transaction ID',
            minWidth: '250px',
            selector: 'TransactionId'
        },
        {
            name: 'Membership ID',
            minWidth: '180px',
            selector: 'MembershipId'
        },
        {
            name: 'Merchant ID',
            minWidth: '180px',
            selector: 'MerchantId'
        },
        {
            name: 'Reward Point',
            minWidth: '100px',
            selector: 'RewardPoint'
        },
        {
            name: 'Reward Point Receiver',
            minWidth: '120px',
            selector: 'RewardPointReceiver'
        },
        {
            name: 'Reward Point Receiver Rate',
            minWidth: '100px',
            selector: 'RewardPointReceiverRate'
        },
        {
            name: 'Reward Rate',
            minWidth: '100px',
            selector: 'RewardRate'
        },
        {
            name: 'Status',
            minWidth: '100px',
            selector: 'Status'
        },
        {
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.CreatedAt ? formatReadableDate(row.CreatedAt) : 'N/A' }
        },
        {
            name: 'Point Expiry Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.expirypointdate ? formatReadableDate(row.expirypointdate) : 'N/A' }
        }
    ]
    const column1 = [
        {
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.CreatedAt ? formatReadableDate(row.CreatedAt) : 'N/A' }
        },
        // {
        //     name: 'Voucher',
        //     minWidth: '150px',
        //     selector: row => {
        //         return voucherList.find(vl => vl.Id === row.VoucherId)?.Description
        //     }
        // },
        {
            name: 'Voucher Type',
            minWidth: '150px',
            sortable: true,
            selector: 'VoucherType'
        },
        {
            name: 'Voucher Description',
            minWidth: '150px',
            sortable: true,
            selector: 'Description'
        },
        {
            name: 'Point',
            minWidth: '100px',
            selector: 'Point'
        },
        {
            name: 'Voucher Value',
            minWidth: '100px',
            selector: 'VoucherValue'
        },
        {
            name: 'Title',
            minWidth: '250px',
            selector: row => {
                return row.title ? row.title : '---' 
            }
        },
        {
            name: 'Transaction ID',
            minWidth: '180px',
            selector: 'TransactionId'
        },
        {
            name: 'Membership ID',
            minWidth: '180px',
            selector: 'MembershipId'
        },
        {
            name: 'Destination Membership ID',
            minWidth: '180px',
            selector: 'DestMembershipId'
        },
        {
            name: 'Product Id',
            minWidth: '180px',
            selector: 'ProductId'
        }
    ]
    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        
        getData(1, 50, startDate, endDate)
      
    }
    const onSubmit1 = e => {
        e.preventDefault()
        
        getData1(1, 50, startDate, endDate)
      
    }
    return (
        <Fragment>
            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1') }}
                            > Earned History
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2') }}
                            >Redeemed History
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardBody>
            </Card>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                <>
                    <Card>
                        <Form className="row p-1" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                            <Col md="3" >
                                <FormGroup>
                                    <Label for="startDate">Start Date</Label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        id='startDate'
                                        value={userInput.startDate}
                                        onChange={onChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" >
                                <FormGroup>
                                    <Label for="endDate">Expiry Date</Label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        id='endDate'
                                        value={userInput.endDate}
                                        onChange={onChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3" className='text-center'>
                                {
                                    TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                        <span >Search</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Form>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                            <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
                                ExportCSV(LoyaltyReport, Object.keys(LoyaltyReport[0]), 'Loyalty Earned Report')
                                }}>
                                    Export CSV
                                </Button.Ripple>
                        </CardHeader>
                        <ServerSideDataTable
                            currentPage={currentPage}
                            handlePagination={handlePagination}
                            RowCount={RowCount}
                            column={[...column]}
                            TableData={LoyaltyReport}
                            RowLimit={50}
                            TableDataLoading={TableDataLoading} />
                    </Card>
                </>
                </TabPane>
                <TabPane tabId="2">
                    <>
                        <Card>
                            <Form className="row p-1" style={{ width: '100%' }} onSubmit={onSubmit1} autoComplete="off">
                                <Col md="3" >
                                    <FormGroup>
                                        <Label for="startDate">Start Date</Label>
                                        <Input
                                            type="date"
                                            name="startDate"
                                            id='startDate'
                                            value={userInput.startDate}
                                            onChange={onChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" >
                                    <FormGroup>
                                        <Label for="endDate">Expiry Date</Label>
                                        <Input
                                            type="date"
                                            name="endDate"
                                            id='endDate'
                                            value={userInput.endDate}
                                            onChange={onChange}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="3" className='text-center'>
                                    {
                                        TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                            <Spinner color='white' size='sm' />
                                            <span className='ml-50'>Loading...</span>
                                        </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                            <span >Search</span>
                                        </Button.Ripple>
                                    }
                                </Col>
                            </Form>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle></CardTitle>
                                <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
                                    ExportCSV(LoyaltyReport1, Object.keys(LoyaltyReport1[0]), 'Loyalty Redeemed Report')
                                    }}>
                                        Export CSV
                                    </Button.Ripple>
                            </CardHeader>
                            <ServerSideDataTable
                                currentPage={currentPage1}
                                handlePagination={handlePagination1}
                                RowCount={RowCount1}
                                column={[...column1]}
                                TableData={LoyaltyReport1}
                                RowLimit={50}
                                TableDataLoading={TableDataLoading} />
                        </Card>
                    </>
                </TabPane>
            </TabContent>
        </Fragment>
    )
}

export default LoyaltyReport