import InputPasswordToggle from '@components/input-password-toggle'
import useJwt from '@src/auth/jwt/useJwt'
import { selectThemeColors } from '@utils'
import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../viewhelper'
import PasswordValidationItem from './PasswordValidationItem'
import { ChevronLeft } from 'react-feather'
import { Skeleton } from 'antd'

const Create = () => {
    const history = useHistory()
    const [featureIDs, setFeatureIDs] = useState([])
    const [sub_menu_ids, setSubmenuIDs] = useState([])
    const [addUserloading, setaddUserloading] = useState(false)
    const [allMenuList, setallMenuList] = useState([])
    const [userTypes, setuserTypes] = useState([])
    const [userTitles, setuserTitles] = useState([])
    const [isloading, setisloading] = useState(true)
    const [passConfig, setPassConfig] = useState({})
    const [isValid, setIsValid] = useState(false)
    const [roleList, setrolelist] = useState([])
    const [ismenuloading, setmenuloading] = useState(true)
    const [userInput, setUserInput] = useState({
        username: "",
        password: '',
        roleid: '',
        title: '',
        userstatus: 1,
        emailid: '',
        fullname: '',
        role_id: 0
    })

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

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
    useEffect(() => {
        localStorage.setItem('useBMStoken', false)
        localStorage.setItem('usePMStoken', false)
        useJwt.getAdminMenuSubmenuList().then(res => {
            // setaddUserloading(false)
            console.log('getAdminMenuSubmenuList', res)
            setallMenuList(res.data.payload)
            // Success(res)
        }).catch(err => {
            // setaddUserloading(false)
            //Error(err)
            console.log(err)
        })
        useJwt.getPasswordConfig().then(res => {
            console.log('getPasswordConfig', res)
            setPassConfig(res.data.payload)
        }).catch(err => {
            //Error(err)
            console.log(err)
        })
        useJwt.getUsertittleList().then(res => {
            // setaddUserloading(false)
            console.log('getUsertittleList', res)
            setuserTitles(res.data.payload)
            // Success(res)
        }).catch(err => {
            // setaddUserloading(false)
            //Error(err)
            console.log(err)
        })

        useJwt.getRoleListForAssign().then(res => {
            console.log('getRoleListForAssign', res.data)
            if (res.data.payload.length) {

                //[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]
                const roleListFormat = res.data.payload.map(item => {
                    return { value: item.id, label: item.role_name }
                })
                setrolelist(roleListFormat)
                setUserInput({ ...userInput, role_id: res.data.payload[0]['id'] })
                getRolemenusubmenulist(res.data.payload[0]['id'])
            }
            setisloading(false)

        }).catch(err => {
            setisloading(false)
            console.log(err)
        })
    }, [])
    const [errors, seterrors] = useState({
        title: '',
        userstatus: '',
        email: ''
    })

    console.log('featureIDs ', featureIDs)
    console.log('sub_menu_ids ', sub_menu_ids)

    const onChangeRole = (selected) => {
        seterrors({ ...errors, role_id: '' })
        setUserInput({ ...userInput, role_id: selected.value })
        getRolemenusubmenulist(selected.value)
    }

    const onchange = (e) => {
        if (e.target.name === 'emailid' && /\S+@\S+\.\S+/.test(e.target.value)) {
            seterrors({ ...errors, email: '' })
        }
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('useBMStoken', false) //tokan management purpose
        localStorage.setItem('usePMStoken', false) //tokan management purpose
        seterrors({})
        const { fullname, username, title, userstatus, password, emailid, role_id } = userInput
        const checkingEmail = /\S+@\S+\.\S+/.test(emailid)
        if (!checkingEmail) {
            seterrors({ ...errors, email: 'is not valid' })
            scrollToTop()
            return 0
        }
        //password check...
        if (!isValid) {
            scrollToTop()
            return 0
        }

        const menuSubmenuMod = allMenuList.filter(x => x.submenu.length).map(y => { return { id: y.id, submenu: y.submenu.map(z => z.id) } })
        const filteredmenuID = []
        for (let i = 0; i < menuSubmenuMod.length; i++) {
            if (menuSubmenuMod[i].submenu.some(subId => sub_menu_ids.includes(subId))) {
                filteredmenuID.push(menuSubmenuMod[i].id)
            }
        }
        console.log({fullname, username, emailid, password, roleid: role_id, title : 12, userstatus, sub_menu_ids: [...new Set(sub_menu_ids)], menu_ids: [...new Set(featureIDs), ...filteredmenuID] })
        setaddUserloading(true)
        useJwt.createAdminUser({fullname, username, emailid, password, roleid: role_id, title : 12, userstatus, sub_menu_ids: [...new Set(sub_menu_ids)], menu_ids: [...new Set(featureIDs), ...filteredmenuID] }).then(res => {
            setaddUserloading(false)
            console.log(res)
            history.push("/adminUserList")
            Success(res)
        }).catch(err => {
            scrollToTop()
            setaddUserloading(false)
            Error(err)
            console.log(err.response)
        })
    }
    return (
        isloading ? <Fragment> <Skeleton active /> <Skeleton active /> </Fragment> : <Fragment>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Add New User</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="pt-1" >
                            <Col md='4' >
                                <FormGroup>
                                    <Label for="username">Username <span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="username"
                                        minLength='6'
                                        id='username'
                                        value={userInput.username}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon@123"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='4' >
                                <FormGroup>
                                    <Label for="username">Full name </Label>
                                    <Input type="text"
                                        name="fullname"
                                        id='fullname'
                                        value={userInput.fullname}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon Doe"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='4' >
                                <FormGroup>
                                    <Label for="emailid">Email <span style={{ color: 'red' }}>* {errors.email}</span></Label>
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
                            <Col md='4' >
                                <FormGroup>
                                    <Label for="password">Password <span style={{ color: 'red' }}>* {errors.pwd}</span></Label>
                                    <InputPasswordToggle
                                        name="password"
                                        id='password'
                                        value={userInput.password}
                                        onChange={onchange}
                                        required
                                        minLength={passConfig?.length?.toString()}
                                        placeholder="******"
                                    />
                                    {/* {error.password && userInput.password && <span style={{ color: 'red', fontSize: '11px' }}>must be greater than 4 digit</span>} */}
                                </FormGroup>
                                   {
                                        userInput.password ?  <PasswordValidationItem password={userInput.password} setIsValid={setIsValid} passConfig={passConfig}/> : null
                                    }
                            </Col>

                            {/* <Col md='4' >
                                <Label>User Type <span style={{ color: 'red' }}>* {errors.userstatus}</span></Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={(selected) => {
                                        seterrors({ ...errors, userstatus: '' })
                                        setUserInput({ ...userInput, userstatus: selected.value })
                                    }}
                                    options={userTypes}
                                    // options={[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]}
                                    isClearable={false}
                                />

                            </Col> */}
                    {/*         <Col md='4' >
                                <Label>User Title</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={(selected) => {
                                        seterrors({ ...errors, title: '' })
                                        setUserInput({ ...userInput, title: selected.value })
                                    }}
                                    options={userTitles.map(x => { return { value: x.id, label: x.statusdesc } })}
                                    isClearable={false}
                                />

                            </Col> */}
                            <Col md='4' >
                                <Label>Status</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={(selected) => {
                                        seterrors({ ...errors, userstatus: '' })
                                        setUserInput({ ...userInput, userstatus: selected.value })
                                    }}
                                    defaultValue={{ value: 1, label: "Active" }}
                                    options={[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]}
                                    isClearable={false}
                                />

                            </Col>

                            <Col md='4' >
                                <Label>Role</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    defaultValue={roleList.length ? roleList[0] : {}}
                                    onChange={(selected) => onChangeRole(selected)}
                                    options={roleList}
                                    isClearable={false}
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
                                allMenuList.filter(m => m.submenu.length === 0).map((menuItem, index) => {

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
                                allMenuList.filter(m => m.submenu.length !== 0).map((menuItem, index) => <Col md='3' key={menuItem.id}>
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
        </Fragment>
    )
}

export default Create