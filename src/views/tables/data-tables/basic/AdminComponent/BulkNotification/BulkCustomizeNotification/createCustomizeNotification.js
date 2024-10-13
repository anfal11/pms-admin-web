import useJwt from '@src/auth/jwt/useJwt'
// import '@styles/react/libs/editor/editor.scss'
import { selectThemeColors } from '@utils'
import { Upload, message } from "antd"
import "antd/dist/antd.css"
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft, FileText, Plus, UploadCloud } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import XLSX from "xlsx"
import { API_BASE_URL, BMS_PASS, BMS_USER, FILE_UPLOAD_BASE_URl } from '../../../../../../../Configurables'
import { Error, Success } from '../../../../../../viewhelper'
import UploadFile from './UploadxlsxFile'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import '@styles/react/libs/editor/editor.scss'
// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import socketIOClient from "socket.io-client"

const { Dragger } = Upload

const createCustomizeNotification = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [emailfilePrevw, setEmailFilePrevw] = useState(null)
    const history = useHistory()
    const EntryRef = useRef()
    const RuleRef = useRef()
    const GrpRef = useRef()
    const BudgetRef = useRef()
    const AdRef = useRef()
    const DayRef = useRef()
    const EmailBodyRef = useRef()
    const MonthRef = useRef()
    const RptRef = useRef()
    const blackListRef = useRef()
    const [ShowUpload, setShowUpload] = useState(true)
    const [rowNumber, setRowNumber] = useState(0)
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [channelList, setChannelList] = useState([])
    const [selectedGroup, setSelectedGroup] = useState({})
    const [selectedQuota, setSelectedQuota] = useState({})
    const [selectedAdRule, setSelectedAdRule] = useState({})
    const [selectedCampaignRule, setSelectedCampaignRule] = useState({})
    const user = JSON.parse(localStorage.getItem('userData'))
    const [quotaList, setQuotaList] = useState([])
    const [adRuleList, setAdRuleList] = useState([])
    const [campaignList, setCampaignList] = useState([])
    const [BlackList, setBlackList] = useState([])
    const [businesscategorylist, setbusinesscategorylist] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [entry_type, setentry_type] = useState(1)
    const [File, setFile] = useState(null)
    const [userInput, setUserInput] = useState({
        title: "",
        sms_from: 0,
        sms_body: '',
        black_list_group_id: [],
        entry_type: 1,
        bulk_sms_file: '',
        bulk_email_file: '',
        rule_id: 0,
        group_id: 0,
        quota_id: 0,
        adRule_id: 0,
        effective_date: null,
        expiry_date: null,
        isScheduled: false,
        isRepeat: false,
        repeat_type: "",
        repeat_time: '',
        is_rule_base_notification: false,
        is_Ad: false,
        isAdScheduled: false,
        startDate: '',
        endDate: '',
        repeat_start_date: null,
        repeat_day: "",
        repeat_month_day: "",
        email_title: '',
        email_body: '',
        creation_type: 1,
        email_attachment: ''
    })

    // const handleChange = (e) => {
    //     setUserInput({ ...userInput, [e.target.name]: e.target.value })
    // }
    const handleChange = (e) => {
        const { name, value } = e.target
        const truncatedValue = name === 'title' ? value.substring(0, 100) : value
        setUserInput({ ...userInput, [name]: truncatedValue })
    }

    useEffect(async () => {
        localStorage.setItem('usePMStoken', false) //for token management
        localStorage.setItem('useBMStoken', true)
        await useJwt.campaignList().then(res => {
            console.log(res)
            setCampaignList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                    localStorage.setItem('BMStoken', res.data.jwtToken)
                    localStorage.setItem("BMSCall", false)
                    setReset(!resetData)
                }).catch(err => {
                    localStorage.setItem("BMSCall", false)
                    console.log(err)
                })
            } else {
                Error(err)
            }
            console.log(err)
            localStorage.setItem('useBMStoken', false)
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
            setbusinesscategorylist(res.data.payload.map(item => { return { value: { id: item.uid, subcategory: item.subcategory }, label: item?.name } }))
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

    // const [Filename, setFilename] = useState('')
    const handleFile = (file /*:File*/) => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader()
        const rABS = !!reader.readAsBinaryString
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" })
            /* Get first worksheet */
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {
                header: 1
            })
            setRowNumber(data.length - 1)
            console.log(
                "data",
                data.map((x) => { return { MSISDN: x[0] } }).filter(y => !!y).splice(1)
            )
            // setModalMSISDN(data.map((x) => { return { MSISDN: x[0] } }).filter(y => !!y).splice(1))
            /* Update state */
            //   this.setState({ data: data, cols: make_cols(ws["!ref"]) })
        }
        if (rABS) reader.readAsBinaryString(file)
        else reader.readAsArrayBuffer(file)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!File) {
            Error({ response: { status: 404, data: { message: 'Please wait for file upload' } } })
            return 0
        }
        const { title, sms_from, sms_body, black_list_group_id, entry_type, bulk_sms_file, bulk_email_file, effective_date, expiry_date, isScheduled, isRepeat, repeat_type, repeat_time, is_rule_base_notification, is_Ad, isAdScheduled, startDate, endDate, repeat_start_date, repeat_day, repeat_month_day, email_title, email_body, creation_type, email_attachment } = userInput
        let { group_id, quota_id, adRule_id, rule_id } = userInput
        // qouta_id = parseInt(selectedQuota.value)
        // quota_id = 1
        // adRule_id = parseInt(selectedAdRule.value)
        // rule_id = parseInt(selectedCampaignRule.value)
        group_id = parseInt(selectedGroup.value)
        quota_id = 1
        adRule_id = parseInt(selectedAdRule.value)
        rule_id = parseInt(selectedCampaignRule.value)
        setPointRuleloading(true)

        if (userInput.creation_type === 1) {
            // const { group_id, quota_id, adRule_id, rule_id } = userInput
            useJwt.createBulkSMS({ title, sms_from, sms_body, group_id, quota_id, adRule_id, rule_id, effective_date, expiry_date, isScheduled, isRepeat, repeat_type, repeat_time, is_rule_base_notification, is_Ad, isAdScheduled, startDate, endDate, repeat_start_date, repeat_day, repeat_month_day, black_list_group_id, entry_type, bulk_sms_file: File }).then((response) => {
                console.log(response)
                setPointRuleloading(false)
                Success(response)
                history.push('/bulkCustomizeNotificationList')
            }).catch((error) => {
                setPointRuleloading(false)
                console.log(error)
                Error(error)
                console.log(error)
            })
        } else {
            useJwt.createBulkEmail({ title, sms_from, sms_body, black_list_group_id, entry_type, rule_id, group_id, quota_id, adRule_id, effective_date, expiry_date, isScheduled, isRepeat, repeat_type, repeat_time, is_rule_base_notification, is_Ad, isAdScheduled, startDate, endDate, repeat_start_date, repeat_day, repeat_month_day, bulk_email_file: File }).then((response) => {
                console.log(response)
                setPointRuleloading(false)
                Success(response)
                history.push('/bulkCustomizeNotificationList')
            }).catch((error) => {
                setPointRuleloading(false)
                console.log(error)
                Error(error)
                console.log(error)
            })
        }
    }

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

    return (
        <Fragment>
            {
                user.role === 'vendor' ? <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allBulkSMSVendor' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple> : <Button.Ripple className='mb-1' color='primary' tag={Link} to='/bulkCustomizeNotificationList' >
                    <div className='d-flex align-items-center'>
                        <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                        <span >Back</span>
                    </div>
                </Button.Ripple>
            }
            <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Create Customize Notification</CardTitle>
                        <div>
                            <FormGroup className='d-flex'>
                                <CustomInput type='radio' name='sms' id='sms' checked={userInput.creation_type === 1} label='SMS'
                                    onChange={() => {
                                        setUserInput({ ...userInput, creation_type: 1 })
                                    }}
                                />
                                <CustomInput className='mx-2' type='radio' name='email' id='email' checked={userInput.creation_type === 2} label='Email'
                                    onChange={() => {
                                        setUserInput({ ...userInput, creation_type: 2 })
                                    }}
                                />
                            </FormGroup>
                        </div>
                    </CardHeader>
                    {
                        userInput.creation_type === 1 ? <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm='12'>
                                    <FormGroup>
                                        <Label for="title">
                                            Notification-SMS-Title
                                            <span style={{ color: 'red' }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={userInput.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Notification Title"
                                            invalid={userInput.title.length >= 100}
                                        />
                                        {userInput.title.length >= 100 && (
                                            <div className="invalid-feedback">You have reached the maximum character limit (100).</div>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col sm='12'>
                                    {
                                        userInput?.entry_type === 2 && <Row>
                                            <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="sms_from">SMS From<span style={{ color: 'red' }}>*</span></Label>
                                                    <Input type="number"
                                                        name="sms_from"
                                                        id='sms_from'
                                                        value={userInput.sms_from}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="sms from"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="6" >
                                                <FormGroup>
                                                    <Label for="sms_body">SMS Body<span style={{ color: 'red' }}>*</span></Label>
                                                    <Input type="textarea"
                                                        name="sms_body"
                                                        id='sms_body'
                                                        value={userInput.sms_body}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="sms body"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    }

                                    {/* {
                                entry_type === 1 ? <UploadFile handleFile={handleFile} setcustomcodecsvurl={setFile}/> : null
                            } */}

                                    <UploadFile handleFile={handleFile} setcustomcodecsvurl={setFile} flag={userInput?.creation_type} />

                                </Col>

                                <Col sm="4" style={{ marginTop: 20 }} >
                                    <FormGroup>
                                        <Label for="">Select Black List</Label>
                                        <Select
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            id='black_list_group_id'
                                            classNamePrefix='select'
                                            // value={{ value: selectedCampaignRule.value, label: selectedCampaignRule.label ? selectedCampaignRule.label : 'select...' }}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, black_list_group_id: [...userInput.black_list_group_id, ...selected.map(i => i.value)] })
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
                                </Col>

                                <Col sm='12' />

                                {userInput.is_Ad && <Col sm="4">
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
                            </Row>
                        </CardBody> : null
                    }
                    {
                        userInput.creation_type === 2 ? <CardBody style={{ paddingTop: '15px' }}>
                            <Row>
                                <Col sm='12'>
                                    <FormGroup>
                                        <Label for="title">
                                        Notification-Email-Title
                                            <span style={{ color: 'red' }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={userInput.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Notification Title"
                                            invalid={userInput.title.length >= 100}
                                        />
                                        {userInput.title.length >= 100 && (
                                            <div className="invalid-feedback">You have reached the maximum character limit (100).</div>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col sm='12'>
                                    <UploadFile handleFile={handleFile} setcustomcodecsvurl={setFile} flag={userInput?.creation_type} />
                                </Col>
                                <Col sm="4" style={{ marginTop: 20 }} >
                                    <FormGroup>
                                        <Label for="">Select Black List</Label>
                                        <Select
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            id='black_list_group_id'
                                            classNamePrefix='select'
                                            // value={{ value: selectedCampaignRule.value, label: selectedCampaignRule.label ? selectedCampaignRule.label : 'select...' }}
                                            onChange={(selected) => {
                                                setUserInput({ ...userInput, black_list_group_id: [...userInput.black_list_group_id, ...selected.map(i => i.value)] })
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
                                </Col>

                                <Col sm='12' />

                                {userInput.is_Ad && <Col sm="4">
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
                            </Row>
                        </CardBody> : null
                    }
                </Card>
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
        </Fragment >
    )
}

export default createCustomizeNotification