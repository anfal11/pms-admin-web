import React, { Fragment, useEffect, useRef, useState } from 'react'
import {Minus, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft} from 'react-feather'
import {Card, CardHeader, CardTitle, Button, Table, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Skeleton } from 'antd'
import { selectThemeColors, transformInToFormObject } from '@utils'
const Status = [{value: 1, label: 'Active'}, {value: 0, label: 'InActive'}]


const CreatePointRule = ({refresh, setrefresh,  ruleeditdata, setruleeditdata}) => {
    const history = useHistory()
    const productRef = useRef()
    const [businessList, setBusinessList] = useState([])
    const [businessid, setBusinessid] = useState('')
    const [selectedBusiness, setselectedBusiness] = useState({})
    const [isLoadingBussiness, setisLoadingBussiness] = useState(true)
    const [isLoading, setisLoading] = useState(true)
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [btnTypeSubmit, setbtnTypeSubmit] = useState(true)
    const [productList, setproductList] = useState([])
    const [productDefaultValue, setproductDefaultValue] = useState({ value: null, label: 'select...'})
    const [isLoadingProduct, setisLoadingProduct] = useState(false)
    const [tierList, setTierList] = useState([{ value: null, label: 'All' }])
    const [selectedTier, setselectedTier] = useState({})
    const [selectedStatus, setselectedStatus] = useState(Status[0])

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
        productId: null,
        is_sku_rule: true
    })
    
    const back = () => {

        setruleeditdata(null)
    }

    const getProductList = (business_id) => {
        setproductList([])
        setisLoadingProduct(true)
        const params = {
            page: 1,
            perPage: 50000,
            business_id,
            q: null,
            imageurlhave: null,
            searchValue: null
        }
        useJwt.productList(params).then(res => {
            const data = res.data.payload
            const pData = data.data.map(p => { return { value: p.productid, label: p.productname } })
            setproductList(pData)
            setisLoadingProduct(false)
            if (pData.length) {
                setproductDefaultValue(pData[0])
                setUserInput(userInput => ({
                    ...userInput,
                    productId: pData[0].value
                  }))

            } else {
                setproductDefaultValue({value: null, label: 'Select...' })
                setUserInput(userInput => ({
                    ...userInput,
                    productId: null
                  }))
            }

        }).catch(err => {
            // Error(err)
            console.log(err)
            setproductDefaultValue({value: null, label: 'Select...' })
            setUserInput(userInput => ({
                ...userInput,
                productId: null
              }))
            setisLoadingProduct(false)
        })
    }

    useEffect(async () => {

        const productId = ruleeditdata['map_item'].length ? ruleeditdata['map_item'][0]['product_id'] : null

        const params = {
            page: 1,
            perPage: 50000,
            business_id: ruleeditdata['bussiness_id'],
            q: null,
            imageurlhave: null,
            searchValue: null
        }

        const [business_id, Tier, productinfoId] = await Promise.all([

                useJwt2.customerBusinessList().then(res => {
                    const { payload } = res.data
                    let defaultBussiness = null
                    const businessList = payload.map(x => { 
                         if ((+x.id) === (+ruleeditdata['bussiness_id'])) {
                            defaultBussiness = { value: x.id, label: x.businessname } 
                         }
                        return { value: x.id, label: x.businessname } 
                    })
                    console.log('defaultBussiness ', defaultBussiness)
                    setBusinessList(businessList)
                    if (payload.length) {
                        //setBusinessid(payload[0].id)
                        setselectedBusiness(defaultBussiness ? defaultBussiness : businessList[0])
                        return defaultBussiness ? defaultBussiness.value : payload[0].id

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
                    const { payload } = res.data, oldtire_id = ruleeditdata['tire_id'] ? (+ruleeditdata['tire_id']) : null
                    let defaultTier = { value: null, label: 'All' }
                    const tList = payload.map(x => { 

                        if (oldtire_id && (+x.id) === oldtire_id) {
                            defaultTier = { value: (+x.id), label: x.tier } 
                        } 
                        return { value: (+x.id), label: x.tier } 
                    })
                    setTierList([{ value: null, label: 'All' }, ...tList])
                    setselectedTier(defaultTier)
                    return null
                }).catch(err => {
                    console.log(err.response)
                    Error(err)
                    return null
                }),

                useJwt.productList(params).then(res => {
                    const data = res.data.payload
                    let defalutProduct = null, p_id = null
                    const pData = data.data.map(p => { 
                        if ((+p.productid) === (+productId)) {
                            defalutProduct = { value: p.productid, label: p.productname } 
                        }
                        return { value: p.productid, label: p.productname } 
                    })
                    setproductList(pData)
                    setisLoadingProduct(false)
                    if (pData.length) {
                        setproductDefaultValue(defalutProduct ? defalutProduct : pData[0])
                        p_id = defalutProduct ? defalutProduct.value : pData[0].value
        
                    } else {
                        setproductDefaultValue({value: null, label: 'Select...' })
                        p_id = null
                    }

                    return p_id
        
                }).catch(err => {
                    // Error(err)
                    console.log(err)
                    setproductDefaultValue({value: null, label: 'Select...' })
                    return null
                })
                
        ])

        setisLoadingBussiness(false)
        setUserInput(userInput => ({
            ...userInput,
            ...ruleeditdata,
            title: ruleeditdata['rule_name'],
            isrange: ruleeditdata['is_range'],
            status: ruleeditdata['is_active'] ? 1 : 0,
            business_id,
            Tier : ruleeditdata['tire_id'],
            startdate: ruleeditdata['start_date'] ? ruleeditdata['start_date'].split('T')[0] : "",
            expiryDate: ruleeditdata['end_date'] ? ruleeditdata['end_date'].split('T')[0] : "",
            productId: productinfoId,
            skuamount: ruleeditdata['is_range'] ? 0 : (ruleeditdata['map_item'].length ? ruleeditdata['map_item'][0]['start_range'] : 0),
            skupoints: ruleeditdata['is_range'] ? 0 : (ruleeditdata['map_item'].length ? ruleeditdata['map_item'][0]['sender_reward_point'] : 0)
          }))

          if (!ruleeditdata['is_active']) {
            setselectedStatus({value: 0, label: 'InActive'})
          }

        if (ruleeditdata['is_range'] && ruleeditdata['map_item'].length) {

            const rangeData = ruleeditdata['map_item'].map(item => {
                return {
                    skustartrange: item.start_range,
                    skuendrange: item.end_range,
                    skupoints: item.sender_reward_point
                }
            })

            setRanges(rangeData)
        }

        setisLoading(false)

    }, [])


    const handleBusinessChange = (selected) => {
        setUserInput(userInput => ({
            ...userInput,
            business_id: selected.value
        }))  
        getProductList(selected.value)
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
        const { title, Tier, business_id, status, startdate, expiryDate, point_expiry_interval_days, skuamount, skupoints, productId, isrange } = userInput
        const items = []
        const body = {
            rule_id: ruleeditdata['id'],
            rule_name: title,
            is_sku_rule: true,
            is_global_rule: false,
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
                product_id: productId ? (+productId) : productId,
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
                    product_id: productId ? (+productId) : productId,
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
        useJwt2.pmsPointRuleEdit(body).then((res) => {
            Success({data: {message : res.data.payload['msg']}})
            setrefresh(refresh + 1)
            setruleeditdata(null)
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error.response)
        })
    }
    return (
        <Fragment>

            {
                isLoading ? <Fragment> <Skeleton active /> <Skeleton active /> <Skeleton active /> </Fragment> : <Fragment>
                            <Button.Ripple className='mb-1' color='primary' onClick={(e) => back()} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Edit Rule</CardTitle>

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
                        <Col sm="4" >
                        <FormGroup>
                            <Label for="Business">Select a Product<span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                ref={productRef}
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                value={productDefaultValue}
                                onChange={(selected) => {
                                    setproductDefaultValue(selected)
                                    setUserInput({ ...userInput, productId: selected.value })
                                }}
                                // maxMenuHeight={150}
                                options={productList}
                                isLoading={isLoadingProduct}
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
                            onFocus={e => productRef.current.select.focus()}
                            value={userInput.productId || ''}
                            onChange={e => ''}
                        />
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
                            <Label for="Business">Select a Tier</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={selectedTier}
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
                                defaultValue={selectedStatus}
                                onChange={(selected) => {
                                    setUserInput({ ...userInput, status: selected.value })
                                }}
                                options={Status}
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
                    <Col sm="12" className='mb-1' >
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    id='isrange'
                                    name='isrange'
                                    label='Is Range?'
                                    checked={userInput.isrange}
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
            }

        </Fragment>
    )
}

export default CreatePointRule