import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../viewhelper'
import { Skeleton } from 'antd'
import { ChevronLeft } from 'react-feather'

const Create = () => {
    const history = useHistory()
    // const [featureIDs, setFeatureIDs] = useState([1])
    const [featureIDs, setFeatureIDs] = useState([])
    const [sub_menu_ids, setSubmenuIDs] = useState([])
    const [addUserloading, setaddUserloading] = useState(false)
    const [isloading, setIsLoading] = useState(true)
    const [allMenuList, setallMenuList] = useState([])
    const [userInput, setUserInput] = useState({
        role_name:"",
        sub_menu_ids:[],
        menu_ids:[]
    })
    const [errors, seterrors] = useState({
        title: '',
        userstatus: '',
        email: ''
    })

    useEffect(() => {
        localStorage.setItem('useBMStoken', false)
        localStorage.setItem('usePMStoken', false)
        useJwt.getAdminMenuSubmenuList().then(res => {
            // setaddUserloading(false)
            console.log('getAdminMenuSubmenuList', res)
            setallMenuList(res.data.payload)
            setIsLoading(false)
        }).catch(err => {
            // setaddUserloading(false)
            Error(err)
            console.log(err)
        })
    }, [])


    const onchange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('useBMStoken', false) //tokan management purpose
        localStorage.setItem('usePMStoken', false) //tokan management purpose
        seterrors({})
        const { role_name } = userInput

        const menuSubmenuMod = allMenuList.filter(x => x.submenu.length).map(y => { return { id: y.id, submenu: y.submenu.map(z => z.id) } })
        const filteredmenuID = []
        for (let i = 0; i < menuSubmenuMod.length; i++) {
            if (menuSubmenuMod[i].submenu.some(subId => sub_menu_ids.includes(subId))) {
                filteredmenuID.push(menuSubmenuMod[i].id)
            }
        }
        console.log({role_name, sub_menu_ids: [...new Set(sub_menu_ids)], menu_ids: [...new Set(featureIDs), ...filteredmenuID] })
        setaddUserloading(true)
        useJwt.createRole({role_name, sub_menu_ids: [...new Set(sub_menu_ids)], menu_ids: [...new Set(featureIDs), ...filteredmenuID] }).then(res => {
            setaddUserloading(false)
            console.log(res)
            history.goBack()
            Success(res)
        }).catch(err => {
            setaddUserloading(false)
            Error(err)
            console.log(err.response)
        })
    }
    return (
        isloading ? <Fragment> <Skeleton active /> <Skeleton active /> </Fragment> : <Fragment>
             <Button.Ripple className='ml-2 mb-2 bg-white border text-primary' color='light' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>

            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Create New User Role</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="pt-1" >
                            <Col md='4' >
                                <FormGroup>
                                    <Label for="role_name">Role name <span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="role_name"
                                        id='role_name'
                                        value={userInput.role_name}
                                        onChange={onchange}
                                        required
                                        placeholder="role name..."
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card >
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Permissions</CardTitle>
                        <CardTitle tag='h4'><CustomInput
                            type='checkbox'
                            id={'All'}
                            label={'Select All'}
                            inline
                            // checked={featureIDs.includes(feature.id)}
                            onChange={e => {
                                const Array2D = allMenuList.map(x => x.submenu.map(y => y.id))
                                if (e.target.checked) {
                                    setFeatureIDs(Array2D.map(item => Array2D.indexOf(item) + 1))
                                    setSubmenuIDs([].concat(...Array2D))
                                } else {
                                    // setFeatureIDs([1])
                                    setFeatureIDs([])
                                    setSubmenuIDs([])
                                }
                            }}
                        /></CardTitle>
                    </CardHeader>
                    <CardBody className='pt-1 pb-0'>
                    <Row className='match-height'>
                            {
                                allMenuList.filter(m => m.submenu?.length === 0).map((menuItem, index) => <Col md='3' key={index}>
                                    <Card className="border p-1">
                                        <CustomInput
                                            type='checkbox'
                                            id={menuItem.id}
                                            label={menuItem.name}
                                            inline
                                            // disabled={menuItem.id === 1 || false}
                                            onChange={e => {
                                                const removedID = featureIDs.filter(x => x !== menuItem.id)
                                                e.target.checked ? setFeatureIDs([...featureIDs, menuItem.id]) : setFeatureIDs(removedID)
                                            }}
                                            checked={featureIDs.includes(menuItem.id)}
                                        />
                                    </Card>
                                </Col>
                                )
                            }
                        </Row>
                        <Row className='match-height'>
                            {
                                allMenuList.filter(m => m.submenu?.length !== 0).map((menuItem, index) => <Col md='4' key={index}>
                                    <Card className="border pb-1">
                                        <b className="border-bottom p-1 mb-1">{menuItem.name}</b>
                                        {
                                            menuItem.submenu?.map((subMenuItem, index) => <div className='px-1' key={index}>
                                                <CustomInput
                                                    type='checkbox'
                                                    id={subMenuItem.id + 1000}
                                                    label={subMenuItem.name}
                                                    inline
                                                    checked={sub_menu_ids.includes(subMenuItem.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSubmenuIDs([...sub_menu_ids, subMenuItem.id])
                                                        } else {
                                                            setSubmenuIDs(sub_menu_ids.filter(submenuID => submenuID !== subMenuItem.id))
                                                        }
                                                    }}
                                                />

                                            </div>)
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