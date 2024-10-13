import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import React, { Fragment, useEffect, useState } from 'react'
import { ChevronLeft, FileText, MoreVertical } from 'react-feather'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Table, Form, FormGroup, Input, Label, Row, Spinner, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { BMS_PASS, BMS_USER, CURRENCY_SYMBOL } from '../../../../../../Configurables'
import { formatReadableDate, getHumanReadableDate } from '../../../../../helper'
import { Error } from '../../../../../viewhelper'
import ServerSideDataTable from '../../ServerSideDataTable'
import SubRportView from './subReportView'

import { UserOutlined } from '@ant-design/icons'
import { Avatar, Segmented } from 'antd'

const statusDetails = {
    0: { title: 'In Progress', color: 'light-primary', count: 0 },
    1: { title: 'Successful', color: 'light-success ', count: 0 },
    2: { title: 'Not Eligible', color: 'light-info', count: 0 },
    3: { title: 'Failed', color: 'light-danger', count: 0 },
    4: { title: 'Partially Disbursed', color: 'light-warning', count: 0 },
    '-1': { title: 'Disbursement In Progress', color: 'light-dark', count: 0 }
}

const statusSet = (statusid) => {
    return statusDetails[statusid] || { title: 'N/A', color: 'light-danger' }
}
const CampaignReport = ({campaign_id, setreportView, campaignInfo}) => {
    const history = useHistory()
    const { id } = useParams()
    const AssignedMenus = JSON.parse(localStorage.getItem('AssignedMenus')) || []
    const Array2D = AssignedMenus.map(x => x.submenu.map(y => y.id))
    const subMenuIDs = [].concat(...Array2D)

    const [subReportView, setsubReportView] = useState(false)
    const [reportIdx, setreportIdxw] = useState(0)

    const [ruleInfo, setruleInfo] = useState({})
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [isloading, setisloading] = useState(false)
    const [resetData, setReset] = useState(true)
    const [tranLogs, setTranLogs] = useState([])
    const [RowCount, setRowCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [statuswisecounter, setstatuswisecounter] = useState([])
    const [counter, setcounter] = useState({
        totalTran: 0,
        totalEligiableTran: 0,
        success: 0,
        partial: 0,
        error: 0,
        inprogres: 0
    })

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
        startDate: null,
        endDate: null
    })
    // const { startDate, endDate } = userInput

    const getData = (page, startDate, endDate) => {
        setisloading(true)
        useJwt2.onlineCampaignReport({campaign_id, page, limit: rowsPerPage, start_date: startDate || null, end_date: endDate || null}).then(res => {
            setTranLogs(res.data.payload)
            setisloading(false)
        }).catch(err => {
            setisloading(false)
            Error(err)
        })
    }

    const handlePagination = page => {
        getData(page.selected + 1, userInput.startDate, userInput.endDate)
        setCurrentPage(page.selected)
    }

    useEffect(async () => {
        Promise.all([
            useJwt2.onlineCampaignReport({campaign_id, page: 1, limit: rowsPerPage}).then(res => {
                setTranLogs(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.onlineCampaignReportCount({campaign_id}).then(res => {
                let totalRows = 0
                res.data.payload.map(item => (totalRows = totalRows + (+item['count'])))
                setRowCount(totalRows)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.onlineCampaignReportCountAll({campaign_id}).then(res => {
                const respdata = res.data.payload
                const objData = {
                    totalTran: 0,
                    totalEligiableTran: 0,
                    success: 0,
                    partial: 0,
                    error: 0,
                    inprogres: 0
                }
                respdata.map(item => {
                    try {
                        if (item.status !== 2) {
                            objData.totalEligiableTran = objData.totalEligiableTran + (+item['count'])
                        }
                        if (item.status === 1) {
                            objData.success = objData.success + (+item['count'])
                        }
                        if (item.status === 3) {
                            objData.error = objData.error + (+item['count'])
                        }
                        if (item.status === 4) {
                            objData.partial = objData.partial + (+item['count'])
                        }
                        if (item.status === -1) {
                            objData.inprogres = objData.inprogres + (+item['count'])
                        }

                        objData.totalTran = objData.totalTran + (+item['count'])

                    } catch (e) {
                        console.log(e)
                    }
                })
                console.log('objData => ', objData)
                setcounter(objData)
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => setTableDataLoading(false))
    }, [])

    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        setisloading(true)
        Promise.all([
            useJwt2.onlineCampaignReport({campaign_id, page: 1, limit: rowsPerPage, start_date: userInput.startDate || null, end_date: userInput.endDate || null}).then(res => {
                setTranLogs(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.onlineCampaignReportCount({campaign_id}).then(res => {
                let totalRows = 0
                res.data.payload.map(item => (totalRows = totalRows + (+item['count'])))
                setRowCount(totalRows)
            }).catch(err => {
                Error(err)
            })
        ]).finally(() => setisloading(false))
    }
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = tranLogs.filter(item => {
                const startsWith =
                    item.tranId.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.tranAmount.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.sourceAcct.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.destAcct.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.commissionId.toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    formatReadableDate(item.tranDate).toString().toLowerCase().startsWith(value.toLowerCase()) ||
                    item.serviceId.toString().toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.tranId.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.tranAmount.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.sourceAcct.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.destAcct.toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.commissionId.toString().toLowerCase().includes(value.toLowerCase()) ||
                    formatReadableDate(item.tranDate).toString().toLowerCase().includes(value.toLowerCase()) ||
                    item.serviceId.toString().toLowerCase().includes(value.toLowerCase())

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
            name: 'Transaction ID',
            minWidth: '160px',
            wrap: true,
            selector: 'tran_id'
        },
        {
            name: 'Transaction Amount',
            minWidth: '100px',
            wrap: true,
            selector: (item) => `${CURRENCY_SYMBOL} ${item.tran_amount}`
        },
        {
            name: 'Reward Receiver',
            minWidth: '40px',
            wrap: true,
            selector: row => {
                return row.receiver === 's' ? 'Sender' : row.receiver === 'r' ? 'Receiver' : row.receiver === 'b' ? 'Both' : '--'
            }
        },
        {
            name: 'Status',
            minWidth: '150px',
            wrap: true,

            selector: (item) => <Badge color={statusSet(`${item['status']}`).color} pill className='px-1 multilineBadge'> {statusSet(item['status']).title}</Badge>
            // selector: (item) => <Badge color={statusSet(`${-1}`).color} pill className='px-1 multilineBadge'> This is an example of text  </Badge>

        },
        {
            name: 'Sender MSISDN',
            minWidth: '130px',
            wrap: true,
            selector: 'source_acct'
        },
        {
            name: 'Receiver MSISDN',
            minWidth: '130px',
            wrap: true,
            selector: 'dest_acct'
        },
        {
            name: 'Service',
            minWidth: '80px',
            wrap: true,
            selector: 'service_name'
        },
        {
            name: 'Process Date',
            minWidth: '120px',
            wrap: true,
            selector: (item) => {
                // return `${item.process_date}`
                // console.log('item.process_date ==> ', typeof item.process_date)
                return item.process_date ? getHumanReadableDate(`${item.process_date}`) : '--'
            }
        },
        {
            name: 'Transaction Date',
            minWidth: '120px',
            wrap: true,
            selector: (item) => {
                // return item.tran_date ? formatReadableDate(item.tran_date) : '--'
                return item.tran_date ? getHumanReadableDate(`${item.tran_date}`) : '--'
            }
        },
        {
            name: 'Remarks',
            minWidth: '250px',
            wrap: true,
            selector: item => {
                switch (item.status) {
                    case 2 :
                    case -1 :
                        return item.remarks
                    
                    default : return null
                }
            }
        },
        {
            name: 'Action',
            minWidth: '200px',
            cell: row => {
                return <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                  <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    className='w-100'
                    onClick={(e) => {
                        setsubReportView(true)
                        setreportIdxw(row.tran_idx)
                    }}
                  >
                    <FileText size={14} className='mr-50' />
                    <span className='align-middle'>Details</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            }
        }
    ]

    const renderTransactionsCounter = () => {
        // return transactionsArr.map(item => {
          return (
                <Fragment>
                    <Col md="2">
                        <Card >
                            <CardBody>
                                <div className='d-flex align-items-center'>
                                    {/* <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div> */}
                                    <h6 style={{ margin: '0 0 0 10px' }}>Total Transactions</h6>
                                </div>
                                <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{counter.totalTran}</h5></div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="2">
                        <Card >
                            <CardBody>
                                <div className='d-flex align-items-center'>
                                    {/* <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div> */}
                                    <h6 style={{ margin: '0 0 0 10px' }}>Total Eligible Transactions</h6>
                                </div>
                                <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{counter.totalEligiableTran}</h5></div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="2">
                        <Card >
                            <CardBody>
                                <div className='d-flex align-items-center'>
                                    {/* <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div> */}
                                    <h6 style={{ margin: '0 0 0 10px' }}>Successful Disbursement</h6>
                                </div>
                                <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{counter.success}</h5></div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="2">
                        <Card >
                            <CardBody>
                                <div className='d-flex align-items-center'>
                                    {/* <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div> */}
                                    <h6 style={{ margin: '0 0 0 10px' }}>Partial Disbursement</h6>
                                </div>
                                <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{counter.partial}</h5></div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="2">
                        <Card >
                            <CardBody>
                                <div className='d-flex align-items-center'>
                                    {/* <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div> */}
                                    <h6 style={{ margin: '0 0 0 10px' }}>Disbursement Failed</h6>
                                </div>
                                <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{counter.error}</h5></div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="2">
                        <Card >
                            <CardBody>
                                <div className='d-flex align-items-center'>
                                    {/* <div style={{ height: '30px', width: '30px', backgroundColor: '#006496', borderRadius: '50%' }}></div> */}
                                    <h6 style={{ margin: '0 0 0 10px' }}>Disbursement In-Progress</h6>
                                </div>
                                <div className='d-flex justify-content-end mt-2'><h5 style={{ margin: '0', fontWeight: 'bold', color: 'black' }}>{counter.inprogres}</h5></div>
                            </CardBody>
                        </Card>
                    </Col>
                </Fragment>
          )
    }

    return (
         !subReportView ? <Fragment>
        <Button.Ripple className='mb-1' color='primary' tag={Link} /* to='/allCampaigns' */ onClick={() => setreportView(false)}>
            <div className='d-flex align-items-center'>
                <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                <span >Back</span>
            </div>
        </Button.Ripple>
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>RealTime Transactions</CardTitle>
            </CardHeader>
            <div className="transactionRewardCounter">
            <Card>
                <Row style={{padding: '10px 10px 0 10px'}} className="transactionRewardCounter">
                   {renderTransactionsCounter()}
                </Row>
                <Form className="row p-1" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                   <Col md="6">
                       <Row>
                       <Col md="5" >
                        <FormGroup>
                            <Label for="startDate">Start Date</Label>
                            <Input
                                type="date"
                                name="startDate"
                                id='startDate'
                                value={userInput.startDate}
                                onChange={onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="5" >
                        <FormGroup>
                            <Label for="endDate">Expiry Date</Label>
                            <Input
                                type="date"
                                name="endDate"
                                id='endDate'
                                value={userInput.endDate}
                                onChange={onChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="2" className='text-center' style={{padding: 0}}>
                        {
                            isloading ? <Button.Ripple color='primary'  disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple  color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Search</span>
                            </Button.Ripple>
                        }
                    </Col>
                       </Row>
                    </Col>
                    <Col md="6" className="transactionRewardCounter" style={{paddingLeft: 20}}>
                       <Card>
                        <Table size='sm' bordered>
                            <tbody>
                            <tr>
                                    <td>Campaign Name</td>
                                    <td>{campaignInfo.campaign_name}</td>
                            </tr>
                            <tr>
                                    <td>Campaign Rule Name</td>
                                    <td>{campaignInfo.commission_rule_name}</td>
                            </tr>
                            {/* <tr>
                                    <td>Reward Type</td>
                                    <td></td>
                            </tr> */}
                            <tr>
                                    <td>Start date</td>
                                    <td>{campaignInfo.start_date ? formatReadableDate(campaignInfo.start_date) : '---'}</td>
                            </tr>
                            <tr>
                                    <td>End Date</td>
                                    <td>{campaignInfo.end_date ? formatReadableDate(campaignInfo.end_date) : '---'}</td>
                            </tr>
                            </tbody>
                        </Table>
                       </Card>
                    </Col>
                  
                </Form>
            </Card>
            </div>

            {/* <Row className='justify-content-end mx-0'>
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
            </Row> */}
              <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={column}
                    TableData={searchValue.length ? filteredData : tranLogs}
                    RowLimit={rowsPerPage}
                    TableDataLoading={TableDataLoading} 
                />

        </Card>
        </Fragment> : <SubRportView 
            setsubReportView={setsubReportView}
            reportIdx={reportIdx}
        />
    )
}

export default CampaignReport