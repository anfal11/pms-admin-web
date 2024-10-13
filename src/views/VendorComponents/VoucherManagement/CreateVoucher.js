import React, { useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { toast } from 'react-toastify'

const CreateVoucher = () => {
    const user = JSON.parse(localStorage.getItem('userData'))
    const productRef = useRef()
    const history = useHistory()
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [CreateVoucherloading, setCreateVoucherloading] = useState(false)
    const [file, setFile] = useState(null)
    const [filePrevw, setFilePrevw] = useState(null)
    const [productList, setproductList] = useState([])
    const [productDefaultValue, setproductDefaultValue] = useState({ value: '', label: 'select...'})
    const [reedemType, setReedemType] = useState({ value: 0, label: ''})
    const [userInput, setUserInput] = useState({
        voucherType: 'product',
        productId: null,
        voucherValue: 1,
        minExpAmount: 0,
        voucherValidity: 0,
        rewardPoint: 0,
        quota: 1,
        expiryDate: '',
        createdBy: user.id,
        terms: '',
        Description: '',
        is_product_voucher : 1,
        purchaseAmount: 0,
        business_id: BusinessList[0].id,
        product_voucher_map_id: null
    })
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
            const data = res.data.payload
            setproductList(data.data.map(p => { return { value: p.productid, label: p.productname } }))
        }).catch(err => {
            // Error(err)
            console.log(err)
        })

    }
    useEffect(() => {
        getProductList(BusinessList[0].id)
    }, [])
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleBusinessChange = (selected) => {
        getProductList(selected.value)
        setUserInput({ ...userInput, business_id: selected.value, productId: null })
        setproductDefaultValue({ value: '', label: 'Select...' })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const { voucherType, voucherValue, productId, minExpAmount, voucherValidity, expiryDate, is_product_voucher, purchaseAmount, rewardPoint, quota, createdBy, terms, Description, business_id } = userInput
        let { product_voucher_map_id } = userInput
        const membershipid = BusinessList.find(b => b.id === business_id).pms_merchantid
        setCreateVoucherloading(true)
        const formData1 = new FormData()
        formData1.append('image', file)
        
      
        await useJwt.singleFileupload(formData1).then(async res => {
            console.log(res)
                const data = {
                    product_optional_image: [await res.data.payload],
                    productname: 'voucher product',
                    categoryid : 49,
                    productdetails: Description,
                    optional_data: [{product_weight:1, product_quantity:quota, product_price:purchaseAmount, delivery_time:'2-3 weeks'}],
                    business_id: BusinessList[0].id,
                    is_voucher_product: true 
                }
                console.log(data)
                await useJwt.addProduct(data).then(response => {
                    console.log(response) 
                    product_voucher_map_id = response.data.payload.productid
                }).catch(err => {
                    console.log(err.response)
                })

        }).catch(e => {
            console.log(e.response)
        })

        const formData = new FormData()
        formData.append("voucherImage", file)
        formData.append("membershipid", membershipid)
        formData.append("voucherType", voucherType)
        formData.append("voucherValue", voucherValue)
        formData.append("productId", productId)
        formData.append("minExpAmount", minExpAmount)
        formData.append("voucherValidity", voucherValidity)
        formData.append("expiryDate", expiryDate)
        formData.append("rewardPoint", rewardPoint)
        formData.append("price", purchaseAmount)
        formData.append("quota", quota)
        formData.append("createdBy", createdBy)
        formData.append("terms", terms)
        formData.append("description", Description)
        formData.append("is_product_voucher", is_product_voucher)
        formData.append("product_voucher_map_id", product_voucher_map_id)

        // console.log(...formData)
        // localStorage.setItem('usePMStoken', true)
        // useJwt.createVoucher(formData).then(res => {
        //     localStorage.setItem('usePMStoken', false)
        //     setCreateVoucherloading(false)
        //     toast.success('voucher created successfully')
        //     console.log(res)
        //     history.push('/AllVouchers')
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     setCreateVoucherloading(false)
        //     Error(err)
        //     console.log(err)
        // })
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Create New Voucher</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: '15px' }}>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    {BusinessList.length > 1 && <Col md='4' >
                        <FormGroup>
                            <Label for="Business">Select a Business<span style={{color:'red'}}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={BusinessList.map(x => { return { value: x.id, label: x.businessname } })[0]}
                                onChange={handleBusinessChange}
                                options={BusinessList.map(x => { return { value: x.id, label: x.businessname } })}
                            />
                        </FormGroup>
                    </Col>}
                    <Col md='4' >
                        <FormGroup>
                            <Label for="Business">Voucher Type<span style={{color:'red'}}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                value={{ value: userInput.voucherType, label: userInput.voucherType }}
                                onChange={(selected) => {
                                    setproductDefaultValue({ value: '', label: 'Select...' })
                                    setUserInput({ ...userInput, voucherType: selected.value, productId: null })
                                }}
                                options={[{ value: 'product', label: 'product' }, { value: 'discount', label: 'discount' }, { value: 'cash', label: 'cash' }]}
                            />
                        </FormGroup>
                    </Col>
                    {userInput.voucherType === 'product' && <Col md='4' >
                        <FormGroup>
                            <Label for="Business">Select a Product<span style={{color:'red'}}>*</span></Label>
                            <Select
                                ref={productRef}
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                value={productDefaultValue}
                                onChange={(selected) => {
                                    setproductDefaultValue({ value: selected.value, label: selected.label })
                                    setUserInput({ ...userInput, productId: selected.value })
                                }}
                                // maxMenuHeight={150}
                                options={productList}
                                isLoading={!productList.length}
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
                    </Col>}
                    <Col md='4' >
                        <FormGroup>
                            <Label for="voucherValue">Voucher Value<span style={{color:'red'}}>*</span></Label>
                            <Input type="number"
                                name="voucherValue"
                                id='voucherValue'
                                value={userInput.voucherValue}
                                onChange={handleChange}
                                required
                                min={1}
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='4' >
                        <FormGroup>
                            <Label for="minExpAmount">Minimum Exp Amount</Label>
                            <Input type="number"
                                name="minExpAmount"
                                id='minExpAmount'
                                value={userInput.minExpAmount}
                                onChange={handleChange}
                                required
                                min={0}
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='4' >
                        <FormGroup>
                            <Label for="voucherValidity">Voucher Validity</Label>
                            <Input type="number"
                                name="voucherValidity"
                                id='voucherValidity'
                                value={userInput.voucherValidity}
                                onChange={handleChange}
                                required
                                min={0}
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='4' >
                        <FormGroup>
                            <Label for="expiryDate">Expiry Date<span style={{color:'red'}}>*</span></Label>
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
                            <Label for="rewardPoint">Reward Point</Label>
                            <Input type="number"
                                name="rewardPoint"
                                id='rewardPoint'
                                value={userInput.rewardPoint}
                                onChange={handleChange}
                                required
                                min={0}
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='4' >
                        <FormGroup>
                            <Label for="purchaseAmount">Purchase Amount</Label>
                            <Input type="number"
                                name="purchaseAmount"
                                id='purchaseAmount'
                                value={userInput.purchaseAmount}
                                onChange={handleChange}
                                required
                                min={0}
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='4' >
                        <FormGroup>
                            <Label for="quota">Quota</Label>
                            <Input type="number"
                                name="quota"
                                id='quota'
                                value={userInput.quota}
                                onChange={handleChange}
                                required
                                min={1}
                                placeholder='0'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='6' >
                        <FormGroup>
                            <Label for="terms">Terms<span style={{color:'red'}}>*</span></Label>
                            <Input type="textarea"
                                name="terms"
                                id='terms'
                                value={userInput.terms}
                                onChange={handleChange}
                                required
                                placeholder='terms & conditions'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='6' >
                        <FormGroup>
                            <Label for="Description">Description<span style={{color:'red'}}>*</span></Label>
                            <Input type="textarea"
                                name="Description"
                                id='Description'
                                value={userInput.Description}
                                onChange={handleChange}
                                required
                                placeholder='Voucher Description...'
                            />
                        </FormGroup>
                    </Col>
                    <Col md='12' >
                        <Label for="voucherImage">Voucher Image<span style={{color:'red'}}>*</span></Label>
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
                                    required
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

                    <Col md="12" className='text-center'>
                        {
                            CreateVoucherloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
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
    )
}

export default CreateVoucher