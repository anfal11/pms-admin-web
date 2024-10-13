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
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search
} from 'react-feather'
import ImageUpload from './ImageUpload'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Badge, Label, Row, Col, Spinner, Form, FormGroup, CardBody, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from 'react-router-dom'
import EditChildSubcategory from './EditChildSubcategory'

const MySwal = withReactContent(Swal)

const ChildSubcategory = () => {
    const history = useHistory()
    const CategoryRef = useRef()
    const SubCategoryRef = useRef()
    const StatusRef = useRef()
    const [isBtnloading, setLoading] = useState(false)
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [CategoryList, setCategoryList] = useState([])
    const [SubCategoryList, setSubCategoryList] = useState([])
    const [SelectedCategoryID, setSelectedCategoryID] = useState('')
    const [FilteredSubCategoryList, setFilteredSubCategoryList] = useState([])
    const [ChildSubCategoryList, setChildSubCategoryList] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [modal, setModal] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])


    const [userInput, setUserInput] = useState({
        childsubcategoryname: '',
        subcategoryid: '',
        status: ''
    })
    const [errors, setErrors] = useState({
        Category: false,
        SubCategory: false,
        Status: false
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
            // console.log(res.data.payload)
            setSubCategoryList(res.data.payload)
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })

        // childsubcategorylist
        useJwt.ChildSubcategoryListAPi().then(res => {
            const Data44 = res.data.payload
            useJwt.productsubcategorylist().then(res => {
                const Data55 = res.data.payload

                const ModifyCSCarray = Data44.map(item => {
                    const CatSubcatData = Data55.filter(x => x.id === item.subcategory_id)
                    return {
                        ...item,
                        SubCategoryName: CatSubcatData[0].subcategoryname,
                        CategoryName: CatSubcatData[0].category.categoryname
                    }
                })

                setChildSubCategoryList(ModifyCSCarray)
                setTableDataLoading(false)
            }).catch(err => {
                console.log(err)
                Error(err)
            })
        }).catch(err => {
            console.log(err.response)
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
            setSelectedCategoryID(option.value)
            setFilteredSubCategoryList(ModifyFilteredArray)
            if (SelectedCategoryID !== '') {
                SubCategoryRef.current.select.clearValue()
            }
            setUserInput({ ...userInput, subcategoryid: '' })
            setErrors({
                ...errors,
                Category: false
            })
        }
    }
    const handleSelectSubCategory = (option, { action }) => {
        if (action === 'clear') {
            console.log('cleared')
        } else {
            setErrors({
                ...errors,
                SubCategory: false
            })
            setUserInput({ ...userInput, subcategoryid: option.value })
        }
    }
    const handleSelectStatus = (option, { action }) => {
        if (action === 'clear') {
            console.log('cleared')
        } else {
            setErrors({
                ...errors,
                Status: false
            })
            setUserInput({ ...userInput, status: option.value })
        }
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const { childsubcategoryname, subcategoryid, status } = userInput
        if (SelectedCategoryID === '' || subcategoryid === '' || status === '') {
            const newErrors = { ...errors }
            SelectedCategoryID === '' ? newErrors.Category = true : newErrors.Category = false
            subcategoryid === '' ? newErrors.SubCategory = true : newErrors.SubCategory = false
            status === '' ? newErrors.Status = true : newErrors.Status = false
            setErrors(newErrors)
            return 0
        }
        setLoading(true)
        useJwt.AddChildSubcategoryAPi({ childsubcategoryname, subcategoryid, status }).then(res => {
            console.log(res.data.payload)
            const InsertObj = res.data.payload
            setChildSubCategoryList([...ChildSubCategoryList, InsertObj])
            Success(res)
            CategoryRef.current.select.clearValue()
            SubCategoryRef.current.select.clearValue()
            StatusRef.current.select.clearValue()
            setUserInput({
                childsubcategoryname: '',
                subcategoryid: '',
                status: ''
            })
            setLoading(false)
        }).catch(err => {
            console.log(err.response)
            setLoading(false)
            Error(err)
        })
    }

    // Data table elements
    const handleDelete = (id) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert this`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return useJwt.DeleteChildSubcategoryAPi({ id }).then(res => {
                    Success(res)
                    const filteredArray = ChildSubCategoryList.filter(item => item.id !== id)
                    setChildSubCategoryList(filteredArray)
                }).catch(err => {
                    console.log(err)
                    Error(err)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {

            }
        })
    }
    const column = [
        {
            name: 'Child Subcategory',
            minWidth: '100px',
            selector: 'name',
            sortable: true
        },
        {
            name: 'Category',
            minWidth: '100px',
            selector: 'CategoryName',
            sortable: true
        },
        {
            name: 'Subcategory',
            minWidth: '100px',
            selector: 'SubCategoryName',
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => {
                return (
                    <Badge color={row.status === 1 ? 'light-success' : 'light-danger'} pill className='px-1'>
                        {row.status === 1 ? 'Active' : 'Inactive'}
                    </Badge>
                )
            },
            minWidth: '100px'
        },
        {
            name: 'Action',
            selector: row => {
                return (<div className="d-flex">
                    <Edit size={15}
                        color='teal'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            // e.preventDefault()
                            // history.push(`/EditChildSubcategory/${row.id}`)
                            setModal(true)
                            sessionStorage.setItem('EditChildSubcategoryInfo', JSON.stringify(row))
                        }} />&nbsp;&nbsp;
                    <Trash size={15}
                        color='red'
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            handleDelete(row.id)
                        }} />
                </div>)
            },
            minWidth: '100px'
        }
    ]
    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
    }
    // ** Custom Pagination
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel=''
            nextLabel=''
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={searchValue.length ? filteredData.length / 7 : ChildSubCategoryList.length / 7 || 1}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            nextLinkClassName='page-link'
            nextClassName='page-item next'
            previousClassName='page-item prev'
            previousLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        />
    )
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)

        if (value.length) {
            updatedData = ChildSubCategoryList.filter(item => {
                const startsWith =
                    item.CategoryName.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.SubCategoryName.toLowerCase().startsWith(value.toLowerCase()) ||
                    item.name.toLowerCase().startsWith(value.toLowerCase())

                const includes =
                    item.CategoryName.toLowerCase().includes(value.toLowerCase()) ||
                    item.SubCategoryName.toLowerCase().includes(value.toLowerCase()) ||
                    item.name.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)

            setSearchValue(value)
        }
    }
    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Add Child Subcategory</CardTitle>

                </CardHeader>
                <CardBody>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col md="3">
                            <FormGroup>
                                <Label>Category</Label>&nbsp;<small className="text-danger">*</small>
                                <Select
                                    ref={CategoryRef}
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={handleSelectCategory}
                                    options={CategoryList}
                                    isClearable={false}
                                    isLoading={!CategoryList.length}
                                />
                                {SelectedCategoryID === '' && errors.Category && <small className="text-danger">Please Select a Category</small>}
                            </FormGroup>
                        </Col>
                        {SelectedCategoryID !== '' ? <Col md="3">
                            <FormGroup>
                                <Label>Subcategory</Label>&nbsp;<small className="text-danger">*</small>
                                <Select
                                    ref={SubCategoryRef}
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={handleSelectSubCategory}
                                    options={FilteredSubCategoryList}
                                    isClearable={false}
                                    isLoading={!FilteredSubCategoryList.length}
                                />
                                {userInput.subcategoryid === '' && errors.SubCategory && <small className="text-danger">Please Select a Subcategory</small>}
                            </FormGroup>
                        </Col> : ''}
                        <Col md="3" >
                            <FormGroup>
                                <Label for="childsubcategoryname">Child Subcategory Name<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text"
                                    required
                                    name="childsubcategoryname"
                                    id='childsubcategoryname'
                                    value={userInput.childsubcategoryname}
                                    onChange={onChange}
                                    required
                                    placeholder="name"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="3">
                            <FormGroup>
                                <Label>Status</Label>&nbsp;<small className="text-danger">*</small>
                                <Select
                                    ref={StatusRef}
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={handleSelectStatus}
                                    options={[{ value: 1, label: 'Active' }, { value: 0, label: 'Inactive' }]}
                                    isClearable={false}
                                // isLoading={!CategoryList.length}
                                />
                                {userInput.status === '' && errors.Status && <small className="text-danger">Please Select a Status</small>}
                            </FormGroup>
                        </Col>

                        <Col md="3" className='text-center'>
                            {
                                isBtnloading ? <Button.Ripple color='primary' disabled style={{ marginTop: '23px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple color='primary' type="submit" style={{ marginTop: '23px' }}>
                                    <span >Submit</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form>
                </CardBody>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Child Subcategory List</CardTitle>
                    <CardTitle>
                        {/* <Label className='mr-1' for='search-input'>
                            Search
                        </Label> */}
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            placeholder='Search'
                            // bsSize='sm'
                            id='search-input'
                            value={searchValue}
                            onChange={handleFilter}
                        />
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <DataTable
                        noHeader
                        pagination
                        /*selectableRows*/
                        columns={column}
                        paginationPerPage={7}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        paginationDefaultPage={currentPage + 1}
                        paginationComponent={CustomPagination}
                        data={searchValue.length ? filteredData : ChildSubCategoryList}
                        progressPending={TableDataLoading}
                        progressComponent={<Spinner color='primary' />}
                        responsive={true}
                    /*selectableRowsComponent={BootstrapCheckbox}*/
                    />
                </CardBody>
            </Card>
            {/* MOdal */}
            <Modal isOpen={modal} toggle={() => setModal(!modal)} >
                <ModalHeader toggle={() => setModal(!modal)}>Update Form</ModalHeader>
                <ModalBody>
                    <EditChildSubcategory
                        ChildSubCategoryList={ChildSubCategoryList}
                        setChildSubCategoryList={setChildSubCategoryList} />
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default ChildSubcategory