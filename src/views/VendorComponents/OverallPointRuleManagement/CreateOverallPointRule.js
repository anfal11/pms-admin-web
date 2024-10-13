import React, { Fragment, useEffect, useState } from 'react'
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
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const CreateOverallPointRule = () => {
    const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [userInput, setUserInput] = useState({
        PointRateSetupName: '',
        PurchaseAmount: 0,
        Points: 0,
        ExpiryDate: null,
        OfferRate: false,
        OfferStartDate: null,
        OfferEndDate: null
    })

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
  
    const onSubmit = (e) => {
        e.preventDefault()
        // localStorage.setItem('usePMStoken', true)
        // const { PointRateSetupName, PurchaseAmount, Points, ExpiryDate, OfferRate, OfferStartDate, OfferEndDate } = userInput
        // setPointRuleloading(true)
        // const merchantId = BusinessList[0].pms_merchantid
        // useJwt.setOverallRules(merchantId, { PointRateSetupName, PurchaseAmount, Points, ExpiryDate, OfferRate, OfferStartDate, OfferEndDate }).then((response) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Success(response)
        //     console.log(response)
        //   }).catch((error) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Error(error)
        //     console.log(error)
        //   })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/overallPointRuleList' >
                    <div className='d-flex align-items-center'>
                            <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                            <span >Back</span>
                    </div>
                    </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Set Global Rule</CardTitle>
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="PointRateSetupName">Point Rate Setup Name<span style={{color:'red'}}>*</span></Label>
                                <Input type="text"
                                    name="PointRateSetupName"
                                    id='PointRateSetupName'
                                    value={userInput.PointRateSetupName}
                                    onChange={handleChange}
                                    required
                                    placeholder="write a name"
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                             <FormGroup>
                                 <Label for="PurchaseAmount">Purchase Amount<span style={{color:'red'}}>*</span></Label>
                                 <Input type="number"
                                    name="PurchaseAmount"
                                    id='PurchaseAmount'
                                    value={userInput.PurchaseAmount}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                             <FormGroup>
                                 <Label for="Points">Points<span style={{color:'red'}}>*</span></Label>
                                 <Input type="number"
                                    name="Points"
                                    id='Points'
                                    value={userInput.Points}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                             <FormGroup>
                                 <Label for="ExpiryDate">Expiry Date<span style={{color:'red'}}>*</span></Label>
                                 <Input type="date"
                                    name="ExpiryDate"
                                    id='ExpiryDate'
                                    value={userInput.ExpiryDate}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col>
                        <Col sm="12" className='mb-1' >
                            <FormGroup check>
                                <Input onChange={(e) => {
                                        if (e.target.checked) { 
                                            setUserInput({ ...userInput, OfferRate: true })
                                        } else {
                                            setUserInput({ ...userInput, OfferRate: false })
                                        }
                                    }
                                } type='checkbox' id='viaEmail' />
                                <Label for='viaEmail' check>
                                    Offer Rate
                                </Label>
                            </FormGroup>
                        </Col>
                        { userInput.OfferRate ? <Col sm="6" >
                             <FormGroup>
                                 <Label for="OfferStartDate">Offer Start Date</Label>
                                 <Input type="date"
                                    name="OfferStartDate"
                                    id='OfferStartDate'
                                    value={userInput.OfferStartDate}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col> : null }
                        { userInput.OfferRate ? <Col sm="6" >
                             <FormGroup>
                                 <Label for="OfferEndDate">Offer End Date</Label>
                                 <Input type="date"
                                    name="OfferEndDate"
                                    id='OfferEndDate'
                                    value={userInput.OfferEndDate}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                  />
                            </FormGroup>
                        </Col> : null }
                        <Col sm="12" className='text-center'>
                            {
                                pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                    <Spinner color='white' size='sm' />
                                    <span className='ml-50'>Loading...</span>
                                </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                    <span >Submit</span>
                                </Button.Ripple>
                            }
                        </Col>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default CreateOverallPointRule