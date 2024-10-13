import React, { Fragment, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
    X, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { BMS_USER, BMS_PASS, CURRENCY_SYMBOL } from '../../../../../../Configurables'
import { selectThemeColors, transformInToFormObject } from '@utils'
import CommonDataTable from '../ClientSideDataTable'
import { divIcon } from 'leaflet'

const CreateService = () => {
    const history = useHistory()
    const RuleTypeRef = useRef()
    const senGroupTypeRef = useRef()
    const recGroupTypeRef = useRef()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [selectRuleProvider, setRuleProvider] = useState({})
    const [keyword, setKeyword] = useState('')
    const groupTypeOptions = [{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }]
    const [senderOption, setSenderOption] = useState(groupTypeOptions)
    const [receiverOption, setReceiverOption] = useState(groupTypeOptions)
    const [TableDataLoading, setTableDataLoading] = useState(true)

    const [error, setError] = useState({
        serviceId: false,
        keyword: false
    })
    const [userInput, setUserInput] = useState({
        serviceId: '',
        serviceKeyword: '',
        keywordDesc: '',
        senGroupType: 1,
        recGroupType: 1,
        ruleProvider: '',
        isFinancial: false,
        minimum: 0,
        maximum: 0,
        isSubCategory: false,
        subTypes: []
    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const [serviceList, setserviceList] = useState([])
    const autoGenerateId = () => {
        const autoGenerateIds = Math.floor(Math.random() * 1000000)
        const found = serviceList.find(s => s.serviceId === autoGenerateIds)
        if (found) {
            autoGenerateId()
        } else {
            setUserInput({ ...userInput, serviceId: autoGenerateIds })
            console.log(autoGenerateId)
        }
    }
    useEffect(async () => {

        useJwt2.getServiceList().then(res => {
            setserviceList(res.data.payload)
        }).catch(err => {
            Error(err)        
        }).finally(() => {
            setTableDataLoading(false)
        })
        autoGenerateId()
    }, [])

    const column = [
        {
            name: 'SL',
            width: '50px',
            sortable: true,
            cell: (row, index) => index + 1  //RDT provides index by default
        },
        {
            name: 'Service Keyword',
            minWidth: '150px',
            sortable: true,
            selector: 'service_keyword',
            wrap: true
        },
        {
            name: 'Keyword Description',
            minWidth: '200px',
            sortable: true,
            selector: 'keyword_description',
            wrap: true
        },
        {
            name: 'Minimum',
            minWidth: '70px',
            sortable: true,
            selector: (row) => `${CURRENCY_SYMBOL} ${row.minimum}`,
            wrap: true
        },
        {
            name: 'Maximum',
            minWidth: '70px',
            sortable: true,
            selector: (row) => `${CURRENCY_SYMBOL} ${row.maximum}`,
            wrap: true
        },
        {
            name: 'Financial',
            minWidth: '70px',
            sortable: true,
            selector: (row) => {
                if (row.is_financial) {
                    return 'Yes'
                } else {
                    return 'No'
                }

            },
            wrap: true
        }
    ]
    const onSubmit = async (e) => {
        e.preventDefault()

        const {isFinancial, keyword_description, maximum, minimum, serviceId, serviceKeyword} = userInput

        setPointRuleloading(true)
        useJwt2.createService({
            serviceId,
            serviceKeyword: serviceKeyword ? serviceKeyword.toLowerCase() : serviceKeyword,
            keywordDesc: keyword_description, 
            maximum, 
            minimum, 
            is_financial: isFinancial
        }).then((response) => {
            Success(response)
            history.push('/allServices')
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
        })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allServices' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Add Service</CardTitle>

                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Row>
                            {/* <Col sm="6" >
                                <FormGroup>
                                    <Label for="serviceId">Service ID<span style={{ color: 'red' }}>*</span> (Service ID is auto generated. You can also edit this.)</Label>
                                    <Input type="text"
                                        name="serviceId"
                                        id='serviceId'
                                        min="100000"
                                        value={userInput.serviceId}
                                        onChange={handleChange}
                                        onBlur={e => {
                                            setError({ ...error, serviceId: false })
                                            const found = serviceList.find(s => s.serviceId === e.target.value)
                                            if (found) {
                                                setError({ ...error, serviceId: true })
                                                setUserInput({ ...userInput, serviceId: '' })
                                            }
                                        }}
                                        required
                                        disabled
                                        placeholder="100000"
                                    />
                                    {error.serviceId && <small style={{ color: "red" }}>This Service ID is already exist.</small>}
                                </FormGroup>
                            </Col> */}
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="serviceKeyword">Service Keyword<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="serviceKeyword"
                                        id='serviceKeyword'
                                        value={userInput.serviceKeyword}
                                        onChange={handleChange}
                                        onBlur={e => {
                                            setError({ ...error, keyword: false })
                                            const found = serviceList.find(s => s.serviceKeyword === e.target.value)
                                            if (found) {
                                                setError({ ...error, keyword: true })
                                                setUserInput({ ...userInput, serviceKeyword: '' })
                                            }
                                        }}
                                        required
                                        placeholder="keyword"
                                    />
                                    {error.keyword && <small style={{ color: "red" }}>This Service Keyword is already exist.</small>}
                                </FormGroup>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="keywordDesc">Keyword Description<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="keyword_description"
                                        id='keyword_description'
                                        value={userInput.keyword_description}
                                        onChange={handleChange}
                                        required
                                        placeholder="description"
                                    />
                                </FormGroup>
                            </Col>
                            {/* <Col sm="6" className='mt-1'>
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        label='Allow subtype?'
                                        id='isSubCategory'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, isSubCategory: true })
                                            } else {
                                                setUserInput({ ...userInput, isSubCategory: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
                            {
                                userInput.isSubCategory && <Col sm="6" >
                                    <FormGroup>
                                        <Label for="keyword">Subtypes<span style={{ color: 'red' }}>*</span></Label>
                                        <div className='d-flex align-items-center'>
                                            <InputGroup>
                                                <Input type="text"
                                                    name="keyword"
                                                    id='keyword'
                                                    value={keyword}
                                                    onChange={e => setKeyword(e.target.value)}
                                                    placeholder="your answer"
                                                />
                                                <InputGroupAddon addonType='append'>
                                                    <Button style={{ zIndex: '0' }} color='primary' outline onClick={() => {
                                                        if (keyword) {
                                                            setUserInput({ ...userInput, subTypes: [...userInput.subTypes, keyword] })
                                                            setKeyword('')
                                                        }
                                                    }}>
                                                        Add
                                                    </Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                        <div className='d-flex mt-1'>
                                            {userInput.subTypes?.map((k, index) => <InputGroup key={index} style={{ width: '100px', marginRight: '10px' }}>
                                                <InputGroupAddon addonType='prepend'>
                                                    <Button style={{ width: '35px', padding: '5px' }} color='primary' outline onClick={() => {
                                                        userInput.subTypes.splice(userInput.subTypes.indexOf(k), 1)
                                                        setUserInput({ ...userInput, subTypes: [...userInput.subTypes] })
                                                    }}>
                                                        <X size={12} />
                                                    </Button>
                                                </InputGroupAddon>
                                                <Input type="text"
                                                    name="keyword"
                                                    id='keyword'
                                                    style={{ fontSize: '10px', padding: '5px' }}
                                                    value={k}
                                                    disabled
                                                    onChange={() => { }}
                                                />
                                            </InputGroup>)}
                                        </div>
                                    </FormGroup>
                                </Col>
                            } */}

                            <Col sm='12'>
                                <p className='mx-auto mt-1 mb-1'>Fill Service Logic information</p>
                            </Col>

                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="minimum">MIN TXN Amount({CURRENCY_SYMBOL})<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="minimum"
                                        id='minimum'
                                        value={userInput.minimum}
                                        onChange={handleChange}
                                        max='999999'
                                        min='0'
                                        required
                                        placeholder='0'
                                        onWheel={(e) => e.target.blur()}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="maximum">MAX TXN Amount({CURRENCY_SYMBOL})<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="maximum"
                                        id='maximum'
                                        max='999999'
                                        min='1'
                                        value={userInput.maximum}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                        onWheel={(e) => e.target.blur()}
                                    />
                                </FormGroup>
                            </Col>
                            {/* 
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="senGroupType">Sender Group Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={RuleTypeRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{ value: userInput.senGroupType, label: [{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value === userInput.senGroupType)?.label || 'Select...' }}
                                        onChange={(selected) => {
                                            setUserInput({...userInput, senGroupType: selected.value})
                                        }}
                                        options={senderOption}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => senGroupTypeRef.current.select.focus()}
                                        value={userInput?.senGroupType || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="recGroupType">Receiver Group Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={RuleTypeRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{ value: userInput.recGroupType, label: [{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value === userInput.recGroupType)?.label || 'Select...' }}
                                        onChange={(selected) => {
                                            setUserInput({...userInput, recGroupType: selected.value})
                                        }}
                                        options={receiverOption}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => recGroupTypeRef.current.select.focus()}
                                        value={userInput?.recGroupType || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="ruleProvider">Reward Priority<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={RuleTypeRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{ value: selectRuleProvider.value, label: selectRuleProvider.label ? selectRuleProvider.label : 'Select...' }}
                                        onChange={(selected) => {
                                            setRuleProvider({ value: selected.value, label: selected.label })
                                        }}
                                        options={[{ value: 's', label: 'Sender' }, { value: 'r', label: 'Reciever' }]}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => RuleTypeRef.current.select.focus()}
                                        value={selectRuleProvider?.value || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col> */}
                            <Col sm="12" className='mt-1'>
                                <FormGroup>
                                    <CustomInput onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, isFinancial: true })
                                        } else {
                                            setUserInput({ ...userInput, isFinancial: false })
                                        }
                                    }
                                    } type='switch' id='isFinancial' label='Is Financial?' />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Existing Services</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <CommonDataTable column={column} TableData={serviceList} TableDataLoading={TableDataLoading}/>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
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
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
}

export default CreateService