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
import useJwt from '@src/auth/jwt/useJwt2'
import { useHistory, useParams } from 'react-router-dom'

const EditPoll = () => {
    const history = useHistory()
    const { form_id } = useParams()
    const [SubmitLoading, setSubmitLoading] = useState(false)
    const PollDetails = JSON.parse(localStorage.getItem('PollDetails'))

    const [userInput, setUserInput] = useState({
        id: PollDetails.id,
        form_title: PollDetails.title,
        start_date: new Date(PollDetails.effective_date).toISOString().replace(/Z/, ''),
        expire_date: new Date(PollDetails.expire_date).toISOString().replace(/Z/, ''),
        status: PollDetails.status,
        effective_date: new Date(PollDetails.effective_date).toISOString().replace(/Z/, '')
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
    useEffect(() => {
        useJwt.FormQAsByID({ form_id }).then(res => {
            console.log('FormQAsByID', res.data.payload)
            const ModifyData = res.data.payload.map(pollItem => {
                const { id, dropdown_options, multiple_choice_options, single_choice_options, is_date_time, is_dropdown, is_input, is_multiple_choice, is_single_choice, question } = pollItem
                const resObj = { is_date_time, is_dropdown, is_input, is_multiple_choice, is_single_choice }
                const myObj = { is_date_time: 5, is_dropdown: 3, is_input: 4, is_multiple_choice: 2, is_single_choice: 1 }
                let answerTypeID
                for (const key in resObj) {
                    if (resObj[key]) answerTypeID = `${key}`
                }
                const resArrayObj = { dropdown_options, multiple_choice_options, single_choice_options }
                let arrayKeyName
                for (const key in resArrayObj) {
                    if (resArrayObj[key].length) arrayKeyName = `${key}`
                }
                return {
                    id,
                    answerTypeID: myObj[answerTypeID],
                    answerType: answerTypes.find(a => a.value === myObj[answerTypeID]).label,
                    question,
                    answerOptions: resArrayObj[arrayKeyName] || []
                }
            })
            setPolls(ModifyData)
            // setTableDataLoading(false)
        }).catch(err => {
            // setTableDataLoading(false)
            console.log(err)
        })

    }, [])

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
        const { id, form_title, start_date, expire_date, status, effective_date } = userInput
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
            id, form_title, start_date, expire_date, status, effective_date, poll_questions: filterExtraPolls
        })

        setSubmitLoading(true)
        useJwt.updatePoll({ id, form_title, start_date, expire_date, status, effective_date, poll_questions: filterExtraPolls }).then(res => {
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
            <Button.Ripple className=' mb-2 bg-white border text-primary' color='light' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />
                <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Edit Poll</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="pt-1" >
                            <Col sm="8" >
                                <FormGroup>
                                    <Label for="form_title">Form Title</Label>
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
                            <Col md='4' >
                                <Label>Status</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={(selected) => {
                                        setUserInput({ ...userInput, status: selected.value })
                                    }}
                                    value={userInput.status ? { value: true, label: "Active" } : { value: false, label: "Inactive" }}
                                    options={[{ value: true, label: "Active" }, { value: false, label: "Inactive" }]}
                                    isClearable={false}
                                />
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="start_date">Start Date</Label>
                                    <Input type="datetime-local"
                                        name="start_date"
                                        id='start_date'
                                        value={userInput.start_date}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon@123"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="expire_date">Expire Date</Label>
                                    <Input type="datetime-local"
                                        name="expire_date"
                                        id='expire_date'
                                        min={userInput.start_date}
                                        value={userInput.expire_date}
                                        onChange={onchange}
                                        required
                                        placeholder="Jhon@123"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="4" >
                                <FormGroup>
                                    <Label for="effective_date">Effective Date</Label>
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
                        </Row>
                    </CardBody>
                </Card>
                {polls.map((pollItem, pollIndex) => <Card key={pollIndex + 5456} className='react-slidedown'>
                    <CardBody>
                        <Row>
                            <Col sm="8" >
                                <FormGroup>
                                    <Label for="question">Poll Title</Label>
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
                                <b className=' mb-1'> {pollItem.answerType} Answer type Options : </b>
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
                                <PlusCircle color='white' size={12} style={{ marginTop: '-3px' }} />&nbsp;<span >Add More Poll</span>
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


export default EditPoll