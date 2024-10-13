import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import useJwtBMS from '@src/auth/jwt/useJwtBMS'
import { Link, useHistory } from 'react-router-dom'
import { ChevronLeft, Plus } from 'react-feather'
import { useFormik } from "formik"
import { Error, Success } from '../../../viewhelper'

import CreateSmsTemplate from './Sms'
import CreateEmailTemplate from './Email'
import CreatePushNotificationTemplate from './PushNotification'
import CreateFaceBookPagePostTemplate from './FBPagePost'
import SelectGroupOrCampRule from './SelectGroupOrCampRule'
import GoogleAd from './GoogleAd'
import SetScheduled from './SetScheduled'
import MapBox from '../../../tables/data-tables/basic/AdminComponent/MapBox'

const InitialData = {
    html: "",
    design: {}
  }

const CreateBulkNotification = () => {

    const history = useHistory()
    const catRef = useRef()
    const emailEditorRef = useRef(null)
    const RuleRef = useRef()
    const GrpRef = useRef()
    const AdRef = useRef()
    const DayRef = useRef()
    const MonthRef = useRef()
    const RptRef = useRef()
    const user = JSON.parse(localStorage.getItem('userData'))
    const [channelList, setChannelList] = useState([])
    const [pushfilePrevw, setPushFilePrevw] = useState(null)
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [instasubCategory, setInstaSubCategory] = useState([])
    const [fbfilePrevw, setFbFilePrevw] = useState(null)
    const [fbSelectdCategory, setfbSelectdCategory] = useState([])
    const [fbSelectdSubCategory, setfbSelectdSubCategory] = useState([])
    const [instafilePrevw, setInstaFilePrevw] = useState(null)
    const [instaSelectdCategory, setinstaSelectdCategory] = useState([])
    const [instaSelectdSubCategory, setinstaSelectdSubCategory] = useState([])
    const [selectedGroup, setSelectedGroup] = useState({})
    const [groupList, setGroupList] = useState([])
    const [selectedCampaignRule, setSelectedCampaignRule] = useState({})
    const [campaignList, setCampaignList] = useState([])
    const [isloading, setisloading] = useState(false)
    const [adRuleList, setAdRuleList] = useState([])
    const [selectedAdRule, setSelectedAdRule] = useState({})
    const [userInput, setUserInput] = useState({
        url: null,
        radius: 0,
        is_location: false,
        fb_page_post_body: '',
        fb_page_post_image: '',
        sms_body: '',
        push_notification_title: '',
        push_notification_body: '',
        push_notification_image: '',
        voucherId: '',
        email_title: '',
        email_body: '',
        email_attachment: '',
        instagram_body: '',
        instagram_image: '',
        rule_id: 0,
        group_id: 0,
        qouta_id: 0,
        adRule_id: 0,
        effective_date: null,
        expiry_date: null,
        isScheduled: false,
        isRepeat: false,
        repeat_type: '',
        repeat_time: 0,
        is_rule_base_notification: false,
        is_Ad: false,
        isAdScheduled: false,
        startDate: '',
        endDate: '',
        repeat_start_date: null,
        repeat_day: '',
        repeat_month_day: '',
        fb_page_post_category_ids: [],
        facebookpage_subcategory_localuids: [],
        instafb_page_post_category_ids: [],
        instafacebookpage_subcategory_localuids: [],
        black_list_group_id: [],
        push_from:"",
        title:""
    })

    const [location, setLocation] = useState({ lat: 23.8041, lng: 90.4152 })
    const [initialValues, setInitialValues] = useState(InitialData)

    const [voucherSelectValue, setvoucherSelectValue] = useState({})
    const [voucherList, setVoucherList] = useState([])
    const [voucherListMap, setVoucherListMap] = useState([])

    const [BlackList, setBlackList] = useState([])
    const blackListRef = useRef()


    const formik = useFormik({
      initialValues,
      enableReinitialize: true,
      onSubmit: (values) => {
      }
    })

    useEffect(async () => {

        Promise.all([
            useJwt2.runningcampaignList().then(res => {
                setCampaignList(res.data.payload.map(item => { return { value: item.id, label: item.campaign_name } }))
             }).catch(err => {
                Error(err)
            }),
            useJwt2.getCampaignChannelList().then(res => {
                setChannelList(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
            useJwt2.getFbpageCategory().then(res => {
                setbusinesscategorylist(res.data.payload.map(item => { return { value: {id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
            }).catch(err => {
                console.log(err.response)
                Error(err)
            }),
    
            useJwt2.getCentralGroup().then(res => {
                // const allGroup = []
                // for (const q of res.data.payload) {
                //     if (q.is_approved === true) {
                //         allGroup.push(q)
                //     }
                // }
                setGroupList(res.data.payload)
            }).catch(err => {
                Error(err)
            }),
    
            useJwt2.adRuleList().then(res => {
                const allAdRule = []
                for (const q of res.data.payload) {
                    if (q.is_approved === true) {
                        allAdRule.push(q)
                    }
                }
                setAdRuleList(allAdRule)
            }).catch(err => {
                Error(err)
            }),

            useJwt2.pmsVoucherList().then(async res => {
                // console.log(res)
                const { payload } = res.data
                const { approvepending = [], mypending = [], list = []} = payload
                const formatedData = list.map(item => {
                    return { value: item.voucherid, label: item.title}
                })
                setVoucherList(formatedData)
                setVoucherListMap(list)
            
            }).catch(err => {
                Error(err)
            }),

            useJwt2.allBlackList().then(res => {
                console.log(res)
                setBlackList(res.data.payload)
            }).catch(err => {
                Error(err)
                console.log(err)
            })
        ])
    }, [])

    const handleChangeFBCategory = (selected) => {
        setfbSelectdCategory(selected)
        const dataPush = [], fb_page_post_category_ids = []
        if (selected.length && selected[selected.length - 1].value.subcategory) {
            selected.map(item => {
                item.value.subcategory.map(item2 => {
                    dataPush.push(item2)
                })
                fb_page_post_category_ids.push(item.value.id)
            })
        }

        if (selected.length === 0) {
            setSubCategory([])
            setUserInput({...userInput, fb_page_post_category_ids: []})

        } else {
            setSubCategory(dataPush.length ? dataPush : subCategory)
            setUserInput({...userInput, fb_page_post_category_ids})
        }
       
    }
    const handleChangeVoucherSelect = (selected) => {
        if (selected) {
            setvoucherSelectValue(selected)
            let body = ""
            voucherListMap.some(item => {
                console.log('item.voucherid === selected.value => ', item.voucherid, ' ', selected.value)
                if (item.voucherid === selected.value) {
                    body = item.description
                    return true
                }
                return false
            })
            console.log('body => ', body)
            setUserInput({...userInput, voucherId: selected.value, push_notification_body: body})
        } else {
            setvoucherSelectValue({})
            setUserInput({...userInput, voucherId: "", push_notification_body: ""})
        }
    }

    const handleChangeFBSubCategory = (selected) => {
        setfbSelectdSubCategory(selected)
        setUserInput({...userInput, facebookpage_subcategory_localuids: selected.map(item => item.value)})
    }

    const handleChangeInstaCategory = (selected) => {
        setinstaSelectdCategory(selected)
        const dataPush = [], instafb_page_post_category_ids = []
        if (selected.length && selected[selected.length - 1].value.subcategory) {
            selected.map(item => {
                item.value.subcategory.map(item2 => {
                    dataPush.push(item2)
                })
                instafb_page_post_category_ids.push(item.value.id)
            })
        }

        if (selected.length === 0) {
            setInstaSubCategory([])
            setUserInput({...userInput, instafb_page_post_category_ids: []})

        } else {
            setInstaSubCategory(dataPush.length ? dataPush : subCategory)
            setUserInput({...userInput, instafb_page_post_category_ids})
        }
       
    }

    const handleChangeInstaSubCategory = (selected) => {
        setinstaSelectdSubCategory(selected)
        setUserInput({...userInput, instafacebookpage_subcategory_localuids: selected.map(item => item.value)})
    }
    const uploadImg = async (file, fieldName, setFunc) => {
        const formData1 = new FormData()
        formData1.append('image', file)
        await useJwt2.singleImageUpload(formData1).then(async res => {
            userInput[fieldName] = await res.data.payload.image_url
            setUserInput({ ...userInput })
            if (file) {
                setFunc(URL.createObjectURL(file))
            }
        }).catch(e => {
            console.log(e.response)
        })
    }
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    console.log('location => ', location)
    const onSubmit = (e) => {
        e.preventDefault()
        const email_body = formik?.values?.html
        let { group_id, qouta_id, adRule_id, rule_id } = userInput
        
        group_id = parseInt(selectedGroup.value)
        // qouta_id = parseInt(selectedQuota.value)
        qouta_id = 1
        adRule_id = parseInt(selectedAdRule.value)
        rule_id = parseInt(selectedCampaignRule.value)
        setisloading(true)
        useJwt2.createBulkNotification({ ...userInput, is_location_base: userInput.is_location, lat: location.lat, long: location.lng, distance_radius: userInput.radius, email_body, group_id, qouta_id, adRule_id, rule_id, facebookpage_subcategory_ids: userInput.facebookpage_subcategory_localuids }).then((response) => {
            Success(response)
            history.push(user.role === 'vendor' ? '/allBulkNotificationsVendor' : '/allBulkNotifications')
            setisloading(false)
        }).catch((error) => {
            Error(error)
            setisloading(false)
        })
    }

    return (
        <Fragment>

            <Button.Ripple className='mb-1' color='primary' tag={Link} to={user.role === 'vendor' ? '/allBulkNotificationsVendor' : '/allBulkNotifications'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Create Bulk Notification</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px', paddingRight: 0 }}>
                   <Form className="row"  onSubmit={onSubmit} autoComplete="off"> 
                   <Col sm='10'>
                          <FormGroup>
                          <Label for="title">Notification-Title<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="text"
                                name="title"
                                id='title'
                                value={userInput.title}
                                onChange={handleChange}
                                required
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
                                    } id={c.channel_name} />
                                </CardHeader>
                                <CardBody style={{paddingRight: 0 }}>
                                    {
                                        userInput[c.key_name] && c.key_name === 'sms' && 
                                        <CreateSmsTemplate 
                                            userInput = {userInput}
                                            handleChange = {handleChange}
                                        />
                                    }
                                    {/* <div style={{display: (userInput[c.key_name] && c.key_name === 'email') ? 'block' : 'none'}}>
                                       <CreateEmailTemplate 
                                            userInput = {userInput}
                                            handleChange = {handleChange}
                                            emailEditorRef = {emailEditorRef}
                                            formik={formik}
                                        />
                                    </div> */}


                                    {
                                        userInput[c.key_name] && c.key_name === 'email' && 
                                        <CreateEmailTemplate 
                                            userInput = {userInput}
                                            handleChange = {handleChange}
                                            emailEditorRef = {emailEditorRef}
                                            formik={formik}
                                        />
                                    }

                                    {
                                        userInput[c.key_name] && c.key_name === 'push_notification' && 
                                        <CreatePushNotificationTemplate 
                                            userInput={userInput}
                                            setUserInput={setUserInput}
                                            handleChange={handleChange} 
                                            pushfilePrevw={pushfilePrevw}
                                            setPushFilePrevw={setPushFilePrevw}
                                            uploadImg={uploadImg}
                                            handleChangeVoucherSelect={handleChangeVoucherSelect}
                                            voucherList={voucherList}
                                        />
                                    }

                                    {
                                        userInput[c.key_name] && (c.key_name === 'fb_page_post' || c.key_name === 'instagram') && 
                                        <CreateFaceBookPagePostTemplate 
                                            c={c}
                                            userInput={userInput}
                                            handleChange={handleChange}
                                            businesscategorylist={businesscategorylist}
                                            catRef={catRef}
                                            handleChangeFBCategory={handleChangeFBCategory}
                                            handleChangeFBSubCategory={handleChangeFBSubCategory}
                                            uploadImg={uploadImg}
                                            fbfilePrevw={fbfilePrevw}
                                            setFbFilePrevw={setFbFilePrevw}
                                            instafilePrevw={instafilePrevw}
                                            setInstaFilePrevw={setInstaFilePrevw}
                                            subCategory={subCategory}
                                            fbSelectdCategory={fbSelectdCategory}
                                            fbSelectdSubCategory={fbSelectdSubCategory}
                                            handleChangeInstaCategory={handleChangeInstaCategory}
                                            handleChangeInstaSubCategory={handleChangeInstaSubCategory}
                                            instasubCategory={instasubCategory}
                                            instaSelectdCategory={instaSelectdCategory}
                                            instaSelectdSubCategory={instaSelectdSubCategory}
                                        />
                                    }
                                </CardBody>
                            </Card>
                         </Col>) : <Col sm='12' className='text-center'><Spinner color='blue' size='md' className='m-3' /></Col>
                    }

                        <SelectGroupOrCampRule 
                            userInput={userInput}
                            setUserInput={setUserInput}
                            setSelectedGroup={setSelectedGroup}
                            selectedGroup={selectedGroup}
                            groupList={groupList}
                            setSelectedCampaignRule={setSelectedCampaignRule}
                            selectedCampaignRule={selectedCampaignRule}
                            campaignList={campaignList}
                            RuleRef={RuleRef}
                            GrpRef={GrpRef}
                            BlackList={BlackList}
                            blackListRef={blackListRef}
    
                        />

                        <GoogleAd />

                        <Col sm='12'></Col>

                        <SetScheduled 
                         userInput={userInput}
                         setUserInput={setUserInput}
                         adRuleList={adRuleList}
                         selectedAdRule={selectedAdRule}
                         setSelectedAdRule={setSelectedAdRule}
                         handleChange={handleChange}
                         AdRef={AdRef}
                         RptRef={RptRef}
                         MonthRef={MonthRef}
                         DayRef={DayRef}
                        />

                      <Col sm='12'></Col>
                        <Col sm="3" className='mb-1 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' onChange={(e) => {
                                    if (e.target.checked) {
                                        setUserInput({ ...userInput, is_location: true })
                                    } else {
                                        setUserInput({ ...userInput, is_location: false })
                                    }
                                }
                                } id='is_location' label='Is Location Based?' />
                            </FormGroup>
                        </Col>
                        {
                            userInput.is_location && <Fragment>
                            <Col sm="6" >
                            <FormGroup>
                                <Label for="Radius">Radius(KM)<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="radius"
                                    id='radius'
                                    value={userInput.radius}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter radius in km"
                                    step={0.1}
                                    min={.5}
                                    onWheel={(e) => e.target.blur()}
                                />
                            </FormGroup>
                        </Col>
                            <Col sm='12' className='mb-1'>
                                <MapBox location={location} setLocation={setLocation} />
                            </Col>
                            </Fragment>
                        }
                     

                        <Col sm="12" className='text-center'>
                            {
                                isloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <span >Submit</span>
                                </Button.Ripple>
                            }
                        </Col>
                  </Form>
                </CardBody>
            </Card>


        </Fragment>
    )
}

export default CreateBulkNotification