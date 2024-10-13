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
import ProductImgUpload from './ProductImgUpload'
import ProductVideoUpload from './ProductVideoUpload'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { CirclePicker, ChromePicker, PhotoshopPicker } from 'react-color'
import './../itemCardStyles.scss'

import 'antd/dist/antd.css'
import { Tag, Skeleton } from 'antd'
import SizeImgUpload from './SIzeImgUpload'

const EditProduct = () => {
    const [imgUpLoading, setimgUpLoading] = useState(false)
    const [sizeChartImg, setSizeChartImg] = useState(false)
    const [categoryDefaultValue, setcategoryDefaultValue] = useState({ label: 'Select', value: 0 })
    const [subCategoryDefaultValue, setsubCategoryDefaultValue] = useState({ label: 'Select', value: 0 })
    const [childSubCategoryDefaultValue, setchildSubCategoryDefaultValue] = useState({ label: 'Select', value: 0 })
    const [productTypeDefaultValue, setproductTypeDefaultValue] = useState({ label: 'Select', value: 0 })
    const [businessDefaultValue, setbusinessDefaultValue] = useState({ label: 'Select', value: 0 })
    const history = useHistory()
    const { productID } = useParams()
    const CatRef = useRef()
    const SubCatRef = useRef()
    const ChildSubCatRef = useRef()
    const ProductTypeRef = useRef()
    const [percent, setpercent] = useState(0)
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))

    const [isLoading, setisLoading] = useState(false)
    const [AdditionalInfoData, setAdditionalInfoData] = useState([])

    const [optional_Dynamic_data, setoptional_Dynamic_data] = useState({})
    const [optional_entityName, setoptional_entityName] = useState({})
    const [additional_fixed_data, setAdditional_fixed_Inputs] = useState({})
    const [optional_data, setoptional_data] = useState({
        product_weight: '',
        product_quantity: 0,
        product_price: 0
    })
    const [DynamicItems, setDynamicItems] = useState([])
    const [NumberOfItemCard, setNumberOfItemCard] = useState([1])
    const [CategoryList, setCategoryList] = useState([])
    const [SubCategoryList, setSubCategoryList] = useState([])
    const [ChildSubCategoryList, setChildSubCategoryList] = useState([])
    const [ProductTypes, setProductTypes] = useState([])
    const [FilteredSubCategoryList, setFilteredSubCategoryList] = useState([])
    const [FilteredChildSubCategoryList, setFilteredChildSubCategoryList] = useState([])
    const [FilteredProductTypes, setFilteredProductTypes] = useState([])
    const [fileUrls, setFileUrls] = useState([])
    const [product_video_link, setproduct_video_link] = useState('')
    const [state, setState] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: []
    })
    const [sizeState, setsizeState] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: []
    })
    const [sizefileUrls, setsizeFileUrls] = useState([])
    const [ProdDetails, setProdDetails] = useState({})
    const [userInput, setUserInput] = useState({
        product_name: '',
        product_description: '',
        product_category: null,
        product_subCategory: null,
        product_childCategory: null,
        product_type: null,
        discount_offer: '',
        discount_startDate: '',
        discount_endDate: '',
        delivery_time_from: 0,
        delivery_time_to: 0,
        RRP: 0,
        VatTax: 0,
        return_allow: false,
        return_terms_and_condition: '',
        return_day_interval: 0,
        business_id: BusinessList[0].id,
        TaxRate: 0,
        Quota: 0,
        IsBudget: false,
        is_customer_order_allow: false,
        budget: 0
    })

    useEffect(() => {
        useJwt.SingleProductDetailsApi({ productid: productID }).then(res => {
            //console.log('ProdDetails', res.data.payload)
            setProdDetails(res.data.payload)
            const MainData = res.data.payload
            setbusinessDefaultValue({ value: MainData.business_name, label: MainData.business_name })
            setcategoryDefaultValue({ value: MainData.categoryinfo.categoryname, label: MainData.categoryinfo.categoryname })
            setsubCategoryDefaultValue({ value: MainData.subcategoryinfo.subcategoryname, label: MainData.subcategoryinfo.subcategoryname })

            setUserInput({
                product_name: MainData.productname,
                product_description: MainData.productdetails,
                product_category: MainData.categoryid,
                product_subCategory: MainData.subcategoryid,
                product_childCategory: MainData.child_subcategory_id,
                product_type: MainData.product_type_id,
                discount_offer: MainData.discount_percent,
                discount_startDate: MainData.discount_startdate,
                discount_endDate: MainData.discount_enddate,
                delivery_time_from: MainData.delivery_startdate_interval,
                delivery_time_to: MainData.delivery_enddate_interval,
                VatTax: MainData.vatrat_percent,
                return_allow: MainData.return_allow,
                return_terms_and_condition: MainData.return_terms_and_condition,
                return_day_interval: MainData.return_day_interval,
                business_id: MainData.business_id,
                TaxRate: MainData.taxrate_percent,
                Quota: MainData.discount_quota,
                IsBudget: !!MainData.discount_budget,
                is_customer_order_allow: MainData.is_customer_order_allow,
                budget: MainData.discount_budget
            })
            setproduct_video_link(MainData.product_video_link)
            // setFileUrls(MainData.product_optional_image.map((x, index) => { return { id: index, img: x } }))
            setState({
                ...state,
                fileList: MainData.product_optional_image.map((x, index) => {
                    return {
                        uid: index + 1,
                        name: 'image.png',
                        status: 'done',
                        type: "image/jpeg",
                        url: x
                    }
                })
            })
            setFileUrls(MainData.product_optional_image.map((x, index) => {
                return {
                    uid: index + 1,
                    name: 'image.png',
                    status: 'done',
                    type: "image/jpeg",
                    url: x
                }
            }))
            setsizeState({
                ...sizeState,
                fileList: MainData.sizechart_url ? [
                    {
                        uid: 1,
                        name: 'image.png',
                        status: 'done',
                        type: "image/jpeg",
                        url: MainData.sizechart_url
                    }
                ] : []
            })
            setsizeFileUrls(MainData.sizechart_url ? [
                {
                    uid: 1,
                    name: 'image.png',
                    status: 'done',
                    type: "image/jpeg",
                    url: MainData.sizechart_url
                }
            ] : [])
            if (!MainData.product_type_id || MainData.is_customer_order_allow) {
                setoptional_data(MainData.optional_data[0])
            }
            //category list..
            useJwt.productcategorylist().then(res => {
                // console.log(res.data.payload)
                setCategoryList(res.data.payload)
            }).catch(err => {
                console.log(err.response)
                Error(err)
            })
            //subcategory list..
            useJwt.productsubcategorylist().then(res => {
                // console.log(res.data.payload)
                setFilteredSubCategoryList(res.data.payload.filter(x => x.categoryid === MainData.categoryid))
                setSubCategoryList(res.data.payload)
            }).catch(err => {
                console.log(err.response)
                Error(err)
            })
            // childsubcategorylist
            useJwt.ChildSubcategoryListAPi().then(res => {
                // console.log(res.data.payload)
                // console.log(res.data.payload.find(x => x.id === MainData.child_subcategory_id))
                if (MainData.child_subcategory_id) {
                    const childsubcatname = res.data.payload.find(x => x.id === MainData.child_subcategory_id).name
                    setchildSubCategoryDefaultValue({ value: childsubcatname, label: childsubcatname })
                }
                setFilteredChildSubCategoryList(res.data.payload.filter(x => x.subcategory_id === MainData.subcategoryid))
                setChildSubCategoryList(res.data.payload)
            }).catch(err => {
                console.log(err)
                Error(err)
            })
            useJwt.ProductTypeListAPi().then(res => {
                // console.log(res.data.payload)
                if (MainData.product_type_id) {
                    const pTypeName = (res.data.payload.find(x => x.product_type_id === MainData.product_type_id).type_name)
                    setproductTypeDefaultValue({ value: pTypeName, label: pTypeName })
                }
                setFilteredProductTypes(res.data.payload.filter(x => x.child_subcategory_id === MainData.child_subcategory_id))
                // const options = res.data.payload.map(x => { return { value: x.product_type_id, label: x.type_name } })
                setProductTypes(res.data.payload)

                // set product type items 
                const selectedObj = res.data.payload.find(item => item.product_type_id === MainData.product_type_id)
                // console.log(selectedObj.additional_dynamic_data)
                function toObject(arr) {
                    const obj = {}
                    for (let i = 0; i < arr.length; ++i) {
                        obj[arr[i]] = ''
                    }
                    return obj
                }
                // console.log(toObject(selectedObj.additional_dynamic_data.map(x => x.entity_name)))
                if (selectedObj.additional_dynamic_data.map(x => x.entity_name).includes("product_size")) {
                    setSizeChartImg(true)
                } else {
                    setSizeChartImg(false)
                }

                setAdditionalInfoData(selectedObj.additional_fixed_data)
                setoptional_entityName({ ...toObject(selectedObj.additional_dynamic_data.map(x => x.entity_name)), IsDefault: false, IsDup: false })

                // const Additional_fixed_obj = MainData.optional_data[0]
                // const sliced = Object.fromEntries(
                //     Object.entries(Additional_fixed_obj).slice(0, 4)
                // )
                // res.data.payload[0].additional_dynamic_data.map((x, i) => {
                //     dynamic_labal_names[i] = x.label
                //     dynamic_key_names[i] = x.entity_name
                // })
                const aditnlData = selectedObj.additional_fixed_data.map((x, i) => x.entity_name)
                const p = { ...MainData.optional_data[0] }
                const newOBJ = {}
                for (const key in p) {
                    if (aditnlData.includes(String(key))) {
                        newOBJ[key] = p[key]
                    }
                }
              //  console.log(newOBJ)
                setAdditional_fixed_Inputs(newOBJ)

                const str = MainData.optional_data
                let dynamicObj = {}
                for (let i = 1; i <= str.length; i++) {
                    dynamicObj = ({ ...dynamicObj, [i]: { ...str[i - 1], IsDefault: Number(str[i - 1].product_price) === MainData.RRP, IsDup: false, no_product_color: !str[i - 1].product_color, no_product_size: !str[i - 1].product_size } })
                }

                //console.log({ ...dynamicObj })
                setoptional_Dynamic_data({ ...dynamicObj })

                // setoptional_Dynamic_data({
                //     1: { ...toObject(selectedObj.additional_dynamic_data.map(x => x.entity_name)), IsDefault: true, IsDup: false },
                //     2: { ...toObject(selectedObj.additional_dynamic_data.map(x => x.entity_name)), IsDefault: false, IsDup: false }
                // })
                setDynamicItems(selectedObj.additional_dynamic_data.map(x => {
                    // if (x.entity_name === "product_color") {
                    //     x.allow_values.push({ label: "Others", value: "Others" })
                    // }
                    return x
                }))

                // const str = MainData.optional_data
                const a = []
                for (let i = 1; i <= str.length; i++) {
                    a.push(i)
                }
                setNumberOfItemCard(a)

            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
            Error(err)
        })

    }, [])

    const ResetStates = (Identity) => {
        setAdditionalInfoData([])
        setDynamicItems([])
        setNumberOfItemCard([])
        setAdditional_fixed_Inputs({})
        setoptional_Dynamic_data({})
        setSizeChartImg(false)
        setsizeFileUrls([])
        setsizeState({ previewVisible: false, previewImage: '', previewTitle: '', fileList: [] })
        if (Identity === 1) {
            setproductTypeDefaultValue({ label: 'Select', value: 0 })
            setFilteredProductTypes([])
        } else if (Identity === 2) {
            // setcategoryDefaultValue({ label: 'Select', value: 0 })
            // setsubCategoryDefaultValue({ label: 'Select', value: 0 })
            setchildSubCategoryDefaultValue({ label: 'Select', value: 0 })
            setproductTypeDefaultValue({ label: 'Select', value: 0 })
            setFilteredChildSubCategoryList([])
            setFilteredProductTypes([])
        } else if (Identity === 3) {
            // setcategoryDefaultValue({ label: 'Select', value: 0 })
            setsubCategoryDefaultValue({ label: 'Select', value: 0 })
            setchildSubCategoryDefaultValue({ label: 'Select', value: 0 })
            setproductTypeDefaultValue({ label: 'Select', value: 0 })
            setFilteredSubCategoryList([])
            setFilteredChildSubCategoryList([])
            setFilteredProductTypes([])
        }
    }
    const handleCategoryChange = (selected) => {
       // console.log(selected.value)
        setcategoryDefaultValue({ value: selected.value, label: selected.label })
        ResetStates(3)
        setUserInput({
            ...userInput, product_category: selected.value, product_subCategory: '', product_childCategory: '', product_type: ''
        })
        setTimeout(() => {
            setFilteredSubCategoryList(SubCategoryList.filter(x => x.categoryid === selected.value))
        }, 0)
    }
    const handleSubCategoryChange = (selected) => {
       // console.log(selected.value)
        setsubCategoryDefaultValue({ value: selected.value, label: selected.label })
        ResetStates(2)
        setUserInput({
            ...userInput, product_subCategory: selected.value, product_childCategory: '', product_type: ''
        })
        setTimeout(() => {
            setFilteredChildSubCategoryList(ChildSubCategoryList.filter(x => x.subcategory_id === selected.value))
        }, 0)
    }
    const handleChildSubCategoryChange = (selected) => {
        //console.log(selected.value)
        setchildSubCategoryDefaultValue({ value: selected.value, label: selected.label })
        ResetStates(1)
        setUserInput({
            ...userInput, product_childCategory: selected.value, product_type: ''
        })
        setTimeout(() => {
            setFilteredProductTypes(ProductTypes.filter(x => x.child_subcategory_id === selected.value))
        }, 0)
    }
    const handleProductTypeChange = (selected) => {
        setproductTypeDefaultValue({ value: selected.value, label: selected.label })
        setUserInput({
            ...userInput, product_type: selected.value
        })
        const selectedObj = ProductTypes.find(item => item.product_type_id === selected.value)

        // console.log(selectedObj.additional_dynamic_data)
        function toObject(arr) {
            const obj = {}
            for (let i = 0; i < arr.length; ++i) { obj[arr[i]] = '' }
            return obj
        }
        // console.log(toObject(selectedObj.additional_dynamic_data.map(x => x.entity_name)))
        if (selectedObj.additional_dynamic_data.map(x => x.entity_name).includes("product_size")) {
            setSizeChartImg(true)
        } else {
            setSizeChartImg(false)
        }

        setAdditionalInfoData(selectedObj.additional_fixed_data)
        setoptional_entityName({ ...toObject(selectedObj.additional_dynamic_data.map(x => x.entity_name)), IsDefault: false, IsDup: false, no_product_color: false, no_product_size: false })
        setoptional_Dynamic_data({
            1: { ...toObject(selectedObj.additional_dynamic_data.map(x => x.entity_name)), IsDefault: true, IsDup: false, no_product_color: false, no_product_size: false }
        })
        setDynamicItems(selectedObj.additional_dynamic_data.map(x => {
            // if (x.entity_name === "product_color") {
            //     x.allow_values.push({ label: "Others", value: "Others" })
            // }
            return x
        }))
        setNumberOfItemCard([])
        setTimeout(() => setNumberOfItemCard([1]), 0)
    }

    const handleChange = (e) => {
        // console.log(fileUrls.map(x => x.img))
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (imgUpLoading) {
            toast.error("Please wait, Image is uploading...")
            return 0
        }
        const {
            product_name, product_description, product_category, product_subCategory, product_childCategory, product_type, discount_offer, discount_startDate, discount_endDate, delivery_time_from, delivery_time_to, VatTax, return_allow, return_terms_and_condition, return_day_interval, business_id, TaxRate, Quota, IsBudget, budget, is_customer_order_allow
        } = userInput
        //console.log(fileUrls)
        const imgUrls = fileUrls.map(x => x.url)
        const sizechart_url = sizefileUrls.length ? sizefileUrls.map(x => x.url)[0] : ''

        if (!imgUrls.length) {
            toast.error('Please upload your product Image')
            return
        }
        if (0 < Number(percent) && Number(percent) < 99) {
            toast.error('Please wait, your video is uploading...')
            return
        }
        // if (!product_video_link) {
        //     toast.error('Please upload your product Video')
        // }
        const DynamicData = Object.values(optional_Dynamic_data)

        // *********************************************
        const arr = [...DynamicData]
        const duplicateIds = arr.map(e => e['product_size']).map((e, i, final) => final.indexOf(e) !== i && i).filter(obj => arr[obj]).map(e => arr[e]["product_size"])

        const duplicateNames = arr.map(e => e['product_color']).map((e, i, final) => final.indexOf(e) !== i && i).filter(obj => arr[obj]).map(e => arr[e]["product_color"])

        const duplicate = arr.filter(obj => duplicateIds.includes(obj.product_size) && duplicateNames.includes(obj.product_color))

        // console.log(duplicate, duplicate[0].product_color)
        //*********************************
        if (duplicate.length && duplicate[0].product_color) {
            const p = { ...optional_Dynamic_data }
            const newOBJ = {}
            for (const key in p) {
                if (duplicate[0].product_size === p[key].product_size && duplicate[0].product_color === p[key].product_color) {
                    newOBJ[key] = { ...p[key], IsDup: true }
                    // p[key].IsDefault = e.target.checked
                } else {
                    newOBJ[key] = { ...p[key], IsDup: false }
                    // p[Number(key)].IsDefault = false
                }
            }
            console.log("newObj", newOBJ)
            setoptional_Dynamic_data(newOBJ)
            toast.error("Duplicate item found!")
            return 0
        }
        // ******************************************************
        // console.log(Object.values(optional_Dynamic_data).find(x => x.IsDefault)["product_price"])
        const RRP = (product_type && !is_customer_order_allow) ? Object.values(optional_Dynamic_data).find(x => x.IsDefault)["product_price"] : optional_data.product_price

        let modify4ColornSize
        if (DynamicData.length === 1) {
            modify4ColornSize = DynamicData.map(x => {
                if (x.no_product_size) {
                    delete x.product_size
                }
                if (x.no_product_color) {
                    delete x.product_color
                }
                if (x.product_length && !x.product_width) {
                    const obj = { ...x, product_width: '', ...additional_fixed_data }
                    return obj
                } else if (!x.product_length && x.product_width) {
                    const obj = { ...x, product_length: '', ...additional_fixed_data }
                    return obj
                } else { return { ...x, ...additional_fixed_data } }
            })
        } else {
            modify4ColornSize = DynamicData.map(x => {
                const AllNoColor = DynamicData.map(y => y.no_product_color).every(z => z === true)
                const AllNoSize = DynamicData.map(y => y.no_product_size).every(z => z === true)
                if (x.no_product_size || AllNoSize) {
                    delete x.product_size
                }
                if (x.no_product_color && AllNoColor) {
                    delete x.product_color
                } else if (x.no_product_color) {
                    x.product_color = ''
                }
                if (x.product_length && !x.product_width) {
                    const obj = { ...x, product_width: '', ...additional_fixed_data }
                    return obj
                } else if (!x.product_length && x.product_width) {
                    const obj = { ...x, product_length: '', ...additional_fixed_data }
                    return obj
                } else { return { ...x, ...additional_fixed_data } }
            })
        }
         //console.log('additional_fixed_data ', additional_fixed_data)
        const newDynamicData = [...modify4ColornSize]
        const modify4delete = newDynamicData.map(x => {
            delete x.IsDefault
            delete x.IsDup
            delete x.no_product_color
            delete x.no_product_size
            return x
        })

        const submitData = {
            ...ProdDetails,
            business_id,
            product_optional_image: imgUrls.length ? imgUrls : [],
            productname: product_name,
            RRP: Number(RRP),
            categoryid: product_category,
            subcategoryid: product_subCategory || null,
            child_subcategory_id: product_childCategory || null,
            product_type_id: product_type || null,
            productdetails: product_description,
            discount_percent: Number(discount_offer) || 0,
            discount_startdate: discount_startDate,
            discount_enddate: discount_endDate,
            vatrat: Number(VatTax),
            delivery_startdate_interval: 5, //parseInt(delivery_time_from),
            delivery_enddate_interval: 10, // parseInt(delivery_time_to),
            return_allow,
            return_day_interval: Number(return_day_interval),
            return_terms_and_condition,
            optional_data: (!product_type || is_customer_order_allow) ? [{...optional_data, ...additional_fixed_data}] : modify4delete,
            location: '',
            taxrate: Number(TaxRate),
            discount_quota: Quota,
            discount_budget: budget,
            is_customer_order_allow,
            sizechart_url,
            product_video_link
        }

       // console.log(submitData)
        // alert('Done')
        setisLoading(true)
        useJwt.updateproductApi(submitData).then(res => {
            setisLoading(false)
            console.log(res)
            Success(res)
            // history.goBack()
            history.push('/allproduct')
        }).catch(err => {
            // history.goBack()
            history.push('/allproduct')
            setisLoading(false)
            console.log(err.response)
            Error(err)
        })
    }
    return (
        <Fragment>
            <Button.Ripple className='ml-2 mb-2' color='primary' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            {BusinessList.length > 1 && <Card>
                <CardHeader className='border-bottom mb-1'>
                    <CardTitle tag='h5'>Business Info</CardTitle>
                </CardHeader>
                <CardBody>
                    <Label for="Business">Select a Business</Label>&nbsp;<span className="text-danger">*</span>
                    <Select
                        theme={selectThemeColors}
                        maxMenuHeight={200}
                        className='react-select'
                        classNamePrefix='select'
                        value={businessDefaultValue}
                        onChange={(selected) => {
                            setbusinessDefaultValue({ value: selected.value, label: selected.label })
                            setUserInput({ ...userInput, business_id: selected.value })
                        }}
                        options={BusinessList.map(x => { return { value: x.id, label: x.businessname } })}
                    />
                </CardBody>
            </Card>}
            {ProdDetails.productname ? <><Row className="match-height">
                <Col xl="6" md="12">
                    <Card>
                        <CardHeader className='border-bottom mb-1'>
                            <CardTitle tag='h5'>Product Images</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {/* {fileUrls.length ? <div className='d-flex flex-wrap'>
                                {
                                    fileUrls.map((image, index) => <img key={index} src={image.url} alt="product image"
                                        style={{ width: '100px', margin: '0px 5px 5px 0px' }} />
                                    )
                                }
                            </div> : ''} */}
                            <ProductImgUpload
                                setimgUpLoading={setimgUpLoading}
                                state={state}
                                setState={setState}
                                fileUrls={fileUrls}
                                setFileUrls={setFileUrls} />
                        </CardBody>
                    </Card>
                </Col>
                <Col xl="6" md="12">
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h5'>Product Video</CardTitle>
                            {ProdDetails.product_video_link ? <CardTitle tag='h5'>
                                <Button.Ripple color='danger' size='sm' onClick={e => {
                                    setproduct_video_link('')
                                    setProdDetails({ ...ProdDetails, product_video_link: '' })
                                }}>
                                    Delete
                                </Button.Ripple>
                            </CardTitle> : ''}
                        </CardHeader>
                        <div className="d-flex">
                            {ProdDetails.product_video_link ? <CardBody>
                                {
                                    ProdDetails.product_video_link.includes("youtube") ? <iframe width="100%" height="200"
                                        src={`https://www.youtube.com/embed/${/[^=]*$/.exec(ProdDetails.product_video_link)[0]}` || ''}>
                                    </iframe> : <video style={{ marginTop: "3px" }} width="100%" height="200" controls src={ProdDetails.product_video_link || ''}>
                                        Your browser does not support the video tag.
                                    </video>
                                }
                            </CardBody> : ''}
                            <CardBody>
                                <ProductVideoUpload
                                    percent={percent}
                                    setpercent={setpercent}
                                    setproduct_video_link={setproduct_video_link}
                                    BusinessID={userInput.business_id} />
                            </CardBody>
                        </div>
                    </Card>
                </Col>
            </Row>


                <Form style={{ width: '100%' }} onSubmit={handleSubmit} autoComplete="off">
                    <Card>
                        <CardHeader className='border-bottom mb-1'>
                            <CardTitle tag='h5'>Product Info</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col sm="6" >
                                    <FormGroup>
                                        <Label for="product_name">Product Name</Label>
                                        <Input
                                            required
                                            // autoFocus
                                            placeholder="Name"
                                            type='text'
                                            name='product_name'
                                            value={userInput.product_name}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                {/* <Col sm="3" >
                                <FormGroup>
                                    <Label for="RRP">RRP</Label>
                                    <Input
                                        required
                                        placeholder="RRP"
                                        type='number'
                                        name='RRP'
                                        value={userInput.RRP}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col> */}
                                <Col sm="3" >
                                    <FormGroup>
                                        <Label for="product_category">Category</Label>
                                        <Select
                                            ref={CatRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={categoryDefaultValue}
                                            onChange={handleCategoryChange}
                                            options={CategoryList.map(x => { return { value: x.id, label: x.categoryname } })}
                                        // isClearable
                                        />
                                        <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => CatRef.current.select.focus()}
                                            value={userInput.product_category || ''}
                                            onChange={e => ''}
                                        />
                                    </FormGroup>
                                </Col>
                                {FilteredSubCategoryList.length ? <Col sm="3" >
                                    <FormGroup>
                                        <Label for="product_subCategory">Sub Category</Label>
                                        <Select
                                            ref={SubCatRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={subCategoryDefaultValue}
                                            onChange={handleSubCategoryChange}
                                            options={FilteredSubCategoryList.map(x => { return { value: x.id, label: x.subcategoryname } })}
                                        // isClearable
                                        />
                                        <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => SubCatRef.current.select.focus()}
                                            value={userInput.product_subCategory || ''}
                                            onChange={e => ''}
                                        />
                                    </FormGroup>
                                </Col> : ''}
                                {FilteredChildSubCategoryList.length ? <Col sm="3" >
                                    <FormGroup>
                                        <Label for="product_childCategory">Child Category</Label>
                                        <Select
                                            ref={ChildSubCatRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={childSubCategoryDefaultValue}
                                            onChange={handleChildSubCategoryChange}
                                            options={FilteredChildSubCategoryList.map(x => { return { value: x.id, label: x.name } })}
                                        // isClearable
                                        />
                                        <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => ChildSubCatRef.current.select.focus()}
                                            value={userInput.product_childCategory || ''}
                                            onChange={e => ''}
                                        />
                                    </FormGroup>
                                </Col> : ''}
                                {FilteredProductTypes.length ? <Col sm="3" >
                                    <FormGroup>
                                        <Label for="product_type">Product Type</Label>
                                        <Select
                                            ref={ProductTypeRef}
                                            theme={selectThemeColors}
                                            maxMenuHeight={200}
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={productTypeDefaultValue}
                                            onChange={handleProductTypeChange}
                                            options={FilteredProductTypes.map(x => { return { value: x.product_type_id, label: x.type_name } })}
                                            // isClearable
                                            isLoading={!FilteredProductTypes.length}
                                        />
                                        <Input
                                            required
                                            style={{
                                                opacity: 0,
                                                width: "100%",
                                                height: 0
                                                // position: "absolute"
                                            }}
                                            onFocus={e => ProductTypeRef.current.select.focus()}
                                            value={userInput.product_type || ''}
                                            onChange={e => ''}
                                        />
                                    </FormGroup>
                                </Col> : ''}
                                <Col sm="12" >
                                    <FormGroup>
                                        <Label for="product_description">Product Description</Label>
                                        <Input
                                            required
                                            placeholder="Description"
                                            type='textarea'
                                            name='product_description'
                                            value={userInput.product_description}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>

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
                                    AdditionalInfoData.map((item, index) => <Col sm="3" key={index}>
                                        <FormGroup>
                                            <Label for={item.label}>{item.label}</Label>
                                            <Input
                                                placeholder={item.label}
                                                type='text'
                                                required
                                                name={item.entity_name}
                                                value={additional_fixed_data[item.entity_name] || ""}
                                                onChange={e => setAdditional_fixed_Inputs({ ...additional_fixed_data, [e.target.name]: e.target.value })}
                                            />
                                        </FormGroup>
                                    </Col>
                                    )
                                }
                            </Row>
                        </CardBody>
                    </Card> : ''}
                    <Row>
                        <Col md='12'>
                            <Card>
                                <CardHeader className='border-bottom mb-1'>
                                    <CardTitle tag='h5'>Discount</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="4" >
                                            <FormGroup>
                                                <Label for="discount_offer">Discount Offer (%)</Label>
                                                <Input
                                                    // required
                                                    type='number'
                                                    placeholder='5%'
                                                    min={0}
                                                    max={100}
                                                    name='discount_offer'
                                                    value={userInput.discount_offer}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        {Number(userInput.discount_offer) > 0 ? <>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="discount_startDate">Start Date</Label>
                                                    <Input
                                                        required
                                                        type='date'
                                                        // min={new Date().toLocaleDateString('fr-CA')}
                                                        name='discount_startDate'
                                                        value={new Date(userInput.discount_startDate).toLocaleDateString('fr-CA')}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="discount_endDate"> End Date</Label>
                                                    <Input
                                                        required
                                                        type='date'
                                                        min={userInput.discount_startDate ? userInput.discount_startDate : new Date().toLocaleDateString('fr-CA')}
                                                        name='discount_endDate'
                                                        value={new Date(userInput.discount_endDate).toLocaleDateString('fr-CA')}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="Quota">Quota</Label>
                                                    <Input
                                                        type='number'
                                                        placeholder='5'
                                                        name='Quota'
                                                        required={!userInput.IsBudget}
                                                        min={!userInput.IsBudget ? 1 : 0}
                                                        value={userInput.Quota}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="IsBudget">Is Budget?</Label>
                                                    <CustomInput
                                                        style={{ zIndex: '0' }}
                                                        className='mt-1'
                                                        onChange={(e) => setUserInput({
                                                            ...userInput, IsBudget: e.target.checked
                                                        })}
                                                        checked={userInput.IsBudget}
                                                        type='checkbox'
                                                        id={'IsBudget'}
                                                        label='Yes'
                                                    // inline
                                                    />
                                                </FormGroup>
                                            </Col>
                                            {userInput.IsBudget && <Col sm="4" >
                                                <FormGroup>
                                                    <Label for="budget">Budget</Label>
                                                    <Input
                                                        required={userInput.IsBudget}
                                                        type='number'
                                                        placeholder='5'
                                                        name='budget'
                                                        min={userInput.IsBudget ? 1 : 0}
                                                        value={userInput.budget}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>}
                                        </> : ''}
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='6'>
                            <Card>
                                <CardHeader className='border-bottom mb-1'>
                                    <CardTitle tag='h5'>Vat / Tax</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="6" >
                                            <FormGroup>
                                                <Label for="VatTax">Vat (%)</Label>
                                                <Input
                                                    required
                                                    type='number'
                                                    placeholder='5%'
                                                    name='VatTax'
                                                    min={0}
                                                    max={100}
                                                    value={userInput.VatTax}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm="6" >
                                            <FormGroup>
                                                <Label for="TaxRate">Tax(%)</Label>
                                                <Input
                                                    required
                                                    type='number'
                                                    placeholder='5%'
                                                    name='TaxRate'
                                                    min={0}
                                                    max={100}
                                                    value={userInput.TaxRate}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col sm="6">
                        <Card>
                                <CardHeader className='border-bottom mb-1'>
                                    <CardTitle tag='h5'>Custom Order</CardTitle>
                                </CardHeader>
                                <CardBody>
                                   <Row>
                                   <Col sm="12">
                                   
                                   <FormGroup>
                                        <Label>Allow Custom Order</Label>
                                        <CustomInput
                                            style={{ zIndex: '0' }}
                                            className='mt-1'
                                            onChange={(e) => setUserInput({ ...userInput, is_customer_order_allow: e.target.checked })}
                                            checked={userInput.is_customer_order_allow}
                                            type='checkbox'
                                            id={'is_customer_order_allow'}
                                            label='Yes'
                                        // inline
                                        />
                                    </FormGroup>

                                   </Col>

                                   </Row>
                                </CardBody>
                                </Card>

                                </Col>
                        {/*<Col md='6'>
                            <Card>
                                <CardHeader className='border-bottom mb-1'>
                                    <CardTitle tag='h5'>Delivery Time</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="6" >
                                            <FormGroup>
                                                <Label for="delivery_time_from">From</Label>
                                                <Input
                                                    required
                                                    type='number'
                                                    min={1}
                                                    placeholder="10 Days"
                                                    name='delivery_time_from'
                                                    value={userInput.delivery_time_from}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm="6" >
                                            <FormGroup>
                                                <Label for="delivery_time_to">To</Label>
                                                <Input
                                                    required
                                                    type='number'
                                                    placeholder="15 Days"
                                                    min={userInput.delivery_time_from ? (Number(userInput.delivery_time_from) + 1) : 1}
                                                    name='delivery_time_to'
                                                    value={userInput.delivery_time_to}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col> */}
                        <Col md='12'>
                            <Row className="match-height">
                                {sizeChartImg && <Col xl="6" md="6">
                                    <Card>
                                        <CardHeader className='border-bottom mb-1'>
                                            <CardTitle tag='h5'>Size Chart Image</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <SizeImgUpload
                                                setimgUpLoading={setimgUpLoading}
                                                state={sizeState}
                                                setState={setsizeState}
                                                fileUrls={sizefileUrls}
                                                setFileUrls={setsizeFileUrls} />
                                        </CardBody>
                                    </Card>
                                </Col>}
                                <Col xl={sizeChartImg ? '6' : '12'} md={sizeChartImg ? '6' : '12'}>
                                    <Card>
                                        <CardHeader className='border-bottom mb-1'>
                                            <CardTitle tag='h5'>Product Return Policy</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col sm="6" >
                                                    <FormGroup>
                                                        <Label for="return_allow">Allow Return For this Product?</Label>
                                                        <CustomInput
                                                            style={{ zIndex: '0' }}
                                                            className='mt-1'
                                                            onChange={(e) => setUserInput({
                                                                ...userInput, return_allow: e.target.checked, return_terms_and_condition: '', return_day_interval: 0
                                                            })}
                                                            checked={userInput.return_allow}
                                                            type='checkbox'
                                                            id={'return_allow'}
                                                            label='Yes'
                                                        // inline
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                {userInput.return_allow && <>
                                                    <Col sm="6" >
                                                        <FormGroup>
                                                            <Label for="return_day_interval">Interval</Label>
                                                            <Input
                                                                required
                                                                type='number'
                                                                placeholder="3 Days"
                                                                min={1}
                                                                name='return_day_interval'
                                                                value={userInput.return_day_interval}
                                                                onChange={handleChange}
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm="12" >
                                                        <FormGroup>
                                                            <Label for="return_terms_and_condition">Terms & Conditions</Label>
                                                            <Input
                                                                required
                                                                type='textarea'
                                                                placeholder="which condition basis you accept this damage product like if faulty product"
                                                                name='return_terms_and_condition'
                                                                value={userInput.return_terms_and_condition}
                                                                onChange={handleChange}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </>}
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>

                        {!userInput.product_type || userInput.is_customer_order_allow ? <Col md='12'>
                            <Card>
                                <CardHeader className='border-bottom mb-1'>
                                    <CardTitle tag='h5'>Optional Info</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="4" >
                                            <FormGroup>
                                                <Label for="product_weight">Product Weight</Label>
                                                <Input
                                                    required
                                                    type='text'
                                                    min={1}
                                                    placeholder="3kg"
                                                    name='product_weight'
                                                    value={optional_data.product_weight}
                                                    onChange={e => setoptional_data({ ...optional_data, [e.target.name]: e.target.value })}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col sm="4" >
                                            <FormGroup>
                                                <Label for="product_quantity">Product Quantity</Label>
                                                <Input
                                                    required
                                                    type='number'
                                                    placeholder="5"
                                                    name='product_quantity'
                                                    value={optional_data.product_quantity}
                                                    onChange={e => setoptional_data({ ...optional_data, [e.target.name]: e.target.value })}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm="4" >
                                            <FormGroup>
                                                <Label for="product_price">Product Price</Label>
                                                <Input
                                                    required
                                                    type='number'
                                                    placeholder="499"
                                                    name='product_price'
                                                    value={optional_data.product_price}
                                                    onChange={e => setoptional_data({ ...optional_data, [e.target.name]: e.target.value })}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col> : ''}
                    </Row>

                    {DynamicItems.length && optional_Dynamic_data && !userInput.is_customer_order_allow ? <Row>
                        {
                            NumberOfItemCard.map((element, index) => <Col md='6' key={index}>
                                <Card >
                                    <CardHeader className='border-bottom mb-1'>
                                        {optional_Dynamic_data[element]["IsDup"] ? <CardTitle className='text-danger' tag='h5'>Item{element} has duplicate size & color</CardTitle> : <CardTitle tag='h5'>Item{element}</CardTitle>}
                                        {/* <CardTitle tag='h5'>Item{element}</CardTitle> */}
                                        <CardTitle tag='h5'>
                                            {NumberOfItemCard.length !== 1 && < Button.Ripple className={optional_Dynamic_data[element]["IsDup"] ? 'pulse' : ''} color='danger' size='sm' disabled={optional_Dynamic_data[element].IsDefault} onClick={e => {
                                                // console.log(NumberOfItemCard.filter(x => x !== element))
                                                const updatedOpDdata = { ...optional_Dynamic_data }
                                                delete updatedOpDdata[element]
                                                const p = { ...updatedOpDdata }
                                                const newOBJ = {}
                                                for (const key in p) {
                                                    newOBJ[key] = { ...p[key], IsDup: false }
                                                }
                                                setoptional_Dynamic_data(newOBJ)
                                                setNumberOfItemCard(NumberOfItemCard.filter(x => x !== element))
                                            }
                                            }>
                                                <span>X</span>
                                            </Button.Ripple>}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            {
                                                DynamicItems.map((item, index) => <Col sm="6" key={index}>
                                                    <FormGroup>
                                                        <Label for={item.label}>{item.label}</Label>
                                                        {
                                                            !item.is_key_value_pair_array && !item.is_normal_array ? <Input
                                                                placeholder={item.label}
                                                                type='number'
                                                                required
                                                                name={item.entity_name}
                                                                value={optional_Dynamic_data[element][item.entity_name]}
                                                                onChange={e => {
                                                                    console.log(optional_Dynamic_data)
                                                                    // console.log(element)
                                                                    setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], [e.target.name]: e.target.value } })
                                                                }}
                                                            /> : item.is_normal_array ? <div style={{
                                                                position: "relative"
                                                            }}> {!optional_Dynamic_data[element].no_product_size && <><Select
                                                                theme={selectThemeColors}
                                                                className='react-select'
                                                                classNamePrefix='select'
                                                                value={{
                                                                    label: optional_Dynamic_data[element][item.entity_name],
                                                                    value: optional_Dynamic_data[element][item.entity_name]
                                                                }}
                                                                onChange={e => {
                                                                    console.log(optional_Dynamic_data)
                                                                    setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], [item.entity_name]: e.value } })
                                                                }}
                                                                maxMenuHeight={200}
                                                                options={item.allow_values.map(x => { return { value: x, label: x } })}
                                                            // isClearable
                                                            // isLoading={!ProductTypes.length}
                                                            /><Input
                                                                    required
                                                                    style={{
                                                                        opacity: 0,
                                                                        width: "100%",
                                                                        height: 0,
                                                                        position: "absolute"
                                                                    }}
                                                                    value={optional_Dynamic_data[element] ? optional_Dynamic_data[element][item.entity_name] : ''}
                                                                    onChange={e => console.log(e)}
                                                                /></>}
                                                                {
                                                                    item.label === 'Product size' && <CustomInput
                                                                        style={{ zIndex: '0' }}
                                                                        className='mt-1'
                                                                        onChange={(e) => setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], product_size: '', no_product_size: e.target.checked } })
                                                                        }
                                                                        checked={optional_Dynamic_data[element].no_product_size}
                                                                        type='checkbox'
                                                                        id={`no_product_size${element}`}
                                                                        label='No size'
                                                                    />
                                                                }
                                                            </div> : item.label === 'Product color' ? <div style={{
                                                                position: "relative"
                                                            }}>
                                                                {optional_Dynamic_data[element][item.entity_name] ? <div style={{
                                                                    backgroundColor: `${optional_Dynamic_data[element][item.entity_name]}` || '#ffffff',
                                                                    height: '20px',
                                                                    width: '40px',
                                                                    border: '1px solid #efefef'
                                                                }}>
                                                                </div> : ''}
                                                                <div className='my-1'>
                                                                    <CustomInput
                                                                        style={{ zIndex: '0' }}
                                                                        className='mt-1'
                                                                        onChange={(e) => setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], product_color: '', no_product_color: e.target.checked } })
                                                                        }
                                                                        checked={optional_Dynamic_data[element].no_product_color}
                                                                        type='checkbox'
                                                                        id={`no_product_color${element}`}
                                                                        label='No color'
                                                                    // inline
                                                                    />
                                                                    <br />
                                                                    {!optional_Dynamic_data[element].no_product_color && <ChromePicker
                                                                        disableAlpha={true}
                                                                        color={optional_Dynamic_data[element] ? optional_Dynamic_data[element][item.entity_name] : ''}
                                                                        onChange={e => {
                                                                            // console.log(e)
                                                                            setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], product_color: e.hex, no_product_color: false } })
                                                                        }} />}
                                                                </div>
                                                            </div> : <div>
                                                                <Select
                                                                    theme={selectThemeColors}
                                                                    className='react-select'
                                                                    classNamePrefix='select'
                                                                    maxMenuHeight={150}
                                                                    value={{
                                                                        label: optional_Dynamic_data[element][item.entity_name],
                                                                        value: optional_Dynamic_data[element][item.entity_name]
                                                                    }}
                                                                    onChange={e => {
                                                                        // console.log(optional_Dynamic_data)
                                                                        // console.log(optional_Dynamic_data[element][item.entity_name])
                                                                        setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], [item.entity_name]: e.value } })
                                                                    }}
                                                                    options={item.allow_values}
                                                                // isClearable
                                                                // isLoading={!ProductTypes.length}
                                                                />
                                                                <Input
                                                                    required
                                                                    style={{
                                                                        opacity: 0,
                                                                        width: "100%",
                                                                        height: 0,
                                                                        position: "absolute"
                                                                    }}
                                                                    value={optional_Dynamic_data[element] ? optional_Dynamic_data[element][item.entity_name] : ''}
                                                                    onChange={e => ''}
                                                                />
                                                            </div>
                                                        }
                                                    </FormGroup>
                                                </Col>)
                                            }
                                            {/* {optional_Dynamic_data[element] ? optional_Dynamic_data[element].product_color === 'Others' && <Col sm="12" >
                                            <FormGroup>
                                                <CirclePicker
                                                    colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]}
                                                    onChange={e => {
                                                        // console.log(e)
                                                        setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], product_color: e.hex } })
                                                    }} />
                                                <Label for="product_color">Type Color Name</Label>
                                                <Input
                                                    // required
                                                    placeholder="product color"
                                                    type='text'
                                                    name='custom_product_color'
                                                    value={optional_Dynamic_data[element] ? optional_Dynamic_data[element][product_color] : ''}
                                                    onChange={e => {
                                                        // console.log(element)
                                                        setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], [e.target.name]: e.target.value } })
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col> : ''} */}
                                            <Col sm="12" >
                                                <FormGroup>
                                                    <Label for="IsDefault">IsDefault</Label>
                                                    <br />
                                                    <Input
                                                        // style={{ zIndex: '0' }}
                                                        required={Object.values(optional_Dynamic_data).map(x => x.IsDefault).every((x) => x === false)}
                                                        className='ml-1 mt-1'
                                                        onChange={(e) => {
                                                            // setoptional_Dynamic_data({ ...optional_Dynamic_data, [element]: { ...optional_Dynamic_data[element], IsDefault: e.target.checked } })
                                                            const p = { ...optional_Dynamic_data }
                                                            console.log("p", p)
                                                            const newOBJ = {}
                                                            for (const key in p) {
                                                                if (Number(key) === element) {
                                                                    // console.log(Object.values(p).map(x => x.IsDefault).includes(true))
                                                                    const OneBoxChked = Object.values(p).map(x => x.IsDefault).includes(true)
                                                                    newOBJ[key] = { ...p[key], IsDefault: OneBoxChked ? true : e.target.checked }
                                                                    // p[key].IsDefault = e.target.checked
                                                                } else {
                                                                    newOBJ[key] = { ...p[key], IsDefault: false }
                                                                    // p[Number(key)].IsDefault = false
                                                                }
                                                            }
                                                            // console.log("newObj", newOBJ)
                                                            setoptional_Dynamic_data(newOBJ)
                                                        }}
                                                        disabled={NumberOfItemCard.length === 1}
                                                        checked={optional_Dynamic_data[element].IsDefault}
                                                        type='checkbox'
                                                        id={`IsDefault${element}`}
                                                    // label='Yes'
                                                    // inline
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <div className="float-right">
                                            {NumberOfItemCard.length === (index + 1) && <Button.Ripple
                                                color='info'
                                                size='sm'
                                                onClick={e => {
                                                    // console.log(NumberOfItemCard)
                                                    setoptional_Dynamic_data({ ...optional_Dynamic_data, [NumberOfItemCard[NumberOfItemCard.length - 1] + 1]: optional_entityName })
                                                    setNumberOfItemCard([...NumberOfItemCard, NumberOfItemCard[NumberOfItemCard.length - 1] + 1])
                                                }}>
                                                <span><Plus size={10} />&nbsp;Add more</span>
                                            </Button.Ripple>}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            )
                        }
                    </Row> : ''}

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
                                                <span>Upload Product</span>
                                            </Button.Ripple>
                                        }
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Form> </> : <Card>
                <CardBody>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </CardBody>
            </Card>}
        </Fragment >
    )
}

export default EditProduct