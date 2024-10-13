import React, { Fragment, useEffect, useState, useRef } from 'react'
import useJwt from '@src/auth/jwt/useJwt'
import { Check, Award, BarChart, Bell, Box, Briefcase, Clipboard, Clock, CreditCard, Gift, Layers, List, Paperclip, Plus, Settings, User, Users, Volume1 } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import rilacBanner from '../../../assets/images/icons/rilac-bg.svg'
import './landingPageStyle.css'


const Pricing = () => {
    const history = useHistory()
    const [plans, setPlans] = useState([])
    const [planSelect, setPlanSelect] = useState(2)
    useEffect(async () => {
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', false)
        await useJwt.planList().then(res => {
            console.log(res)
            setPlans(res.data.payload)
        }).catch(err => {
                Error(err)
                console.log(err)
        })
    }, [])
    return (
            <Row className='py-5 d-flex align-items-center' style={{background: '#D8EFEF'}} id='pricing'>
                <Col sm='1'></Col>
                <Col sm='10' className='py-4'>
                    <h1 className='text-center mb-2'>Choose your plan</h1>
                    <p className='text-center mb-5'>We have created some plans for you to help you to choose the best and suitable<br/> services for your needs. Each plan includes a best set of our services</p>
                    <Row className='bg-white' style={{marginTop:'100px', borderRadius:'15px'}}>
                        {
                            plans.slice(0, 4)?.map((f, index) => <Col key={index} sm='3' className={ planSelect === index ? 'p-3 plan-active' : 'p-3 plan-item'} onClick={() => {
                                setPlanSelect(index)
                                localStorage.setItem('registration_data', JSON.stringify({plan_id: f.id }))
                                // history.push('/merchantregister')

                                }}>
                                {/* <div className='d-flex align-items-end mb-2'>
                                    <h1 className='m-0' style={{marginRight:'20px'}}>{f.other_msg.replace(/<div className='d-flex align-items-end mb-2'>/, '').replace(/<h1 className='m-0' style={{marginRight:'20px'}}>/, '').replace(/<\/h1>/, '').replace(/<p className='m-0'>\/month<\/p>/, '').replace(/<\/div>/, '')}</h1>
                                    <p className='m-0'>/month</p>
                                </div> */}
                                {<div dangerouslySetInnerHTML={{__html: f.other_msg}}></div>}
                                <h2>{f.title}</h2> 
                                <p>{f.details}</p>
                                <div>
                                    {
                                        f.features.map((feature, index) => <span key={index} className='d-flex'><Check className='check-plane' size='20px'/><h5 className='plan-item-details' style={{marginLeft:'5px'}}>{feature.replace(/'/g, '')}</h5></span>)
                                    }
                                </div>
                                <div className='choose-btn'onClick={() => {
                                setPlanSelect(index)
                                localStorage.setItem('registration_data', JSON.stringify({plan_id: f.id }))
                                history.push('/merchantregister')
                                }}>Choose plan</div>
                            </Col>)
                        }
                    </Row>
                </Col>
                <Col sm='1'></Col>
            </Row>
    )
}

export default Pricing