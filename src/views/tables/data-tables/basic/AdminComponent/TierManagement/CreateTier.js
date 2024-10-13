import useJwt from '@src/auth/jwt/useJwt'
import React, { Fragment, useState, useRef, useEffect } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { ChevronLeft } from 'react-feather'
import { BMS_PASS, BMS_USER } from '../../../../../../Configurables'
import { Link, useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Label, Spinner, CustomInput } from 'reactstrap'
import { Error, Success } from '../../../../../viewhelper'

const CreateTier = () => {
    const history = useHistory()
    const [pointRuleloading, setPointRuleloading] = useState(false)
    const serviceRef = useRef()
    const [serviceList, setserviceList] = useState([])
    const [resetData, setReset] = useState(true)
    const [userInput, setUserInput] = useState({
        tier  : '',
        point_required  :0,
        is_point_required: false,
        is_num_of_transaction: false,
        num_of_transaction: 0,
        is_amount_of_transaction: false,
        amount_of_transaction: 0,
        is_month_sustained: false,
        months: 0,
        status: false,
        frequency: false,
        is_service_type: false,
        service_type: 0
    })
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    useEffect(async () => {
        localStorage.setItem('usePMStoken', false)
        localStorage.setItem('useBMStoken', true)
        await useJwt.getServiceList().then(res => {
            console.log(res)
            setserviceList(res.data)
            localStorage.setItem('useBMStoken', false)
        }).catch(err => {
            if (err.response?.status === 401) {
                localStorage.setItem("BMSCall", true)
                useJwt.getBMStoken({ username: BMS_USER, password: BMS_PASS }).then(res => {
                  localStorage.setItem('BMStoken', res.data.jwtToken)
                  localStorage.setItem("BMSCall", false)
                  setReset(!resetData)
                }).catch(err => {
                  localStorage.setItem("BMSCall", false)
                  console.log(err)
                })
            } else {
                Error(err)
                console.log(err)
                // setTableDataLoading(false)
                localStorage.setItem('useBMStoken', false)
            }
        })
    }, [resetData])
    const onSubmit = (e) => {
        e.preventDefault()
        // localStorage.setItem('usePMStoken', true)
        const { tier, point_required} = userInput
        setPointRuleloading(true)
        useJwt.tierCreate({ tier, point_required}).then((response) => {
            setPointRuleloading(false)
            // localStorage.setItem('usePMStoken', false)
            console.log(response)
            Success(response)
            history.push('/AllTiers')
          }).catch((error) => {
            setPointRuleloading(false)
            // localStorage.setItem('usePMStoken', false)
            Error(error)
            console.log(error.response)
          })
    }
    return (
        <Fragment>
            <Button.Ripple className='mb-1' color='primary' tag={Link} to='/AllTiers' >
                    <div className='d-flex align-items-center'>
                            <ChevronLeft size={17} style={{marginRight:'5px'}}/>
                            <span >Back</span>
                    </div>
                    </Button.Ripple>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Create Tier</CardTitle>
                    
                </CardHeader>
                <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                       <Col sm="4" >
                            <FormGroup>
                                <Label for="tier">Tier Name<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="text"
                                    name="tier"
                                    id='tier'
                                    value={userInput.tier}
                                    onChange={handleChange}
                                    required
                                    placeholder="tier name"
                                />
                            </FormGroup>
                        </Col>
                       <Col sm="4" >
                            <FormGroup>
                                <Label for="point_required">Required Point<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="point_required"
                                    id='point_required'
                                    min={0}
                                    value={userInput.point_required}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
                       <Col sm="4" >
                            <FormGroup>
                                <Label for="num_of_transaction">Number Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="num_of_transaction"
                                    id='num_of_transaction'
                                    min={0}
                                    value={userInput.num_of_transaction}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
                       <Col sm="4" >
                            <FormGroup>
                                <Label for="amount_of_transaction">Amount Of Transaction<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="amount_of_transaction"
                                    id='amount_of_transaction'
                                    min={0}
                                    value={userInput.amount_of_transaction}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
                       <Col sm="4" >
                            <FormGroup>
                                <Label for="months">Months<span style={{ color: 'red' }}>*</span></Label>
                                <Input type="number"
                                    name="months"
                                    id='months'
                                    min={0}
                                    value={userInput.months}
                                    onChange={handleChange}
                                    required
                                    placeholder="0"
                                />
                            </FormGroup>
                        </Col>
                       <Col sm="4" ></Col>
                        <Col sm="3" className='mt-1'>
                            <FormGroup>
                                <CustomInput
                                    type='switch'
                                    label='Is Service Type?'
                                    id='is_service_type'
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setUserInput({ ...userInput, is_service_type: true })
                                        } else {
                                            setUserInput({ ...userInput, is_service_type: false, service_type: '' })
                                        }
                                    }
                                    }
                                />
                            </FormGroup>
                        </Col>
                        {
                            userInput.is_service_type && <Col sm="4" >
                                <FormGroup>
                                    <Label for="serviceId">Service Type<span style={{ color: 'red' }}>*</span></Label>
                                    <Select
                                        ref={serviceRef}
                                        theme={selectThemeColors}
                                        maxMenuHeight={200}
                                        className='react-select'
                                        classNamePrefix='select'
                                        // value={{ value: merchantid.merchantid, label: merchantid.businessname ? merchantid.businessname : 'select a business'}}
                                        onChange={(selected) => {
                                            setUserInput({ ...userInput, service_type: selected.value})
                                        }}
                                        options={serviceList?.map(d => { return {value: d.serviceId, label: d.serviceKeyword} })}
                                        isLoading={serviceList.length === 0}
                                    />
                                    <Input
                                        required
                                        style={{
                                            opacity: 0,
                                            width: "100%",
                                            height: 0
                                            // position: "absolute"
                                        }}
                                        onFocus={e => serviceRef.current.select.focus()}
                                        value={userInput.service_type || ''}
                                        onChange={e => ''}
                                    />
                                </FormGroup>
                            </Col>
                        }
                        <Col sm="3" className='mt-1'>
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        label='Is Point Required?'
                                        id='is_point_required'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, is_point_required: true })
                                            } else {
                                                setUserInput({ ...userInput, is_point_required: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
                        <Col sm="4" className='mt-1'>
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        label='Is Number Of Transaction?'
                                        id='is_num_of_transaction'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, is_num_of_transaction: true })
                                            } else {
                                                setUserInput({ ...userInput, is_num_of_transaction: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
                        <Col sm="4" className='mt-1'>
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        label='Is Amount Of Transaction?'
                                        id='is_amount_of_transaction'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, is_amount_of_transaction: true })
                                            } else {
                                                setUserInput({ ...userInput, is_amount_of_transaction: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
                        <Col sm="3" className='mt-1'>
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        label='Is Month Sustained?'
                                        id='is_month_sustained'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, is_month_sustained: true })
                                            } else {
                                                setUserInput({ ...userInput, is_month_sustained: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
                        <Col sm="3" className='mt-1'>
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        label='Status'
                                        id='status'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, status: true })
                                            } else {
                                                setUserInput({ ...userInput, status: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
                        <Col sm="3" className='mt-1'>
                                <FormGroup>
                                    <CustomInput
                                        type='switch'
                                        label='Frequency'
                                        id='frequency'
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setUserInput({ ...userInput, frequency: true })
                                            } else {
                                                setUserInput({ ...userInput, frequency: false })
                                            }
                                        }
                                        }
                                    />
                                </FormGroup>
                            </Col>
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

export default CreateTier