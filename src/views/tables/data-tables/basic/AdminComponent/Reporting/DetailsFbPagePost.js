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
import RegUserPieChart from './RegUserPieChart.js'
const MySwal = withReactContent(Swal)

const DetailsFbPagePost = () => {
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
                    setNotificationDetailsReport({...NotificationDetailsReport, ...res1.data.payload[0], number_of_page: res1.data.payload.length, comment: res2.data.payload, reactions: res3.data.payload})
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

    console.log('NotificationDetailsReport ', NotificationDetailsReport)

    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        getData()
    }, [])
    const column = [
        {
            name: 'Sender Name',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return row.from.name || '---'
            }
        },
        {
            name: 'Message',
            minWidth: '250px',
            sortable: true,
            selector: row => {
                return row.message || '---'
            }
        },
        {
            name: 'Created Date',
            minWidth: '250px',
            sortable: true,
            selector: row => { return row.created_time ? formatReadableDate(row.created_time) : 'N/A' }
        },
        {
            name: '',
            minWidth: '100px',
            selector: row => {
                return <>
                    <span title="Reply">
                        <PlusCircle size={15}
                            color='teal'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                toggleModal()
                                getReplies(NotificationDetailsReport.post_id, row.id)
                                setReplyBody({...replyBody, post_id: NotificationDetailsReport.post_id, comment_id: row.id})
                            }
                        }
                        />
                    </span>
                </>
            }
        }
    ]
    const onSubmit = (e) => {
        e.preventDefault()
        setTableDataLoading(true)
        useJwt.fbPagePostReplyCmnt({ ...replyBody }).then((response) => {
            setTableDataLoading(false)
            getReplies(replyBody.post_id, replyBody.comment_id)
            Success(response)
        }).catch((error) => {
            setTableDataLoading(false)
            Error(error)
            console.log(error.response)
        })
    }
    return (
        <>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/fbPagePostReport' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
            </Button.Ripple>
           <Row>
           <Col sm='12'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Post</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                {
                                    NotificationDetailsReport?.fb_page_post_image ? <Col md="6"><img height={500} src={NotificationDetailsReport?.fb_page_post_image} /> </Col> : null
                                }

                                <Col md="6">
                                   <h6 style={{margin:'0'}}><b>{NotificationDetailsReport?.fb_page_post_body}</b></h6>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm='6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Details Report</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className='d-flex justify-content-between border-bottom p-1'>
                                <h6 style={{margin:'0'}}>Number Of Page:</h6>
                                <h6 style={{margin:'0'}}><b>{NotificationDetailsReport?.number_of_page}</b></h6>
                            </div>
                            <div className='d-flex justify-content-between border-bottom p-1'>
                                <h6 style={{margin:'0'}}>Campaign Name:</h6>
                                <h6 style={{margin:'0'}}><b>{NotificationDetailsReport?.campaign_name}</b></h6>
                            </div>
                            <div className='d-flex justify-content-between border-bottom p-1'>
                                <h6 style={{margin:'0'}}>Campaign Create Date:</h6>
                                <h6 style={{margin:'0'}}><b>{NotificationDetailsReport?.campaign_create_date ? new Date(NotificationDetailsReport?.campaign_create_date).toLocaleDateString('fr-CA') : ""}</b></h6>
                            </div>
                            <div className='d-flex justify-content-between border-bottom p-1'>
                                <h6 style={{margin:'0'}}>Post Create Date:</h6>
                                <h6 style={{margin:'0'}}><b>{NotificationDetailsReport?.post_create_date ? new Date(NotificationDetailsReport?.post_create_date).toLocaleDateString('fr-CA') : ""}</b></h6>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm='6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reactions</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <RegUserPieChart reactions={NotificationDetailsReport?.reactions}/>
                        </CardBody>
                    </Card>
                </Col>
           </Row>
            <Card>
                <CardHeader>
                    <CardTitle>Post Comments</CardTitle>
                </CardHeader>
                <ServerSideDataTable
                    // currentPage={currentPage}
                    // handlePagination={handlePagination}
                    // RowCount={RowCount}
                    column={[...column]}
                    TableData={NotificationDetailsReport?.comment?.data}
                    RowLimit={50}
                    TableDataLoading={TableDataLoading} />
            </Card>

            {/* reply of comment modal*/}
            <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={toggleModal}>Replies</ModalHeader>
            <ModalBody>
                <Form onSubmit={onSubmit}>
                    <Row>
                        <Col sm='9'>
                            <Input type='text' onChange={(e) => setReplyBody({...replyBody, reply: e.target.value})} placeHolder='your reply here...'/>
                        </Col>
                        <Col sm='3'>
                            {
                                TableDataLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                    <span >Send</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Row>
                </Form>
                <div className='mt-2'>
                    {
                      replies.map((item) => <div key={item.id} style={{padding: '10px 12px', borderRadius: '20px', border: '1px solid grey', marginBottom:'8px'}}>
                        <h6 style={{color: 'black'}}>{item.from.name}</h6>
                        <h5>{item.message}</h5>
                        <h6 style={{fontSize:'10px'}} className='text-right m-0'>{new Date(item.created_time).toLocaleDateString()}</h6>
                      </div>)   
                    }
                </div>
            </ModalBody>
        </Modal>
        </>
    )
}

export default DetailsFbPagePost