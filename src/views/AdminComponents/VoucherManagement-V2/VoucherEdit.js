import React, { useEffect, useState, useRef, Fragment } from 'react'
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

const VoucherTypeList = [{ value: 'discount', label: 'discount' }, { value: 'cash', label: 'cash' }, { value: 'product', label: 'product' }]
const Status = [{value: 1, label: 'Active'}, {value: 0, label: 'InActive'}]

const EditVoucher = ({voucherid, setisviewDetails, setvoucherid, refresh, setrefresh}) => {
    const productRef = useRef()
    const history = useHistory()
    const [isLoading, setisLoading] = useState(true)
    const [businessList, setBusinessList] = useState([])
    const [businessid, setBusinessid] = useState('')
    const [isLoadingBussiness, setisLoadingBussiness] = useState(true)
    const [isloadingTier, setisloadingTier] = useState(true)
    const [selectedBusiness, setselectedBusiness] = useState({})
    const [CreateVoucherloading, setCreateVoucherloading] = useState(false)
    const [file, setFile] = useState(null)
    const [filePrevw, setFilePrevw] = useState(null)
    const [productList, setproductList] = useState([])
    const [isLoadingProduct, setisLoadingProduct] = useState(false)
    const [tierList, setTierList] = useState([{ value: null, label: 'All' }])
    const [tierDefault, settierDefault] = useState({})
    const [productDefaultValue, setproductDefaultValue] = useState({ value: '', label: 'select...'})

    const [countryList, setcountryList] = useState([])
    const [countryDefaultValue, setcountryDefaultValue] = useState({ value: '', label: 'select...'})

    const [statusDefault, setstatusDefault] = useState({})

    const [townList, settownList] = useState([])
    const [selectedTowns, setselectedTowns] = useState([])
    const [townDefaultValue, settownDefaultValue] = useState({ value: '', label: 'select...'})

    const [defaultVoucherType, setdefaultVoucherType] = useState({})

    const [customcodecsvurl, setcustomcodecsvurl] = useState(null)

    const [userInput, setUserInput] = useState({
        title: "",
        customcode_url: null,
        voucherType: VoucherTypeList[0].value,
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
        message: ""

    })

    const back = () => {

        setisviewDetails(false)
        setvoucherid(null)
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
               // setUserInput({ ...userInput, productId: pData[0].value })
            } else {
                setproductDefaultValue({value: '', label: 'Select...' })
                //setUserInput({ ...userInput, productId: null })
                setUserInput(userInput => ({
                    ...userInput,
                    productId: null
                  }))
            }

        }).catch(err => {
            // Error(err)
            console.log(err)
            setproductDefaultValue({value: '', label: 'Select...' })
            setUserInput(userInput => ({
                ...userInput,
                productId: null
              }))
            setisLoadingProduct(false)
        })
    }


    const getcityList = async(country_id) => {
        setselectedTowns([])
        settownList([])
        useJwt2.cityList({country_id}).then(res => {
            const { payload } = res.data
            console.log(res)
            const cList = payload.map(x => { return { value: x.id, label: x.name } })
            settownList(cList)
            
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }

    useEffect(async () => {

        const [voucherdetails, businessList, Tier, country_list] = await Promise.all([

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
                        }),
                        useJwt2.customerBusinessList().then(res => {
                            const { payload } = res.data
                            const businessList = payload.map(x => { return { value: x.id, label: x.businessname } })
                            return businessList
                            // setBusinessList(businessList)
                            // if (payload.length) {
                            //     setBusinessid(payload[0].id)
                            //     setselectedBusiness(businessList[0])
                            //     return payload[0].id

                            // } else {
                            //     return []
                            // }
                            
                        }).catch(err => {
                            console.log(err.response)
                            Error(err)
                            return []
                        }),

                        useJwt2.tierList().then(res => {
                            console.log(res)
                            const { payload } = res.data
                            const tList = payload.map(x => { return { value: x.id, label: x.tier } })

                            //setTierList([{ value: null, label: 'All' }, ...tList])
                            return [{ value: 0, label: 'All' }, ...tList]
                        }).catch(err => {
                            console.log(err.response)
                            Error(err)
                            return []
                        }),
                        useJwt2.countryList().then(res => {
                            const { payload } = res.data
                            console.log(res)
                            return payload.map(x => { return { value: x.id, label: x.name } })
                            
                        }).catch(err => {
                            console.log(err.response)
                            Error(err)
                            return []
                        })
                
                    ])

        setisloadingTier(false)
        setisLoadingBussiness(false)
        const dVoucherType = VoucherTypeList.filter(item => item.value === voucherdetails['vouchertype'])
        setdefaultVoucherType(dVoucherType)
        setBusinessList(businessList)
        const selectedBussiness = businessList.filter(item => item.value === voucherdetails['merchantid'])
        setselectedBusiness(selectedBussiness.length ? selectedBussiness[0] : {})
        if (voucherdetails['vouchertype'] === 'product') {

            const params = {
                page: 1,
                perPage: 50000,
                business_id: voucherdetails['merchantid'],
                q: null,
                imageurlhave: null,
                searchValue: null
            }
            
            const pList = await useJwt.productList(params).then(res => {
                const data = res.data.payload
                const pData = data.data.map(p => { return { value: p.productid, label: p.productname } })
                return pData
    
            }).catch(err => {
                console.log(err)
                return [{value: '', label: 'Select...' }]
            })
            setproductList(pList)
            console.log('pList ', pList)
            const pDefault = pList.filter(item => (+item.value) === (+voucherdetails['productid']))
            setproductDefaultValue(pDefault.length ? pDefault[0] : {})
        }
        setTierList(Tier)
        const tierDefaultValue = Tier.filter(item => (+item.value) === (+voucherdetails['tier_id']))
        settierDefault(tierDefaultValue.length ? tierDefaultValue[0] : {})
        const dstatus = Status.filter(item => (+item.value) === (+voucherdetails['status']))
        setstatusDefault(dstatus.length ? dstatus[0] : {})
        setcountryList(country_list)
        if (voucherdetails['is_local']) {
            const dfCountry = country_list.filter(item => (+item.value) === (+voucherdetails['country']))
            console.log('dfCountry ', dfCountry)
            setcountryDefaultValue(dfCountry.length ? dfCountry[0] : {})

            const citylList = await useJwt2.cityList({country_id: voucherdetails['country']}).then(res => {
                const { payload } = res.data
                console.log(res)
                const cList = payload.map(x => { return { value: x.id, label: x.name } })
                return cList
                
            }).catch(err => {
                console.log(err.response)
                Error(err)
                return []
            })
            settownList(citylList)
            console.log('citylList ', citylList)
            if (voucherdetails['town'] && voucherdetails['town'].length) {
                const defaultCityValue = citylList.filter(item =>  voucherdetails['town'].includes(`${item.value}`))
                console.log('defaultCityValue ', defaultCityValue)
                setselectedTowns(defaultCityValue)
            }
        } else {
            setcountryDefaultValue(country_list.length ? country_list[0] : {})
        }

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


    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleBusinessChange = (selected) => {
        if (userInput.voucherType === 'product') {
            getProductList(selected.value)
            setUserInput({ ...userInput, business_id: selected.value })
        } else {
            setUserInput({ ...userInput, business_id: selected.value, productId: null })
            setproductDefaultValue({ value: '', label: 'Select...' })
        }   
        setBusinessid(selected.value)
        setselectedBusiness(selected)
    }

    const handleChangeIsGlobal = (e) => {

        setUserInput({ ...userInput, isglobal: e.target.checked, islocationwise : false, is_local: !(e.target.checked) }) 
    }
    const handleChangeIsLocationwise = (e) => setUserInput({ ...userInput, islocationwise: e.target.checked, isglobal:  !(e.target.checked) }) 
    const handleChangeIsCustomCode = (e) => setUserInput({ ...userInput, customcode: e.target.checked })
    const handleChangeIsSystemVoucher = (e) => setUserInput({ ...userInput, is_system_voucher: e.target.checked })

    const handleChangeCountry = (selected) => {
        setcountryDefaultValue(selected)
        setUserInput({ ...userInput, country: selected.value, town: []  })
        settownList([])
        getcityList(selected.value)
    }
    const handleTownSelect = (selected) => {
        console.log('selected town ', selected)
        setselectedTowns(selected)
    }

    const handleVoucherTypeSelect = (selected) => {
        
        if (selected.value === 'product') {
            getProductList(userInput.business_id)
        }
        setUserInput(userInput => ({
            ...userInput,
            voucherType: selected.value
          }))
        //setUserInput({ ...userInput, voucherType: selected.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
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
            message
        } = userInput

        const voucherimage = file || userInput['voucherimage']
        
        if (!voucherimage) {
            Error({response: { status : 404, data: { message: 'Please wait for image file upload'} }})
            return 0
        }
        setCreateVoucherloading(true)
        const town = selectedTowns.map(item => +item.value)

        const body = {
            voucherid,
            title,
            customcode,
            customcode_url,

            merchantid : +business_id,
            vouchertype: voucherType,
            productid: +productId,
            vouchervalue: +voucherValue,
            vouchervalidity : +voucherValidity,
            expirydate: expiryDate,
            description: Description,
            quota: +quota,
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
                <CardTitle tag='h4'>Update Voucher Info</CardTitle>
                <CustomInput onChange={handleChangeIsSystemVoucher} type='switch' id='is_system_voucher' inline label='Is-System-Voucher' checked={userInput.is_system_voucher}  />
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

                     <Col md='4' >
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
                            <Label for="Business">Voucher Type <span style={{ color: 'red' }}>*</span></Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={defaultVoucherType}
                                onChange={handleVoucherTypeSelect}
                                options={VoucherTypeList}
                            />
                        </FormGroup>
                    </Col>
                    {userInput.voucherType === 'product' && <Col md='4' >
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
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormGroup>
                    </Col>
                    { !userInput.is_system_voucher && <Col md='4' >
                        <FormGroup>
                            <Label for="minExpAmount">Minimum Exp Amount</Label>
                            <Input type="number"
                                name="minExpAmount"
                                id='minExpAmount'
                                value={userInput.minExpAmount}
                                onChange={handleChange}
                                min={0}
                                placeholder='0'
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormGroup>
                    </Col> }
                    <Col md='4' >
                        <FormGroup>
                            <Label for="voucherValidity">Voucher Validity (Days)</Label>
                            <Input type="number"
                                name="voucherValidity"
                                id='voucherValidity'
                                value={userInput.voucherValidity}
                                onChange={handleChange}
                                required
                                min={1}
                                placeholder='0'
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormGroup>
                    </Col>
                    <Col md='4' >
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
                    <Col md='4' >
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

                    { !userInput.is_system_voucher && <Fragment> <Col md='4' >
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
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormGroup>
                    </Col> 
                    <Col md='4' >
                        <FormGroup>
                            <Label for="purchaseAmount">Purchase Amount(Buy Cash)</Label>
                            <Input type="number"
                                name="purchaseAmount"
                                id='purchaseAmount'
                                value={userInput.purchaseAmount}
                                onChange={handleChange}
                                min={0}
                                placeholder='0'
                                onWheel={(e) => e.target.blur()}
                            />
                        </FormGroup>
                    </Col> </Fragment> }

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
                                onWheel={(e) => e.target.blur()}
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
                                defaultValue={tierDefault}
                                onChange={(selected) => setUserInput({ ...userInput, Tier: selected.value })}
                                options={tierList}
                                isLoading={isloadingTier}
                            />
                        </FormGroup>
                    </Col>
                    
                    <Col md='4' >
                        <FormGroup>
                            <Label for="Business">Status</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={statusDefault}
                                onChange={(selected) => {
                                    setUserInput({ ...userInput, status: selected.value })
                                }}
                                options={Status}
                            />
                        </FormGroup>
                    </Col>

                    {
                        !userInput.is_system_voucher && <Fragment>

                      <Col md='12'>
                        <Row>
                            <Col md='4' >
                            <FormGroup>
                                <CustomInput onChange={handleChangeIsGlobal} type='switch' id='isglobal' inline label='Is-Global' checked={userInput.isglobal}  />
                            </FormGroup>
                        </Col>

                        {
                            (!userInput.isglobal && !userInput.islocationwise && userInput.is_local) ? <Fragment>

                                <Col md='4' >
                                        <FormGroup>
                                            <Label for="country">Country</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={countryDefaultValue}
                                                onChange={handleChangeCountry}
                                                options={countryList}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md='4' >
                                        <FormGroup>
                                            <Label for="town">Town</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={selectedTowns}
                                                isMulti
                                                onChange={(selected) => handleTownSelect(selected)}
                                                options={townList}
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
                                <CustomInput onChange={handleChangeIsLocationwise} type='switch' id='islocationwise' inline label='Is-Locationwise' checked={userInput.islocationwise}  />
                            </FormGroup>
                        </Col>
                        {
                            userInput.islocationwise ? <Fragment>

                                    <Col md='3' >
                                        <FormGroup>
                                            <Label for="lat">Lat</Label>
                                            <Input type="number"
                                                name="lat"
                                                id='lat'
                                                value={userInput.lat}
                                                onChange={handleChange}
                                                required
                                                min={1}
                                                placeholder='0'
                                                onWheel={(e) => e.target.blur()}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='3' >
                                        <FormGroup>
                                            <Label for="quota">Long</Label>
                                            <Input type="number"
                                                name="long"
                                                id='long'
                                                value={userInput.long}
                                                onChange={handleChange}
                                                required
                                                min={1}
                                                placeholder='0'
                                                onWheel={(e) => e.target.blur()}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='3' >
                                        <FormGroup>
                                            <Label for="distancecover">Distance-cover(KM)</Label>
                                            <Input type="number"
                                                name="distancecover"
                                                id='distancecover'
                                                value={userInput.distancecover}
                                                onChange={handleChange}
                                                required
                                                min={1}
                                                placeholder='0'
                                                onWheel={(e) => e.target.blur()}
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
                            <Label for="terms">Terms<span style={{ color: 'red' }}>*</span></Label>
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
                            <Label for="Description">Description<span style={{ color: 'red' }}>*</span></Label>
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

                    <Col md='6' >
                        <Label for="voucherImage">Voucher Image<span style={{ color: 'red' }}>*</span></Label>
                        <ImageUpload filePrevw2={userInput.voucherimage} setFilePrevw={setFilePrevw} setFile={setFile}/>
                    </Col>
                    <Col md='6' >

                        <FormGroup>
                        <Label >Message<span style={{ color: 'red' }}>*</span> <Info size={14} id='popFocus'/></Label>

                        <UncontrolledPopover trigger='click' placement='top' target='popFocus'>
                            <PopoverHeader>Tag</PopoverHeader>
                            <PopoverBody> {'<Voucher-Code>'} </PopoverBody>
                        </UncontrolledPopover>
                            
                        <Input type="textarea"
                            name="Message"
                            id='message'
                            value={userInput.Message}
                            onChange={handleChange}
                            required
                            placeholder='Voucher purchase message...'
                        />
                        </FormGroup>
                    </Col>

                    <Col md='12' style={{marginTop: 20}}>
                            <FormGroup>
                                <CustomInput onChange={handleChangeIsCustomCode} type='switch' id='customcode' inline label='Upload-Customcode' checked={userInput.customcode} disabled />
                            </FormGroup>
                    </Col>
                  
                    <Col md='12'>
                    {
                        userInput.customcode && <a href={userInput.customcode_url} target='_blank' > {userInput.customcode_url} </a>
                    }
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

export default EditVoucher