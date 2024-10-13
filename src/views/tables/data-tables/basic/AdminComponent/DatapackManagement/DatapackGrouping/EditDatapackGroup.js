import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Minus, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft } from 'react-feather'
import { Card, CardHeader, CardTitle, Button, Table, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput } from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Skeleton } from 'antd'
import { toast } from 'react-toastify'
import { selectThemeColors, transformInToFormObject } from '@utils'

const EditDatapackGroup = ({ refresh, setrefresh, groupEditData, setgroupEditData }) => {
    const history = useHistory()
    const [operatorListAll, setOperatorListAll] = useState([])
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [packListAll, setPackListAll] = useState([])
    const [operatorWisePackList, setOperatorWisePackList] = useState([])

    const [group_item, setGroup_item] = useState(JSON.parse(localStorage.getItem('datapackInfo'))?.group_items)
    const [single_group_item, setSingle_Group_item] = useState(
        {
            keyword: '',
            pack_code: '',
            number_of_time_api_hit: 1
        }
    )
    // const [userInput, setUserInput] = useState(JSON.parse(localStorage.getItem('datapackInfo')))
    const [userInput, setUserInput] = useState({
        ...JSON.parse(localStorage.getItem('datapackInfo')),
        number_of_time_api_hit: 1
    })
    const handleApiHitChange = (e) => {
        if (e.target.value <= 10) {
            setUserInput({ ...userInput, [e.target.name]: e.target.value })
        }
    }

    useEffect(() => {
        useJwt.datapackList().then(res => {
            console.log(res)
            const operators = []
            for (const ii of res.data.payload) {
                if (!operators.includes(ii.operator)) {
                    operators.push(ii.operator)
                }
            }
            setOperatorListAll(operators.map(item => { return {value: item, label: item} }))
            setPackListAll(res.data.payload)
        }).catch(err => {
            console.log(err)
            Error(err)
        })
    }, [])

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const addGroupItem = () => {
        if (!single_group_item.keyword) {
            toast.error('Keyword is required')
            return 0
        }
        if (!single_group_item.pack_code) {
            toast.error('Pack code is required')
            return 0
        }

        group_item.push({...single_group_item, number_of_time_api_hit: userInput.number_of_time_api_hit})
        setSingle_Group_item({
            keyword: '',
            pack_code: '',
            number_of_time_api_hit: userInput.number_of_time_api_hit
        })
        setUserInput({ ...userInput, number_of_time_api_hit: 1 })
    }

    const handleDelete = (i) => {
        group_item.splice(i, 1)
        setGroup_item([...group_item])
    }

    const handleOperatorChange = (selectedOption) => {
        if (group_item.map(i => i.keyword).includes(selectedOption.value)) {
           toast.error('The operator is already in the group item list!')
           return 0
        }
        setSingle_Group_item({
           ...single_group_item,
           keyword: selectedOption.value
       })
       setOperatorWisePackList(packListAll?.filter(ii => ii.operator === selectedOption.value)?.map(it => { return {value: it.packcode, label: it.name} }))
   }

   const handlePackChange = (selectedOption) => {
       setSingle_Group_item({
           ...single_group_item,
           pack_code: selectedOption.value
       })
   }

    const onSubmit = (e) => {
        e.preventDefault()
        if (group_item.length === 0) {
            toast.error('Group item must have atleast 1 item.')
            return 0
        }
        delete userInput.group_items
        const body = {
            ...userInput, group_item
        }

        console.log('body ', body)

        setPointRuleloading(true)
        useJwt.datapackGroupUpdate(body).then((res) => {
            setPointRuleloading(false)
            Success(res)
            history.push('/datapackGroup')
            // history.push('/myGroupPendingList')
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
            console.log(error.response)
        })
    }

    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/datapackGroup' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                    <span >Back</span>
                </div>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Datapack Group</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='4'>
                                <FormGroup>
                                    <Label for="group_title">Group Title</Label>
                                    <Input
                                        type="text"
                                        name="group_title"
                                        id='group_title'
                                        value={userInput.group_title}
                                        onChange={handleChange}
                                        required
                                        placeholder='group_title'
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Group Item</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                        <Col md='3'>
                                <FormGroup>
                                    <Label for="Business">Select a Operator <span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={handleOperatorChange}
                                        value={operatorListAll.find(i => i.value === single_group_item.keyword) || {value:'', label: 'select...'}}
                                        options={operatorListAll}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='3'>
                                <FormGroup>
                                    <Label for="Business">Select a Pack <span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={handlePackChange}
                                        value={operatorWisePackList.find(i => i.value === single_group_item.pack_code) || {value:'', label: 'select...'}}
                                        options={operatorWisePackList}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='2'>
                                <FormGroup>
                                    <Label for="Business">Select Disburse-Unit <span style={{ color: 'red' }}>*</span></Label>
                                    <Input 
                                        type="number"
                                        name="number_of_time_api_hit"
                                        id='number_of_hit'
                                        value={userInput.number_of_time_api_hit}
                                        onChange={handleApiHitChange}
                                        required
                                        min={1}
                                        max={10}
                                        step={1}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='4'>
                                <Button.Ripple onClick={addGroupItem} color='primary' className='mt-2'>
                                    <span>Add </span>
                                </Button.Ripple>
                            </Col>
                        </Row>
                        <Row>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Group Items Preview</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <th>Keyword</th>
                                            <th>Pack Code</th>
                                            <th>Disburse-Unit</th>
                                            <th></th>
                                        </thead>
                                        <tbody>
                                            {
                                                group_item?.map((item, index) => (<tr>
                                                    <td>{item.keyword}</td>
                                                    <td>{item.pack_code}</td>
                                                    <td>{item.number_of_time_api_hit} X</td>
                                                    <td><span title='Delete'><Trash onClick={() => handleDelete(index)} color='red' size='18px' style={{cursor: 'pointer'}} /></span></td>
                                                </tr>))
                                            }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Row>
                    </CardBody>
                </Card>

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
            </Form>
        </Fragment >
    )
}

export default EditDatapackGroup