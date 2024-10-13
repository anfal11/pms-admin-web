import React, { useEffect, useState, useRef, Fragment } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'

import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import UploadVoucherCustomCode  from './UploadVoucherCustomCode'
import ImageUpload from './ImageUpload'
import { VoucherStatusSet } from '../../statusdb'
import { Skeleton } from 'antd'


const VoucherDetailsView = ({voucherid, setisviewDetails, setvoucherid}) => {

    const [isLoading, setisLoading] = useState(true)
    const [file, setFile] = useState(null)
    const [filePrevw, setFilePrevw] = useState(null)

    const [countryList, setcountryList] = useState([])
    const [countryDefaultValue, setcountryDefaultValue] = useState({ value: '', label: 'select...'})

    const [townList, settownList] = useState([])
    const [selectedTowns, setselectedTowns] = useState([])

    const [country_name, setcountry_name] = useState('')
    const [townnames, settownnames] = useState([])

    const [userInput, setUserInput] = useState({
        voucherType: "",
        productId: null,
        voucherValue: 1,
        minExpAmount: 0,
        voucherValidity: 1,
        rewardPoint: 0,
        quota: 1,
        status: 1,
        expiryDate: '',
        startdate: null,
        terms: '',
        Description: '',
        is_product_voucher : 1,
        is_system_voucher: false,
        purchaseAmount: 0,
        business_id: null,
        is_local: false,
        product_voucher_map_id: null,
        Tier: null,
        islocationwise: false,
        lat: null,
        long: null,
        isglobal: true,
        country: null,
        distancecover: 0,
        town: [],
        customcode: false,
        customcode_url: "",
        message:""

    })

    const back = () => {

        setisviewDetails(false)
        setvoucherid(null)
    }

    const getcityList = (country_id) => {
        return useJwt2.cityList({country_id}).then(res => {
            const { payload } = res.data
            console.log(res)
            return payload
            
        }).catch(err => {
            console.log(err.response)
            Error(err)
            return {}
        })
    }

    useEffect(async() => {
        const [details, country] = await Promise.all([ 
                useJwt2.pmsVoucherDetail({voucherid}).then(async res => {
                const { payload } = res.data
                const modifyData = {
                    ...userInput,
                    ...payload,
                    voucherType: payload.vouchertype,
                    voucherValue: payload.vouchervalue,
                    minExpAmount: payload.minexpamount,
                    voucherValidity: payload.vouchervalidity,
                    rewardPoint: payload.rewardpoint,
                    expiryDate: payload.expirydate,
                    Description: payload.description,
                    is_product_voucher : payload.vouchertype === 'product',
                    is_system_voucher: payload.is_system_voucher,
                    purchaseAmount: payload.price,
                    is_local: !payload.islocationwise && !payload.isglobal
                    //islocationwise: payload.islocationwise,
                    //country: payload.vouchertype,
                    //distancecover: payload.vouchertype,
                    //town: payload.vouchertype,
                    //customcode: false
                }
                setUserInput(modifyData)
                setFilePrevw(payload.voucherimage)
                setisLoading(false)
                return modifyData
            
            }).catch(err => {
                setisLoading(false)
                console.log(err.response)
                Error(err)
                return {}
            }),

            useJwt2.countryList().then(res => {
                const { payload } = res.data
                console.log(res)
                return payload
                
            }).catch(err => {
                console.log(err.response)
                Error(err)
                return {}
            })
        ])
        
        if (!details.isglobal && !details.islocationwise && details.is_local) {

            const country_id = (+details['country'])
            country.some(item => {
                if (item.id === country_id) {
                    setcountry_name(item.name)
                    return true
                }
                return false
            })
    
            const townids = details['town'].map(item => (+item))
            const townlist = await getcityList(country_id)
            const result = townlist.filter((town => townids.includes(town.id)))
            const townlistnames = result.map(item => item.name)
            settownnames(townlistnames)
        }
        
    }, [])

    return (
        <Fragment>
            {
                isLoading ? <Fragment> <Skeleton active /> <Skeleton active /> <Skeleton active /> </Fragment> :    <Fragment> <Button.Ripple className='mb-1' color='primary' onClick={(e) => back()} >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Voucher Details</CardTitle>
                    <CustomInput disabled type='switch' id='is_system_voucher' inline label='Is-System-Voucher' checked={userInput.is_system_voucher}  />
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} autoComplete="off">
                        <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Business Name </Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.businessname || ''}
                            />
                            </FormGroup>
                        </Col>
                        <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Voucher Type</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.voucherType || ''}
                            />
                            </FormGroup>
                        </Col>
                        {userInput.voucherType === 'product' && <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Product Name </Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.productname || ''}
                            />
                            </FormGroup>

                        </Col>}
                        <Col md='4' >
                            <FormGroup>
                                <Label for="voucherValue">Voucher Value</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.voucherValue || '0'}
                            />
                            </FormGroup>
                        </Col>
                        { !userInput.is_system_voucher && <Col md='4' >
                            <FormGroup>
                                <Label for="minExpAmount">Minimum Exp Amount</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.minExpAmount || '0'}
                            />

                            </FormGroup>
                        </Col> }
                        <Col md='4' >
                            <FormGroup>
                                <Label for="voucherValidity">Voucher Validity (Days)</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.voucherValidity || '0'}
                            />

                            </FormGroup>
                        </Col>
                        <Col md='4' >
                            <FormGroup>
                                <Label for="startdate">Start Date</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.startdate || ''}
                            />

                            </FormGroup>
                        </Col>
                        <Col md='4' >
                            <FormGroup>
                                <Label for="expiryDate">Expiry Date</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.expiryDate || ''}
                            />

                            </FormGroup>
                        </Col>

                        { !userInput.is_system_voucher && <Fragment> <Col md='4' >
                            <FormGroup>
                                <Label for="rewardPoint">Reward Point</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.rewardPoint || '0'}
                            />

                            </FormGroup>
                        </Col> 
                        <Col md='4' >
                            <FormGroup>
                                <Label for="purchaseAmount">Purchase Amount(Buy Cash)</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.purchaseAmount || '0'}
                            />

                            </FormGroup>
                        </Col> </Fragment> }

                        <Col md='4' >
                            <FormGroup>
                                <Label for="quota">Quota</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.quota || '0'}
                            />

                            </FormGroup>
                        </Col>
                        <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Tier</Label>
                                <Input 
                                type="text"
                                disabled
                                value={userInput.tier_name || ''}
                            />
                            </FormGroup>
                        </Col>
                        
                        <Col md='4' >
                            <FormGroup>
                                <Label for="Business">Status</Label>
                                <Input 
                                type="text"
                                disabled
                                value={VoucherStatusSet(userInput['status']).title}
                            />
                            </FormGroup>
                        </Col>

                        {
                            !userInput.is_system_voucher && <Fragment>

                        <Col md='12'>
                            <Row>
                                <Col md='4' >
                                <FormGroup>
                                    <CustomInput disabled type='switch' id='isglobal' inline label='Is-Global' checked={userInput.isglobal}  />
                                </FormGroup>
                            </Col>

                            {
                                (!userInput.isglobal && !userInput.islocationwise && userInput.is_local) ? <Fragment>

                                    <Col md='4' >
                                            <FormGroup>
                                                <Label for="country">Country</Label>
                                                <Input 
                                                type="text"
                                                disabled
                                                value={ country_name || ''}
                                            />
                                            </FormGroup>
                                        </Col>

                                        <Col md='4' >
                                            <FormGroup>
                                                <Label for="town">Town</Label>
                                                <Input 
                                                type="text"
                                                disabled
                                                value={ (townnames.length && townnames.toString()) || ''}
                                            />
                                            </FormGroup>
                                        </Col>

                                </Fragment> : null
                            }

                            </Row>
                        </Col>

                        <Col md='12'>
                            <Row>
                                <Col md='3' >
                                <FormGroup>
                                    <CustomInput disabled type='switch' id='islocationwise' inline label='Is-Locationwise' checked={userInput.islocationwise}  />
                                </FormGroup>
                            </Col>
                            {
                                userInput.islocationwise ? <Fragment>

                                        <Col md='3' >
                                            <FormGroup>
                                                <Label for="lat">Lat</Label>
                                                <Input 
                                                type="text"
                                                disabled
                                                value={ userInput['lat'] || ''}
                                            />

                                            </FormGroup>
                                        </Col>
                                        <Col md='3' >
                                            <FormGroup>
                                                <Label for="quota">Long</Label>
                                                <Input 
                                                type="text"
                                                disabled
                                                value={ userInput['long'] || ''}
                                            />
                                            </FormGroup>
                                        </Col>
                                        <Col md='3' >
                                            <FormGroup>
                                                <Label for="distancecover">Distance-cover(KM)</Label>
                                                <Input 
                                                type="text"
                                                disabled
                                                value={ userInput['distancecover'] || '0'}
                                            />
        
                                            </FormGroup>
                                        </Col>
                                </Fragment> : null
                            }

                            </Row>
                        </Col>
                            </Fragment>
                        }

                        <Col md='6' >
                            <FormGroup>
                                <Label for="terms">Terms</Label>
                                <Input type="textarea"
                                    name="terms"
                                    id='terms'
                                    value={userInput.terms}
                                    disabled
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
                                    disabled
                                />
                            </FormGroup>
                        </Col>

                        <Col md='12' >
                            <Label for="voucherImage">Voucher Image</Label>
                            <div>
                                <img src={filePrevw} height={200} />
                            </div>
                        </Col>

                        <Col md='12' style={{marginTop: 20}}>
                                <FormGroup>
                                    <CustomInput disabled type='switch' id='customcode' inline label='Upload-Customcode' checked={userInput.customcode}  />
                                </FormGroup>
                        </Col>
                    
                        <Col md='12'>
                        {
                            userInput.customcode && <a href={userInput.customcode_url} target='_blank' > {userInput.customcode_url} </a>
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

export default VoucherDetailsView