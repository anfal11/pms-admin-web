import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useJwt from '@src/auth/jwt/useJwt'
import { ChevronLeft } from 'react-feather'
import { Tag, Skeleton } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import 'antd/dist/antd.css'
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Label,
    Row,
    Col,
    Form,
    FormGroup,
    CardBody,
    CustomInput,
    Table,
    Spinner,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    FormFeedback,
    Progress
} from 'reactstrap'

const ViewUserDetails = () => {
    const { userID } = useParams()
    const [loading, setloading] = useState(true)
    const [userData, setUserData] = useState({})

    useEffect(() => {
        useJwt.adminUserDetails({ id: userID }).then(res => {
            console.log(res.data.payload[0])
            setUserData(res.data.payload[0])
            setloading(false)
        }).catch(err => {
            console.log(err.response)
        })
    }, [])

    const onchange = () => { }

    return (
        <>
            { loading ? <> <Skeleton active /> <Skeleton active />
            </> : <Form autoComplete="off" className="businessview">

                <Button.Ripple className='ml-2 mb-2' color='primary' tag={Link} to='/user'>
                    <ChevronLeft size={10} />
                    <span className='align-middle ml-50'>Back</span>
                </Button.Ripple>

                <Card >
                    <CardHeader>
                        <CardTitle style={{ width: '100%' }} >
                            <h4 style={{ float: 'left' }}>Staff Details</h4>
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='6' sm='12'>
                                <FormGroup>
                                    <Label for='username'>Username</Label>
                                    <Input type='text'
                                        name='username'
                                        id='username'
                                        value={userData.username}
                                        onChange={onchange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='6' sm='12'>
                                <FormGroup>
                                    <Label for='Email'>Email</Label>
                                    <Input type='text'
                                        name='Email'
                                        id='Email'
                                        value={userData.emailid}
                                        onChange={onchange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='6' sm='12'>
                                <FormGroup>
                                    <Label for='fullname'>Fullname</Label>
                                    <Input type='text'
                                        name='fullname'
                                        id='fullname'
                                        value={userData.fullname}
                                        onChange={onchange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='6' sm='12'>
                                <FormGroup>
                                    <Label for='roleid: '>Role</Label>
                                    <Input type='text'
                                        name='roleid: '
                                        id='roleid: '
                                        value={userData.adminstatus.statusdesc}
                                        onChange={onchange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='6' sm='12'>
                                <FormGroup>
                                    <Label for='storeid'>Store Name</Label>
                                    <Input type='text'
                                        name='storeid'
                                        id='storeid'
                                        value={userData.adminstore ? userData.adminstore.storename : ''}
                                        onChange={onchange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='6' sm='12'>
                                <FormGroup>
                                    <Label for='title'>Title</Label>
                                    <Input type='text'
                                        name='title'
                                        id='title'
                                        value={userData.titleinfo.statusdesc}
                                        onChange={onchange}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>}
        </>
    )
}

export default ViewUserDetails