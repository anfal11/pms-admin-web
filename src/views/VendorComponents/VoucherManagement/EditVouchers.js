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

const EditVoucher = () => {
    const history = useHistory()
    const productRef = useRef()
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [EditVoucherloading, setEditVoucherloading] = useState(false)
    const [file, setFile] = useState(null)
    const [productList, setproductList] = useState([])
    const VoucherDetails = JSON.parse(localStorage.getItem('VoucherDetails'))
    const [filePrevw, setFilePrevw] = useState(VoucherDetails.VoucherImage)
    const [userInput, setUserInput] = useState({
        voucherType: VoucherDetails.VoucherType,
        productId: VoucherDetails.ProductId,
        voucherValue: VoucherDetails.VoucherValue,
        minExpAmount: VoucherDetails.MinExpAmount,
        voucherValidity: VoucherDetails.VoucherValidity,
        rewardPoint: VoucherDetails.RewardPoint,
        quota: VoucherDetails.Quota,
        expiryDate: new Date(VoucherDetails.ExpiryDate).toLocaleDateString('fr-CA'),
        createdBy: 'admin',
        terms: VoucherDetails.Terms,
        Description: VoucherDetails.Description,
        business_id: VoucherDetails.MerchantId,
        businessname: BusinessList.find(b => b.pms_merchantid === VoucherDetails.MerchantId).businessname
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
        getProductList(BusinessList.find(b => b.pms_merchantid === VoucherDetails.MerchantId).id)
    }, [])
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleBusinessChange = (selected) => {
        // getProductList(selected.value)
        getProductList(BusinessList.find(b => b.pms_merchantid === selected.value).id)
        setUserInput({ ...userInput, business_id: selected.value, productId: null })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const { voucherType, voucherValue, productId, minExpAmount, voucherValidity, expiryDate, rewardPoint, quota, createdBy, terms, Description, business_id } = userInput
        // const membershipid = BusinessList.find(b => b.id === business_id).pms_merchantid

        const formData = new FormData()
        formData.append("voucherImage", file !== null ? file : filePrevw)
        formData.append("voucherId", VoucherDetails.Id)
        formData.append("voucherValue", voucherValue)
        formData.append("productId", productId)
        formData.append("minExpAmount", minExpAmount)
        // formData.append("voucherType", voucherType)
        // formData.append("voucherValidity", voucherValidity)
        // formData.append("expiryDate", expiryDate)
        formData.append("rewardPoint", rewardPoint)
        formData.append("quota", quota)
        formData.append("modifiedBy", createdBy)
        formData.append("terms", terms)
        formData.append("description", Description)

        console.log(...formData)

        // setEditVoucherloading(true)
        // localStorage.setItem('usePMStoken', true)
        // useJwt.editVoucher(formData).then(res => {
        //     // console.log(res.data.data.voucherId)
        //     const voucherId = VoucherDetails.Id
        //     // useJwt.approveVoucher({ voucherId, approvedBy: "fahim" }).then(res => {
        //     //     localStorage.setItem('usePMStoken', false)
        //     //     setEditVoucherloading(false)
        //     //     toast.success('voucher updated successfully')
        //     //     console.log(res)
        //     // }).catch(err => {
        //     //     localStorage.setItem('usePMStoken', false)
        //     //     setEditVoucherloading(false)
        //     //     Error(err)
        //     //     console.log(err)
        //     // })
        //     localStorage.setItem('usePMStoken', false)
        //     setEditVoucherloading(false)
        // }).catch(err => {
        //     localStorage.setItem('usePMStoken', false)
        //     setEditVoucherloading(false)
        //     Error(err)
        //     console.log(err)
        // })
    }
    return (
        <>
            <Button.Ripple onClick={e => history.push('/AllVouchers')} color='primary' className='m-1'>
                <ChevronLeft size={12} /> Back
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Update Voucher</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        {BusinessList.length > 1 && <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Select a Business </Label>
                                <Select
                                    isDisabled={true}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={{ value: userInput.businessname, label: userInput.businessname }}
                                    onChange={handleBusinessChange}
                                    options={BusinessList.map(x => { return { value: x.id, label: x.businessname } })}
                                />
                            </FormGroup>
                        </Col>}
                        <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Voucher Type</Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: userInput.voucherType, label: userInput.voucherType }}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, voucherType: selected.value, productId: null })
                                    }}
                                    options={[{ value: 'product', label: 'product' }, { value: 'discount', label: 'discount' }, { value: 'cash', label: 'cash' }]}
                                    isDisabled={true}
                                />
                            </FormGroup>
                        </Col>
                        {userInput.voucherType === 'product' && <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Select a Product</Label>
                                <Select
                                    ref={productRef}
                                    theme={selectThemeColors}
                                    // maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: userInput.productId, label: userInput.productId }}
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, productId: selected.value })
                                    }}
                                    maxMenuHeight={150}
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
                                <Label for="voucherValue">Voucher Value</Label>
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
                                    disabled
                                    min={0}
                                    placeholder='0'
                                />
                            </FormGroup>
                        </Col>
                        <Col md='4' >
                            <FormGroup>
                                <Label for="expiryDate">Expiry Date</Label>
                                <Input type="date"
                                    disabled
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
                                <Label for="terms">Terms</Label>
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
                                <Label for="Description">Description</Label>
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
                            <Label for="voucherImage">Voucher Image</Label>
                            <div className='d-flex'>
                                <div className="file position-relative overflow-hidden mr-2">
                                    <div className='text-center p-1' style={{
                                        height: '102px',
                                        width: '102px',
                                        border: '1px dashed #d9d9d9',
                                        backgroundColor: "#fafafa"
                                    }}>
                                        <span ><Plus size={20} className='mb-1' /></span> <br />
                                        <span>Upload new</span>
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

                        <Col md="12" className='text-center'>
                            {
                                EditVoucherloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
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
        </>
    )
}

export default EditVoucher