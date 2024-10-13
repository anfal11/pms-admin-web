import React, { Fragment, useEffect, useRef, useState } from 'react'
import {Minus, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft} from 'react-feather'
import {Card, CardHeader, CardTitle, Button, Table, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import useJwtBMS from '@src/auth/jwt/useJwtBMS'
import { Error, Success, ErrorMessage } from '../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
const Status = [{value: 1, label: 'Active'}, {value: 0, label: 'InActive'}]
const userTypesList = [{ value: 'sender', label: 'Sender' }, { value: 'receiver', label: 'Receiver' }, { value: 'both', label: 'Both Sender & Receiver' }]


const CreatePointRule = () => {
    const history = useHistory()
    const serviceTypeRef = useRef()
    const [isLoadingBussiness, setisLoadingBussiness] = useState(true)
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [btnTypeSubmit, setbtnTypeSubmit] = useState(true)
    const [serviceType, setServiceType] = useState({ value: '', label: 'select...' })
    const [tierList, setTierList] = useState([{ value: null, label: 'All' }])
    const [ServiceList, setserviceList] = useState([])

    const [RangeArray, setRanges] = useState([
        {
            skustartrange: '',
            skuendrange: '',
            skupoints: '',
            receiverpoint: '',
            usertype: 'sender'
        }
    ])
    const chkRangeInputValues = () => {
        let AllInputIsNotGiven = true
        for (let i = 0; i < RangeArray.length; i++) {
            if ((RangeArray[i]['usertype'] === 'sender' || RangeArray[i]['usertype'] === 'both') && RangeArray[i]['skupoints'] === '') {
                AllInputIsNotGiven = false
                return false
            } else if ((RangeArray[i]['usertype'] === 'receiver' || RangeArray[i]['usertype'] === 'both') && RangeArray[i]['receiverpoint'] === '') {
                AllInputIsNotGiven = false
                return false
            } else if (RangeArray[i]['skustartrange'] === '') {
                AllInputIsNotGiven = false
                return false
            } else if (RangeArray[i]['skuendrange'] === '') {
                AllInputIsNotGiven = false
                return false
            }
        }
        setbtnTypeSubmit(AllInputIsNotGiven)
        return AllInputIsNotGiven
    }
    const addmore = (e) => {
         e.preventDefault()
         console.log('chkRangeInputValues() ', chkRangeInputValues())
         if (!chkRangeInputValues()) {
            return 
         }
        setRanges([
            ...RangeArray,
            {
                skustartrange: Number(RangeArray[RangeArray.length - 1].skuendrange) + 0.01,
                skuendrange: '',
                skupoints: '',
                receiverpoint: '',
                usertype: 'sender'
            }
        ])
        setbtnTypeSubmit(true)
    }
    const [userInput, setUserInput] = useState({
        status: 1,
        skuamount: 0,
        skupoints: 0,
        skustartrange: 0,
        skuendrange: 0,
        receiverpoint: 0,
        usertype: 'sender',
        product_id: null,
        isrange: false,
        title: '',
        business_id: null,
        Tier : null,
        startdate: '',
        expiryDate: '',
        point_expiry_interval_days: 365,
        productId: null,
        service_id: null
    })
    
    useEffect(async () => {

        const [Service_list, Tier] = await Promise.all([

                useJwtBMS.getServiceList().then(res => {
                    console.log('getServiceList', res)
                    const modifiedData = res.data.map(x => { return { value: { id: x.serviceId, keyword: x.serviceKeyword }, label: x.serviceKeyword } })
                    return modifiedData
                
                }).catch(err => {
        
                    //Error(err)
                    console.log(err.response)
                    return []
                }),
                useJwt2.tierList().then(res => {
                    console.log(res)
                    const { payload } = res.data
                    const tList = payload.map(x => { return { value: x.id, label: x.tier } })
                    setTierList([{ value: null, label: 'All' }, ...tList])
                    return null
                }).catch(err => {
                    console.log(err.response)
                   // Error(err)
                    return null
                })
                
        ])
        setserviceList(Service_list)
        setUserInput({ ...userInput, service_id: Service_list.length ? Service_list[0].value.id : 0 })
        setServiceType(Service_list.length ? Service_list[0] : { value: '', label: 'select...' })
        setisLoadingBussiness(false)

    }, [])

    
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const handleServiceChange = (selected) => {
        setServiceType(selected)
        setUserInput({ ...userInput, service_id: selected.value.id })
    }

    const onChangeRangeValue = (e, index) => {

        chkRangeInputValues()
        const newRangeArray = [...RangeArray]
        newRangeArray[index] = {
            ...newRangeArray[index],
            [e.target.name]: parseFloat(e.target.value)
        }
        setRanges(newRangeArray)

    }

    const onChangeRangeValueUserType = (selected, index) => {
        const newRangeArray = [...RangeArray]
        newRangeArray[index] = {
            ...newRangeArray[index],
            usertype: selected.value
        }
        setRanges(newRangeArray)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const { service_id, title, receiverpoint, Tier, usertype, status, startdate, expiryDate, point_expiry_interval_days, skuamount, skupoints, skustartrange, skuendrange, productId, isrange } = userInput
        const items = []
        const body = {
            rule_name: title,
            is_sku_rule: false,
            is_global_rule: false,
            is_service_rule: true,
            bussiness_id: null,
            is_range: isrange,
            is_active: status === 1 || false,
            start_date: startdate,
            end_date: expiryDate,
            point_expiry_interval_days: (+point_expiry_interval_days),
            tire_id : Tier ? (+Tier) : Tier,
            items: []
        }
   
        if (!body.is_range) {
            items.push({
                product_id: null,
                service_id,
                start_range: (+skuamount),
                end_range: null,
                point_receiver_type: usertype,
                sender_reward_point: (+skupoints),
                receiver_reward_point: (+receiverpoint)
            })
        } else {

            RangeArray.map(item => {
                items.push({
                    product_id: null,
                    service_id,
                    start_range: (+item.skustartrange),
                    end_range: (+item.skuendrange),
                    point_receiver_type: item.usertype,
                    sender_reward_point: (+item.skupoints),
                    receiver_reward_point: (+item.receiverpoint)
                })
            })
        }

        body.items = items

        console.log('body ', body)

        setPointRuleloading(true)
        useJwt2.pmsPointRuleCreate(body).then((res) => {
            setPointRuleloading(false)
            Success({data: {message : res.data.payload['msg']}})
            history.push('/servicePointRuleList')
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error.response)
        })
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
                    <CardTitle tag='h4'>Set Rule</CardTitle>

                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">

                    <Col md='3' >
                        <FormGroup>
                            <Label for="voucherValue">Title</Label>
                            <Input type="text"
                                name="title"
                                id='title'
                                value={userInput.title}
                                onChange={handleChange}
                                required
                                placeholder='title'
                            />
                        </FormGroup>
                    </Col>

                        <Col sm="3" >
                        <FormGroup>
                            <Label for="Business">Service Type <span style={{ color: 'red' }}>*</span></Label>
                            <Select
                               ref={serviceTypeRef}
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                onChange={handleServiceChange}
                                value={serviceType}
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
                                    value={serviceType.value || ''}
                                    onChange={e => ''}
                                />
                        </FormGroup>
                        </Col>
                        <Col md='3' >
                        <FormGroup>
                            <Label for="Business">Select a Tier</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={tierList[0]}
                                onChange={(selected) => setUserInput({ ...userInput, Tier: selected.value })}
                                options={tierList}
                            />
                        </FormGroup>
                    </Col>
                    <Col md='3' >
                        <FormGroup>
                            <Label for="Business">Status</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={Status[0]}
                                onChange={(selected) => {
                                    setUserInput({ ...userInput, status: selected.value })
                                }}
                                options={Status}
                            />
                        </FormGroup>
                    </Col>
                        <Col md='3' >
                        <FormGroup>
                            <Label for="startdate">Start Date<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="date"
                                min={new Date().toLocaleDateString('fr-CA')}
                                name="startdate"
                                id='startdate'
                                value={userInput.startdate}
                                onChange={handleChange}
                                required
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='3' >
                        <FormGroup>
                            <Label for="expiryDate">Expiry Date<span style={{ color: 'red' }}>*</span></Label>
                            <Input type="date"
                                min={new Date().toLocaleDateString('fr-CA')}
                                name="expiryDate"
                                id='expiryDate'
                                value={userInput.expiryDate}
                                onChange={handleChange}
                                required
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                
                    <Col md='4' >
                        <FormGroup>
                            <Label for="point_expiry_interval_days">Point Expiry Interval (Days)</Label>
                            <Input type="number"
                                name="point_expiry_interval_days"
                                id='point_expiry_interval_days'
                                value={userInput.point_expiry_interval_days}
                                onChange={handleChange}
                                min={0}
                                placeholder='0'
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="12" className='mb-12' >
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    id='isrange'
                                    name='isrange'
                                    label='Is Range?'
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, isrange: true })
                                        } else {
                                            setUserInput({ ...userInput, isrange: false })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                        {!userInput.isrange ? <Fragment><Col sm="3" >
                            <FormGroup>
                                <Label for="skuamount">Minimum-Amount<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="skuamount"
                                    id='skuamount'
                                    value={userInput.skuamount}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                    placeholder="0"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                                <FormGroup>
                                    <Label for="isrange">Point Receiver Type</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={userTypesList[0]}
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, usertype: selected.value })
                                        }}
                                        // isDisabled={true}
                                        options={userTypesList}
                                    />
                                </FormGroup>
                            </Col>
                            {
                                (userInput.usertype === 'sender' || userInput.usertype === 'both') ? <Col sm="3">
                                <FormGroup>
                                    <Label for="skupoints">Sender Point Per Amount<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="skupoints"
                                        id='skupoints'
                                        value={userInput.skupoints}
                                        onChange={handleChange}
                                        required
                                        min={0}
                                        placeholder="0"
                                        step={1}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                </FormGroup>
                            </Col> : null
                            }
                            {
                                (userInput.usertype === 'receiver' || userInput.usertype === 'both') ? <Col sm="3" >
                                <FormGroup>
                                    <Label for="skupoints">Receiver Point Per Amount<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="receiverpoint"
                                        id='receiverpoint'
                                        value={userInput.receiverpoint}
                                        onChange={handleChange}
                                        required
                                        min={0}
                                        placeholder="0"
                                        step={1}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                </FormGroup>
                            </Col> : null
                            }
                          
                        </Fragment> : null
                        }
                        {!!userInput.isrange && <Col md='12'>
                            <Table bordered responsive>
                                <thead style={{ background: 'white' }}>
                                    <tr>
                                        <th style={{ background: 'white' }}>Start Range<span style={{ color: 'red' }}>*</span></th>
                                        <th style={{ background: 'white' }}>End Range<span style={{ color: 'red' }}>*</span></th>
                                        <th style={{ background: 'white' }}>Point Receiver Type</th>
                                        <th style={{ background: 'white' }}>Sender Point Per Amount<span style={{ color: 'red' }}>*</span></th>
                                        <th style={{ background: 'white' }}>Receiver Point Per Amount<span style={{ color: 'red' }}>*</span></th>
                                        <th style={{ background: 'white' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        RangeArray.map((row, index) => { 
                                            console.log('row ', row) 
                                            return <tr key={index}>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="skustartrange"
                                                    id={`skustartrange${index}`}
                                                    value={row.skustartrange}
                                                    min={index > 0 ? Number(RangeArray[index - 1].skuendrange) + 0.01 : 0}
                                                    onChange={(e) => onChangeRangeValue(e, index)}
                                                    required
                                                    placeholder="0"
                                                    onWheel={(e) => e.target.blur()}
                                                    step='any'
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="skuendrange"
                                                    id={`skuendrange${index}`}
                                                    value={row.skuendrange}
                                                    min={ row.skustartrange  || 0 }
                                                    step='any'
                                                    onChange={(e) => onChangeRangeValue(e, index)}
                                                    required
                                                    placeholder="0"
                                                    onWheel={(e) => e.target.blur()}
                                                />
                                            </td>
                                            <td>
                                                <Select
                                                    theme={selectThemeColors}
                                                    maxMenuHeight={200}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    defaultValue={userTypesList[0]}
                                                    onChange={(selected) => onChangeRangeValueUserType(selected, index)}
                                                    options={userTypesList}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="skupoints"
                                                    id={`skupoints${index}`}
                                                    value={row.skupoints}
                                                    min={0}
                                                    step={1}
                                                    onChange={(e) => onChangeRangeValue(e, index)}
                                                    required
                                                    placeholder="0"
                                                    onWheel={(e) => e.target.blur()}
                                                    disabled={row.usertype === 'receiver'}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="receiverpoint"
                                                    id={`receiverpoints${index}`}
                                                    value={row.receiverpoint}
                                                    min={0}
                                                    step={1}
                                                    onChange={(e) => onChangeRangeValue(e, index)}
                                                    required
                                                    placeholder="0"
                                                    onWheel={(e) => e.target.blur()}
                                                    disabled={row.usertype === 'sender'}
                                                />
                                            </td>
                                            <td>
                                                <Button.Ripple size='sm' color='info' type={btnTypeSubmit ? 'submit' : "button"} onClick={e => addmore(e)}>
                                                    <Plus size={15} />
                                                </Button.Ripple>&nbsp;&nbsp;
                                                {RangeArray.length > 1 && <Button.Ripple size='sm' color='danger' onClick={e => {
                                                    // e.preventDefault()
                                                    setRanges(RangeArray.filter((r, i) => i !== index))
                                                }}>
                                                    <Minus size={15} />
                                                </Button.Ripple>}
                                            </td>
                                        </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Col>}
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

export default CreatePointRule