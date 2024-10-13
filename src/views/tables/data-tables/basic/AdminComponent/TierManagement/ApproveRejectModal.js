import { Fragment, useState, useEffect, useRef } from 'react'
import { PhoneCall } from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt2 from '@src/auth/jwt/useJwt2'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'
import { formatReadableDate } from '../../../../../helper'

const ApproveRejectModal = ({ modal, toggleModal, action, tierInfo, setReset, resetData, serviceList }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)
    const [roleWiseApprovedList, setRoleWiseApprovedList] = useState([])

    useEffect(() => {
        if (tierInfo.id) {
            useJwt2.getApprovalEntryforTier(tierInfo.id).then(res => {
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
    }, [tierInfo.id])

    const onSubmit = () => {
        seteditPointRuleloading(true)
        const data = {
            id: parseInt(tierInfo.id),
            action_id: action
        } 
        useJwt2.pmsTierAction(data).then(res => {
            setReset(!resetData)
            seteditPointRuleloading(true)
            console.log(res)
            toggleModal()
            Success(res)
            seteditPointRuleloading(false)
        }).catch(err => {
            seteditPointRuleloading(false)
            Error(err)
            console.log(err.response)
        })
    }

    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-lg'>
            <div className={`border border-${action === 4 ? 'danger' : 'success'}`}>

                <ModalHeader toggle={toggleModal}>{action === 4 ? 'Reject Tier' : (action === 1 || action === 2 || action === 3) ? 'Approve Tier' : 'Tier Details'}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm='6'>
                            <Card>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Tier:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.tier}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Point Required:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.point_required}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Number Of Transaction:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.num_of_transaction}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Months:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.months}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-2'>
                                    <h6 style={{ margin: '0' }}>Amount Of Transaction:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.amount_of_transaction}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-2'>
                                    <h6 style={{ margin: '0' }}>Created By:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.created_by}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-2'>
                                    <h6 style={{ margin: '0' }}>Created Date:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.created_date ? formatReadableDate(tierInfo.created_date) : 'N/A'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-2'>
                                    <h6 style={{ margin: '0' }}>Action:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.action}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Status:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.status ? 'True' : 'False'}</b></h6>
                                </div>
                            </Card>
                        </Col>
                        <Col sm='6'>
                            <Card>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Frequency:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.frequency ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Is Service Type?:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.is_service_type ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Service Type:</h6>
                                    <h6 style={{ margin: '0' }}><b>{serviceList.find(s => parseInt(s.serviceId) === parseInt(tierInfo.service_type))?.serviceKeyword || 'N/A'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Is Amount Of Transaction?:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.is_amount_of_transaction ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Is Month Sustained?:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.is_month_sustained ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Is Number Of Transaction?:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.is_num_of_transaction ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-2'>
                                    <h6 style={{ margin: '0' }}>Is Point Required?:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.is_point_required ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-2'>
                                    <h6 style={{ margin: '0' }}>Refference Id:</h6>
                                    <h6 style={{ margin: '0' }}><b>{tierInfo.ref_id ? tierInfo.ref_id : 'N/A'}</b></h6>
                                </div>
                            </Card>
                        </Col>

                        <Col sm='12'>
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
                        </Col>
                    </Row>
                    <Col sm="12" className='text-center'>
                        {
                            action !== 5 && <Button.Ripple className='ml-2' color='primary' onClick={onSubmit} type="button" style={{ marginTop: '25px' }}>
                                {editPointRuleloading ? <Spinner size='sm'/> : <span >Confirm</span>}
                            </Button.Ripple>
                        }
                    </Col>
                </ModalBody>
            </div>

        </Modal>
    )
}
export default ApproveRejectModal