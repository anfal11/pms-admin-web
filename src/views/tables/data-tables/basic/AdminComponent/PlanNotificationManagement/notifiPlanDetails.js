import '@styles/react/libs/flatpickr/flatpickr.scss'
import React, { Fragment, useEffect, useState } from 'react'
import useJwt from '@src/auth/jwt/useJwt'
import { ChevronLeft } from 'react-feather'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const notifiPlanDetails = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [planInfo, setplanInfo] = useState(JSON.parse(localStorage.getItem('planDetails')))
    const [planList, setPlanList] = useState([])

    useEffect(() => {
        const callApis = async () => {
            localStorage.setItem('useBMStoken', false) //for token management
            localStorage.setItem('usePMStoken', false) //for token management
            await useJwt.planList().then(res => {
                const { payload } = res.data
                console.log('planList', payload)
                setPlanList(payload)
            }).catch(err => {
                Error(err)
                console.log(err)
            })
        }
        callApis()
    }, [])

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={'/notificationPlanlist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={() => {}} autoComplete="off">
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Notification Plan Details</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                        <Row className='match-height'>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Plan Name:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.plan_name}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Onetime Price:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.price_onetime}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Plan:</h6>
                                        <h6 style={{margin:'0'}}><b>{planList?.find(item => item.id === planInfo?.plan_id)?.title || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Status:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.is_approved ? 'Approved' : planInfo?.is_approved ? 'Rejected' : 'Pending'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>               
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Email Amount:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.email_amount || '--'}</b></h6>
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
                                        <h6 style={{margin:'0 10px 0 0'}}>Google Ads Budget:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.google_ads_budget}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>Google Ads Budget Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.google_ads_budget_show}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>SMS Budget:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.sms_budget || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0 10px 0 0'}}>SMS Budget Show:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.sms_budget_show || '--'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Created By:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.created_by_name || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Created Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(planInfo?.created_at).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Approved By:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.approved_by || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Approved Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(planInfo?.approved_at).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Requested Action:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.action}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Action By:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.action_by_name || '--'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Action Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(planInfo?.action_at).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Has Ads?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.has_ads ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Has Notification?:</h6>
                                        <h6 style={{margin:'0'}}><b>{planInfo?.has_notification ? 'True' : 'False'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default notifiPlanDetails