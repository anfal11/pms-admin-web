import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Eye, File, FileText, Info, Plus, Share, Trash } from 'react-feather'
import { useParams, useHistory, Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, PopoverBody, PopoverHeader, Spinner, Table, UncontrolledPopover } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useJwt from '@src/auth/jwt/useJwt'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import * as FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatReadableDate } from '../../../../../helper'
import { Error, Success } from '../../../../../viewhelper'
import CommonDataTable from '../ClientSideDataTable'
const MySwal = withReactContent(Swal)

const Update = () => {
    const { rule_id } = useParams()
    const created_by = localStorage.getItem("username")
    const history = useHistory()
    // updateServiceRule
    const [reset, setReset] = useState()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [userType, setUserType] = useState({ value: 's', label: 'Sender' })
    const [userTypesList, setUserTypesList] = useState([{ value: 's', label: 'Sender' }, { value: 'r', label: 'Receiver' }, { value: 'b', label: 'Both Sender & Receiver' }])

    const serviceTypeRef = useRef()
    const tireRef = useRef()
    const [serviceType, setServiceType] = useState({ value: '', label: 'select...' })
    const [RangeArray, setRanges] = useState([])
    const [tierList, settierList] = useState([])
    const [ServiceList, setserviceList] = useState([])
    const [userInput, setUserInput] = useState({
        rule_title: '',
        rule_details: '',
        service_type: '',
        service_id: 0,
        amount: 0,
        is_range: 0, //bit 0 mean false 1 mean true
        is_active: 0, //bit 0 mean false 1 mean true
        expiry_date: null,
        user_type: '',
        start_range: 0,
        end_range: 0,
        sender_point: 0,
        receiver_point: 0,
        expiry_point: 365,
        tire: null
    })
    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //for token management
        // localStorage.setItem('usePMStoken', true)
        // await useJwt.getServicePointRules().then(res => {
        //     const Details = res.data.data.filter(x => +x.id === +rule_id)[0]
        //     const { id, rule_title, rule_details, amount, start_range, end_range, expiry_date, is_active, expiry_point, tire, receiver_point, sender_point, is_range, service_type, service_id, user_type } = Details
        //     console.log(Details)
        //     setUserInput({
        //         id,
        //         rule_title,
        //         rule_details,
        //         service_type,
        //         service_id,
        //         amount,
        //         // is_range,
        //         is_active: !is_active ? 0 : 1,
        //         expiry_date: new Date(expiry_date).toLocaleDateString('fr-CA'),
        //         user_type,
        //         start_range,
        //         end_range,
        //         sender_point,
        //         receiver_point,
        //         expiry_point,
        //         tire
        //     })
        //     // setServiceType({ value: { id: service_id, keyword: service_type }, label: service_type })
        // }).catch(err => {
        //     Error(err)
        //     console.log(err)
        // }).finally(() => {
        //     localStorage.setItem('usePMStoken', false)
        // })
        localStorage.setItem('useBMStoken', false) //for token management
        localStorage.setItem('usePMStoken', false) //for token management
        await useJwt.tierList().then(res => {
            console.log('tierList', res.data)
            settierList(res.data.payload.map(x => { return { value: x.id, label: x.tier } }))
            // setTableDataLoading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            // setTableDataLoading(false)
        })

        localStorage.setItem('useBMStoken', true)
        await useJwt.getServiceList().then(res => {
            console.log('getServiceList', res)
            setserviceList(res.data.map(x => { return { value: { id: x.serviceId, keyword: x.serviceKeyword }, label: x.serviceKeyword } }))
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                    localStorage.setItem('BMStoken', res.data.jwtToken)
                    localStorage.setItem("BMSCall", false)
                    setReset(!reset)
                }).catch(err => {
                    localStorage.setItem("BMSCall", false)
                    console.log(err)
                })
            } else {
                Error(err)
                console.log(err.response)
                localStorage.setItem('useBMStoken', false)
            }
        })
    }, [])

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // localStorage.setItem('usePMStoken', true)
        // const { id: rule_id, rule_title, rule_details, amount, start_range, end_range, expiry_date, is_active, expiry_point, tire, receiver_point, sender_point, is_range, service_type, service_id, user_type } = userInput
        // // let { service_type, service_id, user_type } = userInput
        // // service_id = serviceType.value.id
        // // service_type = serviceType.value.keyword
        // // user_type = userType.value

        // console.log({ rule_id, created_by, rule_title, rule_details, service_type, service_id, amount, expiry_date, expiry_point, tire, is_active: !!is_active, receiver_point, sender_point, start_range, end_range, user_type })
        // // return 0
        // setPointRuleloading(true)
        // useJwt.updateServiceRule({ rule_id, created_by, rule_title, rule_details, service_type, service_id, amount, expiry_date, expiry_point, tire, is_active: !!is_active, receiver_point, sender_point, start_range, end_range, user_type }).then((response) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     console.log(response)
        //     Success(response)
        //     history.push('/servicePointRuleList')
        // }).catch((error) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Error(error)
        //     console.log(error)
        // })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/servicePointRuleList' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Update Service Point Rule</CardTitle>

                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col lg='6' md="6" sm="6" >
                            <FormGroup>
                                <Label for="isrange">Rule Title<span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    type="text"
                                    name="rule_title"
                                    id='rule_title'
                                    value={userInput.rule_title}
                                    onChange={e => setUserInput({ ...userInput, rule_title: e.target.value, rule_details: e.target.value })}
                                    required
                                    placeholder="title here..."
                                />
                            </FormGroup>
                        </Col>
                        <Col lg='3' md="4" sm="6" >
                            <FormGroup>
                                <Label for="isrange">Service Type<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={serviceTypeRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={150}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={ServiceList.find(x => x.value.id === userInput.service_id)}
                                    // value={{ value: serviceType.value.id, label: serviceType.label }}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, service_id: selected.value.id, service_type: selected.label })
                                        setServiceType({ value: selected.value, label: selected.label })
                                    }}
                                    options={ServiceList}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => serviceTypeRef.current.select.focus()}
                                    value={userInput.service_id || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col>
                        <Col lg='3' md="4" sm="6" >
                            <FormGroup>
                                <Label for="tire">Tier</Label>
                                <Select
                                    ref={tireRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={150}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={tierList.find(x => x.value === userInput.tire)}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, tire: +selected.value })
                                    }}
                                    options={tierList}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => tireRef.current.select.focus()}
                                    value={userInput.tire || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col>
                        {!userInput.is_range && <>
                            <Col lg='3' md="4" sm="6" >
                                <FormGroup>
                                    <Label for="start_range">Start Range<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="start_range"
                                        id='start_range'
                                        min={0}
                                        value={userInput.start_range}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg='3' md="4" sm="6" >
                                <FormGroup>
                                    <Label for="end_range">End Range<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="end_range"
                                        id='end_range'
                                        min={userInput.start_range}
                                        value={userInput.end_range}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg='3' md="4" sm="6" >
                                <FormGroup>
                                    <Label for="isrange">User Type</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={userTypesList.find(x => x.value === userInput.user_type)}
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, user_type: selected.value })
                                            setUserType({ value: selected.value, label: selected.label })
                                        }}
                                        // isDisabled={true}
                                        options={userTypesList}
                                    />
                                </FormGroup>
                            </Col>

                            {(userType.value === 'r' || userType.value === 'b') ? <Col lg='3' md="4" sm="6" >
                                <FormGroup>
                                    <Label for="receiver_point">Receiver Point Per Amount<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="receiver_point"
                                        id='receiver_point'
                                        value={userInput.receiver_point}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col> : null}
                            {(userType.value === 's' || userType.value === 'b') ? <Col lg='3' md="4" sm="6" >
                                <FormGroup>
                                    <Label for="sender_point">Sender Point Per Amount<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="sender_point"
                                        id='sender_point'
                                        value={userInput.sender_point}
                                        onChange={handleChange}
                                        required
                                        min={0}
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col> : null}

                        </>}
                        <Col lg='3' md="4" sm="6" >
                            <FormGroup>
                                <Label for="amount">Point Conversion Rate<span style={{ color: 'red' }}>*</span></Label>
                                <div className="d-flex">
                                    <Input type="number"
                                        name="amount"
                                        id='amount'
                                        min={0}
                                        value={userInput.amount}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                    <Button.Ripple color='light' outline id='popTop' size='sm'>
                                        <Info color={'#7367f0'} size={22} />
                                    </Button.Ripple>
                                    <UncontrolledPopover placement='top' target='popTop'>
                                        <PopoverHeader>Popover Top</PopoverHeader>
                                        <PopoverBody>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, cumque.</PopoverBody>
                                    </UncontrolledPopover>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col lg='3' md="4" sm="6" >
                            <FormGroup>
                                <Label for="expiry_point">Point Expiry Days<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    min={0}
                                    name="expiry_point"
                                    id='expiry_point'
                                    value={userInput.expiry_point}
                                    onChange={handleChange}
                                    required
                                    placeholder="365"
                                />
                            </FormGroup>
                        </Col>
                        <Col lg='3' md="4" sm="6" >
                            <FormGroup>
                                <Label for="expiry_date">Expiry Date<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="date"
                                    name="expiry_date"
                                    id='expiry_date'
                                    value={userInput.expiry_date ? userInput.expiry_date : ''}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" className='mb-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    id='is_active'
                                    name='is_active'
                                    label='Is Active?'
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, is_active: true })
                                        } else {
                                            setUserInput({ ...userInput, is_active: false })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
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

export default Update