import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react'
import {
    Info, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    UncontrolledPopover, PopoverHeader, PopoverBody, Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { toast } from 'react-toastify'
import UploadVoucherCustomCode  from './UploadVoucherCustomCode'
import ImageUpload from './ImageUpload'
import { Skeleton } from 'antd'

const NewCustomVoucherCodeAdd = ({voucherid, setnewcustomecodeadded, refresh, setrefresh}) => {

    const [userInput, setUserInput] = useState({
        title: "",
        customcode_url: null,
        // voucherType: VoucherTypeList[0].value,
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
        Message: ""

    })
    const [customcodecsvurl, setcustomcodecsvurl] = useState(null)
    const [isLoading, setisLoading] = useState(true)
    const [CreateVoucherloading, setCreateVoucherloading] = useState(false)


    const uploadCsvGroupMemo = useMemo(() => {

        return  <UploadVoucherCustomCode setcustomcodecsvurl={setcustomcodecsvurl}/>

    }, [setcustomcodecsvurl])

    useEffect(async () => {

        const [voucherdetails] = await Promise.all([

                        useJwt2.pmsVoucherDetail({voucherid}).then(async res => {
                            const { payload } = res.data
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
                                is_system_voucher: payload.is_system_voucher,
                                purchaseAmount: payload.price,
                                is_local: !payload.islocationwise && !payload.isglobal
                            }

                            return modifyData
                        
                        }).catch(err => {

                            console.log(err.response)
                            Error(err)
                            return {}
                        })
                
        ])

        setUserInput({
            ...userInput, 
            ...voucherdetails,

            business_id: voucherdetails['merchantid'],
            voucherType: voucherdetails['vouchertype'],
            productId: voucherdetails['productid'],
            voucherValue: voucherdetails['vouchervalue'],
            voucherValidity: voucherdetails['vouchervalidity'],
            expiryDate: voucherdetails['expirydate'],
            Description: voucherdetails['description'],
            quota: voucherdetails['quota'],
            Tier: voucherdetails['tier_id'],
            minExpAmount: voucherdetails['minexpamount'],
            rewardPoint: voucherdetails['rewardpoint'],
            purchaseAmount: voucherdetails['price']
        })

        setisLoading(false)

    }, [])

    const back = () => {

        setnewcustomecodeadded(false)
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        if (!customcodecsvurl) {
            Error({response: { status : 404, data: { message: 'Please wait for customcode file upload'} }})
            return 0
        }
        const { 
            voucherType,
            productId,
            voucherValue,
            minExpAmount,
            voucherValidity,
            rewardPoint,
            quota,
            status,
            expiryDate,
            startdate,
            terms,
            Description,
            is_product_voucher,
            is_system_voucher,
            purchaseAmount,
            business_id,
            is_local,
            product_voucher_map_id,
            Tier,
            islocationwise,
            lat,
            long,
            isglobal,
            country,
            distancecover,
            customcode,
            title,
            customcode_url,
            message,
            voucherimage,
            town
        } = userInput

        setCreateVoucherloading(true)

        const body = {
            voucherid,
            title,
            customcode: true,
            customcode_url: customcodecsvurl,

            merchantid : +business_id,
            vouchertype: voucherType,
            productid: +productId,
            vouchervalue: +voucherValue,
            vouchervalidity : +voucherValidity,
            expirydate: expiryDate,
            description: Description,
            quota: 1,
            status: +status,
            tier_id : +Tier,
            minexpamount: +minExpAmount,
            rewardpoint : +rewardPoint,
            price: +purchaseAmount,

            terms,     
            startdate, 
            voucherimage,
            is_system_voucher,
            isglobal,
            islocationwise,
            lat: +lat,
            long: +long,
            distancecover: +distancecover,
            town,
            country: (+country),
            message
        }
 
        useJwt2.pmsVoucherEdit(body).then(res => {

            setCreateVoucherloading(false)
            console.log(res)
            Success({data: {message : res.data.payload.msg}})
            setrefresh(refresh + 1)
            back()

        }).catch(err => {

            setCreateVoucherloading(false)
            Error(err)
            console.log(err)
        })
    }
    console.log('customcodecsvurl => ', customcodecsvurl)

    return (
        <Fragment> 
            {
            isLoading ? <Fragment> <Skeleton active /> <Skeleton active /> <Skeleton active /> </Fragment> :    <Fragment> <Button.Ripple className='mb-1' color='primary' onClick={(e) => back()} >
            <div className='d-flex align-items-center'>
                <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                <span >Back</span>
            </div>
            </Button.Ripple>
                <Card id="createVoucherd">
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Add New Voucher Code</CardTitle>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                
                        <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                            <Col md="12">
                                 {uploadCsvGroupMemo}
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
   
                </Fragment>
            }
        </Fragment>
    )

}

export default NewCustomVoucherCodeAdd