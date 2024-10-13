import React, { useEffect, useState, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const CreateUser = () => {
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [addUserloading, setaddUserloading] = useState(false)
    const selectInputRef = useRef()
    const [userTypes, setUserTypes] = useState([])
    const [userInput, setUserInput] = useState({
        mobile: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        business_id: BusinessList[0].id
    })
    const [error, seterror] = useState({
        email: false,
        mobile: false
    })
    useEffect(() => {
        useJwt.appUserType().then(res => {
            // console.log(res.data.payload)
            const userTypeApi = res.data.payload.map(type => {
                return { value: type.id, label: type.statusdesc }
            })
            setUserTypes(userTypeApi)
        }).catch(err => {
            console.log(err)
        })
    }, [])
    const onAppUserTypeChange = (option, { action }) => {
        if (action === 'clear') {
            setUserInput({ ...userInput, subusertype: null })
        } else {
            seterror({ ...error, userType: false })
            setUserInput({ ...userInput, subusertype: option.value })
        }
    }
    const handleChange = (e) => {
        const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
        // Email Validator
        if (e.target.name === 'email' && chkEmail) {
            seterror({ ...error, email: false })
        }
        if (e.target.name === 'email' && !chkEmail) {
            seterror({ ...error, email: true })
        }
        //mobile number validator
        if (e.target.name === "mobile") {
            console.log(e.target.value)
            if (e.target.value[0] === '0') {
                seterror({ ...error, mobile: true })
                return 0
            } else {
                seterror({ ...error, mobile: false })
            }
            if (!/^[0-9]*$/.test(e.target.value)) {
                return 0
            }
        }
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const { mobile, email, firstname, lastname, business_id, password, subusertype } = userInput
        const chkEmail = /\S+@\S+\.\S+/.test(email)

        if (!chkEmail) {
            return 0
        }
        setaddUserloading(true)
        useJwt.createSubUserVendor({ mobile, email, firstname, lastname, subusertype, business_id, password }).then(res => {
            setaddUserloading(false)
            console.log(res)
            Success(res)
        }).catch(err => {
            setaddUserloading(false)
            Error(err)
            console.log(err.response)
        })
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Add New User</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: '15px' }}>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    {BusinessList.length > 1 && <Col sm="6" >
                        <FormGroup>
                            <Label for="Business">Select a Business</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={BusinessList.map(x => { return { value: x.id, label: x.businessname } })[0]}
                                onChange={(selected) => {
                                    setUserInput({ ...userInput, business_id: selected.value })
                                }}
                                options={BusinessList.map(x => { return { value: x.id, label: x.businessname } })}
                            />
                        </FormGroup>
                    </Col>}
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="firstname">Firstname<span style={{color:'red'}}>*</span></Label>
                            <Input type="text"
                                name="firstname"
                                id='firstname'
                                value={userInput.firstname}
                                onChange={handleChange}
                                required
                                placeholder="Jhon "
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="lastname">Lastname<span style={{color:'red'}}>*</span></Label>
                            <Input type="text"
                                name="lastname"
                                id='lastname'
                                value={userInput.lastname}
                                onChange={handleChange}
                                required
                                placeholder="Doe"
                            />
                        </FormGroup>
                    </Col>

                    <Col sm="6" >
                        <FormGroup>
                            <Label for="MSISDN">Mobile Number<span style={{color:'red'}}>*</span> </Label>
                            <Input type="text"
                                minLength={10}
                                maxLength={10}
                                name="mobile"
                                id='MSISDN'
                                value={userInput.mobile}
                                onChange={handleChange}
                                required
                                placeholder="123 4567"
                            />
                            {error.mobile && <span style={{ color: 'red', fontSize: '11px' }}>First digit 0 not allow</span>}
                        </FormGroup>
                    </Col>

                    <Col sm="6" >
                        <FormGroup>
                            <Label for="Email">Email<span style={{color:'red'}}>*</span></Label>
                            <Input type="email"
                                name="email"
                                id='Email'
                                value={userInput.email}
                                onChange={handleChange}
                                required
                                placeholder="Example@gmail.com"
                            />
                            {error.email && userInput.email && <span style={{ color: 'red', fontSize: '11px' }}>Please Enter a valid Email</span>}
                        </FormGroup>
                    </Col>

                    <Col sm="6" >
                        <FormGroup>
                            <Label for="password">Password<span style={{color:'red'}}>*</span></Label>
                            <Input type="password"
                                name="password"
                                id='password'
                                value={userInput.password}
                                onChange={handleChange}
                                required
                                placeholder="***"
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
                    <Col sm="12" className='text-center'>
                        {
                            addUserloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </CardBody>
        </Card>
    )
}

export default CreateUser