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

const viewPromotion = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [promoInfo, setpromoInfo] = useState(JSON.parse(localStorage.getItem('promoInfo')))
    const [adruleInfo, setadruleInfo] = useState(null)
    const [adRuleList, setAdRuleList] = useState([])
    const [MerchantList, setMerchantLists] = useState([])
    const [groupList, setGroupList] = useState([])

    useEffect(() => {
        const callApis = async () => {
            await useJwt.customerBusinessList().then(res => {
                const { payload } = res.data
                // console.log(payload)
                setMerchantLists(payload.map(x => { return { value: x.id, label: x.businessname } }))
            }).catch(err => {
                console.log(err.response)
                Error(err)
            })
            await useJwt.adRuleList().then(res => {
                // console.log(res)
                const allAdRule = []
                for (const q of res.data.payload) {
                    if (q.is_approved === true) {
                        allAdRule.push(q)
                    }
                }
                console.log('adrule', allAdRule?.find(ar => ar.id === promoInfo.rule_id))
                setadruleInfo(allAdRule?.find(ar => ar.id === promoInfo.rule_id))
                setAdRuleList(allAdRule)
            }).catch(err => {
                Error(err)
                console.log(err)
            })
            useJwt.getCentralGroup().then(res => {
                console.log(res)
                const allGroup = []
                for (const q of res.data.payload) {
                    if (q.is_approved === true) {
                        allGroup.push(q)
                    }
                }
                setGroupList(allGroup)
            }).catch(err => {
                Error(err)
                console.log(err.response)
            })
        }
        callApis()
    }, [])

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/promolistVendor' : '/promolist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={() => {}} autoComplete="off">
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Promotion Details</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Promotion Name:</h6>
                                        <h6 style={{margin:'0'}}><b>{promoInfo?.title}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Description:</h6>
                                        <h6 style={{margin:'0'}}><b>{promoInfo?.description}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Merchant:</h6>
                                        <h6 style={{margin:'0'}}><b>{MerchantList.find(x => +x.value === +promoInfo?.merchant_id)?.label || 'N/A'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Promotion Type:</h6>
                                        <h6 style={{margin:'0'}}><b>{promoInfo?.promotion_type}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Is Global Promotion?:</h6>
                                        <h6 style={{margin:'0'}}><b>{promoInfo?.is_global ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Group:</h6>
                                        <h6 style={{margin:'0'}}><b>{groupList.find(gr => gr.id === promoInfo?.group_id)?.group_name || 'N/A'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='12'>
                                <Card style={{border: '1px solid grey'}}>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h5'>Images</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        {
                                            promoInfo?.image_urls?.map((src, index) => <div key={index} className="d-flex flex-column">
                                                <img className='rounded mt-2 mr-1' src={src} alt='avatar' width={'30%'} />
                                            </div>)
                                        }
                                    </CardBody>
                                </Card>
                                <Card style={{border: '1px solid grey'}}>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h5'>Mobile Images</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        {
                                            promoInfo?.mobile_image_urls?.length ? promoInfo?.mobile_image_urls.map((src, index) => <div key={index} className="d-flex flex-column">
                                                <img className='rounded mt-2 mr-1' src={src} alt='avatar' width={'30%'} />
                                            </div>) : 'No images'
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
{/* Start of ad rule details */}
                {
                     !adruleInfo ? <Col sm='4' className='p-1'><Spinner color='blue' /></Col> : <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Ad Rule Details</CardTitle>
                        </CardHeader>
                        <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Campaign Objective:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.campaign_objective}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Rule Name:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.rule_name}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Rule Name:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.rule_name}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Start Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(adruleInfo?.start_date).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Expired Date:</h6>
                                        <h6 style={{margin:'0'}}><b>{new Date(adruleInfo?.expired_date).toLocaleDateString('fr-CA')}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Gender:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.gender === null ? 'All' : parseInt(adruleInfo?.gender) === 1 ? 'Males' : parseInt(adruleInfo?.gender) === 2 ? 'Females' : 'N/A'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Max Age:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.max_age}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Min Age:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.min_age}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Is Customize Group?:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.isCustomizeGroup ? 'True' : 'False'}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-1'>
                                        <h6 style={{margin:'0'}}>Groups:</h6>
                                        <h6 style={{margin:'0'}}><b>{ groupList?.map(ser => {
                                                            for (const sser of adruleInfo?.group) {
                                                                if (parseInt(sser) === parseInt(ser.id)) {
                                                                    return ser.group_name
                                                                }
                                                            }
                                                        })}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Device Info/Device Platform:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.device_platform.map(dp => {
                                            if (parseInt(dp) === 1) {
                                                return 'Mobile'
                                            }
                                            if (parseInt(dp) === 2) {
                                                return 'Desktop'
                                            }
                                        })}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>OS Version/User OS:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.user_os}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Country:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.country}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Interested Category:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.interest}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Longtitude:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.longtitude}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Latitude:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.latitude}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm='6'>
                                <Card style={{border: '1px solid grey'}}>
                                    <div className='d-flex justify-content-between border-bottom p-1'>
                                        <h6 style={{margin:'0'}}>Rule Type:</h6>
                                        <h6 style={{margin:'0'}}><b>{adruleInfo?.rule_type || 'N/A'}</b></h6>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                    }    
            </Form>
        </Fragment>
    )
}

export default viewPromotion