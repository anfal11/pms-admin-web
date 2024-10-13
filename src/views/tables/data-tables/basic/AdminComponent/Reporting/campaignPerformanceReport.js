import React, { useState } from 'react'
import {
    Eye
} from 'react-feather'
import { useHistory } from 'react-router-dom'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ExportCSV, formatReadableDate } from '../../../../../helper'
import ServerSideDataTable from '../../ServerSideDataTable'
const MySwal = withReactContent(Swal)

const campaignPerformanceReport = () => {
    const history = useHistory()
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [CampaignPerformanceReport, setCampaignPerformanceReport] = useState([
        {
            campaign_name: 'EID Festival', ad_name:'EID Fresh Picks for Your Wardrobe', notification: 'Hurry! EID Sale Ends Soon', budget:' EID Sale Advertising Budget', total_no_txn: 50, total_amnt_txn: 1100, campaign_score: '70%'
        }, 
        {
            campaign_name: 'Summer Fun', ad_name:'Beat the Heat with Our Cool Deals', notification: 'Summer Savings Just for You', budget:'Summer Fun Marketing Budget', total_no_txn: 70, total_amnt_txn: 1249, campaign_score: '75%'
        },
        {
            campaign_name: 'Back to School', ad_name:'Get Ready for a Smart School Year', notification: 'Back to School Sale - Up to 50% Off', budget:'Back to School Advertising Budget', total_no_txn: 60, total_amnt_txn: 1049, campaign_score: '95%'
        },
        {
            campaign_name: 'Fall Fashion', ad_name:'Cozy Up in Style this Fall', notification: 'Fall Fashion Alert - New Arrivals', budget:'Fall Fashion Marketing Budget', total_no_txn: 48, total_amnt_txn: 1949, campaign_score: '35%'
        },
        {
            campaign_name: 'Holiday Cheer', ad_name:'Give the Gift of Joy this Holiday Season', notification: 'Happy Holidays from Our Team', budget:'Holiday Cheer Advertising Budget', total_no_txn: 88, total_amnt_txn: 2249, campaign_score: '39%'
        },
        {
            campaign_name: 'New Year, New You', ad_name:'Start the Year Right with Our Health Products', notification: 'New Year, New You - Special Offers Inside', budget:'New Year, New You Marketing Budget', total_no_txn: 56, total_amnt_txn: 1009, campaign_score: '77%'
        },
        {
            campaign_name: "Valentine's Day", ad_name:"Love is in the Air - Valentine's Day Gifts", notification: "Spread Love this Valentine's Day", budget:"Valentine's Day Advertising Budget", total_no_txn: 53, total_amnt_txn: 1209, campaign_score: '17%'
        },
        {
            campaign_name: "Spring Cleaning", ad_name:"Clean Your Home Like a Pro", notification: "Spring Cleaning Sale - Save Big", budget:"Spring Cleaning Marketing Budget", total_no_txn: 39, total_amnt_txn: 909, campaign_score: '63%'
        },
        {
            campaign_name: "Summer Travel", ad_name:"Book Your Dream Summer Vacation Now", notification: "Summer Travel Deals You Can't Resist", budget:"Summer Travel Advertising Budget", total_no_txn: 54, total_amnt_txn: 1000, campaign_score: '64%'
        },
        {
            campaign_name: "Halloween Spooktacular", ad_name:"Boo-tiful Costumes and Decorations", notification: "Get Ready to Scream this Halloween", budget:"Halloween Spooktacular Advertising Budget", total_no_txn: 51, total_amnt_txn: 1030, campaign_score: '59%'
        }
    ])
    const [TableDataLoading, setTableDataLoading] = useState(false)

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
        startDate: minDays(5),
        endDate: addDays(0)
    })

    // const getData = () => {
    //     setTableDataLoading(true)
    //     useJwt.fbPagePostBonusCampSummary().then(res => {
    //         console.log('fbPagePostBonusCampSummary', res)
    //         setCampaignPerformanceReport(res.data.payload)
    //     }).catch(err => {
    //         handle401(err.response?.status)
    //         console.log(err.response)
    //     }).finally(f => {
    //         setTableDataLoading(false)
    //     })
    // }

    // useEffect(() => {
    //     localStorage.setItem('useBMStoken', false) //for token management
    //     localStorage.setItem('usePMStoken', false) //for token management
    //     getData()
    // }, [])

    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        
        //getData(1, 50, startDate, endDate)
      
    }

    const column = [
        {
            name: 'Campaign Name',
            minWidth: '250px',
            sortable: true,
            selector: 'campaign_name'
        },
        {
            name: 'Ad Name',
            minWidth: '250px',
            sortable: true,
            selector: 'ad_name'
        },
        {
            name: 'Notification Title',
            minWidth: '250px',
            sortable: true,
            selector: 'notification'
        },
        {
            name: 'Budget',
            minWidth: '250px',
            sortable: true,
            selector: 'budget'
        },
        {
            name: 'Total Number Of TXN',
            minWidth: '100px',
            sortable: true,
            selector: 'total_no_txn'
        },
        {
            name: 'Total Amount Of TXN',
            minWidth: '100px',
            sortable: true,
            selector: 'total_amnt_txn'
        },
        {
            name: 'Campaign Score',
            minWidth: '100px',
            sortable: true,
            selector: 'campaign_score'
        },
        {
            name: '',
            minWidth: '100px',
            selector: row => {
                return <>
                    <span title="Details">
                        <Eye size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                history.push(`/detailsCampaignPerformanceReport/${row.campaign_name}`)
                                }
                            }
                        />
                    </span>
                </>
            }
        }
    ]

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
                    <CardTitle>Campaign Performance Report</CardTitle>
                    <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
  
                    ExportCSV(CampaignPerformanceReport, Object.keys(CampaignPerformanceReport[0]), 'Notification Report')
                        }}>
                            Export CSV
                        </Button.Ripple>
                </CardHeader>
                <ServerSideDataTable
                    // currentPage={currentPage}
                    // handlePagination={handlePagination}
                    // RowCount={RowCount}
                    column={[...column]}
                    TableData={CampaignPerformanceReport}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>
        </>
    )
}

export default campaignPerformanceReport