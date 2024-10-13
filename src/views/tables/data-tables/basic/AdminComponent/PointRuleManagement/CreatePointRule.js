import React, { Fragment, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
    Minus, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, Table, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { divIcon } from 'leaflet'

const CreatePointRule = () => {
    const history = useHistory()
    const BusinessRef = useRef()
    const ProductRef = useRef()
    const user = JSON.parse(localStorage.getItem('userData'))
    const [BusinessList, setBusinessList] = useState([])
    const [merchantId, setMerchantId] = useState({})
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [btnTypeSubmit, setbtnTypeSubmit] = useState(true)
    const [productList, setproductList] = useState([])
    const [businessid, setBusinessid] = useState('')
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
        skuamount: 0,
        skupoints: 0,
        skustartrange: 0,
        skuendrange: 0,
        product_id: null,
        isrange: false
    })
    useEffect(() => {
        localStorage.setItem('usePMStoken', false)
        useJwt.customerBusinessList().then(res => {
            const { payload } = res.data
            setBusinessList(payload)
            setBusinessid(payload[0].id)
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])
    const getProductList = (business_id) => {
        setproductList([])
        const params = {
            page: 1,
            perPage: 50000,
            business_id,
            q: null,
            imageurlhave: null,
            searchValue: null
        }
        useJwt.productList(params).then(res => {
            console.log(res)
            const data = res.data.payload
            setproductList(data.data.map(p => { return { value: p.productid, label: p.productname } }))
        }).catch(err => {
            // Error(err)
            console.log(err)
        })
    }
    useEffect(() => {
        if (businessid !== '') {
            getProductList(businessid)
        }
    }, [businessid])
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // localStorage.setItem('usePMStoken', true)
        // const { skuamount, skupoints, skustartrange, skuendrange, product_id, isrange } = userInput
        // setPointRuleloading(true)
        // const merchantid = merchantId.merchantId
        // console.log(merchantid, { skuamount, skupoints, skustartrange, skuendrange, product_id, isrange, rangeData: RangeArray })
        // useJwt.setMyRules(merchantid, { createdby: user.username, skuamount, skupoints, skustartrange, skuendrange, product_id, isrange, rangeData: RangeArray }).then((response) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Success(response)
        //     history.push('/PointRuleListForAdmin')
        // }).catch((error) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Error(error)
        //     console.log(error.response)
        // })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/PointRuleListForAdmin' >
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
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="Businesses">Businesses<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={BusinessRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: merchantId.merchantId, label: merchantId.businessname ? merchantId.businessname : 'Select...' }}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, product_id: null })
                                        setMerchantId({ merchantId: selected.value.merchantId, businessname: selected.label })
                                        setBusinessid(selected.value.businessid)
                                    }}
                                    isLoading={!BusinessList.length}
                                    options={BusinessList?.map(b => { return { value: { businessid: b.id, merchantId: b.pms_merchantid }, label: b.businessname } })}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => BusinessRef.current.select.focus()}
                                    value={merchantId?.merchantId || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="Product">Select a Product<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={ProductRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={!!userInput.product_id ? productList.find(x => x.value === userInput.product_id) : { value: '', label: 'Select...' }}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, product_id: selected.value })
                                    }}
                                    // maxMenuHeight={150}
                                    options={productList}
                                    isLoading={!productList.length}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => ProductRef.current.select.focus()}
                                    value={userInput?.product_id || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col>
                        {!userInput.isrange ? <Col sm="6" >
                            <FormGroup>
                                <Label for="skupoints">SKU Points<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="skupoints"
                                    id='skupoints'
                                    value={userInput.skupoints}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col> : null}
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
                        {userInput.isrange ? null : <Col sm="6" >
                            <FormGroup>
                                <Label for="skuamount">SKU Amount<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="skuamount"
                                    id='skuamount'
                                    value={userInput.skuamount}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
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
                                        RangeArray.map((row, index) => <tr key={index}>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="skustartrange"
                                                    id={`skustartrange${index}`}
                                                    value={row.skustartrange}
                                                    min={index > 0 ? Number(RangeArray[index - 1].skuendrange) + 0.01 : 0}
                                                    onChange={e => {
                                                        chkRangeInputValues()
                                                        const newRangeArray = [...RangeArray]
                                                        newRangeArray[index] = {
                                                            ...newRangeArray[index],
                                                            skustartrange: parseFloat(e.target.value)
                                                        }
                                                        setRanges(newRangeArray)
                                                    }}
                                                    required
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="skuendrange"
                                                    id={`skuendrange${index}`}
                                                    value={row.skuendrange}
                                                    min={row.skustartrange || 0}
                                                    onChange={e => {
                                                        chkRangeInputValues()
                                                        const newRangeArray = [...RangeArray]
                                                        newRangeArray[index] = {
                                                            ...newRangeArray[index],
                                                            skuendrange: parseFloat(e.target.value)
                                                        }
                                                        setRanges(newRangeArray)
                                                    }}
                                                    required
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    name="skupoints"
                                                    id={`skupoints${index}`}
                                                    value={row.skupoints}
                                                    min={0}
                                                    onChange={e => {
                                                        chkRangeInputValues()
                                                        const newRangeArray = [...RangeArray]
                                                        newRangeArray[index] = {
                                                            ...newRangeArray[index],
                                                            skupoints: parseFloat(e.target.value)
                                                        }
                                                        setRanges(newRangeArray)
                                                    }}
                                                    required
                                                    placeholder="0"
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
                                        </tr>)
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