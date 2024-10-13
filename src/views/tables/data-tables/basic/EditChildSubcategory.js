// ** React Imports
import { Fragment, useState, useRef, useEffect } from 'react'
// ** Custom Components
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { Image } from 'antd'
import 'antd/dist/antd.css'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    ChevronDown, Share, Printer, ChevronLeft, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search
} from 'react-feather'
import ImageUpload from './ImageUpload'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Badge, Label, Row, Col, Spinner, Form, FormGroup, CardBody, Modal, ModalHeader, odalBody, ModalFooter
} from 'reactstrap'
import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom'
const MySwal = withReactContent(Swal)

const EditChildSubcategory = ({ ChildSubCategoryList, setChildSubCategoryList }) => {
    const history = useHistory()
    const SubCategoryRef = useRef()
    const EditChildSubcategoryInfo = JSON.parse(sessionStorage.getItem('EditChildSubcategoryInfo'))
    const [isBtnloading, setLoading] = useState(false)
    const [CategoryList, setCategoryList] = useState([])
    const [CatID, setCatID] = useState({ value: 0, label: 'Select...' })
    const [subCatID, setsubCatID] = useState({ value: 0, label: 'Select...' })
    const [SubCategoryList, setSubCategoryList] = useState([])
    const [FilteredSubCategoryList, setFilteredSubCategoryList] = useState([])

    const [userInput, setUserInput] = useState({
        id: EditChildSubcategoryInfo.id,
        childsubcategoryname: EditChildSubcategoryInfo.name,
        subcategoryid: EditChildSubcategoryInfo.subcategory_id,
        status: EditChildSubcategoryInfo.status
    })
    const [errors, setErrors] = useState({
        SubCategory: false
    })

    useEffect(() => {
        //category list..
        useJwt.productcategorylist().then(res => {
            const data11 = res.data.payload.map(item => {
                return {
                    value: item.id, label: item.categoryname
                }
            })
            setCategoryList(data11)
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })

        //subcategory list..
        useJwt.productsubcategorylist().then(res => {
            const CatSubcatData = res.data.payload.filter(item => item.id === EditChildSubcategoryInfo.subcategory_id)
            // console.log(CatSubcatData[0].categoryid, CatSubcatData[0].id)
            setCatID({ value: CatSubcatData[0].categoryid, label: CatSubcatData[0].category.categoryname })
            // setsubCatID(CatSubcatData[0].subcategoryname)
            setsubCatID({ value: CatSubcatData[0].id, label: CatSubcatData[0].subcategoryname })
            setSubCategoryList(res.data.payload)

            const filterArray = res.data.payload.filter(item => item.categoryid === CatSubcatData[0].categoryid)
            const ModifyFilteredArray = filterArray.map(item => {
                return { value: item.id, label: item.subcategoryname }
            })
            setFilteredSubCategoryList(ModifyFilteredArray)

            // console.log(ModifyFilteredArray.filter(x => x.value === CatSubcatData[0].id))
        }).catch(err => {
            console.log(err)
            Error(err)
        })
    }, [])

    const onChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleSelectCategory = (option, { action }) => {
        if (action === 'clear') {
            console.log('cleared')
        } else {
            const filterArray = SubCategoryList.filter(item => item.categoryid === option.value)
            const ModifyFilteredArray = filterArray.map(item => {
                return { value: item.id, label: item.subcategoryname }
            })
            setCatID({ value: option.value, label: option.label })
            setFilteredSubCategoryList(ModifyFilteredArray)
            SubCategoryRef.current.select.clearValue()
            setsubCatID({ value: 0, label: 'Select...' })
            setUserInput({ ...userInput, subcategoryid: '' })
            // setErrors({
            //     ...errors,
            //     Category: false
            // })
        }
    }
    const handleSelectSubCategory = (option, { action }) => {
        if (action === 'clear') {
            console.log('cleared')
        } else {
            setsubCatID({ value: option.value, label: option.label })
            setUserInput({ ...userInput, subcategoryid: option.value })
        }
    }
    const handleSelectStatus = (option, { action }) => {
        if (action === 'clear') {
            console.log('cleared')
        } else {
            setUserInput({ ...userInput, status: option.value })
        }
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const { id, childsubcategoryname, subcategoryid, status } = userInput
        if (subcategoryid === '') {
            const newErrors = { ...errors }
            subcategoryid === '' ? newErrors.SubCategory = true : newErrors.SubCategory = false
            setErrors(newErrors)
            return 0
        }
        setLoading(true)
        useJwt.EditChildSubcategoryAPi({ id, childsubcategoryname, subcategoryid, status }).then(res => {
            console.log(res)
            // history.goBack()
            const CatSubcatData = SubCategoryList.filter(x => x.id === subcategoryid)
            // setModal(false)
            Success(res)
            setLoading(false)
            const existingArrayItem = ChildSubCategoryList.filter(item => item.id !== id)
            const insertObj = {
                id,
                name: childsubcategoryname,
                subcategory_id: subcategoryid,
                status,
                SubCategoryName: CatSubcatData[0].subcategoryname,
                CategoryName: CatSubcatData[0].category.categoryname
            }
            console.log(insertObj)
            setChildSubCategoryList([...existingArrayItem, insertObj])
        }).catch(err => {
            console.log(err.response)
            setLoading(false)
            Error(err)
        })
    }

    return (
        <Fragment>
            <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Col md="12">
                    <FormGroup>
                        <Label>Category</Label>&nbsp;<small className="text-danger">*</small>
                        <Select
                            // ref={CategoryRef}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            onChange={handleSelectCategory}
                            value={CatID}
                            options={CategoryList}
                            isClearable={false}
                            isLoading={!CategoryList.length}
                        />
                    </FormGroup>
                </Col>
                <Col md="12">
                    <FormGroup>
                        <Label>Subcategory</Label>&nbsp;<small className="text-danger">*</small>
                        <Select
                            ref={SubCategoryRef}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            value={subCatID}
                            onChange={handleSelectSubCategory}
                            options={FilteredSubCategoryList}
                            isClearable={false}
                        // isLoading={!subCatID}
                        />
                        {userInput.subcategoryid === '' && errors.SubCategory && <small className="text-danger">Please Select a Subcategory</small>}
                    </FormGroup>
                </Col>
                <Col md="12" >
                    <FormGroup>
                        <Label for="childsubcategoryname">Child Subcategory Name<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text"
                            required
                            name="childsubcategoryname"
                            id='childsubcategoryname'
                            value={userInput.childsubcategoryname}
                            onChange={onChange}
                            required
                            placeholder="Kid"
                        />
                    </FormGroup>
                </Col>
                <Col md="12">
                    <FormGroup>
                        <Label>Status</Label>&nbsp;<small className="text-danger">*</small>
                        <Select
                            // ref={StatusRef}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            onChange={handleSelectStatus}
                            defaultValue={userInput.status === 1 ? { value: 1, label: 'Active' } : { value: 0, label: 'Inactive' }}
                            options={[{ value: 1, label: 'Active' }, { value: 0, label: 'Inactive' }]}
                            isClearable={false}
                        // isLoading={!CategoryList.length}
                        />
                    </FormGroup>
                </Col>

                <Col md="12" className='text-right'>
                    {
                        isBtnloading ? <Button.Ripple color='primary' disabled style={{ marginTop: '23px' }}>
                            <Spinner color='white' size='sm' />
                            <span className='ml-50'>Loading...</span>
                        </Button.Ripple> : <Button.Ripple color='primary' type="submit" style={{ marginTop: '23px' }}>
                            <span >Update</span>
                        </Button.Ripple>
                    }
                </Col>
            </Form>
        </Fragment>
    )
}

export default EditChildSubcategory