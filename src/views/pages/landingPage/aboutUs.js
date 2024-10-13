import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Check, Award, BarChart, Bell, Box, Briefcase, Clipboard, Clock, CreditCard, Gift, Layers, List, Paperclip, Plus, Settings, User, Users, Volume1 } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import rilacBanner from '../../../assets/images/icons/rilac-bg.svg'
import './landingPageStyle.css'

const AboutUs = () => { 
    return (
        <Row className='py-5 d-flex align-items-center bg-white' id='aboutUs'>
            <Col sm='1'></Col>
            <Col sm='4'>
                {/* <p  tyle={{fontSize:'80%'}}>About us</p>
                <h1  style={{fontSize:'240%'}}>About us our <br />application</h1> */}
                <p  style={{fontSize:'110%', margin:'4% 0'}}>The One Stop Service Platform RILAC is an interoperable one stop service delivery platform with powerful in-built tools/interfaces for designing, configuring and executing the delivery of service. It manages and maintains all enclosures / documents in the online repository and uses them across all services.</p>
                <p  style={{fontSize:'110%', margin:'4% 0'}}>Online marketing is the practice of leveraging web-based channels to spread a message about a company’s brand, products, or services to its potential customers. The methods and techniques used for online marketing include email, social media, display advertising, search engine optimization (SEO), Google AdWords and more. The principal aim of the RILAC is to serve you in all these areas.</p>
            </Col>
            <Col sm='7'>
                <img width='100%' src={rilacBanner}/>
            </Col>
        </Row>
    )
}

export default AboutUs