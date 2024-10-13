import React, { Fragment, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import rilac from '../../../assets/images/icons/RILAC-Logo.svg'

import { Link } from 'react-scroll'
import Home from './home.js'
import AboutUs from './aboutUs'
import Features from './features'
import PricingV2 from './pricingV2'
import PricingV3 from './pricingV3.js'
import Pricing from './pricing'
import FaqContact from './FaqContact.js'
import './landingPageStyle.css'

const LandingPage = () => {
    const [active, setActive] = useState('home')

    return (
        <div>
            <Row style={{ background: 'white' }}>
                <Col sm='1'></Col>
                <Col sm='10'>
                    <Row className='my-2'>
                        <Col sm='2' className='d-flex align-items-center'>
                        <Link className='mr-1 menu-item' onClick={() => setActive('home')} to="home" spy={true} smooth={true} duration={500}> <img width='75%' src={rilac}  /> </Link>
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
            <Fragment>
                <Home />
                <AboutUs />
                <Features />
                {/* <Pricing /> */}
                {/* <PricingV2 /> */}
                <PricingV3/>
                <FaqContact />
            </Fragment>
        </div>
    )
}

export default LandingPage