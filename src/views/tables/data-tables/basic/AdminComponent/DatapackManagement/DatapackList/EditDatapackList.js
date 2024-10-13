import useJwt from '@src/auth/jwt/useJwt'
import { Fragment, useState } from "react"
import { ChevronLeft } from "react-feather"
import { Link, useHistory } from 'react-router-dom'
import { Card, CardHeader, CardTitle, Button, Table, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'
import { Success, Error } from "../../../../../../viewhelper"

const EditDatapackList = () => {
    const history = useHistory()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [userInput, setUserInput] = useState(JSON.parse(localStorage.getItem('datapackInfo')))
    const handleChange = (e) => {
        setUserInput({...userInput, [e.target.name]: e.target.value})
    }
    const onSubmit = (e) => {
        e.preventDefault()
        setPointRuleloading(true)
        useJwt.datapackUpdate(userInput).then(res => {
            console.log(res)
            Success(res)
            history.push('/datapackList')
            setPointRuleloading(false)
        }).catch(err => {
            Error(err)
            console.log(err)
            setPointRuleloading(false)
        })

    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/datapackList' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <h4 className='m-1'>Datapack List Info</h4>
                <Row className='match-height'>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <Row>
                                <Col sm="5" >
                                        <FormGroup>
                                            <Label for="name">Name<span className='text-danger'>*</span></Label>
                                            <Input type="text"
                                                name="name"
                                                id='name'
                                                value={userInput.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Name"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="packcode">Packcode<span className='text-danger'>*</span></Label>
                                            <Input type="text"
                                                name="packcode"
                                                id='packcode'
                                                value={userInput.packcode}
                                                onChange={handleChange}
                                                required
                                                placeholder="Packcode"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="operator">Operator<span className='text-danger'>*</span></Label>
                                            <Input type="text"
                                                name="operator"
                                                id='operator'
                                                value={userInput.operator}
                                                onChange={handleChange}
                                                required
                                                placeholder="Operator"
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="volumeInMB">Volume In MB<span className='text-danger'>*</span></Label>
                                            <Input type="text"
                                                name="volumeInMB"
                                                id='volumeInMB'
                                                value={userInput.volumeInMB}
                                                onChange={handleChange}
                                                placeholder="Volume In MB"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm="12" className='text-center'>
                                {
                                    pointRuleloading ? (
                                        <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                            <Spinner color='white' size='sm' />
                                            <span className='ml-50'>Loading...</span>
                                        </Button.Ripple>
                                    ) : (
                                        <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                            <span>Update</span>
                                        </Button.Ripple>
                                    )
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Form>
        </Fragment >
    )
}

export default EditDatapackList