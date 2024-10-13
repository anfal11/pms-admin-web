import useJwt from '@src/auth/jwt/useJwt'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardHeader, CardTitle, Col, Form, FormGroup, Input, Label, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
import { Error } from '../../../../../viewhelper'
import ServerSideDataTable from '../../ServerSideDataTable'
const MySwal = withReactContent(Swal)
import report from '../../../../../../assets/images/icons/report.png'

const CampaignReport = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [campaignReport, setCampReport] = useState([])
    const [TableDataLoading, setTableDataLoading] = useState(true)
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
        startDate: minDays(30),
        endDate: addDays(0)
    })
    const { startDate, endDate } = userInput

    const getData = (startDate, endDate) => {
        console.log({ startDate, endDate })
        setTableDataLoading(true)
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', true)
        useJwt.grossCampaignReport(startDate, endDate).then(res => {
            console.log(res)
            setCampReport(res.data)
            localStorage.setItem('useBMStoken', false)
            setTableDataLoading(false)
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
            }
            console.log(err)
            setTableDataLoading(false)
            localStorage.setItem('useBMStoken', false)
        })
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        getData(page.selected + 1, 50, startDate, endDate)
        setCurrentPage(page.selected)
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData(startDate, endDate)
    }, [])

    const column = [
        {
            name: 'Campaign Name',
            minWidth: '250px',
            selector: 'distinct_campaign_name'
        },
        {
            name: 'Total Disbursed Amount',
            minWidth: '120px',
            selector: 'total_disbursed_amnt'
        },
        {
            name: 'Pending Disbursement',
            minWidth: '120px',
            selector: 'disbursement_submit'
        },
        {
            name: 'Success Disbursement',
            minWidth: '120px',
            selector: 'disbursement_success'
        },
        {
            name: 'Failed Disbursement',
            minWidth: '120px',
            selector: 'disbursement_error'
        },
        {
            name: 'Total Disbursement Attempt',
            minWidth: '120px',
            selector: 'disbursement_attemp_total'
        },
        {
            name: 'Total Campaign Attempt',
            minWidth: '120px',
            selector: 'campaign_attemp_total'
        },
        {
            name: 'Action',
            minWidth: '100px',
            selector: row => {
                return <>
                    <span title="Details Report">
                        <img 
                            width={'21px'} 
                            style={{color: 'red', cursor:'pointer'}} 
                            src={report}
                            onClick={() => {
                                history.push(`/campaignReport/${row.distinct_campaign_id}`)
                            }}
                        />
                    </span>
                </>
            }
        }
    ]

    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        
        getData(startDate, endDate)
      
    }
    return (
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
  
                    ExportCSV(campaignReport, Object.keys(campaignReport[0]), 'Campaign Report')
                        }}>
                            Export CSV
                        </Button.Ripple>
                </CardHeader>
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={[...column]}
                    TableData={campaignReport}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>
        </>
    )
}

export default CampaignReport