import React, { Fragment, useMemo, useState, useRef, useEffect } from 'react'
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
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import MultipleFileUploader from '../MultipleImageUpload'

const CreatePromo = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [isRtl, setIsRtl] = useRTL()
    const history = useHistory()

    const merchantRef = useRef()
    const ruleRef = useRef()
    const GrpRef = useRef()
    const [PromoCr8Loading, setPromoCr8Loading] = useState(false)
    const [adRuleList, setAdRuleList] = useState([])
    const [MerchantList, setMerchantLists] = useState([])
    const [groupList, setGroupList] = useState([])
    const [userInput, setUserInput] = useState({
        title: '',
        campaign_id: '',
        description: '',
        merchant_id: '',
        rule_id: '',
        promotion_type: 'Normal',
        is_global: false,
        group_id: ''
    })
    
    const [image_urls, setImage_Urls] = useState([])
    const [mobile_image_urls, setmobile_image_urls] = useState([])

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(async () => {
        await useJwt.customerBusinessList().then(res => {
            const { payload } = res.data
            // console.log(payload)
            setMerchantLists(payload.map(x => { return { value: x.id, label: x.businessname } }))
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
        await useJwt.adRuleList().then(res => {
            // console.log(res)
            const allAdRule = []
            for (const q of res.data.payload) {
                if (q.is_approved === true) {
                    allAdRule.push(q)
                }
            }
            setAdRuleList(allAdRule.map(ar => { return { value: ar.id, label: ar.rule_name } }))
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
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()
        const { title, description, merchant_id, group_id, rule_id, promotion_type, is_global } = userInput
        console.log({ title, description, merchant_id: +merchant_id, rule_id: +rule_id, promotion_type, is_global, image_urls, mobile_image_urls, group_id })
        // return 0
        setPromoCr8Loading(true)
        useJwt.createPromotion({ title, description, merchant_id: +merchant_id, rule_id: +rule_id, promotion_type, is_global, image_urls, mobile_image_urls, group_id }).then((response) => {
            console.log(response)
            Success(response)
            setPromoCr8Loading(false)
            history.push(userData?.role === 'vendor' ? '/promolistVendor' : '/promolist')
        }).catch((error) => {
            setPromoCr8Loading(false)
            Error(error)
            console.log(error.response)
        })
    }

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to={userData?.role === 'vendor' ? '/promolistVendor' : '/promolist'} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <h4 className='m-1'>Promotion Info</h4>
                <Row className='match-height'>
                    <Col sm='6'>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="12" >
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
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="description">Description<span className='text-danger'>*</span></Label>
                                            <Input type="textarea"
                                                rows="6"
                                                name="description"
                                                id='description'
                                                value={userInput.description}
                                                onChange={handleChange}
                                                required
                                                placeholder="description here..."
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm='6'>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="merchant_id">Select a Merchant<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                ref={merchantRef}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, merchant_id: selected.value })
                                                }}
                                                options={MerchantList}
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
                                            onFocus={e => merchantRef.current.select.focus()}
                                            value={userInput.merchant_id || ''}
                                            onChange={e => ''}
                                        />
                                    </Col>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="rule_id">AD Rule<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                ref={ruleRef}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, rule_id: selected.value })
                                                }}
                                                options={adRuleList}
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
                                            onFocus={e => ruleRef.current.select.focus()}
                                            value={userInput.rule_id || ''}
                                            onChange={e => ''}
                                        />
                                    </Col>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="type">Promotion Type<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                // ref={ruleRef}
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={{ value: 'Normal', label: 'Normal' }}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, promotion_type: selected.value })
                                                }}
                                                options={[{ value: 'Normal', label: 'Normal' }, { value: 'Special', label: 'Special' }]}
                                                menuPlacement='auto'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="groups">Group<span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                id='group'
                                                classNamePrefix='select'
                                                value={{ value: userInput.group_id, label: groupList.find(gr => gr.id === userInput.group_id)?.group_name || 'select...' }}
                                                onChange={(selected) => {
                                                    setUserInput({ ...userInput, group_id: selected.value })
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
                                                value={userInput?.group_id || ''}
                                                onChange={e => ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" >
                                        <FormGroup>
                                            <Label for="title">Is Global Promotion?</Label> <br />
                                            <CustomInput
                                                type='switch'
                                                id='is_global'
                                                name='is_global'
                                                inline
                                                label=''
                                                checked={userInput.is_global}
                                                onChange={e => setUserInput({ ...userInput, is_global: e.target.checked })} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>`
                    </Col>
                </Row>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Upload Images</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col md='12' className='mb-2'>
                                {/* <Label for="voucherImage">Upload Images</Label> */}
                                <MultipleFileUploader Image_Urls={image_urls} setImage_Urls={setImage_Urls} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Upload Mobile Images</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            <Col md='12' className='mb-2'>
                                {/* <Label for="voucherImage">Upload Images</Label> */}
                                <MultipleFileUploader Image_Urls={mobile_image_urls} setImage_Urls={setmobile_image_urls} mobile_img={true}/>
                            </Col>
                        </Row>
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
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
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

export default CreatePromo