import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft } from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { FormFeedback, Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ImageUpload from '../basic/ImageUpload'
import 'antd/dist/antd.css'
import { Error, Success } from '../../../viewhelper'
import { useForm, Controller} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {AddProductFormValidation} from '../../../formvalidation'
const MySwal = withReactContent(Swal)

const AddNewProduct = () => {
    const history = useHistory()
    const { register, errors, handleSubmit} = useForm({ mode: 'onChange', resolver: yupResolver(AddProductFormValidation) })

    const [storeList, setStoreList] = useState([])
    const [addUserloading, setaddUserloading] = useState(false)
    const [userInput, setUserInput] = useState({
        status:1
    })
    const [barCodes, setBarCodes] = useState({})
    const [productCategoryList, setProductCategoryList] = useState([])
    const [productSubCategoryList, setProductSubCategoryList] = useState([])
    const [filteredSubCategory, setFilteredSubCategory] = useState([])
    const [generateInput, setgenerateInput] = useState([{ codeName: "Barcode" }])
    const [file, setFile] = useState(null)
    const [imgerror, setimgerror] = useState('')
    const [error, seterror] = useState({
        category: false,
        subCategory: false,
        storeID: false,
        status: false
    })

    useEffect(() => {
        useJwt.storeList().then(res => {
            // console.log(res.data.payload)
            const storeApi = res.data.payload.map(type => {
                return { value: type.storeid, label: type.storename }
            })
            setUserInput({ ...userInput, storeid: storeApi[0].value, storevalue:storeApi[0] })
            setStoreList(storeApi)
        }).catch(err => {
            console.log(err)
        })

        useJwt.productcategorylist().then(res => {
            console.log(res.data.payload)
            const data2 = res.data.payload.map(item => {
                return { value: item.id, label: item.categoryname }
            })
            setProductCategoryList(data2)
        }).catch(err => {
            console.log(err.response)
        })

        useJwt.productsubcategorylist().then(res => {
            console.log(res.data.payload)
            const data3 = res.data.payload.map(item => {
                return { value: item.id, label: item.subcategoryname }
            })
            setProductSubCategoryList(res.data.payload)
        }).catch(err => {
            console.log(err.response)
        })

    }, [])

    const handleCallback = (childData, imageUrl) => {
        setFile(childData)
    }

    const onChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onBarCodeChange = (e) => {
        setBarCodes({ ...barCodes, [e.target.name]: e.target.value })
        console.log(Object.values(barCodes))
    }
    const handleStoreName = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, storeid: null, storevalue:null })
        } else {
            setUserInput({ ...userInput, storeid: option.value, storevalue:{value:option.value, label:option.label} })
        }
    }
    const handleStatus = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, status: null })
        } else {
            setUserInput({ ...userInput, status: option.value })
        }
    }
    const handleProductCategory = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, categoryid: null, subcategoryid:null })
            setFilteredSubCategory([])
        } else {
            setUserInput({ ...userInput, categoryid: option.value, subcategoryid: null })
            const newSubCategories = productSubCategoryList.filter(x => x.categoryid === option.value)
            const data = newSubCategories.map(item => {
                return { value: item.id, label: item.subcategoryname }
            })
            setFilteredSubCategory(data)
            // setUserInput({ ...userInput, subcategoryid: null })
        }
    }
    const handleProductSubCategory = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, subcategoryid: null })
        } else {
            setUserInput({ ...userInput, subcategoryid: option.value })
        }
    }
    const handleAddBarcode = () => {
        const newArry = [...generateInput]
        const codeName = 'Barcode'
        // const Barcode = 'Barcode'
        if (newArry.length <= 2) {
            newArry.push({ codeName })
            setgenerateInput(newArry)
        }
        
        // console.log(generateInput)
    }
    const handleProductimage = (e) => {
        const newfile = e.target.files[0]
        setFile(newfile)
    }
    const onsubmit = (value) => {
        setimgerror('')
        //console.log('value ', value)
        //e.preventDefault()
        //console.log(' userInput ')
       // console.log(userInput, Object.values(barCodes))
        const allData = { ...userInput, ...value, barcode: Object.values(barCodes) }
        const { productname, productdetails, productsize, RRP, tillprice, unitvolume, status, quantity, stockalertminqty, barcode, location, categoryid, subcategoryid, storeid } = allData

       // console.log(categoryid)
        if (!file) {
            setimgerror('Image required')
            return 0
        }
        const formData = new FormData()
        formData.append('productimage', file)
        formData.append('productname', productname)
        formData.append('productdetails', productdetails)
        formData.append('productsize', productsize)
        formData.append('RRP', RRP ? RRP : 0)
        formData.append('tillprice', tillprice)
        formData.append('unitvolume', unitvolume)
        formData.append('status', status)
        formData.append('quantity', quantity)
      //  formData.append('stockalertminqty', stockalertminqty)
        formData.append('barcode', JSON.stringify(barcode))
        formData.append('location', location)
        formData.append('categoryid', categoryid)
        formData.append('subcategoryid', subcategoryid)
        formData.append('storeid', storeid)

        const err = { ...error }
        !categoryid ? err.category = true : err.category = false
        !subcategoryid ? err.subCategory = true : err.subCategory = false
        !storeid ? err.storeID = true : err.storeID = false
        !status && status !== 0 ? err.status = true : err.status = false
        seterror(err)

        if (categoryid && subcategoryid && storeid && !err.status) {

                setaddUserloading(true)
                useJwt.addProduct(formData).then(res => {

                    setaddUserloading(false)
                    Success(res)
                    setTimeout(function () { history.replace('/products') }, 1000)

                }).catch(err => {
                    setaddUserloading(false)
                    console.log(err)
                    Error(err)
                })
       
        }
    }
    const handlePOP = () => {
        const arr = [...generateInput]
        arr.pop()
        setgenerateInput(arr)
        const obj = { ...barCodes }
        delete obj[`Barcode${generateInput.length}`]
        setBarCodes(obj)
    }
    return (
        <>
            <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/products'>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Add New Product</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={handleSubmit(onsubmit)} autoComplete="off">

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="productname">Product name <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="productname"
                                    id='productname' onChange={onChange} 
                                    placeholder="productname"
                                    innerRef={register({ required: true })}
                                   invalid={errors.productname && true}
                                />
                        {errors && errors.productname && <FormFeedback>{errors.productname.message}</FormFeedback>}

                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="productsize">Product size <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="productsize"
                                    id='productsize' onChange={onChange} 
                                    placeholder="productsize"
                                    innerRef={register({ required: true })}
                                   invalid={errors.productsize && true}
                                />
                              {errors && errors.productsize && <FormFeedback>{errors.productsize.message}</FormFeedback>}

                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="productCategory">Category<span style={{ color: 'red' }}>*</span></Label>&nbsp;
                                &nbsp;{error.category && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="productCategory"
                                    onChange={handleProductCategory}
                                    options={productCategoryList}
                                    isClearable
                                    isLoading={false}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="productSubCategory">Sub-category<span style={{ color: 'red' }}>*</span></Label>&nbsp;
                                &nbsp;{error.subCategory && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="productSubCategory"
                                    onChange={handleProductSubCategory}
                                    options={filteredSubCategory}
                                    isClearable
                                    isLoading={false}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="quantity">Quantity <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="quantity"
                                    id='quantity' onChange={onChange} 
                                    placeholder="quantity"
                                    innerRef={register({ required: true })}
                                    invalid={errors.quantity && true}
                                />
                                {errors && errors.quantity && <FormFeedback>{errors.quantity.message}</FormFeedback>}
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="productdetails">Product details <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="productdetails"
                                    id='productdetails' onChange={onChange} 
                                    placeholder="productdetails"
                                    innerRef={register({ required: true })}
                                    invalid={errors.productdetails && true}
                                />
                                 {errors && errors.productdetails && <FormFeedback>{errors.productdetails.message}</FormFeedback>}
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="RRP">Marked Price <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="RRP"
                                    id='RRP' onChange={onChange} 
                                    placeholder="Marked Price"
                                    step=".01"
                                    innerRef={register({ required: false })}
                                    // invalid={errors.RRP && true}
                                />
                                {errors && errors.RRP && <FormFeedback>{errors.RRP.message}</FormFeedback>}
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="tillprice">Till price <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="tillprice"
                                    id='tillprice' onChange={onChange} 
                                    placeholder="tillprice"
                                    step=".01"
                                    innerRef={register({ required: true })}
                                    invalid={errors.tillprice && true}
                                />
                                {errors && errors.tillprice && <FormFeedback>{errors.tillprice.message}</FormFeedback>}
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="unitvolume"> Unit volume <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="unitvolume"
                                    id='unitvolume' onChange={onChange} 
                                    placeholder="unitvolume"
                                    innerRef={register({ required: true })}
                                    invalid={errors.unitvolume && true}
                                />
                                 {errors && errors.unitvolume && <FormFeedback>{errors.unitvolume.message}</FormFeedback>}
                            </FormGroup>
                        </Col>

                        {/*<Col sm="3" >
                            <FormGroup>
                                <Label for="stockalertminqty">Stock alert min-quantity <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="stockalertminqty"
                                    id='stockalertminqty' onChange={onChange} required
                                    placeholder="stockalertminqty"
                                />
                            </FormGroup>
                        </Col>*/}

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="status">Status <span style={{ color: 'red' }}>*</span></Label>&nbsp;
                                &nbsp;{error.status && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="status"
                                    onChange={handleStatus}
                                    defaultValue ={{ value: 1, label: "Active" }}
                                    options={[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]}
                                   
                                    isLoading={false}
                                />

                            </FormGroup>
                        </Col>


                        <Col sm="3" >
                            <FormGroup>
                                <Label for="StoreName">Store name<span style={{ color: 'red' }}>*</span></Label>&nbsp;
                                &nbsp;{error.storeID && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="StoreName"
                                    onChange={handleStoreName}
                                    value ={userInput.storevalue || null}
                                    options={storeList}
                                    
                                    isLoading={false}
                                />

                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="location">Location <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="location"
                                    id='location' onChange={onChange} 
                                    placeholder="location"
                                    innerRef={register({ required: true })}
                                    invalid={errors.location && true}
                                />
                                {errors && errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
                            </FormGroup>
                        </Col>
                       
                        {
                            generateInput.map((item, index) => {
                                return (
                                    <Col sm="3" key={index}>
                                        <FormGroup>
                                            <Label for={`${item.codeName}-${index + 1}`}>{`${item.codeName}-${index + 1}`}
                                                <span style={{ color: 'red' }}>*</span>
                                            </Label> {generateInput.length > 1 && <span style={{
                                                float: "right",
                                                cursor: "pointer",
                                                color: "red"
                                            }} onClick={handlePOP}>x</span>}
                                            <Input type="text" name={`${item.codeName}${index + 1}`}
                                                id={`${item.codeName}-${index + 1}`} onChange={onBarCodeChange} 
                                                placeholder={`${item.codeName}-${index + 1}`}
                                                innerRef={register({ required: true })}
                                               invalid={errors[`${item.codeName}${index + 1}`] && true}
                                            />
                                            {errors && errors[`${item.codeName}${index + 1}`] && <FormFeedback>{errors[`${item.codeName}${index + 1}`].message}</FormFeedback>}
                                        </FormGroup>
                                    </Col>
                                )
                            })
                        }

                        <Col sm="3" >
                            <Button.Ripple onClick={handleAddBarcode} className='ml-0' color='info' style={{ marginTop: '25px' }}>
                                <Plus size={15} />
                                <span className='align-middle ml-50'>Add Barcode</span>
                            </Button.Ripple>
                        </Col>

                    <Col sm="12"  >
                            <FormGroup>
                                <Label for="productimage">Product Image <span style={{ color: 'red' }}>*</span> <span style={{color:'red'}}>{imgerror}</span></Label>
                               
                                 <ImageUpload parentCallback = {handleCallback} />

                            </FormGroup>
                        </Col>

                        <Col sm="12" md={{ size: 3, offset: 9 }}  >
                            {
                                addUserloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                        <span className='align-middle ml-50'>Submit</span>
                                    </Button.Ripple>
                            }
                        </Col>
                    </Form>
                </CardBody>
            </Card>
        </>
    )
}

export default AddNewProduct