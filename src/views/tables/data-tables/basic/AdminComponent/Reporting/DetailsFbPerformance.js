import useJwt from '@src/auth/jwt/useJwt'
import { handle401 } from '@src/views/helper'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, PlusCircle } from 'react-feather'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Input, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import ServerSideDataTable from '../../ServerSideDataTable'
import ActiveUserBarChart from '../../../../../VendorComponents/DashBoardUI/ActiveUserBarChart'
import ChartjsLineChart from '../../../../../VendorComponents/DashBoardUI/ChartjsLineChart'
import RegUserPieChart from './RegUserPieChart.js'
const MySwal = withReactContent(Swal)

const DetailsFbPerformance = () => {
    const history = useHistory()
    const {notification_id} = useParams()
    const [replyBody, setReplyBody] = useState({
        post_id: "",
        comment_id: "",
        reply: ""
    })
    const [replies, setReplies] = useState([])
    const [NotificationDetailsReport, setNotificationDetailsReport] = useState({})
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const toggleModal = () => {
        setModal(!modal)
    } 

    const getReplies = (post_id, comment_id) => {
        setTableDataLoading(true)
        setReplies([])
        useJwt.fbPagePostReplyList({ post_id, comment_id }).then(async res => {
            setReplies(res.data.payload.data)
            console.log(res)
        }).catch(err => {
            handle401(err.response?.status)
            console.log(err.response)
        }).finally(f => {
            setTableDataLoading(false)
        })
    }
    const getData = () => {
        setTableDataLoading(true)
        useJwt.fbPagePostBonusCamp({ notification_id: parseInt(notification_id) }).then(async res1 => {
            console.log('fbPagePostBonusCamp', res1)
            await useJwt.fbPagePostCmnt({ post_id: res1.data.payload[0]?.post_id }).then(async res2 => {
                console.log('fbPagePostCmnt', res2)
                await useJwt.fbPagePostReaction({ post_id: res1.data.payload[0]?.post_id }).then(async res3 => {
                    console.log('fbPagePostReaction', res3)
                    setNotificationDetailsReport({...NotificationDetailsReport, ...res1.data.payload[2], number_of_page: res1.data.payload.length, comment: res2.data.payload, reactions: res3.data.payload})
                }).catch(err => {
                    handle401(err.response?.status)
                    console.log(err.response)
                }).finally(f => {
                    setTableDataLoading(false)
                })
            }).catch(err => {
                handle401(err.response?.status)
                console.log(err.response)
            }).finally(f => {
                setTableDataLoading(false)
            })
        }).catch(err => {
            handle401(err.response?.status)
            console.log(err.response)
        }).finally(f => {
            setTableDataLoading(false)
        })
    }

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData()
    }, [])
    return (
        <>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/campaignPerformanceReport' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
            </Button.Ripple>
            <Card>
                <CardHeader>
                    <CardTitle>Campaign Report</CardTitle>
                </CardHeader>
            </Card>
           <Row className='match-height'>
                <Col sm='6'>
                    <Card>
                        <CardBody>
                            <ChartjsLineChart style={{minHeight:'400px'}} labelArray={['Apr 05', 'Apr 06',  'Apr 07',  'Apr 08',  'Apr 09',  'Apr 10', 'Apr 11']} dataValue={[0, 90, 30, 160, 120, 110, 160]} datalabel={'Amount of Transaction'} />
                        </CardBody>
                    </Card>
                </Col>
                <Col sm='6'>
                    <Card>
                        <CardBody>
                            <ActiveUserBarChart style={{minHeight:'400px'}} labels={['Apr 05', 'Apr 06',  'Apr 07',  'Apr 08',  'Apr 09',  'Apr 10', 'Apr 11']} dataCount={[120, 90, 100, 160, 120, 110, 160]} datalabel={'Number of Transaction'} />

                            <RegUserPieChart reactions={{facebook: 66, email: 36, sms: 55}} datalabel={'Remaining Budget'}/>
                            <h6 className='text-center'>Remaining Budget</h6>
                        </CardBody>
                    </Card>
                </Col>
                {
                    [{top: '2,50,000', bot:'Amount Of Transaction'}, {top: '250', bot:'Number Of Transaction'}, {top: '45%', bot:'Score'}, {top: '22500', bot:'Rewards Amount'}, {top: 'No', bot:'Rewards Point'}, {top: '5,50,000', bot:'Campaign Budget'}].map((item, index) => <Col key={index} sm='2'>
                        <Card>
                            <CardBody>
                                <h2 style={{display:'flex', justifyContent:'center', color: '#026496', fontWeight:'1000'}}>{item.top}</h2>
                                <h6 style={{display:'flex', justifyContent:'center'}}>{item.bot}</h6>
                            </CardBody>
                        </Card>
                    </Col>)
                }
                <Col sm='6'>
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className='border-bottom p-1'>
                                <h6 style={{margin:'0 0 10px 0'}}>Name Of Campaign</h6>
                                <h4 style={{margin:'0', color: '#026496'}}><b>Eid Festival</b></h4>
                            </div>
                            <div className='border-bottom p-1'>
                                <h6 style={{margin:'0 0 10px 0'}}>Ad Name</h6>
                                <h4 style={{margin:'0', color: '#026496'}}><b>Eid Fresh Picks for your Wardrobe</b></h4>
                            </div>
                            <div className='border-bottom p-1'>
                                <h6 style={{margin:'0 0 10px 0'}}>Notification Title</h6>
                                <h4 style={{margin:'0', color: '#026496'}}><b>Hurry! Eid Sale Ends Soon</b></h4>
                            </div>
                            <div className='border-bottom p-1'>
                                <h6 style={{margin:'0 0 10px 0'}}>Advertising Budget Title</h6>
                                <h4 style={{margin:'0', color: '#026496'}}><b>Eid Sale Advertising Budget</b></h4>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm='6'>
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className='border-bottom p-1'>
                                <h6 style={{margin:'0 0 10px 0'}}>Start Date</h6>
                                <h4 style={{margin:'0', color: '#026496'}}><b>April 12, 2023</b></h4>
                            </div>
                            <div className='border-bottom p-1'>
                                <h6 style={{margin:'0 0 10px 0'}}>End Date</h6>
                                <h4 style={{margin:'0', color: '#026496'}}><b>April 15, 2023</b></h4>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
           </Row>
        </>
    )
}

export default DetailsFbPerformance