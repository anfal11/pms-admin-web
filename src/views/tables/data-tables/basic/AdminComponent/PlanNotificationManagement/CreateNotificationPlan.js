import { useRTL } from '@hooks/useRTL'
import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { ChevronLeft, X } from 'react-feather'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import MultipleFileUploader from '../MultipleImageUpload'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const CreateNotificationPlan = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const { planId } = useParams()
    const [isRtl, setIsRtl] = useRTL()
    const history = useHistory()
    const [PromoCr8Loading, setPromoCr8Loading] = useState(false)
    const planRef = useRef()
    const [planList, setPlanList] = useState([])
   
    const [userInput, setUserInput] = useState({
        plan_name: "",
        price_onetime: "",
        plan_id: "",
        has_notification: false,
        sms_budget: 0,
        sms_budget_show: 0,
        push_notification_amount: 0,
        email_amount: 0,
        has_ads: false,
        facebook_ads_budget: 0,
        facebook_ads_budget_show: 0,
        google_ads_budget: 0,
        google_ads_budget_show: 0 
    })

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleChangeInt = (e) => {
        setUserInput({ ...userInput, [e.target.name]: parseInt(e.target.value) })
    }
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.planList().then(res => {
            const { payload } = res.data
            console.log('planList', payload)
            setPlanList(payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        if (planId) {
            setUserInput(JSON.parse(localStorage.getItem('planDetails')))
        }
    }, [planId])

    const onSubmit = (e) => {
        e.preventDefault()
        const {plan_name, price_onetime, plan_id, has_notification, sms_budget, sms_budget_show, push_notification_amount, email_amount, has_ads, facebook_ads_budget, facebook_ads_budget_show, google_ads_budget, google_ads_budget_show} = userInput
       
        console.log({plan_name, price_onetime, plan_id, has_notification, sms_budget, sms_budget_show, push_notification_amount, email_amount, has_ads, facebook_ads_budget, facebook_ads_budget_show, google_ads_budget, google_ads_budget_show})
      
        setPromoCr8Loading(true)
        if (planId) {
            useJwt.editNotificationPlans({ id: parseInt(userInput.id), plan_id: parseInt(plan_id), plan_name, price_onetime, plan_id, has_notification, sms_budget, sms_budget_show, push_notification_amount, email_amount, has_ads, facebook_ads_budget, facebook_ads_budget_show, google_ads_budget, google_ads_budget_show }).then((response) => {
                console.log(response)
                Success(response)
                setPromoCr8Loading(false)
                history.push('/notificationPlanlist')
            }).catch((error) => {
                setPromoCr8Loading(false)
                Error(error)
                console.log(error.response)
            })
        } else {
            useJwt.createNotificationPlan({plan_name, price_onetime, plan_id, has_notification, sms_budget, sms_budget_show, push_notification_amount, email_amount, has_ads, facebook_ads_budget, facebook_ads_budget_show, google_ads_budget, google_ads_budget_show}).then((response) => {
                console.log(response)
                Success(response)
                setPromoCr8Loading(false)
                history.push('/notificationPlanlist')
            }).catch((error) => {
                setPromoCr8Loading(false)
                Error(error)
                console.log(error.response)
            })
        }
    }

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={'/notificationPlanlist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <h4 className='m-1'>Notification Plan Info</h4>
                <Row className='match-height'>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="plan_name">Plan Name<span className='text-danger'>*</span></Label>
                                            <Input type="text"
                                                name="plan_name"
                                                id='plan_name'
                                                value={userInput.plan_name}
                                                onChange={handleChange}
                                                required
                                                placeholder="plan name here..."
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="price_onetime">One Price Time<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="price_onetime"
                                                id='price_onetime'
                                                value={userInput.price_onetime}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="plan_id">Plan<span className='text-danger'>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                ref={planRef}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.tax_id, label: planList?.find(item => item.id === userInput.plan_id)?.title || 'Select...' }}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, plan_id: selected.value})
                                                }}
                                                options={planList?.map(b => { return { value: b.id, label: b.title } })}
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                    // position: "absolute"
                                                }}
                                                onFocus={e => planRef.current.select.focus()}
                                                value={userInput?.plan_id || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="push_notification_amount">Push Notification Amount<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="push_notification_amount"
                                                id='push_notification_amount'
                                                value={userInput.push_notification_amount}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="sms_budget">SMS Budget<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="sms_budget"
                                                id='sms_budget'
                                                value={userInput.sms_budget}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="sms_budget_show">SMS Budget Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="sms_budget_show"
                                                id='sms_budget_show'
                                                value={userInput.sms_budget_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="email_amount">Email Amount<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="email_amount"
                                                id='email_amount'
                                                value={userInput.email_amount}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebook_ads_budget">Facebook Ads Budget<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="facebook_ads_budget"
                                                id='facebook_ads_budget'
                                                value={userInput.facebook_ads_budget}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebook_ads_budget_show">Facebook Ads Budget Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="facebook_ads_budget_show"
                                                id='facebook_ads_budget_show'
                                                value={userInput.facebook_ads_budget_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="google_ads_budget">Google Ads Budget<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="google_ads_budget"
                                                id='google_ads_budget'
                                                value={userInput.google_ads_budget}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="google_ads_budget_show">Google Ads Budget Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="google_ads_budget_show"
                                                id='google_ads_budget_show'
                                                value={userInput.google_ads_budget_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>`
                    </Col>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <CustomInput
                                                type='switch'
                                                id='has_notification'
                                                name='has_notification'
                                                inline
                                                label='Has Notification?'
                                                checked={userInput.has_notification}
                                                onChange={e => setUserInput({ ...userInput, has_notification: e.target.checked })} />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <CustomInput
                                                type='switch'
                                                id='has_ads'
                                                name='has_ads'
                                                inline
                                                label='Has Ads?'
                                                checked={userInput.has_ads}
                                                onChange={e => setUserInput({ ...userInput, has_ads: e.target.checked })} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>`
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="12" className='text-center'>
                                {
                                    PromoCr8Loading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : (
                                        planId ? <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Update</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                    )
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default CreateNotificationPlan