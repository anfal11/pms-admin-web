import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronLeft, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock } from 'react-feather'
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'
import { Tag, Skeleton } from 'antd'
import 'antd/dist/antd.css'
// import { Error, Success } from '../../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const EditUserInfo = () => {
    const history = useHistory()
    const { userID } = useParams()
    const [userTypeData, setuserTypeData] = useState([{ value: "", label: "" }])
    const [userTitleData, setuserTitleData] = useState([{ value: "", label: "" }])
    const [storeList, setStoreList] = useState([])
    const [loading, setloading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [userData, setUserData] = useState({})
    // const [userInput, setUserInput] = useState({})
    const [error, seterror] = useState({
        userType: false,
        userTitle: false,
        storeName: false,
        email: false
    })


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
            // console.log(res.data.payload)
            const userTitleApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setuserTitleData(userTitleApi)
        }).catch(err => {
            console.log(err.response)
        })
        useJwt.adminUserDetails({ id: userID }).then(res => {
            const data = res.data.payload[0]
            let modifydata = {}
            console.log(res)
            const splitdata = data.fullname ? data.fullname.split(' ') : [' ', ' ']

            modifydata = {
                id: data.id,
                firstname: splitdata.length ? splitdata[0] : "",
                lastname: splitdata.length === 2 ? splitdata[1] : "",
                emailid: data.emailid,
                roleid: data.roleid,
                rolename: data.adminstatus.statusdesc,
                storename: data.adminstore.storename,
                storeid: data.storeid,
                title: data.titleinfo.statusdesc,
                titleid: data.titleinfo.id
            }
            setUserData(modifydata)
            setloading(false)
        }).catch(err => {
            console.log(err.response)
        })
        useJwt.storeList().then(res => {
            // console.log(res.data.payload)
            const storeApi = res.data.payload.map(type => {
                return { value: type.storeid, label: type.storename }
            })
            setStoreList(storeApi)
        }).catch(err => {
            console.log(err)
        })

    }, [])

    const onChange = (e) => {
        const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
        if (e.target.name === 'emailid' && chkEmail) {
            seterror({ ...error, email: false })
        }
        // console.log([e.target.name], e.target.value)
        const CurrentData = { ...userData }
        if (e.target.name === "firstname") {
            CurrentData.firstname = e.target.value
        }
        if (e.target.name === "lastname") {
            CurrentData.lastname = e.target.value
        }
        if (e.target.name === "emailid") {
            CurrentData.emailid = e.target.value
        }

        setUserData(CurrentData)

    }

    const handleUserType = (option, { action }) => {
        if (action === 'clear') {
            const newData = { ...userData }
            newData.roleid = null
            setUserData(newData)
        } else {
            seterror({ ...error, userType: false })
            const newData = { ...userData }
            newData.roleid = option.value
            setUserData(newData)
        }
    }
    const handleUserTitle = (option, { action }) => {
        if (action === 'clear') {
            const newData = { ...userData }
            newData.titleid = null
            setUserData(newData)
        } else {
            seterror({ ...error, userTitle: false })
            const newData = { ...userData }
            newData.titleid = option.value
            setUserData(newData)
        }
    }
    const handleStoreName = (option, { action }) => {
        if (action === 'clear') {
            const newData = { ...userData }
            newData.storeid = null
            setUserData(newData)
        } else {
            seterror({ ...error, storeName: false })
            const newData = { ...userData }
            newData.storeid = option.value
            setUserData(newData)
        }
    }
    const onsubmit = (e) => {
        e.preventDefault()
        const { id, firstname, lastname, emailid, roleid, storeid, titleid } = userData
        const chkEmail = /\S+@\S+\.\S+/.test(emailid)
        const err = { ...error }
        !chkEmail ? err.email = true : err.email = false
        !roleid ? err.userType = true : err.userType = false
        !titleid ? err.userTitle = true : err.userTitle = false
        !storeid ? err.storeName = true : err.storeName = false
        seterror(err)
        if (!chkEmail) {
            return
        }
        const fullname = `${firstname} ${lastname}`
        // console.log({ id, fullname, roleid, emailid, storeid, title: titleid })
        if (roleid && storeid && titleid) {
            useJwt.adminUserEdit({ id, fullname, roleid, emailid, storeid, title: titleid }).then(res => {
                console.log(res)
                MySwal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: 'The Staff Info has been updated.',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                setTimeout(function () { history.replace('/user') }, 1000)
            }).catch(err => {
                console.log(err)
            })
        }
        // else {
        //     MySwal.fire({
        //         icon: 'warning',
        //         title: 'Failed',
        //         text: '"Storename" "Usertype" "Usertitle" must not be Empty!',
        //         customClass: {
        //             confirmButton: 'btn btn-danger'
        //         }
        //     })
        // }
    }
    return (
        <>
            {loading ? <> <Skeleton active /> <Skeleton active />
            </> : <>
                <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/user'>
                    <ChevronLeft size={10} />
                    <span className='align-middle ml-50'>Back to staff list</span>
                </Button.Ripple>
                <Card>
                    <CardHeader className='border-bottom'>
                        <h5>Update Staff Info</h5>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '15px' }}>
                        <Form className="row" style={{ width: '100%' }} onSubmit={onsubmit} autoComplete="off">

                            <Col sm="3" >
                                <FormGroup>
                                    <Label for="firstName">First Name <span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text" name="firstname"
                                        id='firstName' required placeholder="firstName"
                                        value={userData.firstname}
                                        onChange={onChange}

                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <Label for="lastName">Last Name <span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text" name="lastname"
                                        id='lastName' onChange={onChange} required
                                        placeholder="lastName"
                                        value={userData.lastname}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <Label for="Email">Email <span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.email && <span style={{ color: 'red', fontSize: '11px' }}> is not valid</span>}
                                    <Input type="email" name="emailid"
                                        id='Email' onChange={onChange}
                                        placeholder="Email" value={userData.emailid}

                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <Label for="StoreName">Store Name<span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.storeName && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        name="StoreName"
                                        defaultValue={{ label: userData.storename, value: userData.storeid }}
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
                                        defaultValue={{ label: userData.rolename, value: userData.roleid }}
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
                                        defaultValue={{ label: userData.title, value: userData.titleid }}
                                        onChange={handleUserTitle}
                                        options={userTitleData}
                                        isClearable
                                        isLoading={false}
                                    />

                                </FormGroup>
                            </Col>

                            <Col sm="3" >
                                {
                                    submitLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                        <span className='align-middle ml-50'>Update</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Form>
                    </CardBody>
                </Card> </>}
        </>
    )
}

export default EditUserInfo