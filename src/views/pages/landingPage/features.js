import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Check, Award, BarChart, Bell, Box, Briefcase, Clipboard, Clock, CreditCard, Gift, Layers, List, Paperclip, Plus, Settings, User, Users, Volume1 } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import rilacBanner from '../../../assets/images/icons/rilac-bg.svg'
import './landingPageStyle.css'

const Features = () => {
    const f = [<BarChart className='fe-icon' size={17} color='#FF3E1D'/>, <Award className='fe-icon' size={17} color='#888BFF'/>, <User className='fe-icon' size={17} color='#41D2F1'/>, <Gift className='fe-icon' size={17} color='#71DD37'/>, <Bell className='fe-icon' size={17} color='#FFAC02'/>, <Briefcase className='fe-icon' size={17} color='#71DD37'/>, <Box className='fe-icon' size={17} color='#888BFF'/>, <Users className='fe-icon' size={17} color='#71DD37'/>]
    
    const featrues = [{name: 'Campaign Management', color:'#FF3E1D', img:0}, {name: 'Loyality Management', color:'#888BFF', img:1}, {name: 'User Mangament', color:'#41D2F1', img:2},  {name: 'Voucher Mangament', color:'#71DD37', img:3}, {name: 'Notification', color:'#FFAC02', img:4},  {name: 'Ad Management', color:'#71DD37', img:5}, {name: 'Complain Management', color:'#888BFF', img:6}, {name: 'Group Managment', color:'#71DD37', img:7}]
    return (
            <Row className='py-5 d-flex align-items-center bg-white' id='features'>
                <Col sm='1'></Col>
                <Col sm='10'>
                    <h1 className='text-center mb-2'>Product Details</h1>
                    <p>RILAC is such a product which is built keeping in mind our users so that it will be helpful in the best ways for our users. We believe that      helpful technology enables our users to pursue their valuable and sustainable goals. Here some interesting features of our product has shown below:</p>
                    <Row className='match-height'>
                        {
                            featrues.map(fe => <Col sm='3'>
                                <Card>
                                    <div className='text-center p-3 d-flex flex-column align-items-center'>
                                        <div className='details-bg' style={{background: fe.color}}></div>
                                        {f[fe.img]}
                                        <p className='text-center m-0'>{fe.name}</p>
                                    </div>
                                </Card>
                            </Col>)
                        }
                    </Row>
                </Col>
                <Col sm='1'></Col>
            </Row>
    )
}

export default Features