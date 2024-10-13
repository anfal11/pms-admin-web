import useJwt from '@src/auth/jwt/useJwt'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner, Alert } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'
import LongLiveTokenModal from './longLiveTokenModal'
import FacebookCustomLogin from './FacebookLogin'

const Settings = () => {
    const ref1 = useRef()
    const categoryRef = useRef()
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [reset, setReset] = useState()
    const [modal, setModal] = useState(false)
    const toggleModal = () => setModal(!modal)
    const [category, setCategory] = useState([])
    const [haveFacebookResponse, setHaveFacebookResponse] = useState(false)
    const [facebookpageerror, setfacebookpageerror] = useState(null)
    const [subCategory, setSubCategory] = useState([])
    const [userInput, setUserInput] = useState({
            app_id: '',
            app_secret: '',
            user_token: '',
            pageId: "",
            adAccountId: '',
            google_client_secret: '',
            google_client_id: '',
            google_refresh_token: '',
            google_developer_token:'',
            email_address: '',
            email_password: '',
            fcm_server_ring: '',
            email_config_type: null, //1 for servoce, 2 for host
            email_service: '',
            email_host: '',
            email_port: '',
            instagram_actor_id: '',
            allow_admin_facebook_page_post: false,
            allow_other_merchant_facebook_page_post: false,
            facebook_pagepost_page_id: '',
            facebook_user_id: '', 
            user_access_token: '',
            facebook_page_category_localuid: '', 
            facebookpage_subcategory_localuid: '',
            page_name: null,
            page_access_token: null
    })
    const [collaps, setCollaps] = useState({})
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(() => {
       const callApi = async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.getFbpageCategory().then(res => {
            console.log(res)
            setCategory(res.data.payload.map(item => { return { value: {id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })
        await useJwt.getCampaignSettings().then(res => {
            console.log(res)
            if (res.data.payload.facebook_page_category_localuid && res.data.payload.facebookpage_subcategory_localuid) {
                setSubCategory(category.find(i => i.value.id === res.data.payload?.facebook_page_category_localuid)?.value.subcategory)
            }
            setUserInput({
                    app_id: res.data.payload?.app_id,
                    app_secret: res.data.payload?.app_secret,
                    user_token: res.data.payload?.user_token,
                    pageId: res.data.payload?.page_id,
                    adAccountId: res.data.payload?.ad_account_id,
                    google_client_secret: res.data.payload?.google_client_secret,
                    google_client_id: res.data.payload?.google_client_id,
                    google_refresh_token: res.data.payload?.google_refresh_token,
                    google_developer_token: res.data.payload?.google_developer_token,
                    email_address: res.data.payload?.email_address,
                    email_password: res.data.payload?.email_password,
                    fcm_server_ring: res.data.payload?.fcm_server_ring,
                    email_config_type: res.data.payload?.email_config_type,
                    email_service: res.data.payload?.email_service,
                    email_host: res.data.payload?.email_host,
                    email_port: res.data.payload?.email_port,
                    instagram_actor_id: res.data.payload?.instagram_actor_id,
                    allow_admin_facebook_page_post: res.data.payload?.allow_admin_facebook_page_post,
                    allow_other_merchant_facebook_page_post: res.data.payload?.allow_other_merchant_facebook_page_post,
                    facebook_pagepost_page_id: res.data.payload?.facebook_pagepost_page_id,
                    user_access_token: res.data.payload?.user_access_token,
                    facebook_page_category_localuid: res.data.payload?.facebook_page_category_localuid,
                    facebookpage_subcategory_localuid: res.data.payload?.facebookpage_subcategory_localuid,
                    facebook_user_id: res.data.payload?.facebook_user_id,
                    page_name: res.data.payload?.page_name || null,
                    page_access_token: res.data.payload?.page_access_token || null
            })
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })
       }
       callApi()
    }, [reset])
    const onSubmit = (e) => {
        e.preventDefault()
        const {app_id, app_secret, user_token, pageId, adAccountId, instagram_actor_id, allow_admin_facebook_page_post, allow_other_merchant_facebook_page_post} = userInput
        setPointRuleloading(true)
        console.log({ 
            facebook: {app_id, app_secret, user_token, pageId, adAccountId, instagram_actor_id, allow_admin_facebook_page_post, allow_other_merchant_facebook_page_post}
         })
        useJwt.updateCampaignSettings({ 
            facebook: {app_id, app_secret, user_token, pageId, adAccountId, instagram_actor_id, allow_admin_facebook_page_post, allow_other_merchant_facebook_page_post} 
         }).then((response) => {
            console.log(response)
            setPointRuleloading(false)
            Success(response)
          }).catch((error) => {
            console.log(error.response)
            setPointRuleloading(false)
            Error(error)
          })
    }
    const onSubmit2 = (e) => {
        e.preventDefault()
        const {facebook_pagepost_page_id, facebook_user_id, app_secret,  user_access_token, pageId, facebook_page_category_localuid, facebookpage_subcategory_localuid} = userInput
        setPointRuleloading(true)
        console.log({facebook_pagepost_page_id, app_secret, facebook_user_id, user_access_token, pageId, facebook_page_category_localuid, facebookpage_subcategory_localuid})
        useJwt.updateFacebookPageCrd({app_secret, facebook_pagepost_page_id, facebook_user_id, user_access_token, pageId, facebook_page_category_localuid, facebookpage_subcategory_localuid}).then((response) => {
            console.log(response)
            setPointRuleloading(false)
            Success(response)
          }).catch((error) => {
            setfacebookpageerror(error.response?.data?.message || "Error Occurred !")
            console.log(error.response)
            setPointRuleloading(false)
            //Error(error)
          })
    }
    const onSubmit1 = (e) => {
        e.preventDefault()
        const {google_client_secret, google_client_id, google_developer_token, google_refresh_token, email_address, email_password, fcm_server_ring, email_config_type, email_service, email_host, email_port} = userInput
        setPointRuleloading(true)
        console.log({ 
            google: {google_client_secret, google_client_id, google_refresh_token, google_developer_token},
            email: {email_address, email_password, email_config_type, email_service, email_host, email_port},
            push_notification: {fcm_server_ring}
         })
        useJwt.updateCampaignSettingsNotFb({ 
            google: {google_client_secret, google_client_id, google_refresh_token, google_developer_token},
            email: {email_address, email_password, email_config_type, email_service, email_host, email_port},
            push_notification: {fcm_server_ring}
         }).then((response) => {
            console.log(response)
            setPointRuleloading(false)
            Success(response)
          }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error.response)
          })
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Facebook Page</CardTitle>
                    <CustomInput onChange={(e) => {
                        if (e.target.checked) {
                            setCollaps({...collaps, fb_page: true})
                            setfacebookpageerror(null)
                            setHaveFacebookResponse(false)
                        } else {
                            setCollaps({...collaps, fb_page: false})
                        }
                    }} type='switch' id='fb_page' inline label='' />
                </CardHeader>
                <Form style={{ width: '100%' }} onSubmit={onSubmit2} autoComplete="off">
                    {
                        collaps.fb_page && <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            {
                                facebookpageerror ? <Col md="12" sm="12" >
                                    <Alert color='danger'>
                                        <div className='alert-body'> {facebookpageerror} </div>
                                    </Alert>
                                </Col> : null
                            }

                            {
                                !haveFacebookResponse ? <Fragment>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebook_pagepost_page_id">App ID<span style={{color:'red'}}>*</span></Label>
                                            <Input type="number"
                                                name="facebook_pagepost_page_id"
                                                id='facebook_pagepost_page_id'
                                                value={userInput?.facebook_pagepost_page_id || ""}
                                                onChange={(e) => setUserInput({ ...userInput, app_id: e.target.value, facebook_pagepost_page_id: e.target.value})}
                                                required
                                                placeholder="app id"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                    <FormGroup>
                                        <Label for="app_secret">App Secret<span style={{color:'red'}}>*</span></Label>
                                        <Input type="text"
                                            name="app_secret"
                                            id='app_secret'
                                            value={userInput?.app_secret || ""}
                                            onChange={handleChange}
                                            required
                                            placeholder="app secret"
                                        />
                                    </FormGroup>
                                </Col>
                                    <Col sm="3" className='d-flex justify-content-right' >
                                        
                                        <FacebookCustomLogin 
                                            appId={userInput.facebook_pagepost_page_id} 
                                            userInput={userInput}
                                            setUserInput={setUserInput}
                                            setHaveFacebookResponse={setHaveFacebookResponse}
                                            /> 
                                     
                                    </Col>
                                </Fragment> : <Fragment>
                                        <Col sm="4">
                                        <FormGroup>
                                            <Label for="pageId">Page Id<span style={{color:'red'}}>*</span></Label>
                                            <Input type="text"
                                                name="pageId"
                                                id='pageId'
                                                value={userInput?.pageId || ""}
                                                onChange={handleChange}
                                                required
                                                placeholder="page id"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebook_page_category_localuid">Facebook Page Category<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                ref={categoryRef}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.facebook_page_category_localuid, label: category.find(i => i.value.id === userInput.facebook_page_category_localuid)?.label || 'select a category'}}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, facebook_page_category_localuid: selected.value.id})
                                                    setSubCategory(selected?.value.subcategory)
                                                }}
                                                options={category}
                                                isLoading={category.length === 0}
                                            />
                                            <Input
                                                required
                                                style={{
                                                    opacity: 0,
                                                    width: "100%",
                                                    height: 0
                                                    // position: "absolute"
                                                }}
                                                onFocus={e => categoryRef.current.select.focus()}
                                                value={userInput.facebook_page_category_localuid || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {
                                        (subCategory?.length !== 0) && <Col sm="4" >
                                        <FormGroup>
                                            <Label for="facebookpage_subcategory_localuid">Facebook page Sub Category</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={{ value: userInput.facebookpage_subcategory_localuid, label: subCategory?.find(i => i.uid === userInput.facebookpage_subcategory_localuid)?.name || 'select a subcategory'}}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, facebookpage_subcategory_localuid: selected.value})
                                                }}
                                                isClearable
                                                options={subCategory?.map(item => { return { value: item.uid, label: item.name } })}
                                                isLoading={subCategory?.length === 0}
                                            />
                                        </FormGroup>
                                    </Col>
                                    }
                                    <Col sm="12" className='text-center mt-2'>
                                        {
                                            pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                                <Spinner color='white' size='sm' />
                                                <span className='ml-50'>Loading...</span>
                                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                                <span >Update</span>
                                            </Button.Ripple>
                                        }
                                    </Col>
                                </Fragment>
                            }

                            </Row>
                        </CardBody>
                    }
                </Form>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Facebook Ad</CardTitle>
                    <CustomInput onChange={(e) => {
                        if (e.target.checked) {
                            setCollaps({...collaps, fb_ad: true})
                        } else {
                            setCollaps({...collaps, fb_ad: false})
                        }
                    }} type='switch' id='fb_ad' inline label='' />
                </CardHeader>
                <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    {
                        collaps.fb_ad && <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col sm='12' className='text-right'>
                                <Button.Ripple className='ml-1 text-dark' color='light' onClick={e => { setModal(true) } }>
                                    Update User Token
                                </Button.Ripple>
                            </Col>
                            
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="app_id">App ID<span style={{color:'red'}}>*</span></Label>
                                    <Input type="number"
                                        name="app_id"
                                        id='app_id'
                                        value={userInput?.app_id}
                                        onChange={(e) => setUserInput({ ...userInput, app_id: e.target.value, facebook_pagepost_page_id: e.target.value})}
                                        required
                                        placeholder="app id"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="app_secret">App Secret<span style={{color:'red'}}>*</span></Label>
                                    <Input type="text"
                                        name="app_secret"
                                        id='app_secret'
                                        value={userInput?.app_secret}
                                        onChange={handleChange}
                                        required
                                        placeholder="app secret"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="adAccountId">Ad Account ID (required for facebook advertisement.)<span style={{color:'red'}}>*</span></Label>
                                    <Input type="text"
                                        name="adAccountId"
                                        id='adAccountId'
                                        value={userInput?.adAccountId}
                                        onChange={handleChange}
                                        required
                                        placeholder="ad account id"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="instagram_actor_id">Instagram Actor ID<span className='text-danger'>*</span></Label>
                                    <Input type="text"
                                        name="instagram_actor_id"
                                        id='instagram_actor_id'
                                        value={userInput.instagram_actor_id}
                                        onChange={handleChange}
                                        placeholder="instagram actor id"
                                    />
                                </FormGroup>
                            </Col>
                            {/* <Col sm="4" className='mb-2 mt-1'>
                                <FormGroup>
                                    <CustomInput type='switch' onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, allow_admin_facebook_page_post: true })
                                        } else {
                                            setUserInput({ ...userInput, allow_admin_facebook_page_post: false })
                                        }
                                    }
                                    } id='allow_admin_facebook_page_post' label='Allow admin facebook page post?' checked={userInput?.allow_admin_facebook_page_post} />
                                </FormGroup>
                            </Col>
                            <Col sm="4" className='mb-2 mt-1'>
                                <FormGroup>
                                    <CustomInput type='switch' onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, allow_other_merchant_facebook_page_post: true })
                                        } else {
                                            setUserInput({ ...userInput, allow_other_merchant_facebook_page_post: false })
                                        }
                                    }
                                    } id='allow_other_merchant_facebook_page_post' label='Allow other merchant facebook page post?' checked={userInput?.allow_other_merchant_facebook_page_post}  />
                                </FormGroup>
                            </Col> */}
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="user_token">User Token<span style={{color:'red'}}>*</span></Label>
                                    <Input type="textarea"
                                        rows = "6"
                                        name="user_token"
                                        id='user_token'
                                        value={userInput?.user_token}
                                        onChange={handleChange}
                                        required
                                        placeholder="user token"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="12" className='text-center mt-2'>
                                {
                                    pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Update</span>
                                    </Button.Ripple>
                                }
                            </Col>
                            </Row>
                        </CardBody>
                    }
                </Form>
            </Card>
            <Card>
                <CardBody>
                  <Form style={{ width: '100%' }} onSubmit={onSubmit1} autoComplete="off">
                    {
                        userData.role !== 'vendor' && <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Google</CardTitle>
                            <CustomInput onChange={(e) => {
                                if (e.target.checked) {
                                    setCollaps({...collaps, google: true})
                                } else {
                                    setCollaps({...collaps, google: false})
                                }
                            }} type='switch' id='google' inline label='' />
                        </CardHeader>
                        {
                            collaps.google && <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="google_client_secret">Client Secret<span style={{color:'red'}}>*</span></Label>
                                        <Input type="text"
                                            name="google_client_secret"
                                            id='google_client_secret'
                                            value={userInput?.google_client_secret}
                                            onChange={handleChange}
                                            required
                                            placeholder="client secret"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm='12'>
                                    <Row>
                                        <Col sm="6">
                                            <FormGroup>
                                                <Label for="google_client_id">Client ID<span style={{color:'red'}}>*</span></Label>
                                                <Input type="text"
                                                    name="google_client_id"
                                                    id='google_client_id'
                                                    value={userInput?.google_client_id}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="client id"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="google_refresh_token">Refresh Token<span style={{color:'red'}}>*</span></Label>
                                        <Input type="textarea"
                                            rows = "6"
                                            name="google_refresh_token"
                                            id='google_refresh_token'
                                            value={userInput?.google_refresh_token}
                                            onChange={handleChange}
                                            required
                                            placeholder="refresh token"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="google_developer_token">Developper Token<span style={{color:'red'}}>*</span></Label>
                                        <Input type="textarea"
                                            rows = "6"
                                            name="google_developer_token"
                                            id='google_developer_token'
                                            value={userInput?.google_developer_token}
                                            onChange={handleChange}
                                            required
                                            placeholder="developper token"
                                        />
                                    </FormGroup>
                                </Col>
                                </Row>
                            </CardBody>
                        }
                    </Card>
                    }
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Email</CardTitle>
                            <CustomInput onChange={(e) => {
                                if (e.target.checked) {
                                    setCollaps({...collaps, email: true})
                                } else {
                                    setCollaps({...collaps, email: false})
                                }
                            }} type='switch' id='email' inline label='' />
                        </CardHeader>
                        {
                            collaps.email && <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="email_address">Email Address<span style={{color:'red'}}>*</span></Label>
                                        <Input type="text"
                                            name="email_address"
                                            id='email_address'
                                            value={userInput?.email_address}
                                            onChange={handleChange}
                                            required
                                            placeholder="email_address"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="email_password">Email Password<span style={{color:'red'}}>*</span></Label>
                                        <Input type="text"
                                            name="email_password"
                                            id='email_password'
                                            value={userInput?.email_password}
                                            onChange={handleChange}
                                            required
                                            placeholder="email_password"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="4" >
                                    <FormGroup>
                                        <Label for="email_port">Email Port<span style={{color:'red'}}>*</span></Label>
                                        <Input type="text"
                                            name="email_port"
                                            id='email_port'
                                            value={userInput?.email_port}
                                            onChange={handleChange}
                                            required
                                            placeholder="email_port"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm="4" >
                                    <FormGroup>
                                        <Label for="email_config_type">Email Configure Type<span style={{ color: 'red' }}>*</span></Label>
                                        <Select
                                            ref={ref1}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={{ value: userInput?.email_config_type, label: userInput.email_config_type === 1 ? 'Service' : userInput.email_config_type === 2 ? 'Host' : 'Select' }}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, email_config_type: selected.value })
                                            }}
                                            options={[{ value: 1, label: 'Service' }, { value: 2, label: 'Host'}]}
                                        />
                                    </FormGroup>
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                        }}
                                        onFocus={e => ref1.current.select.focus()}
                                        value={userInput.email_config_type || ''}
                                        onChange={e => ''}
                                    />
                                </Col>
                                { userInput.email_config_type === 1 && <Col sm="4" >
                                    <FormGroup>
                                        <Label for="email_service">Email Service<span style={{color:'red'}}>*</span></Label>
                                        <Input type="text"
                                            name="email_service"
                                            id='email_service'
                                            value={userInput?.email_service}
                                            onChange={handleChange}
                                            required
                                            placeholder="email_service"
                                        />
                                    </FormGroup>
                                </Col> }
                                { userInput.email_config_type === 2 && <Col sm="4" >
                                    <FormGroup>
                                        <Label for="email_host">Email Host<span style={{color:'red'}}>*</span></Label>
                                        <Input type="text"
                                            name="email_host"
                                            id='email_host'
                                            value={userInput?.email_host}
                                            onChange={handleChange}
                                            required
                                            placeholder="email_host"
                                        />
                                    </FormGroup>
                                </Col> }
                            </Row>
                        </CardBody>
                        }
                    </Card>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Push Notification</CardTitle>
                            <CustomInput onChange={(e) => { 
                                    if (e.target.checked) {
                                        setCollaps({...collaps, fcm: true})
                                    } else {
                                        setCollaps({...collaps, fcm: false})
                                    }
                                }} type='switch' id='fcm' inline label='' />
                        </CardHeader>
                        {
                            collaps.fcm && <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm="6" >
                                        <FormGroup>
                                            <Label for="fcm_server_ring">FCM Server Key<span style={{color:'red'}}>*</span></Label>
                                            <Input type="text"
                                                name="fcm_server_ring"
                                                id='fcm_server_ring'
                                                value={userInput?.fcm_server_ring}
                                                onChange={handleChange}
                                                required
                                                placeholder="fcm server key"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        }
                    </Card>
                    {
                        (collaps.email || collaps.google || collaps.fcm) && <Row>
                        <Col sm="12" className='text-center mt-2'>
                            {
                                pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                    <span >Update</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Row>
                    }
                  </Form>
                </CardBody>
            </Card>
            <LongLiveTokenModal
                toggleModal={toggleModal}
                modal={modal}
                resetData={reset}
                setReset={setReset}
            />
        </Fragment>
    )
}

export default Settings