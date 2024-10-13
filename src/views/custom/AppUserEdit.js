import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
import { Skeleton } from 'antd'
import 'antd/dist/antd.css'
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
const MySwal = withReactContent(Swal)

const AppUserEdit = () => {
    const history = useHistory()
    const AppUserData = JSON.parse(sessionStorage.getItem("AppUserData"))[0]
    const [loading, setloading] = useState(false)
    const [userTypes, setUserTypes] = useState([])
    const [userinput, setuserinput] = useState({
        mobile: AppUserData.mobileno,
        email: AppUserData.email,
        firstname: AppUserData.firstname,
        lastname: AppUserData.lastname,
        subusertype: AppUserData.subusertypeinfo.id,
        subusertypeName: AppUserData.subusertypeinfo.statusdesc,
        business_id: AppUserData.business_id,
        customer_idx: AppUserData.idx
    })
    const [error, seterror] = useState({ userType: false, email: false })

    useEffect(() => {
        useJwt.appUserType().then(res => {
            console.log('usertype', res)
            const userTypeApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setUserTypes(userTypeApi)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const onChange = (e) => {
        const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
        if (e.target.name === 'email' && chkEmail) {
            seterror({...error, email: false}) 
        }
        setuserinput({ ...userinput, [e.target.name]: e.target.value })
    }
    const onAppUserTypeChange = (option, { action }) => {
        if (action === 'clear') {
            setuserinput({ ...userinput, subusertype: null })
        } else {
            setuserinput({ ...userinput, subusertype: option.value })
        }
    }
    const onSubmit = (e) => {
        setloading(true)
        e.preventDefault()
        const { mobile, email, firstname, lastname, subusertype, business_id, customer_idx } = userinput
        const chkEmail = /\S+@\S+\.\S+/.test(email)
        const err = { ...error }
        !chkEmail ? err.email = true : err.email = false
        !userinput.subusertype ? err.userType = true : err.userType = false
        seterror(err)
        console.log({ mobile, email, firstname, lastname, subusertype, business_id, customer_idx })
        if (!chkEmail) {
            setloading(false)
            return
        }
        if (!err.userType) {
            useJwt.appEditUser({ mobile, email, firstname, lastname, subusertype, business_id, customer_idx }).then(res => {
                MySwal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: res.data.message,
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                console.log(res)
                setloading(false)
                setTimeout(() => history.goBack(), 1000)
            }).catch(err => {
                setloading(false)
                console.log(err)
            })
        } else { setloading(false) }
    }

    return (
        <>
            <Row className='mb-2'>
                <Col sm='2'>
                    <h4>App User Access</h4>
                </Col>
                <Col sm="10" >
                    <Button.Ripple className='ml-2' color='primary' tag={Link} onClick={() => history.goBack()}>
                        <ChevronLeft size={10} />
                        <span className='align-middle ml-50'>Back to App User Access</span>
                    </Button.Ripple>
                </Col>
            </Row>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>App users for </CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    {true ? <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="2" >
                            <FormGroup>
                                <Label for="mobile">Mobile <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number" name="mobile"
                                    id='mobile' value={userinput.mobile} onChange={onChange} required disabled
                                    placeholder="123 456 789"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="2" >
                            <FormGroup>
                                <Label for="firstName">Firstname <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="firstname"
                                    id='firstName' value={userinput.firstname} onChange={onChange} required
                                    placeholder="firstname"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="2" >
                            <FormGroup>
                                <Label for="lastName">Lastname <span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text" name="lastname"
                                    id='lastName' value={userinput.lastname} onChange={onChange} required
                                    placeholder="lastname"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="2" >
                            <FormGroup>
                                <Label for="email">Email <span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.email && <span style={{ color: 'red', fontSize: '11px' }}>is not valid</span>}
                                <Input type="email" name="email"
                                    id='email' value={userinput.email} onChange={onChange} required
                                    placeholder="example@gmail.com"
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="2" >
                            <FormGroup>
                                <Label for="AppUserType">Type <span style={{ color: 'red' }}>*</span></Label>&nbsp;{error.userType && <span style={{ color: 'red', fontSize: '11px' }}>Required</span>}
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    name="AppUserType"
                                    defaultValue={{ label: userinput.subusertypeName, value: userinput.subusertype }}
                                    onChange={onAppUserTypeChange}
                                    options={userTypes}
                                    isClearable
                                />
                            </FormGroup>

                        </Col>

                        <Col sm="2" >
                            {
                                loading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <span className='align-middle ml-50'>Update</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form> : <Skeleton active />}
                </CardBody>
            </Card>
        </>
    )
}

export default AppUserEdit