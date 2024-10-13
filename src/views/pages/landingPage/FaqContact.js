import React, { Fragment } from 'react'
import { Star, Plus } from 'react-feather'
import { Card, Col, Row, Form, Input } from 'reactstrap'
// import Accordion from 'react-bootstrap/Accordion'
import man1 from '../../../assets/images/avatars/2.png'
import man2 from '../../../assets/images/avatars/4.png'
import man3 from '../../../assets/images/avatars/8.png'
import Footer from './footer'
import './landingPageStyle.css'

const FaqContact = () => {
    const testimony = [{ name: 'Gabriel Fusho', cmnt: 'Rilac is a tremendous product so far I used! It is a one stop place for everything you need.', img: man1 }, { name: 'Adam Smith', cmnt: 'Rilac is a tremendous product so far I used! It is a one stop place for everything you need.', img: man2 }, { name: 'David Json', cmnt: 'Rilac is a tremendous product so far I used! It is a one stop place for everything you need.', img: man3 }]
    return (
        <div id='contact'>
            {/* <Row className='py-5 d-flex align-items-center' style={{ background: '#F4F7F9' }}>
                <Col sm='2'></Col>
                <Col sm='8' className='py-5'>
                    <h1 className='text-center mb-2'>Contact us</h1>
                    <p className='text-center mb-5'>When you think of excellent outcomes, you probably think about the Rilac to enhance your business.<br />For meeting your all the needs we are always here. Knock us anytime...</p>
                    <Row className='pt-3'>
                        <Col sm='6'>
                            <p tyle={{ fontSize: '80%' }}>Say Hello</p>
                            <h1 style={{ fontSize: '240%' }}>Any question? Feel<br />free to contact</h1>
                            <p style={{ fontSize: '110%', margin: '4% 0' }}>You are thinking about the Rilac to enhance your business. For meeting your all the needs we are always here.</p>
                        </Col>
                        <Col sm='6'>
                            <Form>
                                <Input type='text' className='contact-input' placeholder='Enter your name' />
                                <Input type='text' className='contact-input' placeholder='your e-mail' />
                                <Input type='text' className='contact-input' placeholder='Your phone number' />
                                <Input type='textarea' className='contact-input' placeholder='Type your message' />
                                <Input className='contact-submit' type='submit' />
                            </Form>
                        </Col>
                    </Row>
                </Col>
                <Col sm='2'></Col>
            </Row>
            <Row className='py-5 d-flex align-items-center bg-white'>
                <Col sm='1'></Col>
                <Col sm='10'>
                    <h1 className='text-center mb-2 mt-4'>What people say about us</h1>
                    <p className='text-center mb-5'>A customer testimonial is an endorsement from a satisfied customer that vouches for the value of a product or service.<br /> A great testimonial should increase the trustworthiness of a brand and its products and attract new customers.</p>
                    <Row className='match-height d-flex justify-content-center'>
                        {
                            testimony.map(fe => <Col sm='3'>
                                <Card>
                                    <div className='p-2'>
                                        <div>
                                            {
                                                [1, 1, 1, 1, 1, 1].map(f => <Star size='15px' fill='#FFBB00' stroke='#FFBB00' style={{ marginRight: '5px' }} />)
                                            }
                                        </div>
                                        <p className='mb-0 mt-1'>{fe.cmnt}</p>
                                        <div className='mt-3 d-flex align-items-center'>
                                            <img src={fe.img} className='testimony-img' />
                                            <p className='ml-1 mb-0'>{fe.name}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Col>)
                        }
                    </Row>
                </Col>
                <Col sm='1'></Col>
            </Row>
            <Row className='py-5 d-flex align-items-center' style={{ background: '#F4F7F9' }}>
                <Col sm='1'></Col>
                <Col sm='10' className='py-4'>
                    <h1 className='text-center mb-2'>Frequently Asked Questions </h1>
                    <p className='text-center mb-5'>We are asked so many question by our users from different platform and social media.<br /> We have tried to answer some of those frequently asked question.</p>
                    <Row style={{ marginTop: '100px' }}>
                        {
                            [1, 2, 3, 4, 5, 6].map(f => <Col sm="6" className='my-1'>
                                <div className='accordion-ques'><Plus size="14" /><h5 className='m-0 ml-1'>What is RILAC?</h5></div>
                                <div style={{ display: 'none' }}>
                                    Rilac is one Stop Service Platform which is interoperable one stop service delivery platform with powerful in-built tools/interfaces for designing, configuring and executing the delivery of service. It manages and maintains all enclosures / documents in the online repository and uses them across all services.
                                </div>
                            </Col>
                            )}
                    </Row>
                </Col>
                <Col sm='1'></Col>
            </Row> */}
            <Footer />
        </div>
    )
}

export default FaqContact