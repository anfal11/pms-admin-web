import useJwt from '@src/auth/jwt/useJwt'
import React, { useEffect, useState } from 'react'
import { Check, CheckCircle, XCircle, Link } from 'react-feather'
import { useHistory } from 'react-router-dom'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { Success, Error } from '../../viewhelper'
import './landingPageStyle.css'
import ModalForm from './userInfoInputModal'
import SwiperMultiSlides from '../../extensions/swiper/SwiperMultiSlides'
import { Swiper, SwiperSlide } from 'swiper/react'
import '@styles/react/libs/swiper/swiper.scss'
import { colors } from '@mui/material'

const params = {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
        clickable: true
    }
}

const pricingV3 = () => {
    const history = useHistory()
    const [features, setFeatures] = useState(['Mobile App Push', 'Web Push', 'Email', 'Sms', 'In-site Messages', 'On-site Messaging', 'WhatsApp Native', 'Facebook Ads', 'Google Ads', 'Basic Analytics', 'Campaign Management', 'Personalization', 'Data', 'User Management', 'Customer Report'])
    const [frontPlan, setFrontPlan] = useState([])

    const [plandata, setPlandata] = useState([
        {
            plan: 'Basic', price_monthly: '50', price_annually: '500', enableActive: true, 'Mobile App Push': true, 'Web Push': true, Email: true, Sms: true, 'In-site Messages': true, 'On-site Messaging': true, 'WhatsApp Native': false, 'Facebook Ads': false, 'Google Ads': false, 'Basic Analytics': false, 'Campaign Management': false, Personalization: false, Data: false, 'User Management': false, 'Customer Report': false
        }, 
        {
            plan: 'Startup', price_monthly: '200', price_annually: '2000', enableActive: true, 'Mobile App Push': true, 'Web Push': true, Email: true, Sms: true, 'In-site Messages': true, 'On-site Messaging': true, 'WhatsApp Native': true, 'Facebook Ads': true, 'Google Ads': false, 'Basic Analytics': false, 'Campaign Management': false, Personalization: false, Data: false, 'User Management': false, 'Customer Report': false
        }, 
        {
            plan: 'Enterprise', price_monthly: '500', price_annually: '4500', enableActive: true, 'Mobile App Push': true, 'Web Push': true, Email: true, Sms: true, 'In-site Messages': true, 'On-site Messaging': true, 'WhatsApp Native': true, 'Facebook Ads': true, 'Google Ads': true, 'Basic Analytics': true, 'Campaign Management': true, Personalization: true, Data: true, 'User Management': true, 'Customer Report': true
        }
    ])
    // useEffect(async () => {
    //     await useJwt.allSidePanelFeature().then(res => {
    //         console.log(res.data.payload.other_features)
    //         setFeatures(res.data.payload)
    //     }).catch(err => {
    //         Error(err)
    //         console.log(err)
    //     })
    //     await useJwt.pricingAndDetails().then(res => {
    //         console.log(res.data.payload)
    //         setFrontPlan([...res.data.payload.map(item => { return { ...item, enableActive: true } })])
    //     }).catch(err => {
    //         Error(err)
    //         console.log(err)
    //     })
    // }, [])

    const handleBuyNow = (row) => {
        localStorage.setItem('frontPlan', JSON.stringify(row))
        history.push('/viewDetails')
    }

    return (
        <>
            <Card className='py-2'>
                <CardHeader className='px-4'></CardHeader>
                <CardBody>
                    {/* <Row className='px-4'>
                        <Col sm='3'>
                            <div className='d-flex flex-column justify-content-center p-1' style={{ background: '#F3FBFC', height: '260px', borderTopRightRadius: '12px', borderTopLeftRadius: '12px' }}>
                                <h2>Subscription Price & Details</h2>
                                <h6 className='mt-2' style={{color: '#0070E0'}}>Channels</h6>
                            </div>
                            <div className='border border-1 py-2 px-1'>
                                {features?.other_features?.map((item, index) => (
                                    <table className='table table-striped' key={index}>
                                        <thead>
                                            <tr>
                                                <th style={{ backgroundColor: 'transparent', border: '0px' }}>{item.title}</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ marginLeft: '2px' }}>
                                            {item.features?.map((item, index) => (
                                                <tr className='border border-1' key={index}>
                                                    <td>{item.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ))
                                }
                                <div>
                                    <p className='pt-1 pl-2'>Basic Features</p>
                                    {
                                        features?.Basic_Features?.map(feature => <table className='table table-striped'>
                                            <tbody>
                                                <tr className='border border-1 pl-1'>
                                                    <td>{feature.menu_name}</td>
                                                </tr>
                                            </tbody>
                                        </table>)
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col sm='9'>
                            <Swiper {...params}>
                                {frontPlan?.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div>
                                            <div className='p-1' style={{ height: '260px', background: '#F3FBFC', borderTopRightRadius: '12px', borderTopLeftRadius: '12px' }}>
                                                <div className='d-flex justify-content-center'>
                                                    <h4>{item.title}</h4>
                                                </div>
                                                <div className='d-flex justify-content-center mt-1'>
                                                    <div className="btn-group borde" role="group" aria-label="Basic mixed styles example" style={{ borderRadius: '25px', padding: '5px', backgroundColor: 'white' }}>
                                                        <button
                                                            className={`btn`}
                                                            // ${item.enableActive ? 'btn-primary' : 'btn-light'}`
                                                            style={item.enableActive ? { borderRadius: '25px', backgroundColor: 'black', color: 'white' } : { borderRadius: '25px', backgroundColor: 'white', color: 'black' }}
                                                            onClick={() => {
                                                                frontPlan[index].enableActive = !frontPlan[index].enableActive
                                                                setFrontPlan([...frontPlan])
                                                            }}
                                                        >Monthly</button>
                                                        <button
                                                            className={`btn`}
                                                            style={!item.enableActive ? { borderRadius: '25px', backgroundColor: 'black', color: 'white' } : { borderRadius: '25px', backgroundColor: 'white', color: 'black' }}
                                                            onClick={() => {
                                                                frontPlan[index].enableActive = !frontPlan[index].enableActive
                                                                setFrontPlan([...frontPlan])
                                                            }}
                                                        >Yearly</button>
                                                    </div>
                                                </div>
                                                <div className='d-flex justify-content-center'>
                                                    {
                                                        item.enableActive ? <h3 style={{margin: '20px 0', color: '#4F6169', fontSize: '20px'}}>£{item.price_monthly}/m</h3> : <h3 style={{margin: '20px 0', color: '#4F6169', fontSize: '20px'}}>£{item.price_annually}/y</h3>
                                                    }
                                                </div>
                                                <div className='d-flex justify-content-center'>
                                                    <Button onClick={() => handleBuyNow(item)} color='#1D0253' style={{ border: '1px solid #026496', borderRadius: '25px', backgroundColor: '#D8EFEF', fontWeight: 'bold', fontSize: '16px'}}>
                                                        <span className='py-1'>Choose Plan</span>
                                                    </Button>
                                                </div>
                                                <div className='d-flex justify-content-center mt-1'>
                                                    {
                                                        item.enableActive ? <div>
                                                            <p className='m-0' style={{fontSize: '12px', fontWeight: 'normal'}}>{(((((item.price_monthly * 12) - item.price_annually) / (item.price_monthly * 12)) * 100)).toFixed(2)} % Save at Yearly Package</p>
                                                        </div> : !item.enableActive ? <div>
                                                            <p className='m-0' style={{fontSize: '12px', fontWeight: 'normal'}}>Buy And Save {(((((item.price_monthly * 12) - item.price_annually) / (item.price_monthly * 12)) * 100)).toFixed(2)} %</p>
                                                        </div> : null
                                                    }
                                                </div>
                                            </div>
                                            <div className='border border-1 py-2 px-1'>
                                                {features?.other_features?.map((item1, index) => (
                                                    <table className='table table-striped' key={index}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ backgroundColor: 'transparent', border: '0px' }}>{index === 0 ? 'Limit' : <span style={{color: 'transparent'}}>a</span>}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ marginLeft: '2px' }}>
                                                            {item1.features?.map((itm, index) => (
                                                                <tr className='border border-1' key={index}>
                                                                    <td className='d-flex justify-content-center'>{item[itm.feature] || 0}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ))
                                                }
                                                <div>
                                                    <p className='pt-1 pl-2'>Availability</p>
                                                    {
                                                        features?.Basic_Features?.map(feature => <table className='table table-striped'>
                                                            <tbody>
                                                                <tr className='border border-1 pl-1'>
                                                                    <td className='d-flex justify-content-center'>{item.features.map(i => i.id).includes(feature.id) ? <CheckCircle color='green' size='18px' /> : <XCircle color='red' size='18px' />}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Col>
                    </Row> */}
                    <Row>
                      <Col sm='0' md='1'></Col>
                      <Col sm='12' md='10'>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: '#F3FBFC'}}>    
                                            <div className='d-flex flex-column justify-content-center p-1'>
                                                <h2>Subscription Price & Details</h2>
                                                <h6 className='mt-2' style={{color: '#0070E0'}}>Channels</h6>
                                            </div>
                                        </th>
                                        {
                                            plandata.map((item, index) => <th style={{ backgroundColor: '#F3FBFC'}}>
                                                    <div className='p-1'>
                                                    <div className='d-flex justify-content-center'>
                                                        <h4>{item.plan}</h4>
                                                    </div>
                                                    <div className='d-flex justify-content-center mt-1'>
                                                        <div className="btn-group borde" role="group" aria-label="Basic mixed styles example" style={{ borderRadius: '25px', padding: '5px', backgroundColor: 'white' }}>
                                                            <button
                                                                className={`btn`}
                                                                // ${item.enableActive ? 'btn-primary' : 'btn-light'}`
                                                                style={item.enableActive ? { borderRadius: '25px', backgroundColor: 'black', color: 'white' } : { borderRadius: '25px', backgroundColor: 'white', color: 'black' }}
                                                                onClick={() => {
                                                                    plandata[index].enableActive = !plandata[index].enableActive
                                                                    setPlandata([...plandata])
                                                                }}
                                                            >Monthly</button>
                                                            <button
                                                                className={`btn`}
                                                                style={!item.enableActive ? { borderRadius: '25px', backgroundColor: 'black', color: 'white' } : { borderRadius: '25px', backgroundColor: 'white', color: 'black' }}
                                                                onClick={() => {
                                                                    plandata[index].enableActive = !plandata[index].enableActive
                                                                    setPlandata([...plandata])
                                                                }}
                                                            >Yearly</button>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-center'>
                                                        {
                                                            item.enableActive ? <h3 style={{margin: '20px 0', color: '#4F6169', fontSize: '20px'}}>{item.price_monthly} USD</h3> : <h3 style={{margin: '20px 0', color: '#4F6169', fontSize: '20px'}}>{item.price_annually} USD</h3>
                                                        }
                                                    </div>
                                                    <div className='d-flex justify-content-center'>
                                                        <Button onClick={() => {}} color='#1D0253' style={{ border: '1px solid #026496', borderRadius: '25px', backgroundColor: '#D8EFEF', fontWeight: 'bold', fontSize: '16px'}}>
                                                            <span className='py-1'>Choose Plan</span>
                                                        </Button>
                                                    </div>
                                                    <div className='d-flex justify-content-center mt-1'>
                                                        {
                                                            item.enableActive ? <div>
                                                                <p className='m-0 text-center' style={{fontSize: '12px', fontWeight: 'normal'}}>{(((((item.price_monthly * 12) - item.price_annually) / (item.price_monthly * 12)) * 100)).toFixed(2)} % Save at Yearly Package</p>
                                                            </div> : !item.enableActive ? <div>
                                                                <p className='m-0 text-center' style={{fontSize: '12px', fontWeight: 'normal'}}>Buy And Save {(((((item.price_monthly * 12) - item.price_annually) / (item.price_monthly * 12)) * 100)).toFixed(2)} %</p>
                                                            </div> : null
                                                        }
                                                    </div>
                                                </div>
                                            </th>)
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        features?.map((item, index) => <tr style={index % 2 === 0 ? { backgroundColor: '#F3FBFC'} : {}}>
                                            <td>{item}</td>
                                            {
                                                plandata.map(itm => <td className='text-center'>{itm[item] ? <CheckCircle color='green' size='18px' /> : <XCircle color='red' size='18px' />}</td>)
                                            }
                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        </Col>
                        <Col sm='0' md='1'></Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}
export default pricingV3