import { useRef, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
    ChevronLeft, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search
} from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Error } from '../viewhelper'
const MySwal = withReactContent(Swal)

const AppUserAccess = () => {
    const history = useHistory()
    const selectInputRef = useRef()
    const { businessId } = useParams()
    const customer_idx = sessionStorage.getItem("customer_idx")
    const [loading, setloading] = useState(false)
    const [dataTableloading, setdataTableloading] = useState(true)
    const [userTypes, setUserTypes] = useState([])
    const [AppuserDataList, setAppuserDataList] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [userinput, setuserinput] = useState({ mobile: '' })
    const [callEffect, setcallEffect] = useState(false)
    const [error, seterror] = useState({ userType: false, mobile: false, email: false })
    const [maxLength, setMaxLength] = useState(10)

    useEffect(() => {
        // console.log('businessId ', businessId, 'customer_idx ', customer_idx)
        useJwt.appUserList({ business_id: businessId, customer_idx }).then(res => {
            setdataTableloading(false)
            setAppuserDataList(res.data.payload)
            console.log(res.data.payload)
        }).catch(err => {
            console.log(err)
        })

        useJwt.appUserType().then(res => {
            // console.log(res.data.payload)
            const userTypeApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setUserTypes(userTypeApi)
        }).catch(err => {
            console.log(err)
        })
    }, [callEffect])

    const onChange = (e) => {
        // console.log(e.target.name === 'mobile', e.target.value.toString().substr(0, 1) === "0")
        if (e.target.name === 'mobile' && e.target.value.toString().substr(0, 1) === "0") {
            setMaxLength(11)
        }
        if (e.target.name === 'mobile' && e.target.value.toString().substr(0, 1) !== "0") {
            setMaxLength(10)
        }
        setuserinput(userinput => { return { ...userinput, [e.target.name]: e.target.value } })

        const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
        if (e.target.name === 'email' && chkEmail) {
            seterror({ ...error, email: false })
        }

        if (e.target.name === 'mobile' ? e.target.value.length === maxLength : null) {
            seterror({ ...error, mobile: false })
        }
        // const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
        // if (e.target.name === 'email' && chkEmail) {
        //     seterror({...error, email: false}) 
        // }

    }
    const onAppUserTypeChange = (option, { action }) => {
        if (action === 'clear') {
            setuserinput({ ...userinput, subusertype: null })
        } else {
            seterror({ ...error, userType: false })
            setuserinput({ ...userinput, subusertype: option.value })
        }
    }
    const handleDelete = (mobile, idx) => {
        return MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                //fetch business delete api...
                useJwt.appDeleteUser({ mobile, customer_idx: idx }).then(res => {
                    // console.log(res)
                    MySwal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The user has been deleted.',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })
                    setcallEffect(!callEffect)
                }).catch(err => {
                    console.log(err.response)
                })
            }
        })
    }
    const handleEdit = (mobile, row) => {
        const data = AppuserDataList.filter(x => x.mobileno === mobile)
        // console.log(data[0], row)
        sessionStorage.setItem("AppUserData", JSON.stringify(data))
        history.push(`/AppUserEdit/${mobile}`)
    }
    const onSubmit = (e) => {
        setloading(true)
        e.preventDefault()
        const { mobile, email, firstname, lastname, subusertype } = userinput
        const chkEmail = /\S+@\S+\.\S+/.test(email)
        const err = { ...error }
        !userinput.subusertype ? err.userType = true : err.userType = false
        !chkEmail ? err.email = true : err.email = false
        mobile.length !== maxLength ? err.mobile = true : err.mobile = false
        seterror(err)
        if (!chkEmail) {
            setloading(false)
            return
        }
        // console.log({ mb: mobile.length, email, firstname, lastname, subusertype, customer_idx, business_id: businessId })
        if (!err.userType && mobile.length === maxLength) {
            useJwt.appAddNewUser({ mobile, email, firstname, lastname, subusertype, customer_idx, business_id: businessId }).then(res => {
                setuserinput({})
                selectInputRef.current.select.clearValue()
                MySwal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: res.data.message,
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                // console.log(res)
                setloading(false)
                setcallEffect(!callEffect)
            }).catch(err => {
                setloading(false)
                console.log(err)
                Error(err)
            })
        } else { setloading(false) }
    }

    // ** Table Common Column
    const columns = [

        {
            name: 'Mobile',
            selector: row => `0${row.mobileno}`,
            minWidth: '100px'
        },
        {
            name: 'First Name',
            selector: 'firstname',
            minWidth: '100px'
        },
        {
            name: 'Last Name',
            selector: 'lastname',
            minWidth: '100px'
            //   cell: (item) => {
            //     return item.storeinfo ? item.storeinfo.storename : ''
            //   }
        },
        {
            name: 'Email',
            selector: 'email',
            minWidth: '100px'
        },
        {
            name: 'Type',
            selector: 'subusertype',
            minWidth: '100px',
            cell: (item) => {
                return item.subusertypeinfo ? item.subusertypeinfo.statusdesc : ''
            }
        },
        {
            name: 'Actions',
            allowOverflow: true,
            cell: (row) => {
                return (
                    <div className='d-flex'>
                        <Edit size={15} color='#2bc871' style={{ cursor: 'pointer' }} onClick={(e) => handleEdit(row.mobileno, row)} /> &nbsp;&nbsp;
                        <Trash size={15} color='red' style={{ cursor: 'pointer' }} onClick={(e) => handleDelete(row.mobileno, row.idx)} />
                    </div>
                )
            }
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
            pageCount={AppuserDataList.length ? AppuserDataList.length / 10 : 1}
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

    return (
        <>
            <Row className='mb-2'>
                <Col sm='2'>
                    <h4>App User Access</h4>
                </Col>
                <Col sm="10" >
                    <Button.Ripple className='ml-2' color='primary' tag={Link} to='/business'>
                        <ChevronLeft size={10} />
                        <span className='align-middle ml-50'>Back to Business List</span>
                    </Button.Ripple>
                    <Button.Ripple className='ml-2' color='primary' tag={Link} to={`/editbusiness/${businessId}`}>
                        <Edit size={14} />
                        <span className='align-middle ml-50'>Edit this Business </span>
                    </Button.Ripple>
                </Col>
            </Row>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>App users for </CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="4" >
                            <FormGroup>
                                <Label for="mobile">Mobile <span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.mobile && <span style={{ color: 'red', fontSize: '11px' }}>must be {maxLength} digit</span>}
                                <Input type="number" name="mobile"
                                    id='mobile' onChange={onChange} required value={userinput.mobile ? userinput.mobile : ''}
                                    placeholder="079076661234"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="firstName">Firstname <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="firstname"
                                    id='firstName' onChange={onChange} required value={userinput.firstname ? userinput.firstname : ''}
                                    placeholder="firstname"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="lastName">Lastname <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="lastname"
                                    id='lastName' onChange={onChange} required value={userinput.lastname ? userinput.lastname : ''}
                                    placeholder="lastname"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="email">Email <span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.email && <span style={{ color: 'red', fontSize: '11px' }}>is not valid</span>}
                                <Input type="email" name="email"
                                    id='email' onChange={onChange} required value={userinput.email ? userinput.email : ''}
                                    placeholder="example@gmail.com"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="4" >
                            <FormGroup>
                                <Label for="AppUserType">Type <span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.userType && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    ref={selectInputRef}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="AppUserType"
                                    onChange={onAppUserTypeChange}
                                    options={userTypes}
                                    isClearable
                                />
                            </FormGroup>

                        </Col>

                        <Col sm="4" >
                            {
                                loading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <Plus size={15} />
                                    <span className='align-middle ml-50'>Add </span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form>
                    <Row className='mt-2'>
                        <Col sm="12">
                            <DataTable
                                noHeader
                                pagination
                                /*selectableRows*/
                                columns={columns}
                                paginationPerPage={10}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                paginationDefaultPage={currentPage + 1}
                                paginationComponent={CustomPagination}
                                data={AppuserDataList}
                                progressPending={dataTableloading}
                                progressComponent={<Spinner color='primary' />}
                                responsive={true}
                            /*selectableRowsComponent={BootstrapCheckbox}*/
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}

export default AppUserAccess