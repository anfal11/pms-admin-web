import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
// ** Table Data & Columns
//import { data } from '../data'

// ** Add New Modal Component
import AddNewModal from './AddNewModal'
import Select from 'react-select'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft } from 'react-feather'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'

import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const AddNewUser = () => {
    const history = useHistory()
    const [addUserloading, setaddUserloading] = useState(false)
    const [tableDataLoading, setTDL] = useState(true)
    const [userTypeData, setuserTypeData] = useState([{ value: "", label: "" }])
    const [userTitleData, setuserTitleData] = useState([{ value: "", label: "" }])
    const [userList, setUserlist] = useState([])
    const [storeList, setStoreList] = useState([])
    const [userInput, setUserInput] = useState({})
    const [error, seterror] = useState({
        userType: false,
        userTitle: false,
        storeName: false,
        email: false
    })

    const [currentPage, setCurrentPage] = useState(0)
    const [efct, setEfct] = useState(true)

    useEffect(() => {
        useJwt.userRoleList().then(res => {
            // console.log(res.data.payload)
            const userTypeApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setuserTypeData(userTypeApi)
        }).catch(err => {
            console.log(err.response)
        })
        useJwt.userTitleList().then(res => {
            // console.log('title ', res.data.payload)
            const userTitleApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setuserTitleData(userTitleApi)
        }).catch(err => {
            console.log(err.response)
        })
       /* useJwt.adminUserList().then(res => {
            console.log(res.data.payload)
            setUserlist(res.data.payload)
            setTDL(false)
        }).catch(err => {
            console.log(err)
        })*/
        useJwt.storeList().then(res => {
            // console.log(res.data.payload)
            const storeApi = res.data.payload.map(type => {
                return { value: type.storeid, label: type.storename }
            })
            setStoreList(storeApi)
        }).catch(err => {
            console.log(err)
        })

    }, [efct])

    const onchange = (e) => {
        const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
        if (e.target.name === 'Email' && chkEmail) {
            seterror({...error, email: false}) 
        }
        setUserInput({ ...userInput, [e.target.name]: e.target.value })

    }
    const handleUserType = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, UserType: null })
        } else {
            seterror({...error, userType: false})
            setUserInput({ ...userInput, UserType: option.value })
        }
    }
    const handleUserTitle = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, UserTitle: null })
        } else {
            seterror({...error, userTitle: false})
            setUserInput({ ...userInput, UserTitle: option.value })
        }
    }
    const handleStoreName = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, StoreName: null })
        } else {
            seterror({...error, storeName: false})
            setUserInput({ ...userInput, StoreName: option.value })
        }
    }
    const onsubmit = (e) => {
        e.preventDefault()
        const { username, password, Email, firstName, lastName, StoreName, UserType, UserTitle } = userInput
        const chkEmail = /\S+@\S+\.\S+/.test(Email)

        // console.log(userInput)
        // setaddUserloading(true)
        const err = { ...error }
        !chkEmail ? err.email = true : err.email = false
        !userInput.UserType ? err.userType = true : err.userType = false
        !userInput.UserTitle ? err.userTitle = true : err.userTitle = false
        !userInput.StoreName ? err.storeName = true : err.storeName = false
        seterror(err)
        if (!chkEmail) {
            return 
        }
        if (!err.userType && !err.userTitle && !err.storeName) {
            setaddUserloading(true)
            const fullname = `${firstName} ${lastName}`
            useJwt.addAdminUser({ fullname, username, password, roleid: UserType, emailid: Email, storeid: StoreName, title: UserTitle }).then(res => {
                console.log(res)
                MySwal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: 'The Staff has been added successfully',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                setTimeout(function () { history.replace('/user') }, 1000)
            }).catch(err => {
                console.log(err)
            })
        }
    }
    return (
        <>
           <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/user'>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Add New Staff</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="username">Username <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="username"
                                    id='username' onChange={onchange} required
                                    placeholder="username"

                                />
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="password">Password<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="password" name="password"
                                    id='password' onChange={onchange} required
                                    placeholder="password"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="firstName">First Name <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="firstName"
                                    id='firstName' onChange={onchange} required
                                    placeholder="firstName"

                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="lastName">Last Name <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="lastName"
                                    id='lastName' onChange={onchange} required
                                    placeholder="lastName"

                                />
                            </FormGroup>
                        </Col>
                        <Col sm="3" >
                            <FormGroup>
                                <Label for="Email">Email</Label>&nbsp;{error.email && <span style={{ color: 'red', fontSize: '11px' }}> is not valid</span>}
                                <Input type="email" name="Email"
                                    id='Email' onChange={onchange}
                                    placeholder="Example@gmail.com"
                                />
                            </FormGroup>
                        </Col>
                        {/* <Col sm="3" >
                            <FormGroup>
                                <Label for="Store">Store name<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="StoreName"
                                    id='Store' onChange={onchange} required
                                    placeholder="Store name"

                                />
                            </FormGroup>
                        </Col> */}

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="StoreName">Store Name<span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.storeName && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="StoreName"
                                    onChange={handleStoreName}
                                    options={storeList}
                                    isClearable
                                    isLoading={false}
                                />

                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="UserType">User Type<span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.userType && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="UserType"
                                    onChange={handleUserType}
                                    options={userTypeData}
                                    isClearable
                                    isLoading={false}
                                />

                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup>
                                <Label for="UserTitle">User Title<span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.userTitle && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="UserTitle"
                                    onChange={handleUserTitle}
                                    options={userTitleData}
                                    isClearable
                                    isLoading={false}
                                />

                            </FormGroup>
                        </Col>

                        <Col sm="3" >
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

export default AddNewUser