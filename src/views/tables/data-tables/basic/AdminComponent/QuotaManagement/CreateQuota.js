import React, { Fragment, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { useRTL } from '@hooks/useRTL'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import notification from '../../../../../../assets/images/icons/notification 3.svg'
import mail from '../../../../../../assets/images/icons/clarity_email-solid.svg'
import insta from '../../../../../../assets/images/icons/Instagram_logo_2016 1.svg'
import sms from '../../../../../../assets/images/icons/fa6-solid_comment-sms.svg'
import wapp from '../../../../../../assets/images/icons/logos_whatsapp.svg'
import google from '../../../../../../assets/images/icons/google_svg 1.svg'
import fb from '../../../../../../assets/images/icons/ant-design_facebook-filled.svg'
import Nouislider from 'nouislider-react'
import '@styles/react/libs/noui-slider/noui-slider.scss'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import { toast } from 'react-toastify'
import { reducer } from '@uppy/store-redux'
import './ind.css'

const CreateQuota = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [isRtl, setIsRtl] = useRTL()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const history = useHistory()
    const [budget, setBudget] = useState(0.1)
    const [title, setTitle] = useState('')
    const [budgetLimit, setBudgetLimit] = useState(0)
    const [upRange, setupRange] = useState(0.1)
    const [facebook, setfacebook] = useState(0)
    const [googleV, setgoogle] = useState(0)
    const [whatsapp, setwhatsapp] = useState(0)
    const [smsV, setsms] = useState(0)
    const [instagram, setinstagram] = useState(0)
    const [email, setemail] = useState(1)
    const [push_notification, setpush_notification] = useState(1)
    const [smsRate, setsmsRate] = useState(1)

    useEffect(() => {
        useJwt.getSmsRate().then((response) => {
            console.log(response.data.payload?.per_sms_cost)
            setsmsRate(response.data.payload?.per_sms_cost)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })

    }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        console.log({ facebook, googleV, whatsapp, smsV, email, push_notification, instagram, budget, title })
        const isEqual = (budget - (facebook + googleV + whatsapp + (smsV * smsRate) + instagram)) < 1 && (budget - (facebook + googleV + whatsapp + (smsV * smsRate) + instagram)) >= 0
        if (!isEqual) {
            toast.error('Please,  fulfill your budget quota!')
            return 0
        }
        setPointRuleloading(true)
        useJwt.createQuotaList({ title, total_budget:budget, facebook, google: googleV, whatsapp, sms: smsV, email, push_notification, instagram }).then((response) => {
            setPointRuleloading(false)
            Success(response)
            history.push(userData?.role === 'vendor' ? '/allQuotaVendor' : '/allQuota')
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error)
        })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/allQuotaVendor' : '/allQuota'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <div className='d-flex justify-content-center mb-2 mt-2'>
                    <div className='d-flex align-items-center bg-white p-1 mr-1' style={{ borderRadius: '10px' }}>
                        <h4 className='mr-1 mb-0 text-primary'>Title<span style={{ color: 'red' }}>*</span></h4>
                        <Input type="text"
                            name="title"
                            id='title'
                            style={{ width: '60%' }}
                            value={title}
                            onChange={e => {
                                setTitle(e.target.value)
                            }}
                            required
                            placeholder="title here..."
                        />
                    </div>
                    {/* <div className='d-flex justify-content-center mb-2 mt-2'> */}
                    <div className='d-flex align-items-center bg-white p-1' style={{ borderRadius: '10px' }}>
                        <h4 className='mr-1 mb-0 text-primary'>Total Budget<span style={{ color: 'red' }}>*</span></h4>
                        <Input type="number"
                            name="budget"
                            id='budget'
                            style={{ width: '60%' }}
                            value={budget}
                            min={0}
                            onChange={e => {
                                setupRange(parseInt(e.target.value))
                                setBudget(parseInt(e.target.value))
                                setBudgetLimit(parseInt(e.target.value))
                                setfacebook(0)
                                setgoogle(0)
                                setwhatsapp(0)
                                setsms(0)
                                setinstagram(0)
                            }}
                            required
                            placeholder="0"
                        />
                    </div>
                </div>
                <Row>
                    <Col>
                        <h4 className='mb-1'>Free Channels</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm='6'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Email</CardTitle>
                                {/* <img src={mail}/> */}
                                <CustomInput type='checkbox' id='primary' name='primary' inline defaultChecked disabled />
                            </CardHeader>
                            {/* <CardBody style={{ paddingTop: '15px' }}>
                                <Row>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Nouislider
                                                connect='lower'
                                                start={0}
                                                direction={isRtl === true ? 'rtl' : 'ltr'}
                                                orientation='horizontal'
                                                range={{
                                                    min: 0,
                                                    max: 500
                                                }}
                                                tooltips={true}
                                                style={{
                                                    marginTop: '30px'
                                                }}
                                                onChange={e => setemail(parseInt(e[0]))}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody> */}
                        </Card>
                    </Col>
                    <Col sm='6'>
                        <Card>
                            <CardHeader className='border-bottom'>
                                <CardTitle tag='h4'>Push Notification</CardTitle>
                                <CustomInput type='checkbox' id='primary' name='primary' inline defaultChecked disabled />
                            </CardHeader>
                            {/* <CardBody style={{ paddingTop: '15px' }}>
                                <Row>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Nouislider
                                                connect='lower'
                                                start={0}
                                                direction={isRtl === true ? 'rtl' : 'ltr'}
                                                orientation='horizontal'
                                                range={{
                                                    min: 0,
                                                    max: 500
                                                }}
                                                tooltips={true}
                                                style={{
                                                    marginTop: '30px'
                                                }}
                                                onChange={e => setpush_notification(parseInt(e[0]))}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody> */}
                        </Card>
                    </Col>
                </Row>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Paid Channels</CardTitle>
                        {budgetLimit !== 0 && < CardTitle tag='h4'>Remaining : {budgetLimit.toFixed(2)}</CardTitle>}
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px', paddingLeft: '60px', paddingRight: '60px' }}>
                        <Row className='pb-2 border-bottom border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={fb} />
                                    <h4>Facebook</h4>
                                </div>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={facebook}
                                        tooltip={true}
                                        orientation="horizontal"
                                        disabled={budget === 0}
                                        onChange={e => {
                                            // console.log(parseInt(e))
                                            if (budgetLimit > 0 || (parseInt(e) < facebook)) {
                                                if ((budgetLimit - (parseInt(e) - facebook)) >= 0) {
                                                    setBudgetLimit(budgetLimit - (parseInt(e) - facebook))
                                                    setfacebook(parseInt(e))
                                                }
                                            }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className='pb-2 pt-1 border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={google} />
                                    <h4>Google</h4>
                                </div>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={googleV}
                                        tooltip={true}
                                        orientation="horizontal"
                                        disabled={budget === 0}
                                        onChange={e => {
                                            if (budgetLimit > 0 || (parseInt(e) < googleV)) {
                                                if ((budgetLimit - (parseInt(e) - googleV)) >= 0) {
                                                    setBudgetLimit(budgetLimit - (parseInt(e) - googleV))
                                                    // setBudget(budget - (parseInt(e) - googleV))
                                                    setgoogle(parseInt(e))
                                                }

                                            }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className='pb-2 pt-1 border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={wapp} />
                                    <h4>WhatsApp</h4>
                                </div>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={whatsapp}
                                        tooltip={true}
                                        orientation="horizontal"
                                        disabled={budget === 0}
                                        onChange={e => {
                                            if (budgetLimit > 0 || (parseInt(e) < whatsapp)) {
                                                if ((budgetLimit - (parseInt(e) - whatsapp)) >= 0) {
                                                    setBudgetLimit(budgetLimit - (parseInt(e) - whatsapp))
                                                    // setBudget(budget - (parseInt(e) - whatsapp))
                                                    setwhatsapp(parseInt(e))
                                                }
                                            }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className='pb-2 pt-1 border-bottom'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={sms} />
                                    <h4>SMS {`(${smsRate} per sms)`}</h4>
                                </div>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange / smsRate}
                                        reverse={false}
                                        value={smsV}
                                        tooltip={true}
                                        orientation="horizontal"
                                        disabled={budget === 0}
                                        onChange={e => {
                                            if (budgetLimit >= smsRate || (parseInt(e) < smsV)) {
                                                if ((budgetLimit - ((parseInt(e) - smsV) * smsRate)) >= 0) {
                                                    setBudgetLimit(budgetLimit - ((parseInt(e) - smsV) * smsRate))
                                                    // setBudget(budget - (parseInt(e) - smsV))
                                                    setsms(parseInt(e))
                                                }
                                            }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className='pt-1'>
                            <Col sm="6" >
                                <div className='d-flex align-items-center'>
                                    <img className='mr-1' src={insta} />
                                    <h4>Instagram</h4>
                                </div>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Slider
                                        min={0}
                                        max={upRange}
                                        reverse={false}
                                        value={instagram}
                                        tooltip={true}
                                        orientation="horizontal"
                                        disabled={budget === 0}
                                        onChange={e => {
                                            if (budgetLimit > 0 || (parseInt(e) < instagram)) {
                                                if ((budgetLimit - (parseInt(e) - instagram)) >= 0) {
                                                    setBudgetLimit(budgetLimit - (parseInt(e) - instagram))
                                                    // setBudget(budget - (parseInt(e) - instagram))
                                                    setinstagram(parseInt(e))
                                                }
                                            }
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="12" className='text-center'>
                                {
                                    pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment >
    )
}

export default CreateQuota