import useJwt from '@src/auth/jwt/useJwt'
import React, { useEffect, useState } from 'react'
import rilac from '../../../assets/images/icons/RILAC-Logo.svg'
import { Link } from 'react-scroll'
import { Check, CheckCircle, XCircle } from 'react-feather'
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
import { feature } from 'caniuse-lite'

const viewDetails = () => {
    const frontPlan = JSON.parse(localStorage.getItem('frontPlan'))
    const [enableActive, setEnableActive] = useState(false)
    const [extraFeatures, setExtraFeatures] = useState([])
    const [active, setActive] = useState('')
    const toggleEnableModal = () => setEnableActive(!enableActive)

    useEffect(async () => {
        await useJwt.pricingAndDetails().then(res => {
            console.log(res.data.payload)
            // setExtraFeatures([...res.data.payload.map(item => { return { ...item, enableActive: true } })])
            setExtraFeatures(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [frontPlan.id])

    return (
        <>
            <div style={{ minHeight: '100vh', background: 'white' }}>
                <Row>
                    <Col sm='1'></Col>
                    <Col sm='10'>
                        <Row className='my-2'>
                            <Col sm='2' className='d-flex align-items-center'>
                                <Link className='mr-1 menu-item' onClick={() => setActive('home')} to="home" spy={true} smooth={true} duration={500}> <img width='75%' src={rilac} /> </Link>
                            </Col>
                            <Col sm='8' className='d-flex align-items-center'>
                                <Link className='mr-1 menu-item' onClick={() => setActive('home')} to="home" spy={true} smooth={true} duration={500}><p className={active === 'home' ? 'm-0 menue_active' : 'm-0'}>Home</p></Link>
                                {/* <Link className='mr-1 menu-item' onClick={() => setActive('aboutUs')} to="aboutUs" spy={true} smooth={true} duration={500}><p className={active === 'aboutUs' ? 'm-0 menue_active' : 'm-0'}>About Us</p></Link> */}
                                <Link className='mr-1 menu-item' onClick={() => setActive('features')} to="features" spy={true} smooth={true} duration={500}><p className={active === 'features' ? 'm-0 menue_active' : 'm-0'}>Feature</p></Link>
                                <Link className='mr-1 menu-item' onClick={() => setActive('pricing')} to="pricing" spy={true} smooth={true} duration={500}><p className={active === 'pricing' ? 'm-0 menue_active' : 'm-0'}>Price</p></Link>
                                <Link className='mr-1 menu-item' onClick={() => setActive('contact')} to="contact" spy={true} smooth={true} duration={500}><p className={active === 'contact' ? 'm-0 menue_active' : 'm-0'}>Contact us</p></Link>
                                <a href='/Adminlogin' className='mr-1 menu-item'><p className='m-0'>Log in</p></a>
                            </Col>
                            <Col sm='2' className='d-flex align-items-center'>
                                <Link className='mr-1 menu-item' onClick={() => setActive('pricing')} to="pricing" spy={true} smooth={true} duration={500}><p className='demo-btn'>Request for Demo</p></Link>
                                {/* <Link className='mr-1 menu-item' onClick={() => setActive('pricing')} to="pricing" spy={true} smooth={true} duration={500}><div className='demo-btn'>Request for Demo</div></Link> */}
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='1'></Col>
                </Row>
                <Row>
                    <Col sm='1'></Col>
                    <Col sm='7' style={{ background: '#F8F8FF', borderTopRightRadius: '12px', borderTopLeftRadius: '12px', height: '100vh' }} className='p-3'>
                        {
                            frontPlan?.features?.map(i => (
                                <div className='mb-2'>
                                    <h4>{i.name}</h4>
                                    <p>{i.description}</p>
                                </div>
                            ))
                        }
                    </Col>
                    <Col sm='3'>
                        <div>
                            <div className='p-2' style={{ background: '#F8F8FF', borderTopRightRadius: '12px', borderTopLeftRadius: '12px' }}>
                                <div className='d-flex justify-content-center'>
                                    <h3>{frontPlan.title}</h3>
                                </div>
                                <div className="btn-group border border-1 w-100" role="group" aria-label="Basic mixed styles example" style={{ padding: '6px', borderRadius: '10px' }}>
                                    <button
                                        className={`w-50 p-1 btn ${enableActive ? 'btn-primary' : 'btn-light'}`}
                                        style={{ padding: '6px', borderTopLeftRadius: '8px', borderEndStartRadius: '8px' }}
                                        // color={`${enableActive ? 'primary' : 'secondary'}`}
                                        onClick={() => {
                                            toggleEnableModal()
                                        }}
                                    >Monthly</button>
                                    <button
                                        className={`w-50 p-1 btn ${!enableActive ? 'btn-success' : 'btn-light'}`}
                                        style={{ padding: '6px', borderTopRightRadius: '8px', borderEndEndRadius: '8px' }}
                                        // color={`${enableActive ? 'primary' : 'secondary'}`}
                                        onClick={() => {
                                            toggleEnableModal()
                                        }}
                                    >Yearly</button>
                                </div>
                                <div>
                                    {
                                        enableActive ? <div>
                                            <p className='text-center mt-1'>Yearly <span className='text-danger'>Savings {(((((frontPlan.price_monthly * 12) - frontPlan.price_annually) / (frontPlan.price_monthly * 12)) * 100)).toFixed(2)}%</span></p>
                                            <h3 className='text-danger text-center'>£{(frontPlan.price_monthly)}/m</h3>
                                        </div> : <div>
                                            {/* <small className='text-center mt-1' style={{ 'font-weight': 'bold' }}>Buy And <span className='text-danger '>Save {(((((frontPlan.price_monthly * 12) - frontPlan.price_annually) / (frontPlan.price_monthly * 12)) * 100)).toFixed(2)}%</span></small> */}
                                            <p className='text-center mt-1'>
                                                Buy And <span style={{ fontWeight: 'bold' }} className='text-danger'>Save {(((((frontPlan.price_monthly * 12) - frontPlan.price_annually) / (frontPlan.price_monthly * 12)) * 100)).toFixed(2)}%</span>
                                            </p>

                                            <h3 className='text-danger text-center'>£{frontPlan.price_annually}/y</h3>
                                        </div>
                                    }
                                    <div className='d-flex justify-content-center p-1' style={{ borderRadius: '12px' }}>
                                        <Button color='danger'>
                                            <span className='p-1'>Buy Now</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='my-2 px-3 pb-2' style={{ background: '#FFF7F5' }}>
                                <h4 className='text-center pt-2 pb-3'>More Package</h4>
                                    {
                                        extraFeatures
                                            .filter(feature => feature.id !== frontPlan.id)
                                            .map(filteredFeature => (
                                                <div key={filteredFeature.id}>
                                                    <h4 style={{ borderBottom: '1px solid gray', paddingBottom: '2px' }}>{filteredFeature.title}</h4>
                                                    {/* Add more details as needed */}
                                                </div>
                                            ))
                                    }
                            </div>
                        </div>
                    </Col>
                    <Col sm='1'></Col>
                </Row>
            </div>
        </>
    )
}
export default viewDetails