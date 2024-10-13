import React, { useEffect, useState, useRef, Fragment } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Table, Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'

import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import UploadVoucherCustomCode  from './UploadVoucherCustomCode'
import ImageUpload from './ImageUpload'
import { VoucherStatusSet } from '../../statusdb'
import { Skeleton } from 'antd'

const dataLabel = [
                    'Title', 'Bussiness Name', 'Is System Voucher', 'Voucher Type', 'Product Name', 'Voucher Value', 'Minimum Exp Amount', 'Voucher Validity (Days)', 'Start Date',
                    'Expiry Date', 'Reward Point', 'Purchase Amount(Buy Cash)', 'Quota', 'Tier', 'Status', 'Is-Global', 'Country', 'Town', 'Is-Locationwise', 'Lat', 'Long',
                    'Distance-cover(KM)', 'Terms', 'Description', 'Message', 'Voucher Image', 'Custom-Code', 'Customcode-url'
                ]

const dataKey = [
                    'title', 'businessname', 'is_system_voucher', 'voucherType', 'productname', 'voucherValue', 'minExpAmount', 'voucherValidity', 'startdate',
                    'expiryDate', 'rewardPoint', 'purchaseAmount', 'quota', 'tier_name', 'status', 'isglobal', 'country_name', 'townnames', 'islocationwise', 'lat', 'long',
                    'distancecover', 'terms', 'Description', 'message', 'voucherimage', 'customcode', 'customcode_url'
                ]

const VoucherTempDetailsView = ({voucherid, setisviewDetails, setvoucherid}) => {

    const [isLoading, setisLoading] = useState(true)
    const [file, setFile] = useState(null)
    const [filePrevw, setFilePrevw] = useState(null)

    const [countryList, setcountryList] = useState([])
    const [countryDefaultValue, setcountryDefaultValue] = useState({ value: '', label: 'select...'})

    const [townList, settownList] = useState([])
    const [selectedTowns, setselectedTowns] = useState([])

    const [country_name, setcountry_name] = useState('')
    const [townnames, settownnames] = useState([])
    const [newdata, setnewdata] = useState({})
    const [operation, setoperation] = useState('')

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
        message: ""

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

        setisLoading(true)

        const [details, country, tempdetails] = await Promise.all([ 
                useJwt2.pmsVoucherDetail({voucherid}).then(async res => {
                const { payload } = res.data
                console.log('main ', payload)
                if (payload) {

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
                        is_system_voucher: payload.is_system_voucher ? 'True' : 'False',
                        purchaseAmount: payload.price,
                        is_local: !payload.islocationwise && !payload.isglobal,
                        islocationwise: payload.islocationwise ? 'True' : 'False',
                        isglobal: payload.isglobal ? 'True' : 'False',
                        customcode: payload.customcode ? 'True' : 'False',
                        status: payload.status === 1 ? 'Active' : 'In-Active'
                        //distancecover: payload.vouchertype,
                        //town: payload.vouchertype,
                        //customcode: false
                    }
                    setUserInput(modifyData)
                    setFilePrevw(payload.voucherimage)
                   
                    return modifyData

                } else {

                    setUserInput({})
                    return userInput
                }
            
            }).catch(err => {

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
            }),

            useJwt2.pmsTempVoucherDetail({voucherid}).then(async res => {
                const { payload } = res.data
                console.log('temp payload ', payload)
                const modifyData = {
                    ...payload,
                    voucherType: payload.vouchertype,
                    voucherValue: payload.vouchervalue,
                    minExpAmount: payload.minexpamount,
                    voucherValidity: payload.vouchervalidity,
                    rewardPoint: payload.rewardpoint,
                    expiryDate: payload.expirydate,
                    Description: payload.description,
                    is_product_voucher : payload.vouchertype === 'product',
                    is_system_voucher: payload.is_system_voucher ? 'True' : 'False',
                    purchaseAmount: payload.price,
                    is_local: !payload.islocationwise && !payload.isglobal,
                    islocationwise: payload.islocationwise ? 'True' : 'False',
                    isglobal: payload.isglobal ? 'True' : 'False',
                    //distancecover: payload.vouchertype,
                    //town: payload.vouchertype,
                    customcode: payload.customcode ? 'True' : 'False',
                    status: payload.status === 1 ? 'Active' : 'In-Active'
                }
                return modifyData
            
            }).catch(err => {
                console.log(err.response)
                Error(err)
                return {}
            })
        ])
        
        if (details.isglobal === 'False' && details.islocationwise === 'False' && details.is_local) {

            const country_id = (+details['country'])
            country.some(item => {
                if (item.id === country_id) {
                    details['country_name'] = (item.name)
                    return true
                }
                return false
            })
    
            const townids = details['town'].map(item => (+item))
            const townlist = await getcityList(country_id)
            const result = townlist.filter((town => townids.includes(town.id)))
            const townlistnames = result.map(item => item.name)
            details['townnames'] = townlistnames.length ? townlistnames.toString() : ""
        }

        if (tempdetails.isglobal === 'False' && tempdetails.islocationwise === 'False' && tempdetails.is_local) {

            const country_id = (+tempdetails['country'])
            country.some(item => {
                if (item.id === country_id) {
                    tempdetails['country_name'] = (item.name)
                    return true
                }
                return false
            })
    
            const townids = tempdetails['town'].map(item => (+item))
            const townlist = await getcityList(country_id)
            const result = townlist.filter((town => townids.includes(town.id)))
            const townlistnames = result.map(item => item.name)
            tempdetails['townnames'] = townlistnames.length ? townlistnames.toString() : ""
        }

        setoperation(tempdetails['action'])
        setnewdata(tempdetails)

        setisLoading(false)
        
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
                    <CardTitle tag='h4'>Voucher Temp Details</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                   <Table hover responsive> 
                    <thead>
                        <tr>
                        <th>Parameter</th>
                        <th>Old Data</th>
                        <th>New Data</th>
                        </tr>
                    </thead>
                    {/* background-color: #f9c9c9 */}
                    <tbody>
                        {
                            dataLabel.map((item, index) => <tr key={index + 1} style={{backgroundColor: (userInput[dataKey[index]] !== newdata[dataKey[index]] && operation !== 'Insert') ? '#f9c9c9' : null}}>
                                <td style={{fontWeight: 'bold'}}>{item}</td>
                                <td>{
                                    dataKey[index] === 'voucherimage' ? <img src={userInput[dataKey[index]]}  height={100}/> : userInput[dataKey[index]]
                                    }</td>
                                <td>{
                                    dataKey[index] === 'voucherimage' ? <img src={newdata[dataKey[index]]}  height={100}/> : newdata[dataKey[index]]
                                    }</td>
                            </tr>
                            )
                        }
                    </tbody>
                   </Table>
                </CardBody>
            </Card>
            </Fragment>
            }
         
        </Fragment>
    )
}

export default VoucherTempDetailsView