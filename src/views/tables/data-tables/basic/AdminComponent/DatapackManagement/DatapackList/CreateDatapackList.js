import useJwt from '@src/auth/jwt/useJwt'
import { Fragment, useEffect, useState } from "react"
import { ChevronLeft } from "react-feather"
import { Link, useHistory } from 'react-router-dom'
import { Card, CardHeader, CardTitle, Button, Table, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody } from 'reactstrap'
import { Success, Error } from "../../../../../../viewhelper"
import { selectThemeColors } from '../../../../../../../utility/Utils'
import Select from 'react-select'

const CreateDatapackList = () => {
    const history = useHistory()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [operatorListAll, setOperatorListAll] = useState([])
    const [selectedOperator, setSelectedOperator] = useState(null)
    const [userInput, setUserInput] = useState({
        packcode: "",
        operator: "",
        name: "",
        volumeInMB: "",
        currentBalance: ""
    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(() => {

        // useJwt.datapackList().then(res => {
        //     console.log('datapackList ', res.data)

        //     // const operators = []
        //     // for (const ii of res.data.payload) {
        //     //     if (!operators.includes(ii.operator)) {
        //     //         operators.push(ii.operator)
        //     //     }
        //     // }
        //     // setOperatorListAll(operators.map(item => { return {value: item, label: item} }))
        //     // //setPackListAll(res.data.payload)

        //     // const options = res.data.payload.map((operator) => ({
        //     //     value: operator.id,
        //     //     label: operator.operator_keyword
        //     // }))
        //     // setOperatorListAll(options)

        // }).catch(err => {
        //     console.log(err)
        //     Error(err)
        // })

        useJwt.operatorList()
            .then((res) => {
                const options = res.data.payload.map((operator) => ({
                    value: operator.id,
                    label: operator.operator_keyword
                }))
                setOperatorListAll(options)
            })
            .catch((error) => {
                console.error('Error fetching operatorList:', error)
            })
    }, [])
    const handleOperatorChange = (selectedOption) => {
        setSelectedOperator(selectedOption)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        setPointRuleloading(true)
        const formData = {
            ...userInput,
            operator: selectedOperator ? selectedOperator.label : ""
          }
        useJwt.datapackCreate(formData).then(res => {
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
                                            <Label for="operator">Select a Operator <span style={{ color: 'red' }}>*</span></Label>
                                            <Select
                                                theme={selectThemeColors}
                                                maxMenuHeight={200}
                                                className='react-select'
                                                classNamePrefix='select'
                                                onChange={handleOperatorChange}
                                                value={selectedOperator}
                                                options={operatorListAll}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="3" >
                                        <FormGroup>
                                            <Label for="volumeInMB">Volume In MB</Label>
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
                                            <span>Submit</span>
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

export default CreateDatapackList