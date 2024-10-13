import React, { Fragment, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const CreateOverallPointRule = () => {
    const history = useHistory()
    const BusinessRef = useRef()
    const [BusinessList, setBusinessList] = useState([])
    const [merchantid, setMerchantid] = useState({})
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
    useEffect(() => {
        useJwt.customerBusinessList().then(res => {
            const { payload } = res.data
            setBusinessList(payload)
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        // const { PointRateSetupName, PurchaseAmount, Points, ExpiryDate, OfferRate, OfferStartDate, OfferEndDate } = userInput
        // let ed
        // if (OfferRate === true) {
        //     ed = OfferEndDate
        // } else {
        //     ed = ExpiryDate
        // }
        // console.log({ PointRateSetupName, PurchaseAmount, Points, ExpiryDate: ed, OfferRate, OfferStartDate, OfferEndDate })
        // localStorage.setItem('usePMStoken', true)
        // setPointRuleloading(true)
        // const merchantId = merchantid.merchantid
        // useJwt.setOverallRules(merchantId, { PointRateSetupName, PurchaseAmount, Points, ExpiryDate, OfferRate, OfferStartDate, OfferEndDate }).then((response) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Success(response)
        //     history.push('/overallPointRuleListForAdmin')
        //     console.log(response)
        // }).catch((error) => {
        //     setPointRuleloading(false)
        //     localStorage.setItem('usePMStoken', false)
        //     Error(error)
        //     console.log(error)
        // })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/overallPointRuleListForAdmin' >
                <div className='d-flex align-items-center'>
                    <ChevronLeft size={17} style={{ marginRight: '5px' }} />
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
                                <Label for="Businesses">Businesses<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    ref={BusinessRef}
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: merchantid.merchantid, label: merchantid.businessname ? merchantid.businessname : 'Select...' }}
                                    onChange={(selected) => {
                                        setMerchantid({ merchantid: selected.value, businessname: selected.label })
                                    }}
                                    options={BusinessList?.map(b => { return { value: b.pms_merchantid, label: b.businessname } })}
                                />
                                <Input
                                    required
                                    style={{
                                        opacity: 0,
                                        width: "100%",
                                        height: 0
                                        // position: "absolute"
                                    }}
                                    onFocus={e => BusinessRef.current.select.focus()}
                                    value={merchantid?.merchantid || ''}
                                    onChange={e => ''}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="PointRateSetupName">Point Rate Setup Name<span style={{ color: 'red' }}>*</span></Label>
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
                                <Label for="PurchaseAmount">Purchase Amount<span style={{ color: 'red' }}>*</span></Label>
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
                                <Label for="Points">Points<span style={{ color: 'red' }}>*</span></Label>
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
                        {!userInput.OfferRate && <Col sm="6" >
                            <FormGroup>
                                <Label for="ExpiryDate">Expiry Date<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="date"
                                    name="ExpiryDate"
                                    id='ExpiryDate'
                                    value={userInput.ExpiryDate ? userInput.ExpiryDate : 'select a date'}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>}
                        <Col sm="12" className='mb-1' >
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    id='OfferRate'
                                    name='OfferRate'
                                    label='Offer Rate?'
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, OfferRate: true })
                                        } else {
                                            setUserInput({ ...userInput, OfferRate: false, OfferStartDate: null, OfferEndDate: null })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                        {userInput.OfferRate ? <Col sm="6" >
                            <FormGroup>
                                <Label for="OfferStartDate">Offer Start Date<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="date"
                                    name="OfferStartDate"
                                    id='OfferStartDate'
                                    value={userInput.OfferStartDate ? userInput.OfferStartDate : 'select a date'}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col> : null}
                        {userInput.OfferRate ? <Col sm="6" >
                            <FormGroup>
                                <Label for="OfferEndDate">Offer End Date<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="date"
                                    name="OfferEndDate"
                                    id='OfferEndDate'
                                    value={userInput.OfferEndDate ? userInput.OfferEndDate : 'select a date'}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col> : null}
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