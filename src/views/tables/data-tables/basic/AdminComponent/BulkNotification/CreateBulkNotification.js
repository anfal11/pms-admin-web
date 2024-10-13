import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Plus } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { BMS_PASS, BMS_USER, API_BASE_URL } from '../../../../../../Configurables'
import { Error, Success } from '../../../../../viewhelper'
import { EditorState, convertToRaw  } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import '@styles/react/libs/editor/editor.scss'

const CreateBulkNotification = () => {
    const accessToken = localStorage.getItem("accessToken")
    const history = useHistory()
    const catRef = useRef()
    const RuleRef = useRef()
    const GrpRef = useRef()
    const BudgetRef = useRef()
    const AdRef = useRef()
    const DayRef = useRef()
    const MonthRef = useRef()
    const RptRef = useRef()
    const EmailBodyRef = useRef()
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [channelList, setChannelList] = useState([])
    const [file, setFile] = useState(null)
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
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [BlackList, setBlackList] = useState([])
    const blackListRef = useRef()
    const [userInput, setUserInput] = useState({
        fb_page_post_body: '',
        fb_page_post_image: '',
        sms_body: '',
        push_notification_title: '',
        push_notification_body: '',
        push_notification_image: '',
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
        black_list_group_id: []
    })

    const handleChangeFBCategory = (selected) => {
        const dataPush = [], fb_page_post_category_ids = []
        console.log('selected ', selected)
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

    const handleChangeFBSubCategory = (selected) => {
        setUserInput({...userInput, facebookpage_subcategory_localuids: selected.map(item => item.value)})
    }

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(async () => {
        useJwt2.runningcampaignList().then(res => {
            setCampaignList(res.data.payload)
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

        useJwt.allBlackList().then(res => {
            console.log(res)
            setBlackList(res.data.payload)
          }).catch(err => {
            Error(err)
            console.log(err)
          })
    }, [])

    const uploadImg = async (file, fieldName, setFunc) => {
        const formData1 = new FormData()
        formData1.append('image', file)
        await useJwt.singleFileupload(formData1).then(async res => {
            console.log(res)
            userInput[fieldName] = await res.data.payload.image_url
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
        // qouta_id = parseInt(selectedQuota.value)
        qouta_id = 1
        adRule_id = parseInt(selectedAdRule.value)
        rule_id = parseInt(selectedCampaignRule.value)
        console.log({ ...userInput, group_id, qouta_id, adRule_id, rule_id, facebookpage_subcategory_ids: userInput.facebookpage_subcategory_localuids })
        setPointRuleloading(true)
        useJwt.createBulkNotification({ ...userInput, group_id, qouta_id, adRule_id, rule_id, facebookpage_subcategory_ids: userInput.facebookpage_subcategory_localuids }).then((response) => {
            console.log(response)
            setPointRuleloading(false)
            Success(response)
            history.push('/allBulkNotifications')
        }).catch((error) => {
            setPointRuleloading(false)
            console.log(error)
            Error(error)
            console.log(error)
        })
    }
    async function uploadImageCallBack(file) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest() // eslint-disable-line no-undef
          xhr.open("POST", `${API_BASE_URL}/fileupload`)
          xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`)
          xhr.setRequestHeader("Module", "JW9tc0ByZWRsdGQl")
          const data = new FormData() // eslint-disable-line no-undef
          data.append("image", file)
          xhr.send(data)
          xhr.addEventListener("load", () => {
            console.log(xhr.responseText)
            const response = {
                data: {
                    link: JSON.parse(xhr.responseText).payload,
                    type: `image/${JSON.parse(xhr.responseText).payload.split('.')[1]}`
                }
            }
            console.log(response)
            resolve(response)
          })
          xhr.addEventListener("error", () => {
            const error = JSON.parse(xhr.responseText)
            reject(error)
          })
        })
      }

      function countCharacters(str) {
        let englishLetterCount = 0
        let unicodeCount = 0
        let numberCount = 0
        let specialCharacterCount = 0
      
        for (const char of str) {
          if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            englishLetterCount++
          } else if (char >= '0' && char <= '9') {
            numberCount++
          } else if (/[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{2F800}-\u{2FA1F}]/u.test(char)) {
            unicodeCount++
          } else {
            specialCharacterCount++
          }
        }
        const finalV = englishLetterCount + numberCount + (unicodeCount * 2) + specialCharacterCount
        console.log(englishLetterCount, numberCount, unicodeCount, specialCharacterCount, finalV)
        return finalV
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
                    <CardTitle tag='h4'>Create Bulk Notification</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
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
                                    {
                                        (userInput[c.key_name] && c.key_name === 'sms') && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="sms_from">From<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="text"
                                                            name="sms_from"
                                                            id='sms_from'
                                                            value={userInput.sms_from}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="from here..."
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="textarea"
                                                            name="sms_body"
                                                            id='sms_body'
                                                            value={userInput.sms_body}
                                                            onChange={handleChange}
                                                            maxlength="160"
                                                            required
                                                            placeholder="your message"
                                                        />
                                                        <p className='text-right' style={userInput.sms_body.length === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - countCharacters(userInput.sms_body)} characters remaining</p>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    }
                                    {
                                        (userInput[c.key_name] && c.key_name === 'email') && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="title">Subject<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="text"
                                                            name="email_title"
                                                            id='email_title'
                                                            value={userInput.email_title}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="subject here..."
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                                                        <Editor 
                                                          editorState={editorState} 
                                                          ref={EmailBodyRef}
                                                          toolbar={{
                                                            // options: ["blockType", "image"],
                                                            blockType: {
                                                              inDropdown: false,
                                                            //   options: ["H1", "H2"],
                                                              className: 'blockText',
                                                              dropdownClassName: 'blockTextDown'
                                                            },
                                                            image: {
                                                              uploadCallback: uploadImageCallBack,
                                                              inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                                                              alt: { present: true, mandatory: false }
                                                            }
                                                          }}
                                                          onEditorStateChange={data => {
                                                            setUserInput({...userInput, email_body: draftToHtml(convertToRaw(data.getCurrentContent()))}) 
                                                            setEditorState(data)
                                                            // console.log(draftToHtml(convertToRaw(data.getCurrentContent())))
                                                            }} 
                                                        />
                                                        <Input
                                                            required
                                                            style={{
                                                                opacity: 0,
                                                                width: "100%",
                                                                height: 0
                                                                // position: "absolute"
                                                            }}
                                                            onFocus={e => EmailBodyRef.current.select?.focus()}
                                                            value={userInput?.email_body || ''}
                                                            onChange={e => ''}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md='12' className='mb-2'>
                                                    <Label for="voucherImage">Upload Attachment</Label>
                                                    <div className='d-flex'>
                                                        <div className="file position-relative overflow-hidden mr-2">
                                                            <div className='text-center p-1' style={{
                                                                height: '102px',
                                                                width: '102px',
                                                                border: '1px dashed #d9d9d9',
                                                                backgroundColor: "#fafafa"
                                                            }}>
                                                                <span ><Plus size={20} className='my-1' /></span> <br />
                                                                <span>Upload</span>
                                                            </div>
                                                            <Input
                                                                // style={{ width: '300px' }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    opacity: '0',
                                                                    left: '0',
                                                                    top: '0',
                                                                    height: '102px',
                                                                    width: '102px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                type="file"
                                                                accept="image/png, image/jpeg"
                                                                // required
                                                                name="voucherImage"
                                                                id='voucherImage'
                                                                onChange={e => {
                                                                    uploadImg(e.target.files[0], 'email_attachment', setEmailFilePrevw)
                                                                }}
                                                            />
                                                        </div>
                                                        {emailfilePrevw && <img src={emailfilePrevw} alt='voucher img' height='100px'></img>}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    }
                                    {
                                        (userInput[c.key_name] && c.key_name === 'push_notification') && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="push_from">From<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="text"
                                                            name="push_from"
                                                            id='push_from'
                                                            value={userInput.push_from}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="from here..."
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="title">Title<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="text"
                                                            name="push_notification_title"
                                                            id='push_notification_title'
                                                            value={userInput.push_notification_title}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="your title"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="textarea"
                                                            name="push_notification_body"
                                                            id='push_notification_body'
                                                            value={userInput.push_notification_body}
                                                            onChange={handleChange}
                                                            maxlength="160"
                                                            required
                                                            placeholder="your message"
                                                        />
                                                        <p className='text-right' style={userInput.push_notification_body.length === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - userInput.push_notification_body.length} characters remaining</p>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='12' className='mb-1'>
                                                    <Label for="voucherImage">Upload Image</Label>
                                                    <div className='d-flex'>
                                                        <div className="file position-relative overflow-hidden mr-2">
                                                            <div className='text-center p-1' style={{
                                                                height: '102px',
                                                                width: '102px',
                                                                border: '1px dashed #d9d9d9',
                                                                backgroundColor: "#fafafa"
                                                            }}>
                                                                <span ><Plus size={20} className='my-1' /></span> <br />
                                                                <span>Upload</span>
                                                            </div>
                                                            <Input
                                                                // style={{ width: '300px' }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    opacity: '0',
                                                                    left: '0',
                                                                    top: '0',
                                                                    height: '102px',
                                                                    width: '102px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                type="file"
                                                                accept="image/png, image/jpeg"
                                                                // required
                                                                name="voucherImage"
                                                                id='voucherImage'
                                                                onChange={e => {
                                                                    uploadImg(e.target.files[0], 'push_notification_image', setPushFilePrevw)
                                                                }}
                                                            />
                                                        </div>
                                                        {pushfilePrevw && <img src={pushfilePrevw} alt='voucher img' height='100px'></img>}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    }
                                    {
                                        (userInput[c.key_name] && (c.key_name === 'fb_page_post' || c.key_name === 'instagram')) && <CardBody style={{ paddingTop: '15px' }}>
                                            <Row>
                                                <Col sm="12" >
                                                    <FormGroup>
                                                        <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                                                        <Input type="textarea"
                                                            name={c.key_name === 'fb_page_post' ? "fb_page_post_body" : "instagram_body"}
                                                            id='fb_page_post_body'
                                                            value={c.key_name === 'fb_page_post' ? userInput.fb_page_post_body : userInput.instagram_body}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="your message"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md='6' sm='6'>
                                                    <FormGroup>
                                                        <Label for='fb_page_post_category_ids'>Facebook Page Category <span style={{ color: 'red' }}>*</span></Label>
                                                        {
                                                            businesscategorylist.length ? <Select
                                                                ref={catRef}
                                                                theme={selectThemeColors}
                                                                className='basic-multi-select'
                                                                classNamePrefix='select'
                                                                name="businesscategories"
                                                                // defaultValue={businesscategorylist[0]}
                                                                options={businesscategorylist}
                                                                onChange={(selected) => handleChangeFBCategory(selected)}
                                                                isMulti
                                                                isClearable={false}
                                                            
                                                            /> : <Spinner color='primary' />
                                                        }
                                                        <Input
                                                            required
                                                            style={{
                                                                opacity: 0,
                                                                width: "100%",
                                                                height: 0
                                                                // position: "absolute"
                                                            }}
                                                            onFocus={e => catRef.current.select.focus()}
                                                            value={userInput.fb_page_post_category_ids || ''}
                                                            onChange={e => ''}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                {
                                                    (subCategory?.length !== 0) && <Col sm="4" >
                                                    <FormGroup>
                                                        <Label for="facebookpage_subcategory_localuid">Facebook Page Sub Category</Label>
                                                        <Select
                                                            theme={selectThemeColors}
                                                            maxMenuHeight={200}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            onChange={(selected) => handleChangeFBSubCategory(selected)}
                                                            isMulti
                                                            isClearable={false}
                                                            options={subCategory?.map(item => { return { value: item.uid, label: item.name } })}
                                                            
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                }

                                                <Col md='12' className='mb-1'>
                                                    <Label for="voucherImage">Upload Image</Label>
                                                    <div className='d-flex'>
                                                        <div className="file position-relative overflow-hidden mr-2">
                                                            <div className='text-center p-1' style={{
                                                                height: '102px',
                                                                width: '102px',
                                                                border: '1px dashed #d9d9d9',
                                                                backgroundColor: "#fafafa"
                                                            }}>
                                                                <span ><Plus size={20} className='my-1' /></span> <br />
                                                                <span>Upload</span>
                                                            </div>
                                                            <Input
                                                                // style={{ width: '300px' }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    opacity: '0',
                                                                    left: '0',
                                                                    top: '0',
                                                                    height: '102px',
                                                                    width: '102px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                type="file"
                                                                accept="image/png, image/jpeg"
                                                                // required
                                                                name="voucherImage"
                                                                id='voucherImage'
                                                                onChange={e => {
                                                                    uploadImg(e.target.files[0], c.key_name === 'fb_page_post' ? 'fb_page_post_image' : 'instagram_image', c.key_name === 'fb_page_post' ? setFbFilePrevw : setInstaFilePrevw)
                                                                }}
                                                            />
                                                        </div>
                                                        {(fbfilePrevw && c.key_name === 'fb_page_post') ? <img src={fbfilePrevw} alt='voucher img' height='100px'></img> : (instafilePrevw && c.key_name === 'instagram') ? <img src={instafilePrevw} alt='voucher img' height='100px'></img> : null}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    }
                                </Card>
                            </Col>
                            ) : <Col sm='12' className='text-center'><Spinner color='blue' size='md' className='m-3' /></Col>}
                        <Col sm="3" className='mb-2 mt-1'>
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
                                } id='is_rule_base_notification' label='Is Campaign Base Notification?' />
                            </FormGroup>
                        </Col>
                        {
                            userInput.is_rule_base_notification && <Col sm="3" >
                                <FormGroup>
                                    <Label for="groups">Select Campaign<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        id='group'
                                        classNamePrefix='select'
                                        value={{ value: selectedCampaignRule.value, label: selectedCampaignRule.label ? selectedCampaignRule.label : 'select...' }}
                                        onChange={(selected) => {
                                            setSelectedCampaignRule({ value: selected.value, label: selected.label })
                                        }}
                                        options={campaignList?.map(rl => { return { value: rl.id, label: rl.campaign_name } })}
                                        ref={RuleRef}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => RuleRef.current.select.focus()}
                                        value={selectedCampaignRule?.value || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            !userInput.is_rule_base_notification && <Col sm="3" >
                                <FormGroup>
                                    <Label for="groups">Group<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        id='group'
                                        classNamePrefix='select'
                                        value={{ value: selectedGroup.value, label: selectedGroup.label ? selectedGroup.label : 'select...' }}
                                        onChange={(selected) => {
                                            setSelectedGroup({ value: selected.value, label: selected.label })
                                        }}
                                        options={groupList?.map(g => { return { value: g.id, label: g.group_name } })}
                                        ref={GrpRef}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => GrpRef.current.select.focus()}
                                        value={selectedGroup?.value || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                         {/* <Col sm="3" >
                            <FormGroup>
                                <Label for="">Select Black List group</Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    id='black_list_group_id'
                                    classNamePrefix='select'
                                    // value={{ value: selectedCampaignRule.value, label: selectedCampaignRule.label ? selectedCampaignRule.label : 'select...' }}
                                    onChange={(selected) => {
                                        setUserInput({...userInput, black_list_group_id: [...userInput.black_list_group_id, ...selected.map(i => i.value)]})
                                    }}
                                    options={BlackList?.map(rl => { return { value: rl.id, label: rl.group_name } })}
                                    ref={blackListRef}
                                    isMulti
                                />
                                <Input
                                    
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => blackListRef.current.select.focus()}
                                    value={userInput.black_list_group_id || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col> */}

                        {/* <Col sm="3" >
                            <FormGroup>
                                <Label for="quota">Select Budget<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    id='budget'
                                    classNamePrefix='select'
                                    value={{ value: selectedQuota.value, label: selectedQuota.label ? selectedQuota.label : 'select...' }}
                                    onChange={(selected) => {
                                        setSelectedQuota({ value: selected.value, label: selected.label })
                                    }}
                                    options={quotaList?.map(q => { return { value: q.id, label: q.title } })}
                                    ref={BudgetRef}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => BudgetRef.current.select.focus()}
                                    value={selectedQuota?.value || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col> */}
                        <Col sm='12' />
                        {/* <Col sm="6" >
                            <FormGroup>
                                <Label for="title">Title<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text"
                                    name="title"
                                    id='title'
                                    value={userInput.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="your title"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="body">body<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="textarea"
                                    name="body"
                                    id='body'
                                    value={userInput.body}
                                    onChange={handleChange}
                                    maxlength="160"
                                    required
                                    placeholder="your message"
                                />
                                <p className='text-right' style={userInput.body.length === 160 ? {margin: '2px', color: 'red'} : {margin:'2px', color: 'blue'}}>{160 - userInput.body.length} characters remaining</p>
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="remarks">Remarks</Label>
                                <Input type="text"
                                    name="remarks"
                                    id='remarks'
                                    value={userInput.remarks}
                                    onChange={handleChange}
                                    required
                                    placeholder="remarks"
                                />
                            </FormGroup>
                        </Col> */}
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
                                } id='is_Ad' label='Is AD?' />
                            </FormGroup>
                        </Col>
                        {userInput.is_Ad && false && <Col sm="4">
                            <FormGroup>
                                <Label for="ad_rule">Select Ad Rule<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: selectedAdRule.value, label: selectedAdRule.label ? selectedAdRule.label : 'select...' }}
                                    onChange={(selected) => {
                                        setSelectedAdRule({ value: selected.value, label: selected.label })
                                    }}
                                    options={adRuleList?.map(g => { return { value: g.id, label: g.rule_name } })}
                                    ref={AdRef}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => AdRef.current.select.focus()}
                                    value={selectedAdRule?.value || ''}
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
                                } id='isAdScheduled' label='Is Ad Scheduled?' />
                            </FormGroup>
                        </Col>}
                        {
                            userInput.isAdScheduled && <Col md='4' >
                                <FormGroup>
                                    <Label for="startDate">Start Date<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="datetime-local"
                                        min={new Date().toLocaleDateString('fr-CA')}
                                        name="startDate"
                                        id='startDate'
                                        value={userInput.startDate}
                                        onChange={handleChange}
                                        required
                                        placeholder='0'
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isAdScheduled && <Col md='4' >
                                <FormGroup>
                                    <Label for="endDate">End Date<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="datetime-local"
                                        min={new Date().toLocaleDateString('fr-CA')}
                                        name="endDate"
                                        id='endDate'
                                        value={userInput.endDate}
                                        onChange={handleChange}
                                        required
                                        placeholder='0'
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
                                } id='isScheduled' checked={userInput.isScheduled} label='Is Scheduled?' />
                            </FormGroup>
                        </Col>
                        {
                            userInput.isScheduled && <Col md='4' >
                                <FormGroup>
                                    <Label for="effective_date">Scheduled Date<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="datetime-local"
                                        min={new Date().toLocaleDateString('fr-CA')}
                                        name="effective_date"
                                        id='effective_date'
                                        value={userInput.effective_date}
                                        onChange={handleChange}
                                        required
                                        placeholder='0'
                                    />
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
                                } id='isRepeat' checked={userInput.isRepeat} label='Is Repeat?' />
                            </FormGroup>
                        </Col>
                        {
                            userInput.isRepeat && <Col md='4' >
                                <FormGroup>
                                    <Label for="startDate">Start Date<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="date"
                                        min={new Date().toLocaleDateString('fr-CA')}
                                        name="repeat_start_date"
                                        id='repeat_start_date'
                                        value={userInput.repeat_start_date}
                                        onChange={handleChange}
                                        required
                                        placeholder='0'
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isRepeat && <Col md='4' >
                                <FormGroup>
                                    <Label for="expiry_Date">Expiry Date<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="date"
                                        min={new Date().toLocaleDateString('fr-CA')}
                                        name="expiry_date"
                                        id='expiry_date'
                                        value={userInput.expiry_date}
                                        onChange={handleChange}
                                        required
                                        placeholder='0'
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isRepeat && <Col sm='4'>
                                <FormGroup>
                                    <Label for="repeat_type">Repeat Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, repeat_type: selected.value })
                                        }}
                                        options={[{ value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }]}
                                        ref={RptRef}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
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
                                    <Label for="startDate">Date of Month<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        // defaultValue={{ value: 1, label: '1' }}
                                        onChange={(e) => {
                                            if (!e) {
                                                setUserInput({ ...userInput, repeat_month_day: '' })
                                            } else {
                                                const a = e.map(ee => ee.label)
                                                setUserInput({ ...userInput, repeat_month_day: a.toString() })
                                          }
                                        }}
                                        options={[
                                            { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' },
                                            { value: 8, label: '8' }, { value: 9, label: '9' }, { value: 10, label: '10' }, { value: 11, label: '11' }, { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' },
                                            { value: 15, label: '15' }, { value: 16, label: '16' }, { value: 17, label: '17' }, { value: 18, label: '18' }, { value: 19, label: '19' }, { value: 20, label: '20' }, { value: 21, label: '21' },
                                            { value: 22, label: '22' }, { value: 23, label: '23' }, { value: 24, label: '24' }, { value: 25, label: '25' }, { value: 26, label: '26' }, { value: 27, label: '27' }, { value: 28, label: '28' }, { value: 29, label: '29' }, { value: 30, label: '30' }, { value: 31, label: '31' }
                                        ]}
                                        menuPlacement='auto'
                                        ref={MonthRef}
                                        isMulti
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
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
                                    <Label for="startDate">Day<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={(e) => {
                                            if (!e) {
                                                setUserInput({ ...userInput, repeat_day: '' })
                                            } else {
                                                const a = e.map(ee => ee.label)
                                                setUserInput({ ...userInput, repeat_day: a.toString() })
                                          }
                                        }}
                                        options={[{ value: 'Saturday', label: 'Saturday' }, { value: 'Sunday', label: 'Sunday' }, { value: 'Monday', label: 'Monday' }, { value: 'Tuesday', label: 'Tuesday' }, { value: 'Wednesday', label: 'Wednesday' }, { value: 'Thursday', label: 'Thursday' }, { value: 'Friday', label: 'Friday' }]}
                                        menuPlacement='auto'
                                        ref={DayRef}
                                        isMulti
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
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
                                    <Label for="startDate">Time<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="time"
                                        min={new Date().toLocaleDateString('fr-CA')}
                                        name="repeat_time"
                                        id='repeat_time'
                                        value={userInput.repeat_time}
                                        onChange={handleChange}
                                        required
                                        placeholder='0'
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {/* <Col md='12' className='mb-2'>
                            <Label for="voucherImage">Upload Image</Label>
                            <div className='d-flex'>
                                <div className="file position-relative overflow-hidden mr-2">
                                    <div className='text-center p-1' style={{
                                        height: '102px',
                                        width: '102px',
                                        border: '1px dashed #d9d9d9',
                                        backgroundColor: "#fafafa"
                                    }}>
                                        <span ><Plus size={20} className='my-1' /></span> <br />
                                        <span>Upload</span>
                                    </div>
                                    <Input
                                        // style={{ width: '300px' }}
                                        style={{
                                            position: 'absolute',
                                            opacity: '0',
                                            left: '0',
                                            top: '0',
                                            height: '102px',
                                            width: '102px',
                                            cursor: 'pointer'
                                        }}
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        // required
                                        name="voucherImage"
                                        id='voucherImage'
                                        onChange={e => {
                                            if (e.target.files.length !== 0) {
                                                setFilePrevw(URL.createObjectURL(e.target.files[0]))
                                            }
                                            setFile(e.target.files[0])
                                        }}
                                    />
                                </div>
                                {filePrevw && <img src={filePrevw} alt='voucher img' height='100px'></img>}
                            </div>
                        </Col>
                        {
                            channelList.map(c => c.bulk_notification && <Col key={c.id} sm="3" className='mb-1'>
                                    <FormGroup>
                                        <CustomInput type='switch' onChange={(e) => {
                                                if (e.target.checked) { 
                                                    setUserInput({ ...userInput, [c.key_name]: true })
                                                } else {
                                                    setUserInput({ ...userInput, [c.key_name]: false })
                                                }
                                            }
                                        } id={c.channel_name} label={c.channel_name} />
                                    </FormGroup>
                                </Col>
                                
                            
                        )} */}
                        <Col sm="12" className='text-center'>
                            {
                                pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
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