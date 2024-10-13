import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import { selectThemeColors } from '@utils'
import { JsonWebTokenError } from 'jsonwebtoken'
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { ChevronLeft, Plus } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { Error, Success } from '../../../../../viewhelper'

const BulkNotificationDetails = () => {
    const history = useHistory()
    const GrpRef = useRef()
    const RuleRef = useRef()
    const BudgetRef = useRef()
    const AdRef = useRef()
    const DayRef = useRef()
    const MonthRef = useRef()
    const RptRef = useRef()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [channelList, setChannelList] = useState([])
    const [resetData, setReset] = useState(false)
    const [emailfilePrevw, setEmailFilePrevw] = useState(null)
    const [pushfilePrevw, setPushFilePrevw] = useState(null)
    const [fbfilePrevw, setFbFilePrevw] = useState(null)
    const [instafilePrevw, setInstaFilePrevw] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState({})
    const [selectedQuota, setSelectedQuota] = useState({})
    const [selectedAdRule, setSelectedAdRule] = useState({})
    const [selectedCampaignRule, setSelectedCampaignRule] = useState({})
    const user = JSON.parse(localStorage.getItem('userData'))
    const [quotaList, setQuotaList] = useState([])
    const [adRuleList, setAdRuleList] = useState([])
    const [campaignList, setCampaignList] = useState([])
    const [userInput, setUserInput] = useState(JSON.parse(localStorage.getItem('NotificationInfo')))
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])

    const [BlackList, setBlackList] = useState([])

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(async () => {
        //  setUserInput(JSON.parse(localStorage.getItem('NotificationInfo')))
        // localStorage.setItem('usePMStoken', false) //for token management
        // localStorage.setItem('useBMStoken', true)
        // await useJwt.campaignList().then(res => {
        //     console.log(res)
        //     setCampaignList(res.data)
        //     localStorage.setItem('useBMStoken', false)
        // }).catch(err => {
        //     if (err.response.status === 401) {
        //         localStorage.setItem("BMSCall", true)
        //         useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
        //             localStorage.setItem('BMStoken', res.data.jwtToken)
        //             localStorage.setItem("BMSCall", false)
        //             setReset(!resetData)
        //         }).catch(err => {
        //             localStorage.setItem("BMSCall", false)
        //             console.log(err)
        //         })
        //     } else {
        //         Error(err)
        //     }
        //     console.log(err)
        //     localStorage.setItem('useBMStoken', false)
        // })
        useJwt2.runningcampaignList().then(res => {
            setCampaignList(res.data.payload.map(item => { return { value: item.id, label: item.campaign_name } }))
         }).catch(err => {
            Error(err)
        })
        useJwt.getCampaignChannelList().then(res => {
            console.log(res)
            setChannelList(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.getCentralGroup().then(res => {
            console.log(res)
            const allGroup = []
            for (const q of res.data.payload) {
                if (q.is_approved === true) {
                    allGroup.push(q)
                }
            }
            setGroupList(allGroup)
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })
        // useJwt.getQuotaList().then(res => {
        //     console.log(res)
        //     const allQuotas = []
        //     for (const q of res.data.payload) {
        //         if (q.is_approved === true) {
        //             allQuotas.push(q)
        //         }
        //     }
        //     setQuotaList(allQuotas)
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        // })
        useJwt.adRuleList().then(res => {
            console.log(res)
            const allAdRule = []
            for (const q of res.data.payload) {
                if (q.is_approved === true) {
                    allAdRule.push(q)
                }
            }
            setAdRuleList(allAdRule)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
        useJwt.getFbpageCategory().then(res => {
            setbusinesscategorylist(res.data.payload.map(item => { return { value: {id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
        useJwt2.allBlackList().then(res => {
            // console.log(res)
            const blacklistItems = []
            res.data.payload.map(item => {
                console.log(`userInput['black_list_group_id']==> `, userInput['black_list_group_id'])
              if (userInput['black_list_group_id'].includes(item['id'])) {
                blacklistItems.push({value: item['id'], label: item['group_name']})
              }
            })
            setBlackList(blacklistItems)
            // setBlackList(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [resetData])
    const uploadImg = async (file, fieldName, setFunc) => {
        const formData1 = new FormData()
        formData1.append('image', file)
        await useJwt.singleFileupload(formData1).then(async res => {
            console.log(res)
            userInput[fieldName] = await res.data.payload
            setUserInput({ ...userInput })
            if (file) {
                setFunc(URL.createObjectURL(file))
            }
        }).catch(e => {
            console.log(e.response)
        })
    }
    const onSubmit = (e) => {
        e.preventDefault()
        let { group_id, qouta_id, adRule_id, rule_id } = userInput
        group_id = parseInt(selectedGroup.value)
        qouta_id = parseInt(selectedQuota.value)
        adRule_id = parseInt(selectedAdRule.value)
        rule_id = parseInt(selectedCampaignRule.value)
        console.log({ ...userInput, group_id, qouta_id, adRule_id, rule_id })
        // setPointRuleloading(true)
        // useJwt.createBulkNotification({ ...userInput, group_id, qouta_id, adRule_id, rule_id }).then((response) => {
        //     setPointRuleloading(false)
        //     Success(response)
        //     history.push('/allBulkNotifications')
        // }).catch((error) => {
        //     setPointRuleloading(false)
        //     Error(error)
        //     console.log(error.response)
        // })
    }
    return (
        <Fragment>
            {
                user.role === 'vendor' ? <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allBulkNotificationsVendor' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple> : <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allBulkNotifications' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple>
            }

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Bulk Notification Details</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col sm='10'>
                          <FormGroup>
                          <Label for="title">Notification-Title<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="text"
                                name="title"
                                id='title'
                                value={userInput['title'] || ""}
                                // onChange={handleChange}
                                disabled
                                placeholder="Notification Title"
                            />
                            </FormGroup>
                        </Col>
                        {
                            channelList.length !== 0 ? channelList.map(c => c.bulk_notification && <Col key={c.id} sm="12" className='mb-1'>
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h6'>{c.key_name.replace(/_/g, ' ').toUpperCase()}</CardTitle>
                                        <CustomInput type='switch' onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, [c.key_name]: true })
                                            } else {
                                                setUserInput({ ...userInput, [c.key_name]: false })
                                            }
                                        }
                                        } id={c.channel_name} disabled checked={userInput.channel_info[c.key_name]}/>
                                    </CardHeader>
                                    {
                                        (userInput.channel_info[c.key_name] && c.key_name === 'sms') && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="sms_from">From<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="text"
                                                            name="sms_from"
                                                            id='sms_from'
                                                            value={userInput['sms_from'] || ""}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body</Label>
                                                        <Input type="textarea"
                                                            name="sms_body"
                                                            id='sms_body'
                                                            value={userInput.channel_info.sms_body}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                        {/* <p className='text-right' style={userInput.sms_body.length === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - userInput.sms_body.length} characters remaining</p> */}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    }
                                    {
                                        (userInput.channel_info[c.key_name] && c.key_name === 'email') && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="title">Subject</Label>
                                                        <Input type="text"
                                                            name="email_title"
                                                            id='email_title'
                                                            value={userInput.channel_info.email_title}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body</Label>
                                                        <div style={{padding:'10px 10px', border:'1px solid #D4D4CD', borderRadius:'5px'}} dangerouslySetInnerHTML={{__html: userInput?.channel_info?.email_body}} />
                                                    </FormGroup>
                                                </Col>
                                                {/* <Col md='12' className='mb-2'>
                                                    <Label for="voucherImage">Attachment</Label>
                                                    <div className='d-flex'>
                                                        <img src={userInput.channel_info.email_attachment} alt='img' height='100px'></img>
                                                    </div>
                                                </Col> */}
                                            </Row>
                                        </CardBody>
                                    }
                                    {
                                        (userInput.channel_info[c.key_name] && c.key_name === 'push_notification') && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="push_from">From<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="text"
                                                            name="push_from"
                                                            id='push_from'
                                                            value={userInput.channel_info.push_from}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="title">Title</Label>
                                                        <Input type="text"
                                                            name="push_notification_title"
                                                            id='push_notification_title'
                                                            value={userInput.channel_info.push_notification_title}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body</Label>
                                                        <Input type="textarea"
                                                            name="push_notification_body"
                                                            id='push_notification_body'
                                                            value={userInput.channel_info.push_notification_body}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                        {/* <p className='text-right' style={userInput.push_notification_body.length === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - userInput.push_notification_body.length} characters remaining</p> */}
                                                    </FormGroup>
                                                </Col>
                                                <Col md='12' className='mb-1'>
                                                    <Label for="voucherImage">Image</Label>
                                                    <div className='d-flex'>
                                                        <img src={userInput.channel_info.push_notification_image} alt='img' height='100px'></img>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    }
                                    {
                                        (userInput.channel_info[c.key_name] && (c.key_name === 'fb_page_post' || c.key_name === 'instagram')) && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body</Label>
                                                        <Input type="textarea"
                                                            name={c.key_name === 'fb_page_post' ? "fb_page_post_body" : "instagram_body"}
                                                            id='fb_page_post_body'
                                                            value={c.key_name === 'fb_page_post' ? userInput.channel_info.fb_page_post_body : userInput.channel_info.instagram_body}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="fb_page_post_category_ids">Business Category</Label>
                                                        <Input type="text"
                                                            name={"fb_page_post_category_ids"}
                                                            id='fb_page_post_category_ids'
                                                            value={businesscategorylist?.filter(item => {
                                                                if (userInput?.fb_page_post_category_ids?.includes(item.value.id)) {
                                                                    return item.label
                                                                }
                                                            })?.map(item => item.label)}
                                                            onChange={handleChange}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md='12' className='mb-1'>
                                                    <Label for="voucherImage">Image</Label>
                                                    <div className='d-flex'>
                                                        {c.key_name === 'fb_page_post' ? <img src={userInput.channel_info.fb_page_post_image} alt='img' height='100px'></img> : c.key_name === 'instagram' ? <img src={userInput.channel_info.instagram_image} alt='img' height='100px'></img> : null}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    }
                                </Card>
                            </Col>
                            ) : <Col sm='12' className='text-center'><Spinner color='blue' size='md' className='m-3' /></Col>}
                        <Col sm="4" className='mb-2 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' onChange={(e) => {
                                    if (e.target.checked) {
                                        setUserInput({ ...userInput, is_rule_base_notification: true })
                                        setSelectedGroup({})
                                    } else {
                                        setUserInput({ ...userInput, is_rule_base_notification: false })
                                        setSelectedCampaignRule({})
                                    }
                                }
                                } id='is_rule_base_notification' checked={userInput?.is_rule_base_notification} label='Is Campaign Base Notification?' disabled/>
                            </FormGroup>
                        </Col>
                        {
                            userInput.is_rule_base_notification && <Col sm="4" >
                                <FormGroup>
                                    <Label for="groups">Selected Campaign</Label>
                                    <Input
                                        disabled
                                        onFocus={e => RuleRef.current.select.focus()}
                                        value={campaignList.find(r => (+r.value) === (+userInput.rule_id))?.label}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            !userInput.is_rule_base_notification && <Col sm="4" >
                                <FormGroup>
                                    <Label for="groups">Group</Label>
                                    <Input
                                        disabled
                                        onFocus={e => GrpRef.current.select.focus()}
                                        value={groupList.find(g => g.id === userInput.group_id)?.group_name}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }

             <Col sm="4" >
                   <FormGroup>
                        <Label for="blacklist">Black List</Label>
                        <Select
                        disabled
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        id='black_list_group_id'
                        classNamePrefix='select'
                        value={BlackList}
                        options={BlackList}
                        // ref={blackListRef}
                        isMulti
                        isDisabled={true}

                    />
                    </FormGroup>
            </Col>

                        {/* <Col sm="4" >
                            <FormGroup>
                                <Label for="quota">Budget</Label>
                                <Input
                                    disabled
                                    onFocus={e => BudgetRef.current.select.focus()}
                                    value={quotaList.find(q => q.id === userInput.qouta_id)?.title}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col> */}
                        <Col sm='12' />
                        <Col sm="3" className='mb-1 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' onChange={(e) => {
                                    if (e.target.checked) {
                                        setUserInput({ ...userInput, is_Ad: true, isScheduled: false, isRepeat: false })
                                    } else {
                                        setUserInput({ ...userInput, is_Ad: false, isAdScheduled: false })
                                        setSelectedAdRule({})
                                    }
                                }
                                } id='is_Ad' label='Is AD?' disabled checked={userInput.is_Ad} />
                            </FormGroup>
                        </Col>
                        {userInput.is_Ad && <Col sm="4">
                            <FormGroup>
                                <Label for="ad_rule">Select Ad Rule</Label>
                                <Input
                                    disabled
                                    onFocus={e => AdRef.current.select.focus()}
                                    value={adRuleList.find(al => al.id === userInput.adRule_id)?.rule_name}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col>}
                        <Col sm='12' />
                        {userInput.is_Ad && <Col sm="3" className='mb-1 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' onChange={(e) => {
                                    if (e.target.checked) {
                                        setUserInput({ ...userInput, isAdScheduled: true })
                                    } else {
                                        setUserInput({ ...userInput, isAdScheduled: false, startDate: null, endDate: null })
                                    }
                                }
                                } id='isAdScheduled' label='Is Ad Scheduled?' disabled checked={userInput.isAdScheduled} />
                            </FormGroup>
                        </Col>}
                        {
                            userInput.isAdScheduled && <Col md='4' >
                                <FormGroup>
                                    <Label for="startDate">Start Date</Label>
                                    <Input type="datetime-local"
                                        name="startDate"
                                        id='startDate'
                                        value={new Date(userInput?.startDate).toISOString().slice(0, 16)}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isAdScheduled && <Col md='4' >
                                <FormGroup>
                                    <Label for="endDate">End Date</Label>
                                    <Input type="datetime-local"
                                        name="endDate"
                                        id='endDate'
                                        value={new Date(userInput?.endDate).toISOString().slice(0, 16)}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        <Col sm="3" className='mb-1 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' onChange={(e) => {
                                    if (e.target.checked) {
                                        setUserInput({ ...userInput, isScheduled: true, isRepeat: false })
                                    } else {
                                        setUserInput({ ...userInput, isScheduled: false, effective_date: null })
                                    }
                                }
                                } id='isScheduled' checked={userInput.isScheduled} label='Is Scheduled?' disabled />
                            </FormGroup>
                        </Col>
                        {
                            userInput.isScheduled && <Col md='4' >
                                <FormGroup>
                                    <Label for="effective_date">Scheduled Date</Label>
                                    <Input type="datetime-local"
                                        name="effective_date"
                                        id='effective_date'
                                        value={new Date(userInput?.effective_date).toISOString().slice(0, 16)}
                                        onChange={handleChange}
                                        disabled
                                    />
                                     {/* <Input type="datetime-local"
                                        name="effective_date"
                                        id='effective_date'
                                        value={new Date('2024-05-07T13:40z').toISOString().slice(0, 16)}
                                        onChange={handleChange}
                                        disabled
                                    /> */}
                                </FormGroup>
                            </Col>
                        }
                        <Col sm='12' />
                        <Col sm="3" className='mb-1 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' onChange={(e) => {
                                    if (e.target.checked) {
                                        setUserInput({ ...userInput, isRepeat: true, isScheduled: false })
                                    } else {
                                        setUserInput({ ...userInput, isRepeat: false, expiry_date: null, repeat_type: '', repeat_time: null })
                                    }
                                }
                                } id='isRepeat' checked={userInput.isRepeat} label='Is Repeat?' disabled />
                            </FormGroup>
                        </Col>
                        {
                            userInput.isRepeat && <Col md='4' >
                                <FormGroup>
                                    <Label for="startDate">Start Date</Label>
                                    <Input type="date"
                                        name="repeat_start_date"
                                        id='repeat_start_date'
                                        value={new Date(userInput?.repeat_start_date).toLocaleDateString('fr-CA')}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isRepeat && <Col md='4' >
                                <FormGroup>
                                    <Label for="expiry_Date">Expiry Date</Label>
                                    <Input type="date"
                                        name="expiry_date"
                                        id='expiry_date'
                                        value={new Date(userInput?.expiry_date).toLocaleDateString('fr-CA')}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isRepeat && <Col sm='4'>
                                <FormGroup>
                                    <Label for="repeat_type">Repeat Type</Label>
                                    <Input
                                        disabled
                                        onFocus={e => RptRef.current.select.focus()}
                                        value={userInput?.repeat_type || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            (userInput.isRepeat && userInput.repeat_type === 'Monthly') && <Col md='3' >
                                <FormGroup>
                                    <Label for="startDate">Date of Month</Label>
                                    <Input
                                        disabled
                                        onFocus={e => MonthRef.current.select.focus()}
                                        value={userInput?.repeat_month_day || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            (userInput.isRepeat && userInput.repeat_type === 'Weekly') && <Col md='3' >
                                <FormGroup>
                                    <Label for="startDate">Day</Label>
                                    <Input
                                        disabled
                                        onFocus={e => DayRef.current.select.focus()}
                                        value={userInput?.repeat_day || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            (userInput.isRepeat && (userInput.repeat_type === 'Daily' || userInput.repeat_type === 'Weekly' || userInput.repeat_type === 'Monthly')) && <Col md='3' >
                                <FormGroup>
                                    <Label for="startDate">Time</Label>
                                    <Input type="time"
                                        min={new Date().toLocaleDateString('fr-CA')}
                                        name="repeat_time"
                                        id='repeat_time'
                                        value={userInput.repeat_time}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default BulkNotificationDetails