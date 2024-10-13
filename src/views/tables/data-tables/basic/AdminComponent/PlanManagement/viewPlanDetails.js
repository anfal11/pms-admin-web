import useJwt from '@src/auth/jwt/useJwt'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import React, { Fragment, useEffect, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error } from '../../../../../viewhelper'
const MySwal = withReactContent(Swal)

const viewPlanDetails = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [planInfo, setplanInfo] = useState(JSON.parse(localStorage.getItem('planDetails')))

    useEffect(() => {
        const callApis = async () => {
        }
        callApis()
    }, [])

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={'/planlist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={() => {}} autoComplete="off">
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Plan Details</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                        <Row className='match-height'>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Plan Title:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.title}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 15px 0 0'}}>Other Messages:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.other_msg}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 15px 0 0'}}>Details:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.details}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Valid Till:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(planInfo?.valid_til).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Email Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.email_show}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Facebook Ads Budget:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.facebook_ads_budget}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Facebook Ads Budget Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.facebook_ads_budget_show}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Facebook Post Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.facebook_post_show}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Subscription Plan:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.link_subscription_name}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Features:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.features?.map((f, index) => <h6 key={index}>{`${index + 1}) ${f}`}</h6>) || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Annually Price:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.price_annually || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Monthly Price:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.price_monthly || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Quarterly Price:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.price_quarterly || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Google Ads Budget:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.google_ads_budget}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Google Ads Budget Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.google_ads_budget_show}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Instagram Post Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.instagram_post_show}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Push Notification Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.push_notification_show || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>SMS Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.sms_show || '--'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Plan Grace Period:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.plan_grace_period || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Created By:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.created_by || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Created Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(planInfo?.created_date).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Modified By:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.modified_by || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Modified Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(planInfo?.modified_date).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Requested Action:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.action}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Approved By:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.approved_by || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Approve Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(planInfo?.approved_date).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Recommended?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.recommended ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Status?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.status ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Temp Status?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.temp_status ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Has Ads?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.has_ads ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Has Notification?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.has_notification ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Is Temporary?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.is_temporary ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Plan Visibility?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.plan_visibility ? 'True' : 'False'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='12'>
                                <Card style={{border: '1px solid grey'}}>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h5'>Plan Image</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                            <img className='rounded mt-2 mr-1' src={planInfo?.plan_image} alt='plan_image' width={'30%'} />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default viewPlanDetails