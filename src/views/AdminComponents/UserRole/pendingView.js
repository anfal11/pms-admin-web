import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import { Error, Success } from '../../viewhelper'
import { ChevronLeft } from 'react-feather'

const PendingView = () => {
    const { id } = useParams()
    const history = useHistory()
    const [featureIDs, setFeatureIDs] = useState([])
    const [sub_menu_ids, setSubmenuIDs] = useState([])
    const [addUserloading, setaddUserloading] = useState(false)
    const [allMenuList, setallMenuList] = useState([])
    const [isValid, setIsValid] = useState(false)
    const [userInput, setUserInput] = useState({
        role_name:"",
        sub_menu_ids:[],
        menu_ids:[]
    })

    useEffect(() => {
        localStorage.setItem('useBMStoken', false)
        localStorage.setItem('usePMStoken', false)
        useJwt.getAdminroleTempDetails({role_id: id}).then(res => {
            // setaddUserloading(false)
            console.log('get role details', res)
            if (res.data['payload']) {
                const { role_name, rolemenudata } = res.data['payload']
                const menu_ids = [], submenuids = []
                rolemenudata.map(item => {
                    menu_ids.push(item.id)
                    if (item.submenu && item.submenu.length) {
                        item.submenu.map(item2 => submenuids.push(item2.id)) 
                    }
                })
                setUserInput({ role_name, menu_ids, sub_menu_ids: submenuids})
            }
            // Success(res)
        }).catch(err => {
            // setaddUserloading(false)
            Error(err)
            console.log(err)
        })

        useJwt.getAdminMenuSubmenuList().then(res => {
            // setaddUserloading(false)
            console.log('getAdminMenuSubmenuList', res)
            setallMenuList(res.data.payload)
            // Success(res)
        }).catch(err => {
            // setaddUserloading(false)
            Error(err)
            console.log(err)
        })
    }, [])

    return (
        <Fragment>

           <Button.Ripple className='ml-2 mb-2 bg-white border text-primary
            ' color='light' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>

            <Form style={{ width: '100%' }}>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>View User Role Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="pt-1" >
                            <Col md='4' >
                                <FormGroup>
                                    <Label for="role_name">Role name</Label>
                                    <Input type="text"
                                        name="role_name"
                                        id='role_name'
                                        value={userInput.role_name}
                                        required
                                        disabled = {true}
                                        placeholder="role name..."
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card >
                    {/* <CardHeader className='border-bottom'>
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
                                    setFeatureIDs([])
                                    setSubmenuIDs([])
                                }
                            }}
                        /></CardTitle>
                    </CardHeader> */}
                    <CardBody className='pt-1 pb-0'>
                    <Row className='match-height'>
                            {
                                allMenuList.filter(m => m.submenu.length === 0).map((menuItem, index) => {

                                    const ischecked = userInput.menu_ids.includes(menuItem.id)

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

                                                const ischecked = userInput.sub_menu_ids.includes(subMenuItem.id)

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
                </Card>
            </Form>
        </Fragment>
    )
}

export default PendingView