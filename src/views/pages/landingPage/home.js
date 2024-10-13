import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Link } from 'react-scroll'
import rilacBanner from '../../../assets/images/icons/Rilac_Banner.svg'
import redRilacBanner from '../../../assets/images/icons/Banner.svg'
import './landingPageStyle.css'

const Home = () => {
    const [active, setActive] = useState('home')

    return (
        <Row className='banner' id='home'>
            <Col sm='12'>
                <img width='100%' src={redRilacBanner}/>
            </Col>
            <Col sm='12' className='banner-right'>
                <Row>
                    <Col sm='7'></Col>
                    <Col sm='5' style={{marginTop:'12%', marginLeft:'61.5%'}}>
                        {/* <p className='' style={{fontSize:'80%', color: '#222222'}}>Tag line</p> */}
                        {/* <p className='text-white' style={{fontSize:'80%'}}>Tag line</p> */}
                        {/* <h1 className='text-white' style={{fontSize:'240%'}}>Business Automation</h1>
                        <p className='text-white' style={{fontSize:'110%', margin:'4% 0'}}>Automation is the future of next generation <br/> business operarion.</p> */}
                        {/* <p className='text-white' style={{fontSize:'110%', margin:'4% 0'}}>Digital campaign management involves planning, <br/>executing, and analyzing a digital marketing campaign <br/>across various digital channels such as social media, <br/>email, search engines, and websites. The goal of a digital <br/>campaign is to promote a brand, product, or service, <br/>and to reach and engage with a target audience.</p>  */}
                        <p className='' style={{fontSize:'130%', margin:'4% 0', color: '#222222'}}>Digital campaign management involves planning, <br/>executing, and analyzing a digital marketing campaign <br/>across various digital channels such as social media, <br/>email, search engines, and websites. The goal of a digital <br/>campaign is to promote a brand, product, or service, <br/>and to reach and engage with a target audience.</p> 
                        {/* <button className='book-btn'>Book your plan</button> */}
                        <Link className='mr-1 menu-item' onClick={() => setActive('pricing')} to="pricing" spy={true} smooth={true} duration={500}><button className='book-btn'>Book your plan</button></Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Home