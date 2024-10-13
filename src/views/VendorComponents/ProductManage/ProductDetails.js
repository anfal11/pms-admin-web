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
    const history = useHistory()
    const { productID } = useParams()
    const [Imgs, setImgs] = useState([])
    const [ProdDetails, setProdDetails] = useState({})
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
            setProdDetails(res.data.payload)
            const MainData = res.data.payload
            console.log('main data ', MainData)
            setBusinessName(JSON.parse(localStorage.getItem('customerBusinesses')).find(x => x.id === MainData.business_id).businessname)
            const { product_optional_image, product_type_id } = MainData
            setImgs(product_optional_image)
            // Child sub cat list api 
            useJwt.ChildSubcategoryListAPi().then(res => {

                setChildSubCatName(res.data.payload.find(x => x.id === Number(MainData.child_subcategory_id)).name)

            }).catch(err => {
                console.log(err.response)
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
    return (
        <Fragment>
            <Button.Ripple className='ml-2 mb-2' color='primary' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom mb-1'>
                    <CardTitle tag='h5'>Business Info</CardTitle>
                </CardHeader>
                <CardBody>
                    <Label>Business Name</Label>
                    <Input
                        placeholder="Business"
                        type='text'
                        value={BusinessName}
                        disabled
                    />
                </CardBody>
            </Card>

            {ProdDetails.productname ? <><Row className="match-height">
                <Col md='12'>
                    <Card>
                        <CardHeader className='border-bottom mb-1'>
                            <CardTitle tag='h5'>Product Images</CardTitle>
                        </CardHeader>
                        <CardBody >
                            <div className="d-flex justify-content-around">
                                {
                                    Imgs.map((x, index) => <img key={index} src={x} alt="Product Image" className="w-25" />)
                                }
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* <Col md='6'>
                    <Card>
                        <CardHeader className='border-bottom mb-1'>
                            <CardTitle tag='h5'>Product Video</CardTitle>
                        </CardHeader>
                        {ProdDetails.product_video_link ? <CardBody>
                            {
                                ProdDetails.product_video_link.includes("youtube") ? <iframe width="100%" height="300"
                                    src={`https://www.youtube.com/embed/${/[^=]*$/.exec(ProdDetails.product_video_link)[0]}` || ''}>
                                </iframe> : <video style={{ marginTop: "3px" }} width="100%" height="300" controls src={ProdDetails.product_video_link || ''}>
                                    Your browser does not support the video tag.
                                </video>
                            }
                        </CardBody> : ''}
                    </Card>
                </Col> */}
            </Row>

                <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Product Info</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='6' className='my-1'>
                                <Label>Product Name</Label>
                                <Input
                                    placeholder="Product Name"
                                    type='text'
                                    value={ProdDetails.productname}
                                    disabled
                                />
                            </Col>
                            <Col md='3' className='my-1'>
                                <Label>Category</Label>
                                <Input
                                    placeholder="Category"
                                    type='text'
                                    value={ProdDetails.categoryinfo ? ProdDetails.categoryinfo.categoryname : ''}
                                    disabled
                                />
                            </Col>
                            <Col md='3' className='my-1'>
                                <Label>Sub-Category</Label>
                                <Input
                                    placeholder="Sub-Category"
                                    type='text'
                                    value={ProdDetails.subcategoryinfo ? ProdDetails.subcategoryinfo.subcategoryname : ''}
                                    disabled
                                />
                            </Col>
                            <Col md='3' className='my-1'>
                                <Label>Child Category</Label>
                                <Input
                                    placeholder="Child-Sub-Category"
                                    type='text'
                                    value={ChildSubCatName}
                                    disabled
                                />
                            </Col>
                            <Col md='3' className='my-1'>
                                <Label>Product Type</Label>
                                <Input
                                    placeholder=" "
                                    type='text'
                                    value={productTypeName}
                                    disabled
                                />
                            </Col>
                            <Col md='12'>
                                <Label>Product Description</Label>
                                <Input
                                    placeholder="Product Description"
                                    type='textarea'
                                    rows = {10}
                                    value={ProdDetails.productdetails}
                                    disabled
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Discount</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='4' className='my-1'>
                                <Label>Discount Offer (%)</Label>
                                <Input
                                    placeholder="Product Name"
                                    type='text'
                                    value={ProdDetails.discount_percent}
                                    disabled
                                />
                            </Col>

                            {ProdDetails.discount_percent ? <><Col md='4' className='my-1'>
                                <Label>Start Date</Label>
                                <Input
                                    placeholder="Category"
                                    type='text'
                                    value={new Date(ProdDetails.discount_startdate).toLocaleDateString('fr-CA')}
                                    disabled
                                />
                            </Col>
                                <Col md='4' className='my-1'>
                                    <Label>End Date</Label>
                                    <Input
                                        placeholder="Sub-Category"
                                        type='text'
                                        value={new Date(ProdDetails.discount_enddate).toLocaleDateString('fr-CA')}
                                        disabled
                                    />
                                </Col>
                                <Col md='4' className='my-1'>
                                    <Label>Quota</Label>
                                    <Input
                                        placeholder="Child-Sub-Category"
                                        type='text'
                                        value={ProdDetails.discount_quota}
                                        disabled
                                    />
                                </Col>
                                <Col md='4' className='my-1'>
                                    <Label>Is Budget?</Label>
                                    <Input
                                        placeholder=" "
                                        type='text'
                                        value={!!ProdDetails.discount_budget}
                                        disabled
                                    />
                                </Col>
                                {ProdDetails.discount_budget ? <Col md='4' className='my-1'>
                                    <Label>Budget</Label>
                                    <Input
                                        placeholder=" "
                                        type='text'
                                        value={ProdDetails.discount_budget}
                                        disabled
                                    />
                                </Col> : ''} </> : ''}
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <Col md="6">
                        <Card>
                            <CardHeader className='border-bottom mb-1'>
                                <CardTitle tag='h5'>Vat / Tax</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md='6' className='my-1'>
                                        <Label>Vat</Label>
                                        <Input
                                            placeholder=" "
                                            type='text'
                                            value={Number(ProdDetails.vatrat_percent).toFixed(2)}
                                            disabled
                                        />
                                    </Col>
                                    <Col md='6' className='my-1'>
                                        <Label>Tax</Label>
                                        <Input
                                            placeholder=" "
                                            type='text'
                                            value={Number(ProdDetails.taxrate_percent).toFixed(2)}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card>
                            <CardHeader className='border-bottom mb-1'>
                                <CardTitle tag='h5'>Delivery Time</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md='6' className='my-1'>
                                        <Label>From</Label>
                                        <Input
                                            placeholder=" "
                                            type='text'
                                            value={ProdDetails.delivery_startdate_interval}
                                            disabled
                                        />
                                    </Col>
                                    <Col md='6' className='my-1'>
                                        <Label>To</Label>
                                        <Input
                                            placeholder=" "
                                            type='text'
                                            value={ProdDetails.delivery_enddate_interval}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Product Return Policy</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='6' className='my-1'>
                                <Label>Allow Return For this Product?</Label>
                                <Input
                                    placeholder=" "
                                    type='text'
                                    value={ProdDetails.return_allow}
                                    disabled
                                />
                            </Col>
                            {ProdDetails.return_allow && <><Col md='6' className='my-1'>
                                <Label>Interval</Label>
                                <Input
                                    placeholder=" "
                                    type='text'
                                    value={ProdDetails.return_day_interval}
                                    disabled
                                />
                            </Col>
                                <Col md='12' className='my-1'>
                                    <Label>Terms & Conditions</Label>
                                    <Input
                                        placeholder=" "
                                        type='textarea'
                                        value={ProdDetails.return_terms_and_condition}
                                        disabled
                                    />
                                </Col></>}
                        </Row>
                    </CardBody>
                </Card>
                {AdditionalInfoData.length ? <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Additional Info</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            {
                                AdditionalInfoData.map((x, index) => <Col key={index} md='3' className='my-1'>
                                    <Label>{aditional_entity_labal_names[index]}</Label>
                                    <Input
                                        type='text'
                                        value={ProdDetails["optional_data"][0][x]}
                                        disabled
                                    />
                                </Col>)
                            }
                        </Row>
                    </CardBody>
                </Card> : ''}

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
                                    // value={ProdDetails.}
                                    disabled
                                />
                            </Col>
                            <Col md='4' className='my-1'>
                                <Label>Product Weight</Label>
                                <Input
                                    type='text'
                                    // value={ProdDetails.}
                                    disabled
                                />
                            </Col>
                            <Col md='4' className='my-1'>
                                <Label>Product Quantity</Label>
                                <Input
                                    type='text'
                                    // value={ProdDetails.}
                                    disabled
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card> */}
                {productTypeName === '' ? null : <Card>
                    <CardHeader className='border-bottom mb-1'>
                        <CardTitle tag='h5'>Optional Info</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>

                            {
                                ProdDetails["optional_data"].map((singleobj, index) => {

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

                                                        let label = key
                                                        const value = singleobj[key]
                                                        producttypedynamicinfo.every((s_obj, s_index) => {
                                                            // console.log('s_obj', s_obj)
                                                            if (s_obj["entity_name"] === key) {
                                                                // if (s_obj["is_key_value_pair_array"]) {
                                                                //     s_obj["allow_values"].every(alv => {
                                                                //         if (alv["value"] === value) {
                                                                //             value = alv["label"]
                                                                //             return false
                                                                //         }
                                                                //         return true
                                                                //     })
                                                                // }
                                                                label = s_obj["label"]
                                                                return false
                                                            }
                                                            return true
                                                        })

                                                        return <Col md='4' key={index} className='my-1'>
                                                            <Label>{label}</Label>
                                                            {
                                                                label === 'Product color' ? <div style={{
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
                                                    }

                                                    )


                                                    }
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>

                                })
                            }
                        </Row>
                    </CardBody>
                </Card>}
            </> : <Card>
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