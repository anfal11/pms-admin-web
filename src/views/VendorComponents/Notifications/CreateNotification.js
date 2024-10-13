import React, { useEffect, useState } from 'react'
import axios from 'axios'
import jwtDefaultConfig from '../../../@core/auth/jwt/jwtDefaultConfig'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { divIcon } from 'leaflet'

const CreateNotification = () => {
    const [notificationloading, setnotificationloading] = useState(false)
    const [userInput, setUserInput] = useState({
        Notification_Title: '',
        Notification_Body: '',
        viaSMS: false,
        viaEmail: false,
        viaPushNotification: false
    })

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
  
    const onSubmit = (e) => {
        e.preventDefault()
        const { Notification_Title, Notification_Body, viaSMS, viaEmail, viaPushNotification } = userInput
        setnotificationloading(true)
        useJwt.createNotifications({ Notification_Title, Notification_Body, viaSMS, viaEmail, viaPushNotification }).then((response) => {
            setnotificationloading(false)
            Success(response)
          }).catch((error) => {
            setnotificationloading(false)
            Error(error)
            console.log(error)
          })
    }
    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Create Notification</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: '15px' }}>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="Notification_Title">Title</Label>
                            <Input type="text"
                                name="Notification_Title"
                                id='Notification_Title'
                                value={userInput.Notification_Title}
                                onChange={handleChange}
                                required
                                placeholder="your title"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        {/* for alligning purpose */}
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="Notification_Body">Message</Label>
                            <Input type="textarea"
                                name="Notification_Body"
                                id='Notification_Body'
                                value={userInput.Notification_Body}
                                onChange={handleChange}
                                required
                                placeholder="your message"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="12" >
                        <FormGroup check>
                            <Input onChange={(e) => {
                                    if (e.target.checked) { 
                                        setUserInput({ ...userInput, viaSMS: true })
                                    } else {
                                        setUserInput({ ...userInput, viaSMS: false })
                                    }
                                }
                            } type='checkbox' id='viaSMS' />
                            <Label for='viaSMS' check>
                                Notification send via SMS
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col sm="12" >
                        <FormGroup check>
                            <Input onChange={(e) => {
                                    if (e.target.checked) { 
                                        setUserInput({ ...userInput, viaEmail: true })
                                    } else {
                                        setUserInput({ ...userInput, viaEmail: false })
                                    }
                                }
                            } type='checkbox' id='viaEmail' />
                            <Label for='viaEmail' check>
                            Notification send via Email
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col sm="12" >
                        <FormGroup check>
                            <Input onChange={(e) => {
                                    if (e.target.checked) { 
                                        setUserInput({ ...userInput, viaPushNotification: true })
                                    } else {
                                        setUserInput({ ...userInput, viaPushNotification: false })
                                    }
                                }
                            } type='checkbox' id='viaPushNotification' />
                            <Label for='viaPushNotification' check>
                            Notification send via Push Notification
                            </Label>
                        </FormGroup>
                    </Col>

                    <Col sm="6" className='text-center'>
                        {
                            notificationloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Create</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </CardBody>
        </Card>
    )
}

export default CreateNotification