import React, { Fragment } from 'react'
import { Check, Facebook, Instagram, Twitter } from 'react-feather'
import { Link } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
// import rilac from '../../../assets/images/icons/white RILAC logo.png'
import rilac from '../../../assets/images/icons/RILAC-Logo.svg'
import './landingPageStyle.css'

const Footer = () => {
    return (
        <Fragment>
            <Row style={{background: '#F7F8F9'}} className="py-4">
                <Col sm='1'></Col>
                <Col sm='10'>
                    <Row>
                        <Col md='4' sm='12' className='d-flex justify-content-start'>
                            <div>
                                <div className='mb-2'><img width='35%' src={rilac}/></div>
                                <div>
                                    <p className=''style={{color: '#222222'}}>The One Stop Service Platform RILAC is an interoperable one stop service delivery platform with powerful in-built tools/interfaces for designing, configuring and executing the delivery of service. It manages and maintains all enclosures / documents in the online repository and uses them across all services.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md='4' sm='12' className='d-flex justify-content-center'>
                            <div className='d-flex flex-column align-items-center'>
                                <div className='mb-3'><h1 className='m-0' style={{color: '#222222'}}>Information</h1></div>
                                <div className='d-flex flex-column'>
                                    <Link className='mb-2' style={{color: '#222222'}}><Check /> Home</Link>
                                    <Link className='mb-2' style={{color: '#222222'}}><Check /> About us</Link>
                                    <Link className='mb-2' style={{color: '#222222'}}><Check /> Product Feature</Link>
                                    <Link className='mb-2' style={{color: '#222222'}}><Check /> Contact Us  +447930520196</Link>
                                </div>
                            </div>
                        </Col>
                        <Col md='4' sm='12'  className='d-flex justify-content-end'>
                            <div>
                                <div className='mb-2'><h1 className='m-0' style={{color: '#222222'}}>Social</h1></div>
                                <div className='d-flex'>
                                    <Link className='mr-1' style={{color: '#222222'}}><Facebook /></Link>
                                    <Link className='mr-1' style={{color: '#222222'}}><Twitter /></Link>
                                    <Link className='mr-1' style={{color: '#222222'}}><Instagram /></Link>
                                </div> 
                            </div>   
                        </Col>
                    </Row>
                </Col>
                <Col sm='1'></Col>
            </Row>
            <Row>
                <Col sm='12' className='d-flex align-items-center justify-content-center' style={{background: '#FF0000'}}>
                    <h6 className='text-white my-1'>copyright @ Red Technologies</h6>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Footer