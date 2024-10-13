import React, { Fragment, useEffect, useRef, useState } from 'react'
import useJwt from '@src/auth/jwt/useJwt'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'
import Select from 'react-select'
import { ChevronLeft } from 'react-feather'
import { selectThemeColors } from '@utils'
import { formatReadableDate } from '../../../../../../helper'
import { Error } from '../../../../../../viewhelper'

const ViewPendingDetails = ({details, setIsDetailsView}) => {

    const [userInput, setuserInput] = useState(details)
    // const [blacklistGroup, setBlackListGroup] = useState([
    //     {
    //         value: "0",
    //         label: "eee"
    //     },
    //     {
    //         value: "03",
    //         label: "rrr"
    //     }
    // ])
    const [blacklistGroup, setBlackListGroup] = useState([])
    const [repeat_type, setrepeat_type] = useState({ value: details['repeat_type'] || "", label: details['repeat_type'] || "" })

    useEffect(async () => {
        if (userInput['black_list_group_id'].length) {
            useJwt.allBlackList().then(res => {
                const blacklistItems = []
                res.data.payload.map(item => {
                  if (userInput['black_list_group_id'].includes(item['id'])) {
                    blacklistItems.push({value: item['id'], label: item['group_name']})
                  }
                })
                setBlackListGroup(blacklistItems)
              }).catch(err => {
                Error(err)
                console.log(err)
              })
        }
    }, [])

    const back = (e) => {
        setIsDetailsView(false)
    }
    
    return (
        <Fragment>

            <Card>
               <CardHeader className='border-bottom'>
                    <CardTitle> <Button.Ripple className='mb-1' color='primary' onClick={(e) => back()} >
                            <div className='d-flex align-items-center'>
                                <ChevronLeft size={17} style={{ marginRight: '5px' }} />
                                <span >Back</span>
                            </div>
                        </Button.Ripple>
                        <h4>View Pending Details</h4>
                    </CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row">
                        <Col sm='12'>
                          <FormGroup>
                          <Label for="title">Notification-Title</Label>
                            <Input type="text"
                                name="title"
                                id='title'
                                value={userInput.title}
                                disabled
                            />
                            </FormGroup>
                        </Col>

                        <Col sm='12'>
                            <FormGroup>
                                <Label for="">Black List group</Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    disabled
                                    className='react-select'
                                    id='black_list_group_id'
                                    classNamePrefix='select'
                                    value={blacklistGroup}
                                    isMulti
                                    isDisabled={true}
                                />
                            
                            </FormGroup>
                        </Col>

                        <Col sm='12'>
                            <FormGroup>
                                <Label for="">File-Path</Label>
                                {
                                    userInput.file_path && <a href={userInput.file_path} target='_blank' > {userInput.file_path} </a>
                                }
                            </FormGroup>
                        </Col>

                        <Col sm="3" className='mb-1 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' id='isScheduled' checked={userInput.isScheduled} label='Is Scheduled?' />
                            </FormGroup>
                        </Col>
                        {
                            userInput.isScheduled && <Col md='4' >
                                <FormGroup>
                                    <Label for="effective_date">Scheduled Date</Label>
                                    <Input type="text"
                                        name="effective_date"
                                        id='effective_date'
                                        value={userInput.effective_date ? formatReadableDate(userInput.effective_date || '') : '--' }
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        <Col sm='12' />
                        <Col sm="3" className='mb-1 mt-1'>
                            <FormGroup>
                                <CustomInput type='switch' id='isRepeat' checked={userInput.isRepeat} label='Is Repeat?' />
                            </FormGroup>
                        </Col>
                        {
                            userInput.isRepeat && <Col md='4' >
                                <FormGroup>
                                    <Label for="startDate">Start Date </Label>
                                    <Input type="text"
                                        name="repeat_start_date"
                                        id='repeat_start_date'
                                        value={userInput.repeat_start_date ? formatReadableDate(userInput.repeat_start_date || '') : '--' }
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isRepeat && <Col md='4' >
                                <FormGroup>
                                    <Label for="expiry_Date">Expiry Date</Label>
                                    <Input type="text"
                                        name="expiry_date"
                                        id='expiry_date'
                                        value={userInput.expiry_date ? formatReadableDate(userInput.expiry_date || '') : '--' }
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            userInput.isRepeat && <Col sm='4'>
                                <FormGroup>
                                    <Label for="repeat_type">Repeat Type</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={repeat_type}
                                        isDisabled={true}
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            (userInput.isRepeat && userInput.repeat_type === 'Monthly') && <Col md='3' >
                                <FormGroup>
                                    <Label for="dateofMonth">Date of Month</Label>
                                    <Input type="text"
                                        name="dateofMonth"
                                        id='dateofMonth'
                                        value={userInput.repeat_month_day}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            (userInput.isRepeat && userInput.repeat_type === 'Weekly') && <Col md='3' >
                                <FormGroup>
                                    <Label for="datesofweek">Day</Label>
                                    <Input type="text"
                                        name="datesofweek"
                                        id='datesofweek'
                                        value={userInput.repeat_day}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }
                        {
                            (userInput.isRepeat && (userInput.repeat_type === 'Daily' || userInput.repeat_type === 'Weekly' || userInput.repeat_type === 'Monthly')) && <Col md='3' >
                                <FormGroup>
                                    <Label for="startDate">Time</Label>
                                    <Input type="text"
                                        name="repeat_time"
                                        id='repeat_time'
                                        value={userInput.repeat_time}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        }

                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}


export default ViewPendingDetails