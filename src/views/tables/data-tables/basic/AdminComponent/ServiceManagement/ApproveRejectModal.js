import { Fragment, useState, useEffect, useRef } from 'react'
import { PhoneCall } from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import useJwt2 from '@src/auth/jwt/useJwt2'

import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { formatReadableDate } from '../../../../../helper'
import { CURRENCY_SYMBOL } from '../../../../../../Configurables'


const ApproveRejectModal = ({ modal, toggleModal, action, serviceInfo, serviceLogicInfo, setReset, resetData }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [roleWiseApprovedList, setRoleWiseApprovedList] = useState([])

    useEffect(() => {
        if (serviceInfo.id) {
            useJwt.campServiceViewApproval(serviceInfo.id).then(res => {
                console.log(res)
                const itemArr = []
                for (const item of res.data.payload.module_data.roles) {
                    const approvedby = res.data.payload.approved.find(i => i.role_id === item.role_id)
                    if (approvedby) {
                        itemArr.push({role_id: item.role_name, approved_by: approvedby.approved_by, approved_at: approvedby.approved_at})
                    } else {
                        itemArr.push({role_id: item.role_name, approved_by: '--', approved_at: ''})
                    }
                }
                setRoleWiseApprovedList(itemArr)
            }).catch(err => {
                console.log(err)
                Error(err)
            })
        }
    }, [serviceInfo.id])
    
    const onSubmit = () => {
        seteditPointRuleloading(true)
        const data = {
            temp_id: serviceInfo.id,
            action
        }
        useJwt2.approveRejectService(data).then(res => {
            setReset(!resetData)
            seteditPointRuleloading(false)
            toggleModal()
            Success(res)
        }).catch(err => {
            seteditPointRuleloading(false)
            Error(err)
        })
    }

    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-xl'>
            <div className={`border border-${action === 0 ? 'danger' : 'success'}`}>

                <ModalHeader toggle={toggleModal}>{action === 0 ? 'Reject Service' : action === 1 ? 'Approve Service' : 'Service Details'}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm='6'>
                            <Card>
                                <CardHeader className='border-bottom'>
                                    <h6 style={{ margin: '0' }}></h6><h5 style={{ margin: '0' }}>Service Info</h5><h6 style={{ margin: '0' }}></h6>
                                </CardHeader>
                                <div>
                                    <div className='d-flex justify-content-between border-bottom p-2'>
                                        <h6 style={{ margin: '0' }}>Service ID</h6>
                                        <h6 style={{ margin: '0' }}><b>{serviceInfo.foreign_id || serviceInfo.service_id}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-2'>
                                        <h6 style={{ margin: '0' }}>Service Keyword</h6>
                                        <h6 style={{ margin: '0' }}><b>{serviceInfo.service_keyword}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-2'>
                                        <h6 style={{ margin: '0' }}>Keyword Details</h6>
                                        <h6 style={{ margin: '0' }}><b>{serviceInfo.keyword_description || ""}</b></h6>
                                    </div>
                                    {/* <div className='d-flex justify-content-between p-2'>
                                        <h6 style={{ margin: '0' }}>Subtype</h6>
                                        <h6 style={{ margin: '0' }}><b>{serviceInfo.sub_types?.map(m => <Badge key={m} style={{ marginRight: '5px' }}>{m}</Badge>)}</b></h6>
                                    </div> */}
                                </div>
                            </Card>
                        </Col>
                        {
                            action !== 3 ? <Col sm='6'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Approval Entry</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12" >
                                            <Table>
                                                <tr>
                                                    <th>Role Name</th>
                                                    <th>Approved By</th>
                                                    <th>Approved At</th>
                                                </tr>
                                                {
                                                    roleWiseApprovedList?.length !== 0 ? roleWiseApprovedList?.map((item, index) => <tr key={index}>
                                                        <td>{item.role_id}</td>
                                                        <td>{item.approved_by}</td>
                                                        <td>{item.approved_at ? formatReadableDate(item.approved_at || '') : '--'}</td>
                                                    </tr>) : <Spinner className='text-center'/>
                                                }
                                            </Table>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>`
                        </Col> : null
                        }
                        
                        <Col sm='6'>
                            <Card>
                                <CardHeader className='border-bottom'>
                                    <h6 style={{ margin: '0' }}></h6><h5 style={{ margin: '0' }}>Service Logic Info</h5><h6 style={{ margin: '0' }}></h6>
                                </CardHeader>
                                <div>
                                    {/* <div className='d-flex justify-content-between border-bottom p-2'>
                                        <h6 style={{ margin: '0' }}>Sender Group Type</h6>
                                        <h6 style={{ margin: '0' }}><b>{[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value === serviceLogicInfo?.senGroupType)?.label}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-2'>
                                        <h6 style={{ margin: '0' }}>Receiver Group Type</h6>
                                        <h6 style={{ margin: '0' }}><b>{[{ value: 1, label: 'Customer' }, { value: 2, label: 'Agent' }, { value: 3, label: 'Merchant' }, { value: 0, label: 'Any' }].find(item => item.value === serviceLogicInfo?.recGroupType)?.label}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-2'>
                                        <h6 style={{ margin: '0' }}>Reward Priority</h6>
                                        <h6 style={{ margin: '0' }}><b>{serviceLogicInfo?.ruleProvider === 's' ? 'Sender' : serviceLogicInfo?.ruleProvider === 'r' ? 'Reciever' : ''}</b></h6>
                                    </div> */}
                                    <div className='d-flex justify-content-between border-bottom p-2'>
                                        <h6 style={{ margin: '0' }}>MIN TXN Amount</h6>
                                        <h6 style={{ margin: '0' }}><b>{CURRENCY_SYMBOL} {serviceInfo?.minimum}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom p-2'>
                                        <h6 style={{ margin: '0' }}>MAX TXN Amount</h6>
                                        <h6 style={{ margin: '0' }}><b>{CURRENCY_SYMBOL} {serviceInfo?.maximum}</b></h6>
                                    </div>
                                    <div className='d-flex justify-content-between p-2'>
                                        <h6 style={{ margin: '0' }}>Is Financial?</h6>
                                        <h6 style={{ margin: '0' }}><b>{serviceInfo?.is_financial ? 'True' : 'False'}</b></h6>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    
                    <Col sm="12" className='text-center'>
                        {
                            editPointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' onClick={onSubmit} type="button" style={{ marginTop: '25px' }}>
                                <span >Confirm</span>
                            </Button.Ripple>
                        }
{/* 
                        {
                            action !== 3 && <Button.Ripple className='ml-2' disabled={action === 3} color='primary' onClick={onSubmit} type="button" style={{ marginTop: '25px' }}>
                                <span >Confirm</span>
                            </Button.Ripple>
                        } */}
                    </Col>
                </ModalBody>
            </div>

        </Modal>
    )
}
export default ApproveRejectModal