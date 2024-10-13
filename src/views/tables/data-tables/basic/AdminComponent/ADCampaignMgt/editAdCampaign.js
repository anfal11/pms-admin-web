import React, { Fragment, useMemo, useState, useRef, useEffect } from 'react'
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
import { reducer } from '@uppy/store-redux'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const EditAdCampaign = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [isRtl, setIsRtl] = useRTL()
    const budgetRef = useRef()
    const typeRef = useRef()
    const objRef = useRef()
    const catRef = useRef()
    const googleTypeRef = useRef()
    const history = useHistory()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [toggle, setToggle] = useState({ fb: false, google: false })
    const [quotalist, setQuotaList] = useState([])
    const [googleCampaignAdvertisingChannelType, setGoogleCampaignAdvertisingChannelType] = useState([])
    const [facebookCampaignSpecialAdCategories, setFacebookCampaignSpecialAdCategories] = useState([])
    const [facebookCampaignObjectives, setFacebookCampaignObjectives] = useState([])
    const [userInput, setUserInput] = useState(JSON.parse(localStorage.getItem('adCampaignInfo')))
    const [MerchantList, setMerchantLists] = useState([])
    useEffect(() => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        useJwt.getQuotaList().then(res => {
            console.log(res)
            const allQuotas = []
            for (const q of res.data.payload) {
                if (q.is_approved === true) {
                    allQuotas.push(q)
                } 
            }
            setQuotaList(allQuotas)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.googleCampaignAdvertisingChannelType().then(res => {
            console.log(res)
            setGoogleCampaignAdvertisingChannelType(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.facebookCampaignSpecialAdCategories().then(res => {
            console.log(res)
            setFacebookCampaignSpecialAdCategories(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.facebookCampaignObjectives().then(res => {
            console.log(res)
            setFacebookCampaignObjectives(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.customerBusinessList().then(res => {
            const { payload } = res.data
            setMerchantLists(payload.map(x => { return { value: x.id, label: x.businessname } }))
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        setPointRuleloading(true)
        console.log(userInput)
        useJwt.editAdCampaign(userInput).then((response) => {
            setPointRuleloading(false)
            Success(response)
            console.log(response)
            history.push(userData?.role === 'vendor' ? '/adCampaignlistVendor' : '/adCampaignlist')
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error.response)
        })
    }

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/adCampaignlistVendor' : '/adCampaignlist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                {userData?.role !== 'vendor' && <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h6'>Create Ad Campaign</CardTitle>
                    </CardHeader>
                    <CardBody className='mt-1'>
                        <Row>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="name">Ad Campaign Name<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="name"
                                        id='name'
                                        value={userInput.name}
                                        onChange={(e) => {
                                            setUserInput({...userInput, name: e.target.value})
                                        }}
                                        required
                                        placeholder="name here..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="campaign_type">Campaign Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        ref= {typeRef}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{ value: userInput.campaign_type, label: userInput.campaign_type }}
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, campaign_type: selected.value })
                                        }}
                                        options={[{ value: 'both', label: 'both' }, { value: 'facebook', label: 'facebook' }, { value: 'google', label: 'google' }]}
                                        menuPlacement='auto'
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => typeRef.current.select.focus()}
                                        value={userInput.campaign_type || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="merchant_id">Select a Merchant</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={[...MerchantList, { value: 'self', label: 'Self' }].find(mer => mer.value === userInput?.business_id)}
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, business_id: selected.value })
                                        }}
                                        options={[{ value: 'self', label: 'Self' }, ...MerchantList]}
                                        menuPlacement='auto'
                                    />
                                </FormGroup>
                            </Col>
                            {
                                userInput.business_id === 'self' && <Col sm="4" >
                                <FormGroup>
                                    <Label for="budget">Select Budget<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        ref={budgetRef}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{ value: userInput.budget_id, label: quotalist.find(i => parseInt(i.id) === userInput.budget_id)?.title }}
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, budget_id: selected.value })
                                        }}
                                        options={ quotalist.map(q => { return { value: q.id, label: q.title } }) }
                                        menuPlacement='auto'
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => budgetRef.current.select.focus()}
                                        value={userInput.budget_id || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>}

                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h6'>
                          <img src={fb} width='30%' className='mr-1'/> Facebook
                        </CardTitle>
                        <CustomInput type='switch' onChange={(e) => {
                            if (e.target.checked) {
                                setToggle({ ...toggle, fb: true })
                            } else {
                                setToggle({ ...toggle, fb: false })
                            }
                        }
                        } id='fb' />
                    </CardHeader>
                    {
                        toggle.fb && <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="4" >
                                    <FormGroup>
                                        <Label for="objective">Objective<span style={{ color: 'red' }}>*</span></Label>
                                        <Select
                                            ref={objRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={{value:userInput.objective, label: userInput.objective || 'select...'}}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, objective: selected.value})
                                            }}
                                            options={facebookCampaignObjectives.map(x => { return { value: x.objectives, label: x.objectives } })}
                                            menuPlacement='auto'
                                        />
                                    </FormGroup>
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => objRef.current.select.focus()}
                                        value={userInput.objective || ''}
                                        onChange={e => ''}
                                    />
                                </Col>
                                <Col sm="4" >
                                    <FormGroup>
                                        <Label for="special_ad_categories">Special Ad Categories<span style={{ color: 'red' }}>*</span></Label>
                                         <Select
                                            ref={catRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={{value:userInput.special_ad_categories, label: userInput.special_ad_categories || 'select...'}}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, special_ad_categories: selected.value})
                                            }}
                                            options={facebookCampaignSpecialAdCategories.map(x => { return { value: x.catagories, label: x.catagories } })}
                                            menuPlacement='auto'
                                        />
                                    </FormGroup>
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => catRef.current.select.focus()}
                                        value={userInput.special_ad_categories || ''}
                                        onChange={e => ''}
                                    />
                                </Col>
                                {/* <Col sm="4" >
                                    <FormGroup>
                                        <Label for="adAccountId">Ad Account Id<span style={{ color: 'red' }}>*</span></Label>
                                        <Input type="text"
                                            name="adAccountId"
                                            id='adAccountId'
                                            value={userInput.adAccountId}
                                            onChange={(e) => {
                                                setUserInput({...userInput, facebook_data: {...userInput.facebook_data, adAccountId: e.target.value}})
                                            }}
                                            required
                                            placeholder="ad account id here..."
                                        />
                                    </FormGroup>
                                </Col> */}
                                <Col sm="4" className='mt-2'>
                                    <FormGroup>
                                        <CustomInput type='switch' onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({...userInput, facebook_status: 1})
                                            } else {
                                                setUserInput({...userInput, facebook_status: 0})
                                            }
                                        }
                                        } id='statusfb' checked={userInput.facebook_status} label='Facebook Campaign Status' />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        }                               
                    </Card>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h6'>
                            <img src={google} width='30%' className='mr-1'/> Google
                        </CardTitle>
                        <CustomInput type='switch' onChange={(e) => {
                            if (e.target.checked) {
                                setToggle({ ...toggle, google: true })
                            } else {
                                setToggle({ ...toggle, google: false })
                            }
                        }
                        } id='google' />
                    </CardHeader> 
                    {
                        toggle.google && <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="4" >
                                    <FormGroup>
                                        <Label for="google_advertising_channel_type">Advertising Channel Type<span style={{ color: 'red' }}>*</span></Label>
                                        <Select
                                            ref={googleTypeRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={{value:userInput.google_advertising_channel_type, label: userInput.google_advertising_channel_type || 'select...'}}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, google_advertising_channel_type: selected.value})
                                            }}
                                            options={googleCampaignAdvertisingChannelType.map(x => { return { value: x.channel_type, label: x.channel_type } })}
                                            menuPlacement='auto'
                                        />
                                    </FormGroup>
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => googleTypeRef.current.select.focus()}
                                        value={userInput.google_advertising_channel_type || ''}
                                        onChange={e => ''}
                                    />
                                </Col>
                                <Col sm="4" className='mt-2'>
                                    <FormGroup>
                                        <CustomInput type='switch' onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({...userInput, google_status: 1})
                                            } else {
                                                setUserInput({...userInput, google_status: 0})
                                            }
                                        }
                                        } id='status' checked={userInput.google_status} label='Google Campaign Status' />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        }                               
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
                                        <span >Update</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default EditAdCampaign