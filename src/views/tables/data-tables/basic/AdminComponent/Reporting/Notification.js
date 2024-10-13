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

const NotificationReport = () => {
    const history = useHistory()
    const [RowCount, setRowCount] = useState(1)
    const [searchValue, setsearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [NotificationReport, setNotificationReport] = useState([
        {
            title: 'Hurry! EID Sale Ends Soon', date:'02/04/2023', channel: ['Facebook, Email'], success_rate: '30%', campaign_name: 'EID Festival', ad_name:'EID Fresh Picks for Your Wardrobe', budget:' EID Sale Advertising Budget'
        }, 
        {
            title: 'Summer Savings Just for You', date:'23/03/2023',  channel: ['Push Notification, SMS'], success_rate: '50%', campaign_name: 'Summer Fun', ad_name:'Beat the Heat with Our Cool Deals', budget:'Summer Fun Marketing Budget'
        },
        {
            title: 'Back to School Sale - Up to 50% Off', date:'17/03/2023',  channel: ['Facebook, Email'], success_rate: '55%', campaign_name: 'Back to School', ad_name:'Get Ready for a Smart School Year', budget:'Back to School Advertising Budget'
        },
        {
            title: 'Fall Fashion Alert - New Arrivals', date:'12/03/2023',  channel: ['Facebook, Email'], success_rate: '65%', campaign_name: 'Fall Fashion', ad_name:'Cozy Up in Style this Fall', budget:'Fall Fashion Marketing Budget'
        },
        {
            title: 'Happy Holidays from Our Team', date:'09/03/2023',  channel: ['Push Notification, SMS'], success_rate: '67%', campaign_name: 'Holiday Cheer', ad_name:'Give the Gift of Joy this Holiday Season', budget:'Holiday Cheer Advertising Budget'
        },
        {
            title: 'New Year, New You - Special Offers Inside', date:'19/3/2023',  channel: ['Push Notification, SMS'], success_rate: '22%', campaign_name: 'New Year, New You', ad_name:'Start the Year Right with Our Health Products', budget:'New Year, New You Marketing Budget'
        },
        {
            title: "Spread Love this Valentine's Day", date:'25/03/2023',  channel: ['Facebook, Email'], success_rate: '52%', campaign_name: "Valentine's Day", ad_name:"Love is in the Air - Valentine's Day Gifts", budget:"Valentine's Day Advertising Budget"
        },
        {
            title: "Spring Cleaning Sale - Save Big", date:'20/03/2023',  channel: ['Push Notification, SMS'], success_rate: '92%', campaign_name: "Spring Cleaning", ad_name:"Clean Your Home Like a Pro", budget:"Spring Cleaning Marketing Budget"
        },
        {
            title: "Summer Travel Deals You Can't Resist", date:'20/3/2023',  channel: ['Facebook, Email'], success_rate: '92%', campaign_name: "Summer Travel", ad_name:"Book Your Dream Summer Vacation Now", budget:"Summer Travel Advertising Budget"
        },
        {
            title: "Get Ready to Scream this Halloween", date:'26/03/2023',  channel: ['Facebook, Email'], success_rate: '72%', campaign_name: "Halloween Spooktacular", ad_name:"Boo-tiful Costumes and Decorations", budget:"Halloween Spooktacular Advertising Budget"
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
    const { startDate, endDate } = userInput

    // const getData = (page, limit, startDate, endDate) => {
    //     console.log({ page, limit, startDate, endDate })
    //     setTableDataLoading(true)
    //     useJwt.getNotificationReport({ page, limit, startDate, endDate }).then(res => {
    //         console.log('NotificationReport', res)
    //         setRowCount(res.data.payload.count)
    //         setNotificationReport(res.data.payload.rows)
    //     }).catch(err => {
    //         handle401(err.response?.status)
    //         console.log(err.response)
    //     }).finally(f => {
    //         setTableDataLoading(false)
    //     })
    // }
    // ** Function to handle Pagination
    const handlePagination = page => {
        getData(page.selected + 1, 50, startDate, endDate)
        setCurrentPage(page.selected)
    }

    // useEffect(() => {
    //     localStorage.setItem('useBMStoken', false) //for token management
    //     localStorage.setItem('usePMStoken', false) //for token management
    //     getData(1, 50, startDate, endDate)
    // }, [])
     
    const column = [
        {
            name: 'Notification Title',
            minWidth: '250px',
            sortable: true,
            selector: 'title'
        },
        {
            name: 'Date',
            minWidth: '120px',
            sortable: true,
            selector: 'date'
        },
        {
            name: 'Channel',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return row.channel.toString().replace(/,/, ', ')
            }
        },
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
            name: 'Budget',
            minWidth: '250px',
            sortable: true,
            selector: 'budget'
        },
        {
            name: 'Succes Rate',
            minWidth: '100px',
            sortable: true,
            selector: 'success_rate'
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
                                history.push(`/detailsNotificationReport/${row.title}`)
                            }
                        }
                        />
                    </span>
                </>
            }
        }
    ]
    // const column = [
    //     {
    //         name: 'Created Date',
    //         minWidth: '250px',
    //         sortable: true,
    //         selector: row => { return row.created_at ? formatReadableDate(row.created_at) : 'N/A' }
    //     },
    //     {
    //         name: 'Created By',
    //         minWidth: '120px',
    //         selector: 'created_by_name'
    //     },
    //     {
    //         name: 'Is Ad Scheduled?',
    //         minWidth: '100px',
    //         selector: row => {
    //             return row.isAdScheduled ? 'True' : 'False'
    //         }
    //     },
    //     {
    //         name: 'Is Repeat?',
    //         minWidth: '100px',
    //         selector: row => {
    //             return row.isRepeat ? 'True' : 'False'
    //         }
    //     },
    //     {
    //         name: 'Is Scheduled?',
    //         minWidth: '100px',
    //         selector: row => {
    //             return row.isScheduled ? 'True' : 'False'
    //         }
    //     },
    //     {
    //         name: 'Is Ad?',
    //         minWidth: '100px',
    //         selector: row => {
    //             return row.is_Ad ? 'True' : 'False'
    //         }
    //     },
    //     {
    //         name: 'Is Rule Base Notification?',
    //         minWidth: '100px',
    //         selector: row => {
    //             return row.is_rule_base_notification ? 'True' : 'False'
    //         }
    //     },
    //     {
    //         name: '',
    //         minWidth: '100px',
    //         selector: row => {
    //             return <>
    //                 <span title="Details">
    //                     <Eye size={15}
    //                         color='teal'
    //                         style={{ cursor: 'pointer' }}
    //                         onClick={(e) => {
    //                             history.push(`/detailsNotificationReport/${row.id}`)
    //                         }
    //                     }
    //                     />
    //                 </span>
    //             </>
    //         }
    //     }
    // ]

    const onChange = e => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault()
        
        //getData(1, 50, startDate, endDate)
      
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
                    <CardTitle>Notification Report</CardTitle>
                    <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => {
  
                    ExportCSV(NotificationReport, Object.keys(NotificationReport[0]), 'Notification Report')
                        }}>
                            Export CSV
                        </Button.Ripple>
                </CardHeader>
                <ServerSideDataTable
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    RowCount={RowCount}
                    column={[...column]}
                    TableData={NotificationReport}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>
        </>
    )
}

export default NotificationReport