import React, { Fragment, useEffect, useRef, useState } from 'react'
import {Minus, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft} from 'react-feather'
import {Card, CardHeader, CardTitle, Button, Table, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
const Status = [{value: 1, label: 'Active'}, {value: 0, label: 'InActive'}]


const CreatePointRule = () => {
    const history = useHistory()
    const productRef = useRef()
    const [businessList, setBusinessList] = useState([])
    const [businessid, setBusinessid] = useState('')
    const [selectedBusiness, setselectedBusiness] = useState({})
    const [isLoadingBussiness, setisLoadingBussiness] = useState(true)
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [btnTypeSubmit, setbtnTypeSubmit] = useState(true)
    const [productList, setproductList] = useState([])
    const [productDefaultValue, setproductDefaultValue] = useState({ value: '', label: 'select...'})
    const [isLoadingProduct, setisLoadingProduct] = useState(false)
    const [tierList, setTierList] = useState([{ value: null, label: 'All' }])

    const [RangeArray, setRanges] = useState([
        {
            skustartrange: '',
            skuendrange: '',
            skupoints: ''
        }
    ])
    const chkRangeInputValues = () => {
        let AllInputIsNotGiven = true
        for (let i = 0; i < RangeArray.length; i++) {
            const inputValues = Object.values(RangeArray[i])
            AllInputIsNotGiven = inputValues.includes('')
            if (AllInputIsNotGiven) {
                return
            }
        }
        setbtnTypeSubmit(AllInputIsNotGiven)
    }
    const [userInput, setUserInput] = useState({
        status: 1,
        skuamount: 0,
        skupoints: 0,
        skustartrange: 0,
        skuendrange: 0,
        product_id: null,
        isrange: false,
        title: '',
        business_id: null,
        Tier : null,
        startdate: '',
        expiryDate: '',
        point_expiry_interval_days: 365,
        productId: null
    })
    

    useEffect(async () => {

        const [business_id, Tier] = await Promise.all([

                useJwt2.customerBusinessList().then(res => {
                    const { payload } = res.data
                    const businessList = payload.map(x => { return { value: x.id, label: x.businessname } })
                    setBusinessList(businessList)
                    if (payload.length) {
                        setBusinessid(payload[0].id)
                        setselectedBusiness(businessList[0])
                        return payload[0].id

                    } else {
                        return null
                    }
                    
                }).catch(err => {
                    console.log(err.response)
                    Error(err)
                    return null
                }),

                useJwt2.tierList().then(res => {
                    console.log(res)
                    const { payload } = res.data
                    const tList = payload.map(x => { return { value: x.id, label: x.tier } })
                    setTierList([{ value: null, label: 'All' }, ...tList])
                    return null
                }).catch(err => {
                    console.log(err.response)
                    Error(err)
                    return null
                })
                
        ])
        setisLoadingBussiness(false)
        setUserInput({...userInput, business_id})

    }, [])


    const handleBusinessChange = (selected) => {
        setUserInput(userInput => ({
            ...userInput,
            business_id: selected.value
        }))  
        setBusinessid(selected.value)
        setselectedBusiness(selected)
    }

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
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

    console.log('RangeArray ', RangeArray)

    const onSubmit = (e) => {
        e.preventDefault()
        const { title, Tier, business_id, status, startdate, expiryDate, point_expiry_interval_days, skuamount, skupoints, skustartrange, skuendrange, productId, isrange } = userInput
        const items = []
        const body = {
            rule_name: title,
            is_sku_rule: false,
            is_global_rule: true,
            is_service_rule: false,
            bussiness_id: (+business_id),
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
                service_id: null,
                start_range: skuamount,
                end_range: null,
                point_receiver_type: 'sender',
                sender_reward_point: skupoints,
                receiver_reward_point: 0
            })
        } else {

            RangeArray.map(item => {
                items.push({
                    product_id: null,
                    service_id: null,
                    start_range: item.skustartrange,
                    end_range: item.skuendrange,
                    point_receiver_type: 'sender',
                    sender_reward_point: item.skupoints,
                    receiver_reward_point: 0
                })
            })
        }

        body.items = items

        console.log('body ', body)

        setPointRuleloading(true)
        useJwt2.pmsPointRuleCreate(body).then((res) => {
            setPointRuleloading(false)
            Success({data: {message : res.data.payload['msg']}})
            history.push('/overallPointRuleList')
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error.response)
        })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/overallPointRuleList' >
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

                    <Col md='4' >
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

                        <Col sm="4" >
                        <FormGroup>
                            <Label for="Business">Select a Business <span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                onChange={handleBusinessChange}
                                value={selectedBusiness}
                                options={businessList}
                                isLoading={isLoadingBussiness}
                            />
                        </FormGroup>
                        </Col>
                        <Col md='4' >
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
                    <Col sm="12" className='mb-1' >
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
                        {!userInput.isrange ? <Fragment><Col sm="6" >
                            <FormGroup>
                                <Label for="skuamount">SKU Amount<span style={{ color: 'red' }}>*</span></Label>
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
                        </Col><Col sm="6" >
                            <FormGroup>
                                <Label for="skupoints">SKU Points<span style={{ color: 'red' }}>*</span></Label>
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
                        </Col>  </Fragment> : null
                        }
                        {!!userInput.isrange && <Col md='12'>
                            <Table bordered responsive>
                                <thead style={{ background: 'white' }}>
                                    <tr>
                                        <th style={{ background: 'white' }}>SKU Start Range<span style={{ color: 'red' }}>*</span></th>
                                        <th style={{ background: 'white' }}>SKU End Range<span style={{ color: 'red' }}>*</span></th>
                                        <th style={{ background: 'white' }}>SKU Point<span style={{ color: 'red' }}>*</span></th>
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
                                                />
                                            </td>
                                            <td>
                                                <Button.Ripple size='sm' color='info' type={btnTypeSubmit ? 'submit' : "button"} onClick={e => {
                                                    // e.preventDefault()
                                                    let AllInputIsNotGiven = true
                                                    for (let i = 0; i < RangeArray.length; i++) {
                                                        const inputValues = Object.values(RangeArray[i])
                                                        AllInputIsNotGiven = inputValues.includes('')
                                                        if (AllInputIsNotGiven) {
                                                            return
                                                        }
                                                    }
                                                    // console.log(AllInputIsNotGiven)
                                                    setRanges([
                                                        ...RangeArray,
                                                        {
                                                            skustartrange: Number(RangeArray[RangeArray.length - 1].skuendrange) + 0.01,
                                                            skuendrange: '',
                                                            skupoints: ''
                                                        }
                                                    ])
                                                    setbtnTypeSubmit(true)
                                                }}>
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