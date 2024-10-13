import React, { Fragment, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {
    ChevronDown, Share, Minus, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupText, CustomInput
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import Flatpickr from 'react-flatpickr'
import { divIcon } from 'leaflet'
import CommonDataTable from '../DataTable'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import '@styles/react/libs/flatpickr/flatpickr.scss'

const EditOfflineCommisionRule = () => {
    const history = useHistory()
    const RuleTenureRef = useRef()
    const skdTimeRef = useRef()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const [serviceList, setserviceList] = useState([])
    const [userInput, setUserInput] = useState(JSON.parse(localStorage.getItem('offlineRule')))
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        localStorage.setItem('useBMStoken', true)
        useJwt.getServiceList().then(res => {
            console.log(res)
            setserviceList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            Error(err)
            console.log(err)
            localStorage.setItem('useBMStoken', false)
        })
    }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        let {startDate, endDate} = userInput
        startDate = startDate ? startDate.replace(/T/, ' ') : startDate
        endDate = endDate ? endDate.replace(/T/, ' ') : endDate

        localStorage.setItem('useBMStoken', true)
        setPointRuleloading(true)
        console.log({...userInput, startDate, endDate})
        const { id } = userInput
        useJwt.editOfflineRule(id, {...userInput, startDate, endDate}).then((response) => {
            setPointRuleloading(false)
            localStorage.setItem('useBMStoken', false)
            Success(response)
            history.push('/allOfflineRules')
          }).catch((error) => {
            setPointRuleloading(false)
            localStorage.setItem('useBMStoken', false)
            Error(error)
            console.log(error.response)
          })
    }
    const charLimit = (field) => {
        let charCount = 0
        let actualCharReduce = 0
        let tempField = field
        while (tempField.match(/<TransactionTime>/) || tempField.match(/<TransactionId>/) || tempField.match(/<RewordAmount>/) || tempField.match(/<Msisdn>/) || tempField.match(/<TransactionAmount>/) || tempField.match(/<CampaignName>/)) {
            if (tempField.match(/<TransactionTime>/)) { 
                charCount += 19
                actualCharReduce += 2
                tempField = tempField.replace(/<TransactionTime>/, '') 
            }
            if (tempField.match(/<TransactionId>/)) { 
                charCount += 30
                actualCharReduce += 15 
                tempField = tempField.replace(/<TransactionId>/, '') 
            }
            if (tempField.match(/<RewordAmount>/)) {  
                charCount += 10
                actualCharReduce -= 4 
                tempField = tempField.replace(/<RewordAmount>/, '') 
            }
            if (tempField.match(/<Msisdn>/)) { 
                charCount += 11
                actualCharReduce -= 3 
                tempField = tempField.replace(/<Msisdn>/, '')  
            }
            if (tempField.match(/<TransactionAmount>/)) {  
                charCount += 10
                actualCharReduce -= 9 
                tempField = tempField.replace(/<TransactionAmount>/, '')  
            }
            if (tempField.match(/<CampaignName>/)) { 
                actualCharReduce += (userInput?.offlineRuleName?.length - 14)
                charCount += userInput?.offlineRuleName?.length 
                tempField = tempField.replace(/<CampaignName>/, '')  
            }
        }
        charCount += tempField.length
        return {charCount, actualCharReduce}
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/allOfflineRules' >
                    <div className='d-flex align-items-center'>
                            <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                            <span >Back</span>
                    </div>
                    </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Update Offline Campaign Rule</CardTitle>
                </CardHeader>
           </Card>
          <Form style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
              <Card>
                  <CardBody>
                    <Row>
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="offlineRuleName">Campaign Rule Name<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text"
                                    name="offlineRuleName"
                                    id='offlineRuleName'
                                    value={userInput.offlineRuleName}
                                    onChange={handleChange}
                                    required
                                    maxLength='20'
                                    placeholder="description here..."
                                />
                                <p className='text-right' style={userInput.offlineRuleName.length === 20 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{20 - userInput.offlineRuleName.length} characters remaining</p>
                            </FormGroup>
                        </Col>
                        <Col sm="6" >
                            <FormGroup>
                                <Label for="offlineRuleMsg">Offline Rule Message<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="textarea"
                                    name="offlineRuleMsg"
                                    id='offlineRuleMsg'
                                    value={userInput.offlineRuleMsg}
                                    onChange={handleChange}
                                    required
                                    placeholder="message here..."
                                    maxLength={(160 - charLimit(userInput.offlineRuleMsg).actualCharReduce).toString()}
                                />
                                <p className='text-right' style={charLimit(userInput.offlineRuleMsg).charCount === 160 ? { margin: '2px', color: 'red' } : { margin: '2px', color: 'blue' }}>{160 - charLimit(userInput.offlineRuleMsg).charCount} characters remaining</p>
                            </FormGroup>
                        </Col>
                        <Col sm="5">
                                <FormGroup>
                                    <Label for="serviceId">Service Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{value: userInput.serviceId, label: serviceList.find(ser => ser.serviceId === userInput.serviceId)?.serviceKeyword}}
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, serviceId: selected.value})
                                        }}
                                        options={serviceList?.map(d => { return {value: d.serviceId, label: d.serviceKeyword} })}
                                    />
                                </FormGroup>
                            </Col>
                        <Col sm="4" >
                                <FormGroup>
                                    <Label for="userType">Reward Receiver<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{value:userInput.userType, label: userInput.userType === 's' ? 'Sender' : userInput.userType === 'r' ? 'Receiver' : 'select...'}}
                                        onChange={(selected) => {
                                                setUserInput({...userInput, userType: selected.value})
                                        }}
                                        options={[{value:'s', label:'Sender'}, {value:'r', label:'Receiver'}]}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3">
                                <FormGroup>
                                    <Label for="tranDays">Rule Tenure<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={RuleTenureRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={{value:userInput.tranDays, label: userInput.tranDays === 1 ? 'Daily' : userInput.tranDays === 7 ? 'Weekly' : userInput.tranDays === 30 ? 'Monthly' : 'select...'}}
                                        onChange={(selected) => {
                                            if (selected.value === 1) {
                                                setUserInput({ ...userInput, skdTime: 0, tranDays: selected.value })
                                            } else {
                                                setUserInput({ ...userInput, tranDays: selected.value })
                                            }
                                        }}
                                        options={[{ value: 1, label: 'Daily' }, { value: 7, label: 'Weekly' }, { value: 30, label: 'Monthly' }]}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => RuleTenureRef.current.select.focus()}
                                        value={userInput.tranDays || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="3" className='mt-2' >
                                <FormGroup>
                                    <CustomInput
                                    type='switch'
                                    id='isSkdDatetime'
                                    name='isSkdDatetime'
                                    label='Is Schedule?'
                                    checked={userInput.isSkdDatetime}
                                    onChange={(e) => {
                                            if (e.target.checked) { 
                                                setUserInput({ ...userInput, isSkdDatetime: true })
                                            } else {
                                                setUserInput({ ...userInput, isSkdDatetime: false, skdTime: 0, skdHour: 0 })
                                            }
                                        }
                                    }
                                    />
                                </FormGroup>
                            </Col>
                            {
                                (userInput.isSkdDatetime && userInput.tranDays === 30) && <Col md='3' >
                                <FormGroup>
                                    <Label for="endTimeline">Select a date<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={skdTimeRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, skdTime: selected.value })
                                        }}
                                        options={[
                                            { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }, { value: 6, label: '6' }, { value: 7, label: '7' },
                                            { value: 8, label: '8' }, { value: 9, label: '9' }, { value: 10, label: '10' }, { value: 11, label: '11' }, { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' },
                                            { value: 15, label: '15' }, { value: 16, label: '16' }, { value: 17, label: '17' }, { value: 18, label: '18' }, { value: 19, label: '19' }, { value: 20, label: '20' }, { value: 21, label: '21' },
                                            { value: 22, label: '22' }, { value: 23, label: '23' }, { value: 24, label: '24' }, { value: 25, label: '25' }, { value: 26, label: '26' }, { value: 27, label: '27' }, { value: 28, label: '28' }, { value: 29, label: '29' }, { value: 30, label: '30' }, { value: 31, label: '31' }
                                        ]}
                                        defaultValue={{ value: userInput?.skdTime, label: userInput?.skdTime.toString() }}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                        }}
                                        onFocus={e => skdTimeRef.current.select.focus()}
                                        value={userInput.skdTime || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            }
                            {
                                (userInput.isSkdDatetime && userInput.tranDays === 7) && <Col md='3' >
                                <FormGroup>
                                    <Label for="skdHour">Select a day<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={skdTimeRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, skdTime: selected.value })
                                        }}
                                        options={[{ value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' }, { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }]}
                                        defaultValue={[{ value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' }, { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }].find(d => d.value === userInput?.skdTime)}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                        }}
                                        onFocus={e => skdTimeRef.current.select.focus()}
                                        value={userInput.skdTime || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                            }
                            {
                                userInput.isSkdDatetime && <Col md='3' >
                                <FormGroup>
                                    <Label for="skdHour">Hour<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="skdHour"
                                        min='0'
                                        max='24'
                                        id='skdHour'
                                        value={userInput.skdHour}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                            <Col sm='6'>
                                <FormGroup>
                                <Label for="tranOpsType">Rule Type<span style={{ color: 'red' }}>*</span></Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{value: userInput.tranOpsType, label: userInput.tranOpsType === 1 ? 'Apply Rule on Transaction Count' : userInput.tranOpsType === 0 ? 'Apply Rule on Transaction Amount Limit' : userInput.tranOpsType === 2 ? 'Apply Rule on Both Transaction Count & Amount' : 'select...'}}
                                    onChange={(selected) => {
                                            setUserInput({...userInput, tranOpsType: selected.value})
                                    }}
                                    options={[{value: 1, label:'Apply Rule on Transaction Count'}, {value: 0, label:'Apply Rule on Transaction Amount Limit'}, {value: 2, label:'Apply Rule on Both Transaction Count & Amount'}]}
                                />
                                </FormGroup>
                            </Col>
                            <Col sm="6" className='mt-1' >
                                    <FormGroup>
                                        <CustomInput
                                        type='switch'
                                        id='isPerTranBonus'
                                        name='isPerTranBonus'
                                        label='Is Bonus Per Transaction?'
                                        checked={userInput.isPerTranBonus}
                                        onChange={(e) => {
                                                if (e.target.checked) { 
                                                    setUserInput({ ...userInput, isPerTranBonus: true })
                                                } else {
                                                    setUserInput({ ...userInput, isPerTranBonus: false })
                                                }
                                            }
                                        }
                                        />
                                    </FormGroup>
                                </Col>
                        </Row>
                        <Row className='mt-2'>
                            {
                                (userInput.tranOpsType === 1 || userInput.tranOpsType === 2) && <Col sm="3" >
                                <FormGroup>
                                    <Label for="noOfTran">MIN TXN Count<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="noOfTran"
                                        id='noOfTran'
                                        value={userInput.noOfTran}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col>
                            }
                            {
                                (userInput.tranOpsType === 0 || userInput.tranOpsType === 2) && <Col sm="3" >
                                <FormGroup>
                                    <Label for="minPerTran">MIN Amount(TK)/TXN<span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number"
                                        name="minPerTran"
                                        id='minPerTran'
                                        value={userInput.minPerTran}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </Col>
                            }
                            {
                                (userInput.tranOpsType === 2) && <Col sm="3">
                                <FormGroup check>
                                    <CustomInput onChange={(e) => {
                                            if (e.target.checked) { 
                                                setUserInput({ ...userInput, isTotalTran: true })
                                            } else {
                                                setUserInput({ ...userInput, isTotalTran: false })
                                            }
                                        }
                                    } label='On Total Amount?' type='checkbox' id='isTotalTran' checked={userInput.isTotalTran}/>
                                </FormGroup>
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <Col sm='6'>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col sm="12" className='mb-1'>
                                        <Label className='d-block'><h6>Type</h6></Label>
                                        <FormGroup check inline className='mr-3'>
                                            <Label check>
                                                <CustomInput type='radio' id='flat' name='flat' checked={!userInput.isPercentage} 
                                                onChange={() => {
                                                    setUserInput({...userInput, isPercentage: false, min: 0, max:0})
                                                    }}
                                                /> Flat
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <CustomInput type='radio' id='percentage' name='percentage' checked={userInput.isPercentage}
                                                onChange={() => {
                                                    setUserInput({...userInput, isPercentage: true})
                                                    }}
                                                /> Percentage
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="4" >
                                        <FormGroup>
                                            <Label for="bonusAmount">Amount<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="number"
                                                name="bonusAmount"
                                                id='bonusAmount'
                                                value={userInput.bonusAmount}
                                                onChange={handleChange}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    {
                                        userInput.isPercentage && <Col sm="4" >
                                        <FormGroup>
                                            <Label for="min">Min<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="number"
                                                name="min"
                                                id='min'
                                                value={userInput.min}
                                                onChange={handleChange}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    }
                                    {
                                        userInput.isPercentage && <Col sm="4" >
                                        <FormGroup>
                                            <Label for="max">Max<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="number"
                                                name="max"
                                                id='max'
                                                value={userInput.max}
                                                onChange={handleChange}
                                                required
                                                placeholder="0"
                                            />
                                        </FormGroup>
                                    </Col>
                                    }
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm='6'>
                        <Card>
                            <CardBody>
                               <Row>
                                <Col md='6' >
                                        <FormGroup>
                                            <Label for="startDate">Start Date<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="datetime-local"
                                                // min={new Date().toLocaleDateString('fr-CA')}
                                                name="startDate"
                                                id='startDate'
                                                value={userInput.startDate}
                                                onChange={e => {
                                                    setUserInput({...userInput, startDate: e.target.value})
                                                }}
                                                required
                                                placeholder='0'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md='6' >
                                        <FormGroup>
                                            <Label for="endDate">End Date<span style={{ color: 'red' }}>*</span></Label>
                                            <Input type="datetime-local"
                                                // min={new Date().toLocaleDateString('fr-CA')}
                                                name="endDate"
                                                id='endDate'
                                                value={userInput.endDate}
                                                onChange={e => {
                                                    setUserInput({...userInput, endDate: e.target.value})
                                                }}
                                                required
                                                placeholder='0'
                                            />
                                        </FormGroup>
                                    </Col>
                               </Row>
                                <Col sm="4" className='mt-1' >
                                    <FormGroup>
                                        <CustomInput
                                        type='switch'
                                        id='isActive'
                                        name='isActive'
                                        label='isActive?'
                                        checked={userInput.isActive}
                                        onChange={(e) => {
                                                    if (e.target.checked) { 
                                                        setUserInput({ ...userInput, isActive: true })
                                                    } else {
                                                        setUserInput({ ...userInput, isActive: false })
                                                    }
                                                }
                                            }
                                        />
                                    </FormGroup>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Col sm="12" className='text-center'>
                    {
                        pointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                            <Spinner color='white' size='sm' />
                            <span className='ml-50'>Loading...</span>
                        </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                            <span >Update</span>
                        </Button.Ripple>
                    }
                </Col>
            </Form>
        </Fragment>
    )
}

export default EditOfflineCommisionRule