import useJwt2 from '@src/auth/jwt/useJwt2'
import React, { Fragment, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Spinner, Table } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { formatReadableDate } from '../../../helper'
const MySwal = withReactContent(Swal)

const PendingList = ({ TableDataLoading, pendingpointConversionRule:pointConversionRule, setpendingpointConversionRule:setpointConversionRule, toggleReset }) => {

    const handlePoPupActions = (id, action_type, message) => {
        return MySwal.fire({
            title: message,
            text: `You won't be able to revert this`,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const data = {
                    temp_id : id,
                    action_type
                }
                return useJwt2.pointConvertAction(data).then(res => {
                    toggleReset()
                    Success({data: {message : res.data.payload.msg}})
                 
                }).catch(err => {
                    Error(err)
                })
            },
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading()
        }).then(function (result) {
            if (result.isConfirmed) {

            }
        })

    }

    return (
        <Card>
        <CardHeader className='border-bottom'>
            <CardTitle tag='h4'>Point Conversion Rule Temp</CardTitle>
        </CardHeader>
        {
            pointConversionRule.temphave ? <CardBody style={{ paddingTop: '15px' }}>
            <Fragment>
                <Row>
                    <Col md="6">
                        <Col md="12" >
                        <FormGroup>
                            <Label for="point">Point<span style={{ color: 'red' }}>*</span></Label>
                            <Input
                                type="number"
                                name="point"
                                id='point'
                                value={pointConversionRule.point}
                                disabled
                                required
                                placeholder="point here..."
                            />
                        </FormGroup>
                        </Col>
                        <Col md="12" >
                            <FormGroup>
                                <Label for="cash_amount">Cash Amount<span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    type="number"
                                    name="cash_amount"
                                    id='cash_amount'
                                    value={pointConversionRule.cash_amount}
                                    disabled                                
                                    required
                                    placeholder="cash amount here..."
                                />
                            </FormGroup>
                        </Col>
                        <Col md="12" >
                            <FormGroup>
                                <Label for="min_point_need">Minimum Point Need<span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    type="number"
                                    name="min_point_need"
                                    id='min_point_need'
                                    value={pointConversionRule.min_point_need}
                                    disabled
                                    required
                                    placeholder="min point need here..."
                                />
                            </FormGroup>
                        </Col>
                    </Col>
                    <Col md="6">
                        <p>Created By: {pointConversionRule.created_by}</p>
                        <p>Created At: {pointConversionRule.created_at ? formatReadableDate(pointConversionRule.created_at) : null}</p>
                    </Col>
                </Row>


                <Col sm="12" className='text-center'>
                        <Button.Ripple className='ml-2' color='primary' style={{ marginTop: '25px' }} onClick={(e) => handlePoPupActions(1, 1, 'You want to approve it?')}>
                            <span >Approve</span>
                        </Button.Ripple>

                        <Button.Ripple className='ml-2' color='danger' style={{ marginTop: '25px' }} onClick={(e) => handlePoPupActions(1, 2, 'You want to reject it?')}>
                            <span >Reject</span>
                        </Button.Ripple>
                </Col>
            </Fragment>
        </CardBody> : null
        }
        
    </Card>
    )
}

export default PendingList