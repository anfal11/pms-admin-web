import React, { Fragment, useEffect, useState, useContext } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle, X, XCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, Alert, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Success, Error } from '../../../../../viewhelper'
import { handle401 } from '../../../../../helper'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Link, useHistory } from 'react-router-dom'

const Create = () => {
    const history = useHistory()
    const [groupList, setgroupList] = useState([])
    const [receiverGroup, setReceiverGroup] = useState({})

    useEffect(() => {
        useJwt.getCentralGroup().then(res => {
            console.log(res)
            const allGroup = []
            for (const q of res.data.payload) {
                if (q.is_approved) {
                    allGroup.push(q)
                }
            }
            setgroupList(allGroup)
        }).catch(err => {
            Error(err)
            console.log(err.response)
        })
    }, [])

    const [SubmitLoading, setSubmitLoading] = useState(false)
    // useEffect(() => {

    // }, [])
    const [userInput, setUserInput] = useState({
        form_title: "",
        start_date: "",
        expire_date: "",
        status: true,
        effective_date: "",
        group_spec: false,
        group_id: null
    })

    const [errors, seterrors] = useState([])
    const answerTypes = [
        { value: 1, label: 'Radio' },
        { value: 2, label: 'Checkbox' },
        { value: 3, label: 'Drop Down' },
        { value: 5, label: 'Date & Time' },
        { value: 4, label: 'Short Answer' }
    ]
    const [polls, setPolls] = useState([
        {
            answerTypeID: 1,
            answerType: 'Radio',
            question: '',
            answerOptions: ['', '', '']
        }
    ])

    const handleAnstypeChange = (selected, pollIndex) => {
        const updatePoll = [...polls]
        updatePoll[pollIndex] = { ...updatePoll[pollIndex], answerTypeID: selected.value, answerType: selected.label }
        setPolls(updatePoll)
    }
    const handlePollTitleChange = (e, pollIndex) => {
        const updatePoll = [...polls]
        updatePoll[pollIndex] = { ...updatePoll[pollIndex], question: e.target.value }
        setPolls(updatePoll)
    }
    const AddMorePoll = () => {
        setPolls([...polls, { answerTypeID: 1, answerType: 'Radio', question: '', answerOptions: ['', '', ''] }])
    }
    const handleAddMoreOption = (pollIndex) => {
        const updatePoll = [...polls]
        updatePoll[pollIndex] = { ...updatePoll[pollIndex], answerOptions: [...updatePoll[pollIndex].answerOptions, ''] }
        setPolls(updatePoll)
    }
    const removeOption = (pollIndex, ansIndex) => {
        const updatePoll = [...polls]
        updatePoll[pollIndex] = { ...updatePoll[pollIndex], answerOptions: updatePoll[pollIndex].answerOptions.filter((x, i) => i !== ansIndex) }
        setPolls(updatePoll)
    }


    const onchange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const { form_title, start_date, expire_date, status, effective_date, group_id, group_spec } = userInput
        const copyPolls = [...polls]
        const modifyPolls = copyPolls.map(pollItem => {
            return {
                ...pollItem,
                is_multiple_choice: pollItem.answerTypeID === 2,
                is_single_choice: pollItem.answerTypeID === 1,
                is_dropdown: pollItem.answerTypeID === 3,
                is_input: pollItem.answerTypeID === 4,
                is_date_time: pollItem.answerTypeID === 5,
                multiple_choice_options: pollItem.answerTypeID === 2 ? pollItem.answerOptions : [],
                single_choice_options: pollItem.answerTypeID === 1 ? pollItem.answerOptions : [],
                dropdown_options: pollItem.answerTypeID === 3 ? pollItem.answerOptions : []
            }
        })
        const filterExtraPolls = modifyPolls.map(pollItem => {
            delete pollItem.answerTypeID
            delete pollItem.answerType
            delete pollItem.answerOptions
            return { ...pollItem }
        })
        console.log({
            form_title, start_date, expire_date, status, effective_date, poll_questions: filterExtraPolls, group_id : group_spec ? group_id : null
        })

        setSubmitLoading(true)
        useJwt2.createPoll({ form_title, start_date: effective_date, expire_date, status, effective_date, poll_questions: filterExtraPolls, group_id : group_spec ? group_id : null }).then(res => {
            setSubmitLoading(false)
            Success(res)
            console.log(res)
            history.push('/AllPolls')
        }).catch(err => {
            setSubmitLoading(false)
            console.log(err.response)
            Error(err)
        })
    }
    return (
        <Fragment>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Button.Ripple className='mb-1' color='primary' tag={Link} to='/AllPolls' >
                    <div className='d-flex align-items-center'>
                            <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                            <span >Back</span>
                    </div>
                </Button.Ripple>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Create New Poll</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="pt-1" >
                            <Col sm="6" >
                                <FormGroup>
                                    <Label for="form_title">Form Title<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="text"
                                        name="form_title"
                                        id='form_title'
                                        value={userInput.form_title}
                                        onChange={onchange}
                                        required
                                        placeholder="Form title here...."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <Label for="effective_date">Effective Date<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="datetime-local"
                                        name="effective_date"
                                        id='effective_date'
                                        value={userInput.effective_date}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon@123"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3" >
                                <FormGroup>
                                    <Label for="expire_date">Expire Date<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="datetime-local"
                                        name="expire_date"
                                        id='expire_date'
                                        min={userInput.effective_date}
                                        value={userInput.expire_date}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon@123"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='4' className='mt-1'>
                                <CustomInput
                                        type='switch'
                                        id='group_spec'
                                        name='group_spec'
                                        label='Group Specific'
                                        onChange={(e) => {
                                                if (e.target.checked) { 
                                                    setUserInput({ ...userInput, group_spec: true })
                                                } else {
                                                    setUserInput({ ...userInput, group_spec: false})
                                                }
                                            }
                                        }
                                    />
                            </Col>
                            {
                                userInput.group_spec && <Col sm="4" >
                                <FormGroup>
                                    <Label for="Businesses">Group<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={(selected) => {
                                            setReceiverGroup({ groupId: selected.value.id, groupType: selected.value.type})
                                            setUserInput({ ...userInput, group_id: selected.value.id })
                                        }}
                                        options={groupList?.map(d => { return {value: {id: d.id, type: d.type}, label: `${d.id}. ${d.group_name}`} })}
                                    />
                                </FormGroup>
                                </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
                {polls.map((pollItem, pollIndex) => <Card key={pollIndex + 5456} className='react-slidedown'>
                    <CardBody>
                        <Row>
                            <Col sm="8" >
                                <FormGroup>
                                    <Label for="question">Question</Label>
                                    <Input type="text"
                                        name="question"
                                        id='question'
                                        rows={1}
                                        value={pollItem.question}
                                        onChange={(e) => handlePollTitleChange(e, pollIndex)}
                                        required
                                        placeholder="What do you want to ask?"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md='4' >
                                <Label>Answer Type</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={(selected) => handleAnstypeChange(selected, pollIndex)}
                                    value={{ label: pollItem.answerType, value: pollItem.answerTypeID }}
                                    options={answerTypes}
                                    isClearable={false}
                                />
                            </Col>

                            {[1, 2, 3].includes(pollItem.answerTypeID) && <Col md='12'>
                                <b className=' mb-1'> {pollItem.answerType} Answer Type Options : </b>
                                <Row>
                                    {
                                        pollItem.answerOptions.map((ans, ansIndex) => <Col md='3' key={ansIndex}>
                                            <FormGroup>
                                                <Label for="FormTitle">{`Option ${ansIndex + 1}`}</Label>
                                                <div className="d-flex align-items-center">
                                                    <Input type="text"
                                                        name={`option${ansIndex}`}
                                                        id={ansIndex + 654156465}
                                                        value={ans}
                                                        onChange={e => {
                                                            const updatePoll = [...polls]
                                                            updatePoll[pollIndex].answerOptions[ansIndex] = e.target.value
                                                            setPolls(updatePoll)
                                                        }}
                                                        required
                                                        placeholder="option..."
                                                    />&nbsp;<>
                                                        {
                                                            pollItem.answerOptions.length > 1 && <XCircle color='crimson' size={20} onClick={() => removeOption(pollIndex, ansIndex)} style={{ cursor: 'pointer' }} />
                                                        }
                                                    </>
                                                </div>
                                            </FormGroup>
                                        </Col>)
                                    }
                                    <Col md='3'>
                                        <Button.Ripple className='bg-white border' style={{ marginTop: '24px' }} block color='light' onClick={() => handleAddMoreOption(pollIndex)}>
                                            <span >Add option</span>
                                        </Button.Ripple>
                                    </Col>
                                </Row>
                            </Col>}
                        </Row>
                        <hr />
                        <div className="text-right">
                            {(polls.length - 1) === pollIndex && <Button.Ripple color='info' size='sm' onClick={AddMorePoll}>
                                <PlusCircle color='white' size={12} style={{ marginTop: '-3px' }} />&nbsp;<span >Add More</span>
                            </Button.Ripple>}
                            {polls.length > 1 && <Button.Ripple color='danger' size='sm' className='ml-1' onClick={() => setPolls(polls.filter((x, i) => i !== pollIndex))}>
                                <Trash color='white' size={12} style={{ marginTop: '-3px' }} />
                            </Button.Ripple>}
                        </div>
                    </CardBody>
                </Card>)}

                <Card >
                    <CardBody className='pt-0'>
                        <Row>
                            <Col sm="12" className='text-center'>
                                {
                                    SubmitLoading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
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


export default Create