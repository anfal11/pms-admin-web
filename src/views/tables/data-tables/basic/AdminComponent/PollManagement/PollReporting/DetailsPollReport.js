import React, { Fragment, useEffect, useState, useContext } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft, RefreshCw, PlusCircle, X, XCircle
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, Alert, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput, Progress, Table
} from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { Success, Error } from '../../../../../../viewhelper'
import { formatReadableDate } from '../../../../../../helper'
import useJwt from '@src/auth/jwt/useJwt2'
import { useHistory, useParams } from 'react-router-dom'
import RadialCircle from './RadialCircle'
import ActiveUserBarChart from './ActiveUserBarChart'
import { handle401, ExportCSV } from '@src/views/helper'
import { toast } from 'react-toastify'

const DetailsPollReport = () => {
    const history = useHistory()
    const { pollID: form_id } = useParams()
    const [day, setDayLimit] = useState(7)
    const [barPercentage, setBarPercentage] = useState([])
    const [barPercentage2, setBarPercentage2] = useState([])
    const [responseCount, setresponseCount] = useState({})
    const PollReportDetails = JSON.parse(localStorage.getItem('PollReportDetails'))
    const [dateTimePercent, setdateTimePercent] = useState({
        question: '',
        answer: []
    })
    const [barChartDataLabel, setBarChartDataLabel] = useState({
        labels: '',
        dataCount: ''
    })
    const handleResponders = (form_id, title, question_id) => {
        toast.info('Please wait, \n CSV is processing...', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
        localStorage.setItem("useAkashtoken", true)
        useJwt.pollReportUsers({ form_id, question_id }).then(res => {
            const DataArray = res.data.payload.respondedCustomers || []
            ExportCSV(DataArray, ['name', 'email', 'mobile'], title.replaceAll(/\s/g, ''))
            console.log('pollReportUsers', DataArray)
            localStorage.setItem("useAkashtoken", false)
        }).catch(err => {
            console.log(err)
            localStorage.setItem("useAkashtoken", false)
        })
    }
    const getPercentage = (param, array) => {
        const allParam = array.filter(x => x === param)
        return Number(allParam.length / array.length * 100).toFixed()
    }
    useEffect(async () => {
        localStorage.setItem("useAkashtoken", true)
        await useJwt.analyzeMultipleQuestion({ form_id }).then(res => {
            setBarPercentage(res.data.payload.multipleQuestionWithAnswer.map(QAObj => {
                const uniqAns = [...new Set(QAObj.answer)]
                return {
                    question: QAObj.question,
                    question_id: QAObj.question_id,
                    answer: uniqAns.map(ans => {
                        return { ans, percent: getPercentage(ans, QAObj.answer) }
                    })
                }
            }))
            localStorage.setItem("useAkashtoken", false)
        }).catch(err => {
            localStorage.setItem("useAkashtoken", false)
            console.log(err)
        })
        localStorage.setItem("useAkashtoken", true)
        await useJwt.analyzeSingleQuestion({ form_id }).then(res => {
            setBarPercentage2(res.data.payload.singleQuestionWithAnswer.map(QAObj => {
                const uniqAns = [...new Set(QAObj.answer)]
                return {
                    question: QAObj.question,
                    question_id: QAObj.question_id,
                    answer: uniqAns.map(ans => {
                        return { ans, percent: getPercentage(ans, QAObj.answer) }
                    })
                }
            }))
            localStorage.setItem("useAkashtoken", false)
        }).catch(err => {
            console.log(err)
            localStorage.setItem("useAkashtoken", false)
        })
        localStorage.setItem("useAkashtoken", true)
        await useJwt.analyzeDateTimeQuestion({ form_id }).then(res => {
            if (res.data.payload.dateTimeQuestionWithAnswer[0]) {
                const Quarters = res.data.payload.dateTimeQuestionWithAnswer[0].answer[0]
                const QuarterMod = []
                for (const key in Quarters) {
                    QuarterMod.push({ name: key, percent: (Quarters[key].length / res.data.payload.dateTimeQuestionWithAnswer[0].count) * 100 })
                }
                // console.log('dateTimeQuestionWithAnswer', QuarterMod)
                console.log({
                    question: res.data.payload.dateTimeQuestionWithAnswer[0].question,
                    answer: QuarterMod,
                    question_id: res.data.payload.dateTimeQuestionWithAnswer[0].question_id
                })
                setdateTimePercent({
                    question: res.data.payload.dateTimeQuestionWithAnswer[0].question,
                    answer: QuarterMod,
                    question_id: res.data.payload.dateTimeQuestionWithAnswer[0].question_id
                })
            }
            localStorage.setItem("useAkashtoken", false)
        }).catch(err => {
            localStorage.setItem("useAkashtoken", false)
            console.log(err)
        })
        localStorage.setItem("useAkashtoken", true)
        await useJwt.responseCount({ form_id }).then(res => {
            // console.log('responseCount', res.data.payload)
            setresponseCount(res.data.payload)
            localStorage.setItem("useAkashtoken", false)
        }).catch(err => {
            localStorage.setItem("useAkashtoken", false)
            console.log(err)
        })
    }, [])

    useEffect(() => {
        localStorage.setItem("useAkashtoken", true)
        useJwt.analyzeTimeSeries({ form_id, day }).then(res => {
            console.log('analyzeTimeSeries', res.data.payload)
            const dataCount = res.data.payload.map(x => x.count)
            const labels = res.data.payload.map(x => `${new Date(x.date).getMonth() + 1}/${new Date(x.date).getDate()}`)
            setBarChartDataLabel({
                labels,
                dataCount
            })
            localStorage.setItem("useAkashtoken", false)
        }).catch(err => {
            localStorage.setItem("useAkashtoken", false)
            console.log(err)
        })
    }, [day])
    return (
        <>
            <Button.Ripple className='ml-2 mb-2 bg-white border text-primary' color='light' onClick={(e) => history.goBack()}>
                <ChevronLeft size={10} />  <span className='align-middle ml-50'>Back</span>
            </Button.Ripple>
            <Card>
                <Row className='text-center p-1'>
                    <Col md='3' sm='6'>
                        <p>Form Title</p>
                        <small><b>{PollReportDetails.title}</b></small>
                    </Col>
                    <Col md='3' sm='6'>
                        <p>Created Date</p>
                        <small><b>{formatReadableDate(PollReportDetails.created_at)}</b></small>
                    </Col>
                    <Col md='3' sm='6'>
                        <p>Expire Date</p>
                        <small><b>{formatReadableDate(PollReportDetails.expire_date)}</b></small>
                    </Col>
                    <Col md='3' sm='6'>
                        <p>Response</p>
                        <small><b>{PollReportDetails.poll_answers.length}</b></small>
                    </Col>
                </Row>
            </Card>
            {
                barPercentage.map((pbarObj, index) => <Card key={index}>
                    <Row className='p-1'>
                        <Col sm='12'>
                            <div className="d-flex justify-content-between flex-wrap ">
                                <p>{pbarObj.question}</p>
                                {!!pbarObj.answer.length && <Button.Ripple
                                    className='ml-2 mb-2 bg-white border text-primary'
                                    size='sm'
                                    color='light'
                                    onClick={(e) => handleResponders(form_id, pbarObj.question, pbarObj.question_id)}>
                                    Export
                                </Button.Ripple>}
                            </div>
                        </Col>
                        {
                            pbarObj.answer.map((pbar, pbarIndex) => <Col md='3' sm='6' className='my-1' key={pbarIndex}>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <span>{pbar.ans}</span>
                                    <span>{pbar.percent}%</span>
                                </div>
                                <Progress className='avg-session-progress progress-bar-primary mt-25' value={pbar.percent} />
                            </Col>)
                        }

                    </Row>
                </Card>)
            }
            {
                barPercentage2.map((pbarObj, index) => <Card key={index}>
                    <Row className='p-1'>
                        <Col sm='12'>
                            <div className="d-flex justify-content-between flex-wrap ">
                                <p>{pbarObj.question}</p>
                                {!!pbarObj.answer.length && <Button.Ripple
                                    className='ml-2 mb-2 bg-white border text-primary'
                                    size='sm'
                                    color='light'
                                    onClick={(e) => handleResponders(form_id, pbarObj.question, pbarObj.question_id)}>
                                    Export
                                </Button.Ripple>}
                            </div>
                        </Col>
                        {
                            pbarObj.answer.map((pbar, pbarIndex) => <Col md='3' sm='6' className='my-1' key={pbarIndex}>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <span>{pbar.ans}</span>
                                    <span>{pbar.percent}%</span>
                                </div>
                                <Progress className='avg-session-progress progress-bar-primary mt-25' value={pbar.percent} />
                            </Col>)
                        }

                    </Row>
                </Card>)
            }


            <Card>
                <Row className='p-1'>
                    <Col sm='12'>
                        <div className="d-flex justify-content-between flex-wrap ">
                            <p>{dateTimePercent.question}</p>
                            {!!dateTimePercent.answer.length && <Button.Ripple
                                className='ml-2 mb-2 bg-white border text-primary'
                                size='sm'
                                color='light'
                                onClick={(e) => handleResponders(form_id, dateTimePercent.question, dateTimePercent.question_id)}>
                                Export
                            </Button.Ripple>}
                        </div>
                    </Col>
                    {
                        dateTimePercent.answer.map((x, index) => <Col lg='3' md='4' sm='6' className='my-1' key={index}>
                            <RadialCircle series={x.percent} />
                            <p className="text-center">{
                                x.name === 'firstQuarter' ? 'January to March' : x.name === 'secondQuarter' ? 'April to June' : x.name === 'thirdQuarter' ? 'July to September' : x.name === 'fourthQuarter' ? 'October to December' : ''
                            }</p>
                        </Col>)
                    }
                </Row>
            </Card>
            <Row className='match-height'>
                {!!barChartDataLabel.labels.length && <Col md='8'>
                    <Card className='p-0'>
                        <CardHeader className='border-bottom p-1'>
                            <div></div>
                            <div style={{ minWidth: '100px' }}>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    onChange={(selected) => {
                                        setDayLimit(selected.value)
                                    }}
                                    defaultValue={{ value: 7, label: 7 }}
                                    options={[{ value: 7, label: 7 }, { value: 30, label: 30 }]}
                                    isClearable={false}
                                />
                            </div>
                        </CardHeader>
                        {/* <b className='border-bottom p-1'>Active Users</b> */}
                        <CardBody className='pt-1'>
                            <ActiveUserBarChart labels={barChartDataLabel.labels} dataCount={barChartDataLabel.dataCount} />
                        </CardBody>
                    </Card>
                </Col>}
                <Col md='4'>
                    <Card >
                        <Table responsive >
                            <tbody >
                                <tr>
                                    <td>Last 7 days</td>
                                    <td>{responseCount.result_sevenDays}</td>
                                </tr>
                                <tr>
                                    <td>This Month</td>
                                    <td>{responseCount.result_thirtyDays}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>{responseCount.total_response}</td>
                                </tr>
                            </tbody>

                        </Table>
                    </Card>
                </Col>
            </Row>

        </>
    )
}

export default DetailsPollReport