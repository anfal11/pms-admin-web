import React, { Fragment, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit, Archive, Trash, Search, Eye, Lock, ChevronLeft
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, Spinner, CardBody
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import MrchntCmsnTable from './MrchntCmsnTable'

const CostSettings = () => {
    const [CostManageLoading, setCostManage] = useState(false)
    const [per_sms_cost, setper_sms_cost] = useState(1)

    const [commission_percentageLoading, setcommission_percentageLoading] = useState(false)
    const [adCostLoading, setadCostLoading] = useState(false)
    const [commission_percentage, setcommission_percentage] = useState(1)
    const [merchant_commission_percentage, setmerchant_commission_percentage] = useState(1)

    const [MerchantList, setMerchantLists] = useState([])
    const [SelectedMerchantList, setSelectedMerchantList] = useState([])
    const [SelectedMerchantLoading, setSelectedMerchantLoading] = useState(false)
    const [TableDataLoading, setTableDataLoading] = useState(true)
    const [TableDataRefresh, setTableDataRefresh] = useState(true)
    const [MerchantCmsnList, setMerchantCmsnList] = useState([])
    const [adCost, setAdCost] = useState({
       sms_cost: 0,
       sms_charge:0,
       email_charge:0,
       push_notification_charge:0,
       facebook_post_charge:0,
       push_notification_amount:0,
       instagram_post_charge:0
    })
    const adCostONchange = (e) => {
        setAdCost({...adCost, [e.target.name]: parseInt(e.target.value)})
    }

    useEffect(async () => {
        await useJwt.getAdCost().then((response) => {
            setAdCost({ ...response.data.payload })
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        await useJwt.getSmsRate().then((response) => {
            // console.log(response.data.payload)
            setper_sms_cost(response.data.payload?.per_sms_cost)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        await useJwt.get_global_commission_rate().then((response) => {
            // console.log(response.data.payload)
            setcommission_percentage(response.data.payload?.commission_percentage)
        }).catch((error) => {
            Error(error)
            console.log(error)
        })
        await useJwt.customerBusinessList().then(res => {
            const { payload } = res.data
            // console.log(payload)
            setMerchantLists(payload.map(x => { return { value: x.id, label: x.businessname } }))
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [])
    useEffect(async () => {
        await useJwt.get_merchant_commission_rate({ page: 1, limit: 100 }).then(res => {
            console.log('get_merchant_commission_rate', res.data.payload)
            setMerchantCmsnList(res.data.payload.rows)
            setTableDataLoading(false)
        }).catch(err => {
            console.log(err.response)
            Error(err)
        })
    }, [TableDataRefresh])
    const onCostConfSubmit = (e) => {
        e.preventDefault()
        // console.log({ id: 1, per_sms_cost: +((+per_sms_cost).toFixed(2)) })
        // return 0
        setCostManage(true)
        useJwt.updateSmsRate({ id: 1, per_sms_cost: +((+per_sms_cost).toFixed(2)) }).then((response) => {
            setCostManage(false)
            Success(response)
        }).catch((error) => {
            setCostManage(false)
            Error(error)
            console.log(error)
        })
    }
    const onGCSubmit = (e) => {
        e.preventDefault()
        // console.log({ id: 2, commission_percentage: +((+commission_percentage).toFixed(2)) })
        // return 0
        setcommission_percentageLoading(true)
        useJwt.edit_global_commission_rate({ id: 2, commission_percentage: +((+commission_percentage).toFixed(2)) }).then((response) => {
            setcommission_percentageLoading(false)
            Success(response)
        }).catch((error) => {
            setcommission_percentageLoading(false)
            Error(error)
            console.log(error)
        })
    }
    const onAdCostSubmit = (e) => {
        e.preventDefault()
        setadCostLoading(true)
        useJwt.adCostUpdate({ ...adCost }).then((response) => {
            setadCostLoading(false)
            Success(response)
        }).catch((error) => {
            setadCostLoading(false)
            Error(error)
            console.log(error)
        })
    }
    const onSelectedMerchantSubmit = (e) => {
        e.preventDefault()
        const body = {
            merchant_id: SelectedMerchantList.map(x => x.value),
            merchant_name: SelectedMerchantList.map(x => x.label),
            commission_percentage: +merchant_commission_percentage
        }
        console.log(body)
        // return 0
        setSelectedMerchantLoading(true)
        useJwt.create_merchant_commission_rate(body).then((response) => {
            setSelectedMerchantLoading(false)
            Success(response)
            setTableDataRefresh(r => !r)
        }).catch((error) => {
            setSelectedMerchantLoading(false)
            Error(error)
            console.log(error)
        })
    }
    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle>
                        Ad Cost Configuration
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Form style={{ width: '100%' }} onSubmit={onAdCostSubmit} autoComplete="off">
                        <Row>
                            <Col sm='4'>
                                <FormGroup>
                                    <Label>SMS Cost</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step='0.01'
                                        name="sms_cost"
                                        id='sms_cost'
                                        value={adCost?.sms_cost}
                                        onChange={adCostONchange}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='4'>
                                <FormGroup>
                                    <Label>SMS Charge</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step='0.01'
                                        name="sms_charge"
                                        id='sms_charge'
                                        value={adCost?.sms_charge}
                                        onChange={adCostONchange}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='4'>
                                <FormGroup>
                                    <Label>Email Charge</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step='0.01'
                                        name="email_charge"
                                        id='email_charge'
                                        value={adCost?.email_charge}
                                        onChange={adCostONchange}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='4'>
                                <FormGroup>
                                    <Label>Push Notification Charge</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step='0.01'
                                        name="push_notification_charge"
                                        id='push_notification_charge'
                                        value={adCost?.push_notification_charge}
                                        onChange={adCostONchange}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='4'>
                                <FormGroup>
                                    <Label>Push Notification Amount</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        name="push_notification_amount"
                                        id='push_notification_amount'
                                        value={adCost?.push_notification_amount}
                                        onChange={adCostONchange}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='4'>
                                <FormGroup>
                                    <Label>Facebook Post Charge</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step='0.01'
                                        name="facebook_post_charge"
                                        id='facebook_post_charge'
                                        value={adCost?.facebook_post_charge}
                                        onChange={adCostONchange}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='4'>
                                <FormGroup>
                                    <Label>Instagram Post Charge</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step='0.01'
                                        name="instagram_post_charge"
                                        id='instagram_post_charge'
                                        value={adCost?.instagram_post_charge}
                                        onChange={adCostONchange}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm='12' className='text-center' style={{ paddingTop: '23px' }}>
                                {
                                    adCostLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle>
                        SMS Configuration
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Form style={{ width: '100%' }} onSubmit={onCostConfSubmit} autoComplete="off">
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Per SMS Cost</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step='0.01'
                                        name="per_sms_cost"
                                        id='per_sms_cost'
                                        value={per_sms_cost}
                                        onChange={e => {
                                            setper_sms_cost(e.target.value)
                                        }}
                                        required
                                        placeholder="1"
                                    />
                                </FormGroup>
                            </Col>
                            <Col className='text-center' style={{ paddingTop: '23px' }}>
                                {
                                    CostManageLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                        <Spinner color='white' size='sm' />
                                        <span className='ml-50'>Loading...</span>
                                    </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                        <span >Submit</span>
                                    </Button.Ripple>
                                }
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
            {/* <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle>
                        Commission Configuration
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Card className='border-bottom'>
                        <CardHeader>
                            <CardTitle>
                                Global  Commission
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Form style={{ width: '100%' }} onSubmit={onGCSubmit} autoComplete="off">
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label>Commission(%)</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                step='0.01'
                                                name="commission_percentage"
                                                id='commission_percentage'
                                                value={commission_percentage}
                                                onChange={e => {
                                                    setcommission_percentage(e.target.value)
                                                }}
                                                required
                                                placeholder="1"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col className='text-center' style={{ paddingTop: '23px' }}>
                                        {
                                            commission_percentageLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                                <Spinner color='white' size='sm' />
                                                <span className='ml-50'>Loading...</span>
                                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                                <span >Submit</span>
                                            </Button.Ripple>
                                        }
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                    <Card className='border-bottom'>
                        <CardHeader>
                            <CardTitle>
                                Merchant Based  Commission
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Form style={{ width: '100%' }} onSubmit={onSelectedMerchantSubmit} autoComplete="off">
                                <Row>
                                    <Col md='6'>
                                        <FormGroup>
                                            <Label>Select Merchants</Label>
                                            <Select
                                                theme={selectThemeColors}
                                                className='react-select'
                                                classNamePrefix='select'
                                                name=""
                                                maxMenuHeight={100}
                                                onChange={(selected) => {
                                                    setSelectedMerchantList(selected)
                                                }}
                                                options={MerchantList}
                                                isClearable
                                                isMulti
                                                isLoading={false}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {
                                        !!SelectedMerchantList.length && <Col md='3'>
                                            <FormGroup>
                                                <Label>Commission (%) </Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    step='0.01'
                                                    name={merchant_commission_percentage}
                                                    id={merchant_commission_percentage}
                                                    value={merchant_commission_percentage}
                                                    onChange={e => {
                                                        setmerchant_commission_percentage(e.target.value)
                                                    }}
                                                    required
                                                    placeholder="1"
                                                />
                                            </FormGroup>
                                        </Col>
                                    }
                                    {!!SelectedMerchantList.length && <Col md='3' className='text-center' style={{ paddingTop: '23px' }}>
                                        {
                                            SelectedMerchantLoading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                                <Spinner color='white' size='sm' />
                                                <span className='ml-50'>Loading...</span>
                                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit">
                                                <span >Submit</span>
                                            </Button.Ripple>
                                        }
                                    </Col>}
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                    <MrchntCmsnTable
                        TableDataLoading={TableDataLoading}
                        MerchantCmsnList={MerchantCmsnList}
                        setTableDataRefresh={setTableDataRefresh}
                        setMerchantCmsnList={setMerchantCmsnList} />
                </CardBody>
            </Card> */}
        </Fragment>
    )
}

export default CostSettings