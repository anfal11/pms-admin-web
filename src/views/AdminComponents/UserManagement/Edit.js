import React, { Fragment, useEffect, useState, useContext } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, Alert, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { selectThemeColors, transformInToFormObject, _isEmptyObj } from '@utils'
import { Success, Error } from '../../viewhelper'
import useJwt from '@src/auth/jwt/useJwt'
import { useHistory, useParams } from 'react-router-dom'
import { handle401 } from '../../helper'
import PasswordValidationItem from './PasswordValidationItem'

const EditUser = () => {
    const history = useHistory()
    const { username } = useParams()
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const [EmailErr, setEmailErr] = useState('')
    const [menuSubmenus, setMenuSubmenus] = useState([])
    const [passConfig, setPassConfig] = useState({})
    const [isValid, setIsValid] = useState(false)
    const [menu_ids, setMenuIDs] = useState([1])
    const [featureIDs, setFeatureIDs] = useState([])
    const [sub_menu_ids, setSubmenuIDs] = useState([])
    const [roleList, setrolelist] = useState([])
    const [isloading, setisloading] = useState(true)
    const [ismenuloading, setmenuloading] = useState(true)
    const [addUserloading, setaddUserloading] = useState(false)

    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}

    if (!userInfo || _isEmptyObj(userInfo)) {
        history.push("/adminUserList")
    }

    const [userInput, setUserInput] = useState({
        username: userInfo['username'],
        password: '',
        userstatus: userInfo['userstatus'] || 0,
        fullname: userInfo['fullname'] || "",
        emailid: userInfo['emailid'] || "",
        passwordRequired: false,
        role_id : parseInt(userInfo['roleid']) || 0,
        rolevalueoptionas : {}
    })

    const getRolemenusubmenulist = (role_id) => {

        setmenuloading(true)
        setFeatureIDs([])
        setSubmenuIDs([])

        useJwt.getAdminroleDetails({role_id}).then(res => {
            // setaddUserloading(false)
            console.log('get role details', res)
            if (res.data['payload']) {
                const { rolemenudata } = res.data['payload']
                const menu_ids = [], submenuids = []
                rolemenudata.map(item => {
                    menu_ids.push(item.id)
                    if (item.submenu && item.submenu.length) {
                        item.submenu.map(item2 => submenuids.push(item2.id)) 
                    }
                })

                setFeatureIDs(menu_ids)
                setSubmenuIDs(submenuids)
                //setUserInput({ role_name, menu_ids, sub_menu_ids: submenuids})
            }
            setmenuloading(false)
        }).catch(err => {
            //Error(err)
            setmenuloading(false)
            console.log(err)
        })
    }

    useEffect(async () => {
        localStorage.setItem('useBMStoken', false) //tokan management purpose
        localStorage.setItem('usePMStoken', false) //tokan management purpose
        await useJwt.getAdminMenuSubmenuList().then(res => {
            // console.table('GetMenuSubmenus', res.data.payload)
            setMenuSubmenus(res.data.payload)
        }).catch(err => {
            //handle401(err.response.status)
            console.log(err)
        })
        useJwt.getPasswordConfig().then(res => {
            console.log('getPasswordConfig', res)
            setPassConfig(res.data.payload)
        }).catch(err => {
            Error(err)
            console.log(err)
        })
    }, [])
    // console.log(userInfo)
    
    const [errors, seterrors] = useState([])

    const passwordSwitch = (e) => {
        if (e.target.checked) {
            setUserInput({ ...userInput, passwordRequired: true })
        } else {
            setUserInput({ ...userInput, passwordRequired: false, password: '' })
        }
    }
    const onchange = (e) => {
        if (e.target.name === 'emailid' && /\S+@\S+\.\S+/.test(e.target.value)) {
            setEmailErr('')
        }
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const onChangeRole = (selected) => {
        setUserInput({ ...userInput, role_id: selected.value, rolevalueoptionas: selected })
        getRolemenusubmenulist(selected.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('useBMStoken', false) //tokan management purpose
        localStorage.setItem('usePMStoken', false) //tokan management purpose
        const { username, userstatus, password, emailid, fullname, passwordRequired, role_id } = userInput
        const checkingEmail = /\S+@\S+\.\S+/.test(emailid)
        if (!checkingEmail) {
            scrollToTop()
            document.getElementById('emailid').focus()
            setEmailErr('is invalid')
            return 0
        }
        //if enter password and password is not valid then stop it..
        if (passwordRequired && !isValid) {
            scrollToTop()
            return 0
        }

        console.log({ passwordRequired, fullname, username, password : passwordRequired ? password : null, emailid, userstatus, sub_menu_ids: [...new Set(sub_menu_ids)], menu_ids: [...new Set(menu_ids)], roleid: role_id, title: 12 })
        setaddUserloading(true)
        useJwt.editAdminUser({ fullname, username, password : passwordRequired ? password : null, emailid, userstatus, sub_menu_ids: [...new Set(sub_menu_ids)], menu_ids: [...new Set(menu_ids)], roleid: role_id, title: 12 }).then(res => {
            setaddUserloading(false)
            console.log(res)
            history.push("/adminUserList")
        }).catch(err => {
            // handle401(err.response.status)
            setaddUserloading(false)
            // seterrors(Object.values(err.response.data.errors).map(x => x[0]))
            scrollToTop()
            // console.log(Object.values(err.response.data.errors).map(x => x[0]))
            console.log(err.response)
            Error(err)
        })
    }

    const promiseOptions = (inputValue) => { 
       return new Promise((resolve) => { 
            useJwt.getRoleListForAssign().then(res => {
                console.log('getRoleListForAssign', res.data)
                let rolelistItem = []
                if (res.data.payload.length) {
    
                    //[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]
                    const roleListFormat = res.data.payload.map(item => {
                        return { value: item.id, label: item.role_name }
                    })
                    setrolelist(roleListFormat)
                    rolelistItem = roleListFormat
                    if (!userInfo.roleid) {
                        setUserInput({ ...userInput, role_id: res.data.payload[0]['id'], rolevalueoptionas: res.data.payload[0] })
                    } else {
                        let defaultValue = {}
                        roleListFormat.some(item => {
                            if (item.value === parseInt(userInfo.roleid)) {
                                defaultValue = item
                                return true
                            }
                            return false
                        })

                        setUserInput({ ...userInput, rolevalueoptionas: defaultValue})
                    }
                    getRolemenusubmenulist(userInfo.roleid || res.data.payload[0]['id'])
                }
                setisloading(false)
                resolve(rolelistItem)
    
            }).catch(err => {
                setisloading(false)
                console.log(err)
                resolve([])
            })

           // setTimeout(() => { resolve(roleList) }, 10000) 
        }) 
    }

    return (
        <Fragment>
            <Button.Ripple className='ml-2 mb-2 bg-white border text-primary
            ' color='light' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            {!!errors.length && <Alert color="danger" className='w-100 mb-1 p-1'>
                {errors}
            </Alert>}
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Edit User</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="pt-1" >
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input type="text"
                                        name="username"
                                        disabled
                                        id='username'
                                        value={userInput.username}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon@123"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="fullname">Fullname</Label>
                                    <Input type="text"
                                        name="fullname"
                                        id='fullname'
                                        value={userInput.fullname}
                                        onChange={onchange}
                                        required
                                        placeholder="John doe"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='6' >
                                <Label>Status</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={(selected) => {
                                        seterrors({ ...errors, userstatus: '' })
                                        setUserInput({ ...userInput, userstatus: selected.value })
                                    }}
                                    value={userInput.userstatus === 1 ? { value: 1, label: "Active" } : { value: 0, label: "Inactive" }}
                                    options={[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]}
                                    isClearable={false}
                                />
                            </Col>
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="emailid">Email <span style={{ color: 'red' }}> {EmailErr}</span></Label>
                                    <Input type="email"
                                        name="emailid"
                                        id='emailid'
                                        value={userInput.emailid}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon_doe@gmail.com"
                                    />
                                </FormGroup>
                            </Col>

                            <Col sm="6" >
                               <CustomInput  type='switch' id='passwordBtn' onChange={(e) => passwordSwitch(e)} inline label='Change Password' defaultChecked={false}/>
                               {
                                userInput.passwordRequired ? <FormGroup style={{paddingTop: 10}}>
                                    <Label for="password">Password</Label>
                                    <InputPasswordToggle
                                        name="password"
                                        id='password'
                                        value={userInput.password}
                                        onChange={onchange}
                                        placeholder="******"
                                        required={userInput.passwordRequired}
                                    />
                                    </FormGroup> : null
                               }

                                {
                                    userInput.password ?  <PasswordValidationItem password={userInput.password} setIsValid={setIsValid} passConfig={passConfig}/> : null
                                }

                            </Col>
                            <Col sm='6' >
                                <Label>Role</Label>
                                {/* <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={roleList.length ? roleList[0] : {}}
                                    onChange={(selected) => onChangeRole(selected)}
                                    options={roleList}
                                    isClearable={false}
                                /> */}
                                <AsyncSelect 
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    cacheOptions 
                                    defaultOptions
                                    loadOptions={promiseOptions}
                                    onChange={(selected) => onChangeRole(selected)}
                                    value={userInput.rolevalueoptionas || {}}
                                />

                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card >
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Permissions &nbsp;&nbsp; {ismenuloading ? <Spinner /> : null}</CardTitle>

                    </CardHeader>
                    <CardBody className='pt-1 pb-0'>
                    <Row className='match-height'>
                            {
                                menuSubmenus.filter(m => m.submenu.length === 0).map((menuItem, index) => {

                                    const ischecked = featureIDs.includes(menuItem.id)

                                    return <Col md='3' key={menuItem.id}>
                                    <Card className="border p-1">
                                        <CustomInput
                                            type='checkbox'
                                            id={menuItem.id}
                                            label={menuItem.name}
                                            onChange={(e) => e.preventDefault()}
                                            inline
                                            disabled={!ischecked}
                                            checked={ischecked}
                                        />
                                    </Card>
                                </Col>
                                })
                            }
                        </Row>
                        <Row className='match-height'>
                            {
                                menuSubmenus.filter(m => m.submenu.length !== 0).map((menuItem, index) => <Col md='3' key={menuItem.id}>
                                    <Card className="border pb-1">
                                        <b className="border-bottom p-1 mb-1">{menuItem.name}</b>
                                        {
                                            menuItem.submenu.map((subMenuItem, index) => {

                                                const ischecked = sub_menu_ids.includes(subMenuItem.id)

                                                return <div className='px-1' key={`sub-${subMenuItem.id}`}>
                                                <CustomInput
                                                    type='checkbox'
                                                    id={subMenuItem.id + 1000}
                                                    label={subMenuItem.name}
                                                    inline
                                                    onChange={(e) => e.preventDefault()}
                                                    disabled={!ischecked}
                                                    checked={ischecked}
                                                />

                                            </div>
                                            })
                                        }
                                    </Card>
                                </Col>
                                )
                            }
                        </Row>
                    </CardBody>
                </Card>

                <Card >
                    <CardBody className='pt-0'>
                        <Row>
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
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment >
    )
}

export default EditUser