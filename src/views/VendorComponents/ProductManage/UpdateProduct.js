import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import { useParams, useHistory } from 'react-router-dom'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, ncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, nputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import InputGroupText from 'reactstrap/lib/InputGroupText'
import useJwt from '@src/auth/jwt/useJwt'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { toast, Slide } from 'react-toastify'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import 'antd/dist/antd.css'
import { Tag, Skeleton } from 'antd'

const ProductDetails = () => {
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const history = useHistory()
    const { productID } = useParams()
    const [isLoading, setisLoading] = useState(false)
    const [Imgs, setImgs] = useState([])
    const [ProdDetails, setProdDetails] = useState({})
    const [OpFixedData, setOpFixedData] = useState({})
    const [OpDynamicData, setOpDynamicData] = useState([])
    const [OpDynamicDataEntity, setOpDynamicDataEntity] = useState([])
    const [AdditionalInfoData, setAdditionalInfoData] = useState([])
    const [AdditionalInfoValues, setAdditionalInfoValues] = useState({})
    const [productTypeName, setproductTypeName] = useState('')
    const [ChildSubCatName, setChildSubCatName] = useState('')
    const [BusinessName, setBusinessName] = useState('')
    const [aditional_entity_labal_names, setAditionalEntityLabalNames] = useState([])
    const [optional_entity_labal_names, setOptionalEntityLabalNames] = useState([])
    const [optional_entity_key_names, setOptionalEntityKeyNames] = useState([])
    const [producttypedynamicinfo, setproducttypedynamicinfo] = useState([])

    useEffect(() => {
        useJwt.SingleProductDetailsApi({ productid: productID }).then(res => {
            setProdDetails({ ...res.data.payload, is_budget: !!res.data.payload.discount_budget })
            const MainData = res.data.payload
            console.log('main data ', MainData)
            setBusinessName(
                {
                    label: BusinessList.find(x => x.id === MainData.business_id).businessname,
                    value: BusinessList.find(x => x.id === MainData.business_id).businessname
                }
            )
            const { product_optional_image, product_type_id, optional_data } = MainData
            if (!product_type_id) {
                setOpFixedData(optional_data[0])
            }
            setImgs(product_optional_image)
            // Child sub cat list api 
            useJwt.ChildSubcategoryListAPi().then(res => {

                setChildSubCatName(res.data.payload.find(x => x.id === Number(MainData.child_subcategory_id)).name)

            }).catch(err => {
                console.log(err)
            })
            // product list api fetch 
            useJwt.ProductTypeListAPi({ product_type_id }).then(res => {
                const Data11 = res.data.payload, labal_names = [], dynamic_labal_names = [], dynamic_key_names = []
                setproductTypeName(Data11[0].type_name)

                const aditnlData = Data11[0].additional_fixed_data.map((x, i) => {
                    labal_names[i] = x.label
                    return x.entity_name
                })
                Data11[0].additional_dynamic_data.map((x, i) => {
                    dynamic_labal_names[i] = x.label
                    dynamic_key_names[i] = x.entity_name
                })
                //console.log("Prodtype", Data11)

                const p = { ...MainData.optional_data[0] }
                const newOBJ = {}
                for (const key in p) {
                    if (aditnlData.includes(String(key))) {
                        newOBJ[key] = p[key]
                    }
                }
                // console.log("newOBJ", newOBJ, aditnlData)
                // console.log("opd", aditnlDynamicData, optional_data.map(x => {
                //     const newX = {}
                //     for (const key in x) {
                //         if (aditnlDynamicData.includes(String(key))) {
                //             newX[key] = x[key]
                //         }
                //     }
                //     return newX
                // })
                // )
                setOpDynamicData(optional_data.map(x => {
                    const newX = {}
                    for (const key in x) {
                        if (aditnlDynamicData.includes(String(key))) {
                            newX[key] = x[key]
                        }
                    }
                    return newX
                }))
                setOpDynamicDataEntity(aditnlDynamicData)
                setAdditionalInfoValues(newOBJ)
                setAdditionalInfoData(aditnlData)
                setAditionalEntityLabalNames(labal_names)

                setOptionalEntityKeyNames(dynamic_key_names)
                setOptionalEntityLabalNames(dynamic_labal_names)

                setproducttypedynamicinfo(Data11[0].additional_dynamic_data)


            }).catch(err => {
                console.log(err)
            })

        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('ProdDetails', ProdDetails)
        setisLoading(true)
        useJwt.updateproductApi(ProdDetails).then(res => {
            setisLoading(false)
            // history.goBack()
            history.push('/allproduct')
            Success(res)
        }).catch(err => {
            setisLoading(false)
            console.log(err)
            Error(err)
        })
    }
    return (
        <Fragment>
            <Button.Ripple className='ml-2 mb-2' color='primary' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            <Card>
                <h4 className="text-center py-2">Update Stock </h4>
            </Card>

            {ProdDetails.productname ? <Form style={{ width: '100%' }} onSubmit={handleSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Discount</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='4' className='my-1'>
                                <Label>Discount Offer (%)</Label>
                                <Input
                                    min={0}
                                    type='number'
                                    value={ProdDetails.discount_percent}
                                    onChange={e => setProdDetails({ ...ProdDetails, discount_percent: e.target.value })}
                                // disabled
                                />
                            </Col>

                            {ProdDetails.discount_percent > 0 ? <><Col md='4' className='my-1'>
                                <Label>Start Date</Label>
                                <Input
                                    type='date'
                                    value={new Date(ProdDetails.discount_startdate).toLocaleDateString('fr-CA')}
                                    onChange={e => setProdDetails({ ...ProdDetails, discount_startdate: e.target.value })}
                                // disabled
                                />
                            </Col>
                                <Col md='4' className='my-1'>
                                    <Label>End Date</Label>
                                    <Input
                                        type='date'
                                        min={new Date(ProdDetails.discount_startdate).toLocaleDateString('fr-CA')}
                                        value={new Date(ProdDetails.discount_enddate).toLocaleDateString('fr-CA')}
                                        onChange={e => setProdDetails({ ...ProdDetails, discount_enddate: e.target.value })}
                                    // disabled
                                    />
                                </Col>
                                <Col md='4' className='my-1'>
                                    <Label>Quota</Label>
                                    <Input
                                        type='number'
                                        required={!ProdDetails.is_budget}
                                        min={!ProdDetails.is_budget ? 1 : 0}
                                        value={ProdDetails.discount_quota}
                                        onChange={e => setProdDetails({ ...ProdDetails, discount_quota: e.target.value })}
                                    // disabled
                                    />
                                </Col>
                                <Col md='4' className='my-1'>
                                    <Label>Is Budget?</Label>
                                    <CustomInput
                                        style={{ zIndex: '0' }}
                                        className='mt-1'
                                        onChange={e => setProdDetails({ ...ProdDetails, is_budget: e.target.checked })}
                                        checked={ProdDetails.is_budget}
                                        type='checkbox'
                                        id='isB'
                                        label='Yes'
                                    />
                                    {/* <Input
                                    placeholder=" "
                                    type='text'
                                    defaultValue={!!ProdDetails.discount_budget}
                                    disabled
                                /> */}
                                </Col>
                                {ProdDetails.is_budget ? <Col md='4' className='my-1'>
                                    <Label>Budget</Label>
                                    <Input
                                        placeholder=" "
                                        type='number'
                                        required={ProdDetails.is_budget}
                                        min={ProdDetails.is_budget ? 1 : 0}
                                        value={ProdDetails.discount_budget}
                                        onChange={e => setProdDetails({ ...ProdDetails, discount_budget: e.target.value })}
                                    // disabled
                                    />
                                </Col> : ''} </> : ''}
                        </Row>
                    </CardBody>
                </Card>
                {/* <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Optional Info</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='4' className='my-1'>
                                <Label>Product Price</Label>
                                <Input
                                    type='text'
                                    defaultValue={OpFixedData.product_price}
                                // disabled
                                />
                            </Col>
                            <Col md='4' className='my-1'>
                                <Label>Product Weight</Label>
                                <Input
                                    type='text'
                                    defaultValue={OpFixedData.product_weight}
                                    disabled
                                />
                            </Col>
                            <Col md='4' className='my-1'>
                                <Label>Product quantity</Label>
                                <Input
                                    type='text'
                                    defaultValue={OpFixedData.product_quantity}
                                // disabled
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>  */}
                {productTypeName === '' ? null : <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Product name :  {ProdDetails.productname}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            {
                                ProdDetails["optional_data"].map((singleobj, index) => {
                                    const mainIndex = index
                                    const keys = Object.keys(singleobj), showkeys = []
                                    keys.map((key, i) => {

                                        if (!AdditionalInfoData.includes(key)) {

                                            showkeys.push(key)
                                        }
                                    })

                                    return <Col key={index} md='6'>
                                        <Card style={{ border: "1px solid #d2c7c7" }}>
                                            <CardHeader className='border-bottom mb-1'>
                                                <CardTitle tag='h5'>Item {index + 1}</CardTitle>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    {showkeys.map((key, index) => {

                                                        let label = key, value = singleobj[key]
                                                        producttypedynamicinfo.every((s_obj, s_index) => {

                                                            if (s_obj["entity_name"] === key) {
                                                                if (s_obj["is_key_value_pair_array"]) {
                                                                    s_obj["allow_values"].every(alv => {
                                                                        if (alv["value"] === value) {
                                                                            value = alv["label"]
                                                                            return false
                                                                        }
                                                                        return true
                                                                    })
                                                                }
                                                                label = s_obj["label"]
                                                                return false
                                                            }
                                                            return true
                                                        })
                                                        if (label === 'product_quantity' || label === 'product_price') {
                                                            return <Col md='4' key={index} className='my-1'>
                                                                <Label>{(label.replace(/^.{1}/g, label[0].toUpperCase())).replace(/_/g, ' ')}</Label>
                                                                {label === 'product_quantity' ? <Input
                                                                    required
                                                                    type='number'
                                                                    value={value}
                                                                    onChange={e => {
                                                                        const old = [...ProdDetails.optional_data]
                                                                        old[mainIndex] = { ...old[mainIndex], product_quantity: e.target.value }
                                                                        setProdDetails({
                                                                            ...ProdDetails,
                                                                            optional_data: old
                                                                        })
                                                                    }}
                                                                /> : <Input
                                                                    required
                                                                    type='number'
                                                                    value={value}
                                                                    onChange={e => {
                                                                        if (Number(value) === ProdDetails.RRP) {
                                                                            const old = [...ProdDetails.optional_data]
                                                                            old[mainIndex] = { ...old[mainIndex], product_price: e.target.value }
                                                                            setProdDetails({
                                                                                ...ProdDetails,
                                                                                RRP: Number(e.target.value),
                                                                                optional_data: old
                                                                            })
                                                                        } else {
                                                                            const old = [...ProdDetails.optional_data]
                                                                            old[mainIndex] = { ...old[mainIndex], product_price: e.target.value }
                                                                            setProdDetails({
                                                                                ...ProdDetails,
                                                                                optional_data: old
                                                                            })
                                                                        }
                                                                    }}
                                                                />}

                                                            </Col>
                                                        } else return ''
                                                    }
                                                    )
                                                    }
                                                </Row>
                                                <Row>
                                                    {showkeys.map((key, index) => {
                                                        let label = key
                                                        const value = singleobj[key]
                                                        producttypedynamicinfo.every((s_obj, s_index) => {
                                                            // console.log('s_obj', s_obj)
                                                            if (s_obj["entity_name"] === key) {
                                                                label = s_obj["label"]
                                                                return false
                                                            }
                                                            return true
                                                        })
                                                        if (label === 'product_quantity' || label === 'product_price') {
                                                            return ''
                                                        } else return <Col md='4' key={index} className='my-1'>
                                                            <Label>{(label.replace(/^.{1}/g, label[0].toUpperCase())).replace(/_/g, ' ')}</Label>
                                                            {
                                                                label === 'product_color' ? <div style={{
                                                                    backgroundColor: value,
                                                                    height: '30px',
                                                                    width: '30px',
                                                                    marginTop: '2px',
                                                                    border: '4px solid #efefef',
                                                                    borderRadius: '50%'
                                                                }}>
                                                                </div> : <Input
                                                                    type='text'
                                                                    value={value}
                                                                    disabled
                                                                />
                                                            }
                                                        </Col>
                                                    })}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                })
                            }
                        </Row>
                    </CardBody>
                </Card>}
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="12" className='text-center'>
                                <FormGroup>
                                    {
                                        isLoading ? <Button.Ripple color='primary' disabled >
                                            <Spinner color='white' size='sm' />
                                            <small className='ml-50'>Loading...</small>
                                        </Button.Ripple> : <Button.Ripple color='primary' type="submit"  >
                                            <span>Update Stock</span>
                                        </Button.Ripple>
                                    }
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form> : <Card>
                <CardBody>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </CardBody>
            </Card>}
        </Fragment>
    )
}

export default ProductDetails