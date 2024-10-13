import { useRTL } from '@hooks/useRTL'
import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft, X } from 'react-feather'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import MultipleFileUploader from './MultipleImageUpload'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const CreatePlan = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const { planId } = useParams()
    const tpsRef = useRef()
    const taxRef = useRef()
    const graceRef = useRef()
    const subsRef = useRef()
    const [isRtl, setIsRtl] = useRTL()
    const history = useHistory()
    const [PromoCr8Loading, setPromoCr8Loading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [allMenuList, setallMenuList] = useState([])
    const [planTaxList, setPlanTaxList] = useState([])
    const [featureIDs, setFeatureIDs] = useState([])
    const [subPlanList, setSubPlanList] = useState([])
    const [selectedSubsPlan, setSelectedSubsPlan] = useState({})
    const [selected_sub_menu_ids, setSubmenuIDs] = useState([])
    const [userInput, setUserInput] = useState({
        title: "",
        details: "",
        price_monthly: 0,
        price_quarterly: 0,
        price_annually: 0,
        is_temporary: true,
        status: true,
        other_msg: " ",
        features: [],
        plan_visibility: false,
        valid_til: "", //date* A
        plan_image: null,
        recommended: true,
        has_notification: false,
        sms_show: 0,
        email_show: 0,
        push_notification_show: 0,
        instagram_post_show: 0,
        facebook_post_show: 0,
        has_ads: false,
        facebook_ads_budget: 0,
        facebook_ads_budget_show: 0,
        google_ads_budget: 0,
        google_ads_budget_show: 0,
        plan_grace_period: 0,
        tax_id: 0,
        menu_ids : [],
        sub_menu_ids : [],
        link_subscription_id: null,
        link_subscription_name : ""   
    })
    
    const [image_urls, setImage_Urls] = useState([])

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleChangeInt = (e) => {
        setUserInput({ ...userInput, [e.target.name]: parseInt(e.target.value) })
    }
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false)
        localStorage.setItem('usePMStoken', false)
        useJwt.getMerchantPlanMenuList().then(res => {
            console.log('getAdminMenuSubmenuList', res)
            const menueIds = res.data.payload.map(items => items.id)
            delete res.data.payload[menueIds.indexOf(15)]
            delete res.data.payload[menueIds.indexOf(16)]
            delete res.data.payload[menueIds.indexOf(9)]
            setallMenuList(res.data.payload)
            if (!planId) {
                setFeatureIDs([...featureIDs, ...res.data.payload?.slice(0, 5)?.map(item => item.id)])
            }
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.subscriptionList().then(async res => {
            console.log('subscriptionList', res)
            setSubPlanList(res.data.filter(item => !item.RilacPlanId))
            setSelectedSubsPlan(res.data[0])

            await useJwt.planTaxList().then(res1 => {
                const { payload } = res1.data
                console.log('planTaxList', payload)
                setPlanTaxList(payload)
                setUserInput({ ...userInput, link_subscription_id: res.data[0].id, link_subscription_name : res.data[0].PackageName, tax_id: payload[0]?.id})
            }).catch(err => {
                Error(err)
                console.log(err)
            })
        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [])
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        if (planId) {
            setUserInput({...JSON.parse(localStorage.getItem('planDetails'))})
            setImage_Urls([JSON.parse(localStorage.getItem('planDetails')).plan_image])
            setFeatureIDs(JSON.parse(localStorage.getItem('planDetails')).plan_features?.map(item => item.menu_id))
            setSubmenuIDs(JSON.parse(localStorage.getItem('planDetails')).plan_features?.map(item => item.submenu_id))
        }
    }, [planId])

    const onSubmit = (e) => {
        e.preventDefault()
        const { title, details, price_quarterly, is_temporary, status, other_msg, features, plan_visibility, valid_til, recommended, has_notification, sms_show, email_show, push_notification_show, instagram_post_show, facebook_post_show, has_ads, facebook_ads_budget, facebook_ads_budget_show, google_ads_budget, google_ads_budget_show, tax_id, enterprise_api_tps, link_subscription_id, link_subscription_name } = userInput
        let { plan_grace_period, price_annually, price_monthly, plan_image, menu_ids, sub_menu_ids } = userInput
        plan_image = image_urls[0]
        price_monthly = selectedSubsPlan.Price
        price_annually = price_monthly * 10
        plan_grace_period = selectedSubsPlan.Grass
        const menuSubmenuMod = allMenuList?.filter(x => x.submenu?.length).map(y => { return { id: y.id, submenu: y.submenu.map(z => z.id) } })
        const filteredmenuID = []
        for (let i = 0; i < menuSubmenuMod?.length; i++) {
            if (menuSubmenuMod[i].submenu.some(subId => selected_sub_menu_ids.includes(subId))) {
                filteredmenuID.push(menuSubmenuMod[i].id)
            }
        }
        menu_ids = [...new Set(featureIDs), ...filteredmenuID]
        sub_menu_ids = [...new Set(selected_sub_menu_ids)]
      
        setPromoCr8Loading(true)
        if (planId) {
            useJwt.updatePlanList({ plan_id: parseInt(userInput.id), title, details, price_monthly, price_quarterly, price_annually, is_temporary, status, other_msg, features, plan_visibility, valid_til, recommended, has_notification, sms_show, email_show, push_notification_show, instagram_post_show, facebook_post_show, has_ads, facebook_ads_budget, facebook_ads_budget_show, google_ads_budget, google_ads_budget_show, plan_grace_period, tax_id: parseInt(tax_id), plan_image, menu_ids, sub_menu_ids, enterprise_api_tps, link_subscription_id, link_subscription_name }).then((response) => {
                console.log(response)
                Success(response)
                setPromoCr8Loading(false)
                history.push('/planlist')
            }).catch((error) => {
                setPromoCr8Loading(false)
                Error(error)
                console.log(error.response)
            })
        } else {
            useJwt.createPlanList({ title, details, price_monthly, price_quarterly, price_annually, is_temporary, status, other_msg, features, plan_visibility, valid_til, recommended, has_notification, sms_show, email_show, push_notification_show, instagram_post_show, facebook_post_show, has_ads, facebook_ads_budget, facebook_ads_budget_show, google_ads_budget, google_ads_budget_show, plan_grace_period, tax_id: parseInt(tax_id), plan_image, menu_ids, sub_menu_ids, enterprise_api_tps, link_subscription_id, link_subscription_name }).then((response) => {
                console.log(response)
                Success(response)
                setPromoCr8Loading(false)
                history.push('/planlist')
            }).catch((error) => {
                setPromoCr8Loading(false)
                Error(error)
                console.log(error.response)
            })
        }
    }

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={'/planlist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <h4 className='mt-1'>Basic Settings</h4>
                 <Card>
                    <CardBody>
                        <Row>
                            <Col sm="3" >
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        id='is_temporary'
                                        name='is_temporary'
                                        inline
                                        label='Is Temporary?'
                                        checked={userInput.is_temporary}
                                        onChange={e => setUserInput({ ...userInput, is_temporary: e.target.checked })} />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        id='statues'
                                        name='statues'
                                        inline
                                        label='Status'
                                        checked={userInput.status}
                                        onChange={e => setUserInput({ ...userInput, statues: e.target.checked })} />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        id='plan_visibility'
                                        name='plan_visibility'
                                        inline
                                        label='Is Plan Visible?'
                                        checked={userInput.plan_visibility}
                                        onChange={e => setUserInput({ ...userInput, plan_visibility: e.target.checked })} />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        id='recommended'
                                        name='recommended'
                                        inline
                                        label='Recommended?'
                                        checked={userInput.recommended}
                                        onChange={e => setUserInput({ ...userInput, recommended: e.target.checked })} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card> 
                <Card>
                    <Row className='match-height'>
                        <Col sm='4'>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Subscription Plan</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="8" >
                                            <FormGroup>
                                                <Label for="enterprise_api_tps">Select Subscription Plan<span className='text-danger'>*</span></Label>
                                                    <Select
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    ref={subsRef}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    value={{ value: userInput.link_subscription_id, label: subPlanList?.map(item => { return {value: item.id, label: item.PackageName} })?.find(item => item.value === userInput.link_subscription_id?.toString())?.label || 'Select...' }}
                                                    onChange={(selected) => {
                                                        setUserInput({ ...userInput, link_subscription_id: selected.value, link_subscription_name : selected.label})
                                                        setSelectedSubsPlan(subPlanList?.find(item => item.id === selected.value?.toString()))
                                                    }}
                                                    options={subPlanList?.map(item => { return {value: item.id, label: item.PackageName} })}
                                                />
                                                <Input
                                                    required
                                                    style={{
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: 0
                                                        // position: "absolute"
                                                    }}
                                                    onFocus={e => subsRef.current.select.focus()}
                                                    value={userInput.link_subscription_id || ''}
                                                    onChange={e => ''}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card> 
                        </Col>
                        <Col sm='8'>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>Subscription Info</CardTitle>
                                </CardHeader>
                                <CardBody>
                                        <div className='d-flex border-bottom p-1'>
                                            <h6 style={{margin:'0 10px 0 0', width:'250px'}}>Price</h6>
                                            <h6 style={{margin:'0 10px 0 0'}}>:</h6>
                                            <h6 style={{margin:'0', textAlign:'left'}}><b>{selectedSubsPlan?.Price}</b></h6>
                                        </div>
                                        <div className='d-flex border-bottom p-1'>
                                            <h6 style={{margin:'0 10px 0 0', width:'250px'}}>Grace period</h6>
                                            <h6 style={{margin:'0 10px 0 0'}}>:</h6>
                                            <h6 style={{margin:'0'}}><b>{selectedSubsPlan?.Grass} days</b></h6>
                                        </div>
                                        <div className='d-flex border-bottom p-1'>
                                            <h6 style={{margin:'0 10px 0 0', width:'250px'}}>Charge Description</h6>
                                            <h6 style={{margin:'0 10px 0 0'}}>:</h6>
                                            <h6 style={{margin:'0'}}><b>{selectedSubsPlan?.ChargeDescription}</b></h6>
                                        </div>
                                        <div className='d-flex border-bottom p-1'>
                                            <h6 style={{margin:'0 10px 0 0', width:'250px'}}>Commission Description</h6>
                                            <h6 style={{margin:'0 10px 0 0'}}>:</h6>
                                            <h6 style={{margin:'0'}}><b>{selectedSubsPlan?.CommissionDescription}</b></h6>
                                        </div>
                                        <div className='d-flex border-bottom p-1'>
                                            <h6 style={{margin:'0 10px 0 0', width:'250px'}}>Wallet Migration Status</h6>
                                            <h6 style={{margin:'0 10px 0 0'}}>:</h6>
                                            <h6 style={{margin:'0'}}><b>{selectedSubsPlan?.is_wallet_migrate ? 'True' : "False"}</b></h6>
                                        </div>
                                        {selectedSubsPlan?.is_wallet_migrate && 
                                            <div className='d-flex p-1'>
                                                <h6 style={{margin:'0 10px 0 0', width:'250px'}}>Wallet Type</h6>
                                                <h6 style={{margin:'0 10px 0 0'}}>:</h6>
                                                <h6 style={{margin:'0'}}><b>{selectedSubsPlan?.Wallet_Name}</b></h6>
                                            </div>}
                                </CardBody>
                            </Card> 
                        </Col>
                    </Row>
                </Card>
              
                
                <Row className='match-height'>
                    <h4 className='mx-1'>Plan Info</h4>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="title">Title<span className='text-danger'>*</span></Label>
                                            <Input type="text"
                                                name="title"
                                                id='title'
                                                value={userInput.title}
                                                onChange={handleChange}
                                                required
                                                placeholder="title here..."
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='3' >
                                        <FormGroup>
                                            <Label for="valid_til">Valid Till<span className='text-danger'>*</span></Label>
                                            <Input type="date"
                                                name="valid_til"
                                                id='valid_til'
                                                value={userInput.valid_til.split('T')[0]}
                                                onChange={handleChange}
                                                required
                                                placeholder='0'
                                            />
                                        </FormGroup>
                                    </Col>
                                    {/* <Col sm="4" >
                                        <FormGroup>
                                            <Label for="other_msg">other message<span className='text-danger'>*</span></Label>
                                            <Input type="textarea"
                                                name="other_msg"
                                                rows="3"
                                                id='other_msg'
                                                value={userInput.other_msg}
                                                onChange={handleChange}
                                                required
                                                placeholder="other message here..."
                                            />
                                        </FormGroup>
                                    </Col> */}
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="enterprise_api_tps">Enterprise API TPS<span className='text-danger'>*</span></Label>
                                             <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                ref={tpsRef}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.enterprise_api_tps, label: [{ value: 5, label: '5' }, { value: 10, label: '10' }, { value: 15, label: '15' }, { value: 20, label: '20' }, { value: 25, label: '25' }, { value: 30, label: '30' }]?.find(item => item.value === userInput.enterprise_api_tps)?.label || 'Select...' }}
                                                onChange={(selected) => {
                                                    if (selected) {
                                                        setUserInput({ ...userInput, enterprise_api_tps: selected.value})
                                                    } else {
                                                        setUserInput({ ...userInput, enterprise_api_tps: 0})
                                                    }
                                                }}
                                                options={[{ value: 5, label: '5' }, { value: 10, label: '10' }, { value: 15, label: '15' }, { value: 20, label: '20' }, { value: 25, label: '25' }, { value: 30, label: '30' }]}
                                                isClearable
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                    // position: "absolute"
                                                }}
                                                onFocus={e => tpsRef.current.select.focus()}
                                                value={userInput.enterprise_api_tps || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="tax_id">Tax ID<span className='text-danger'>*</span></Label>
                                              <Select
                                                theme={selectThemeColors}
                                                ref={taxRef}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.tax_id, label: planTaxList?.find(item => item.id === userInput?.tax_id?.toString())?.tax_name || 'Select...' }}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, tax_id: selected.value})
                                                }}
                                                options={planTaxList?.map(b => { return { value: b.id, label: b.tax_name } })}
                                            />
                                              <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                    // position: "absolute"
                                                }}
                                                onFocus={e => taxRef.current.select.focus()}
                                                value={userInput.tax_id || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" >
                                        <Row>
                                            <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="details">Details<span className='text-danger'>*</span></Label>
                                                    <Input type="textarea"
                                                        rows="5"
                                                        name="details"
                                                        id='details'
                                                        value={userInput.details}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="details here..."
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="6">
                                                <FormGroup>
                                                    <Label for="details">Upload Plan Images<span className='text-danger'>*</span></Label>
                                                    <MultipleFileUploader Image_Urls={image_urls} setImage_Urls={setImage_Urls}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col> 
                </Row>
                <Row>
                     {/* <Col sm='12'>
                        <h4 className='m-1'>Pricing</h4>
                        <Card>
                            <CardBody>
                                <Row>
                                <Col sm="4" >
                                        <FormGroup>
                                            <Label for="price_monthly">Monthly Price<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="price_monthly"
                                                id='price_monthly'
                                                value={userInput.price_monthly}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="monthly price here..."
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="price_quarterly">Quarterly Price<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="price_quarterly"
                                                id='price_quarterly'
                                                value={userInput.price_quarterly}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="quarterly price here..."
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="price_annually">Annualy Price<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="price_annually"
                                                id='price_annually'
                                                value={userInput.price_annually}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="annualy price here..."
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="plan_grace_period">Plan Grace Period<span className='text-danger'>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                ref={graceRef}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.plan_grace_period, label: [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' }, { value: 8, label: '8' }, { value: 9, label: '9' }, { value: 10, label: '10' }, { value: 11, label: '11' }, { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' }, { value: 15, label: '15' }, { value: 16, label: '16' }]?.find(item => item.value === userInput.plan_grace_period)?.label || 'Select...' }}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, plan_grace_period: selected.value})
                                                }}
                                                options={[{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' }, { value: 8, label: '8' }, { value: 9, label: '9' }, { value: 10, label: '10' }, { value: 11, label: '11' }, { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' }, { value: 15, label: '15' }, { value: 16, label: '16' }]}
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                    // position: "absolute"
                                                }}
                                                onFocus={e => graceRef.current.select.focus()}
                                                value={userInput.plan_grace_period || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>`
                    </Col> */}
                    <Col sm='12'>
                        <div className='d-flex'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    id='has_notification'
                                    name='has_notification'
                                    inline
                                    label=''
                                    checked={userInput.has_notification}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, has_notification: e.target.checked })
                                            setFeatureIDs([...featureIDs, 6, 7, 10])
                                        } else {
                                            setUserInput({ ...userInput, has_notification: e.target.checked, facebook_post_show: 0, instagram_post_show: 0, push_notification_show: 0, email_show: 0, sms_show: 0 })
                                            setFeatureIDs([...featureIDs.filter(i => i !== 6 && i !== 7 && i !== 10)])
                                        }
                                    }} />
                            </FormGroup>
                            <h4>Social Media and Communication</h4>
                        </div>
                        {
                            userInput.has_notification && <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebook_post_show">Facebook Post Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="facebook_post_show"
                                                id='facebook_post_show'
                                                value={userInput.facebook_post_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="instagram_post_show">Instagram Post Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="instagram_post_show"
                                                id='instagram_post_show'
                                                value={userInput.instagram_post_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="push_notification_show">Push Notification Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="push_notification_show"
                                                id='push_notification_show'
                                                value={userInput.push_notification_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="email_show">Email Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="email_show"
                                                id='email_show'
                                                value={userInput.email_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="sms_show">SMS Show<span className='text-danger'>*</span></Label>
                                            <Input type="number"
                                                name="sms_show"
                                                id='sms_show'
                                                value={userInput.sms_show}
                                                onChange={handleChangeInt}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                            </Card>
                        }
                    </Col>
                    <Col sm='12'>
                        <div className='d-flex'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    id='has_ads'
                                    name='has_ads'
                                    inline
                                    label=''
                                    checked={userInput.has_ads}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, has_ads: e.target.checked })
                                            setFeatureIDs([...featureIDs, 6, 7, 10])
                                        } else {
                                            setUserInput({ ...userInput, has_ads: e.target.checked, facebook_ads_budget: 0, facebook_ads_budget_show: 0, google_ads_budget: 0, google_ads_budget_show: 0 })
                                            setFeatureIDs([...featureIDs.filter(i => i !== 6 && i !== 7 && i !== 10)])
                                        }
                                     }
                                    } />
                            </FormGroup>
                            <h4>Digital Advertising</h4>
                        </div>
                        {
                            userInput.has_ads && <Card>
                            <CardBody>
                                <Row>
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
                                    <Col sm="4"></Col>
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
                        </Card>
                        }
                    </Col>
                </Row>
                <Card >
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Available Features</CardTitle>
                        <CardTitle tag='h4'><CustomInput
                            type='checkbox'
                            id={'All'}
                            label={'Select All'}
                            inline
                            // checked={featureIDs.includes(feature.id)}
                            checked={featureIDs.length === allMenuList.length}
                            onChange={e => {
                                const tempArray2D = allMenuList?.slice(5)
                                const Array2D = tempArray2D.map(x => x.id)
                                if (e.target.checked) {
                                    // setFeatureIDs([...featureIDs, ...Array2D.map(item => Array2D.indexOf(item) + 1)])
                                    setFeatureIDs([...featureIDs?.slice(0, 5), ...Array2D])
                                    setSubmenuIDs([].concat(...Array2D))
                                } else {
                                    setFeatureIDs([...featureIDs?.slice(0, 5)])
                                    setSubmenuIDs([])
                                }
                            }}
                        /></CardTitle>
                    </CardHeader>
                    <CardBody className='pt-1 pb-0'>
                    <Row className='match-height'>
                            {
                                allMenuList.map((menuItem, index) => <Col md='3' key={index}>
                                    <Card className="border p-1">
                                        <CustomInput
                                            type='checkbox'
                                            id={menuItem.id}
                                            label={menuItem.menu_name}
                                            inline
                                            disabled={index === 0 || index === 1 || index === 2 || index === 3 || index === 4}
                                            onChange={e => {
                                                const removedID = featureIDs.filter(x => x !== menuItem.id)
                                                e.target.checked ? setFeatureIDs([...featureIDs, menuItem.id]) : setFeatureIDs(removedID)
                                            }}
                                            checked={featureIDs.includes(menuItem.id)}
                                        />
                                    </Card>
                                </Col>
                                )
                            }
                        </Row>
                        {/* <Row className='match-height'>
                            {
                                allMenuList.filter(m => m.submenu.length !== 0).map((menuItem, index) => <Col md='3' key={index}>
                                    <Card className="border pb-1">
                                        <b className="border-bottom p-1 mb-1">{menuItem.name}</b>
                                        {
                                            menuItem.submenu.map((subMenuItem, index) => <div className='px-1' key={index}>
                                                <CustomInput
                                                    type='checkbox'
                                                    id={subMenuItem.id + 1000}
                                                    label={subMenuItem.name}
                                                    inline
                                                    checked={selected_sub_menu_ids.includes(subMenuItem.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSubmenuIDs([...selected_sub_menu_ids, subMenuItem.id])
                                                        } else {
                                                            setSubmenuIDs(selected_sub_menu_ids.filter(submenuID => submenuID !== subMenuItem.id))
                                                        }
                                                    }}
                                                />

                                            </div>)
                                        }
                                    </Card>
                                </Col>
                                )
                            }
                        </Row> */}
                    </CardBody>
                </Card>
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

export default CreatePlan