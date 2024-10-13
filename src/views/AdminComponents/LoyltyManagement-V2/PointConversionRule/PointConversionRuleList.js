import useJwt2 from '@src/auth/jwt/useJwt2'
import { selectThemeColors } from '@utils'
import React, { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Spinner, Table } from 'reactstrap'
import { Error, Success } from '../../../viewhelper'

const PointConversionRuleList = ({ TableDataLoading, pointConversionRule, setpointConversionRule, toggleReset }) => {
    const history = useHistory()
    const [pointRuleloading, setPointRuleloading] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        setPointRuleloading(true)
        useJwt2.pointConvertInfoUpdate({...pointConversionRule, minimum_required_point: pointConversionRule.min_point_need }).then((res) => {
            setPointRuleloading(false)
            toggleReset()
            Success({data: {message : res.data.payload.msg}})
        }).catch((error) => {
            setPointRuleloading(false)
            Error(error)
        })
    }

    return (
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>Point Conversion Rule</CardTitle>
            </CardHeader>
            <CardBody style={{ paddingTop: '15px' }}>
                    <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                        <Col lg='6' md="6" sm="6" >
                            <FormGroup>
                                <Label for="point">Point<span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    type="number"
                                    name="point"
                                    id='point'
                                    value={pointConversionRule.point}
                                    onChange={e => setpointConversionRule({ ...pointConversionRule, point: parseInt(e.target.value) })}
                                    required
                                    placeholder="point here..."
                                />
                            </FormGroup>
                        </Col>
                        <Col lg='6' md="6" sm="6" >
                            <FormGroup>
                                <Label for="cash_amount">Cash Amount<span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    type="number"
                                    name="cash_amount"
                                    id='cash_amount'
                                    value={pointConversionRule.cash_amount}
                                    onChange={e => setpointConversionRule({ ...pointConversionRule, cash_amount: parseInt(e.target.value) })}
                                    required
                                    placeholder="cash amount here..."
                                />
                            </FormGroup>
                        </Col>
                        <Col lg='6' md="6" sm="6" >
                            <FormGroup>
                                <Label for="min_point_need">Minimum Point Need<span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    type="number"
                                    name="min_point_need"
                                    id='min_point_need'
                                    value={pointConversionRule.min_point_need}
                                    onChange={e => setpointConversionRule({ ...pointConversionRule, min_point_need: parseInt(e.target.value) })}
                                    required
                                    placeholder="min point need here..."
                                />
                            </FormGroup>
                        </Col>
                        {/* <Col lg='6' md="6" sm="6" >
                            <FormGroup>
                                <Label for="created_by">Created by</Label>
                                <Input
                                    type="text"
                                    name="created_by"
                                    id='created_by'
                                    value={pointConversionRule?.created_by}
                                    disabled
                                    placeholder="min point need here..."
                                />
                            </FormGroup>
                        </Col>
                        */}
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
                </CardBody>
        </Card>
    )
}

export default PointConversionRuleList