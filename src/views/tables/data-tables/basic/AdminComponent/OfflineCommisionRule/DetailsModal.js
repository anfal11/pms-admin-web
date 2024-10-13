import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import CommonDataTable from '../ClientSideDataTable'

const DetailsModal = ({ modal, toggleModal, commisionInfo, setReset, resetData, serviceList }) => {

    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={toggleModal}>Campaign Rule Details</ModalHeader>
            <ModalBody>
                    <Row>
                        <Col sm='6'>
                            <Card>
                                <div className='d-flex justify-content-between border-bottom p-1'>
                                    <h6 style={{margin:'0'}}>Campaign Rule ID:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.id}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-1'>
                                    <h6 style={{margin:'0'}}>Campaign Rule Name:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.offlineRuleName}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-1'>
                                    <h6 style={{margin:'0'}}>Offline Rule Message:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.offlineRuleMsg}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Is Percentage?:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.isPercentage ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-1'>
                                    <h6 style={{margin:'0'}}>Amount:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.bonusAmount}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-1'>
                                    <h6 style={{margin:'0'}}>Minimum:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.min}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between border-bottom p-1'>
                                    <h6 style={{margin:'0'}}>Maximum:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.max}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Is Active?:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.isActive ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Start Date:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.startDate ? new Date(commisionInfo?.startDate).toLocaleDateString('fr-CA') : 'N/A'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>End Date:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.endDate ? new Date(commisionInfo?.endDate).toLocaleDateString('fr-CA') : 'N/A'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Check Date:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.checkDate ? new Date(commisionInfo?.checkDate).toLocaleDateString('fr-CA') : 'N/A'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Created By:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.createBy}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Service Type:</h6>
                                    <h6 style={{margin:'0'}}><b>{serviceList.find(sr => sr.serviceId === commisionInfo?.serviceId)?.serviceKeyword}</b></h6>
                                </div>
                            </Card>
                        </Col>
                        <Col sm='6'>
                            <Card>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>MIN Amount(TK)/TXN:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.minPerTran}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>MIN TXN Count:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.noOfTran}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Rule Type:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.tranOpsType === 1 ? 'Apply Rule on Transaction Count' : commisionInfo?.tranOpsType === 0 ? 'Apply Rule on Transaction Amount Limit' : commisionInfo?.tranOpsType === 2 ? 'Apply Rule on Both Transaction Count & Amount' : ''}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Is Expiry?:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.isExpiry ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Rule Tenure:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.tranDays === 1 ? 'Daily' : commisionInfo?.tranDays === 7 ? 'Weekly' : commisionInfo?.tranDays === 30 ? 'Monthly' : ''}</b></h6>
                                </div>
                            </Card>
                            <Card>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Is Schedule?:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.isSkdDatetime ? 'True' : 'False'}</b></h6>
                                </div>
                                {commisionInfo?.tranDays === 7 && <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Schedule Days</h6>
                                    <h6 style={{margin:'0'}}><b>{[{ value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' }, { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }].find(d => d.value === commisionInfo?.skdTime)?.label}</b></h6>
                                </div>}
                                {commisionInfo?.tranDays === 30 && <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Schedule Date</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.skdTime ? commisionInfo?.skdTime : 'N/A'}</b></h6>
                                </div>}
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Schedule Hour:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.skdHour ? commisionInfo?.skdHour : 'N/A'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Is Bonus Per Transaction:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.isPerTranBonus ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Reward Receiver:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.userType === 's' ? 'Sender' : commisionInfo?.userType === 'r' ? 'Receiver' : ''}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Is Expiry?:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.isExpiry ? 'True' : 'False'}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>On Total Amount?:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.isTotalTran ? 'True' : 'False'}</b></h6>
                                </div>
                            </Card>
                            <Card>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Approve Date:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.approveDate}</b></h6>
                                </div>
                                <div className='d-flex justify-content-between p-1'>
                                    <h6 style={{margin:'0'}}>Approved By:</h6>
                                    <h6 style={{margin:'0'}}><b>{commisionInfo?.approvedBy}</b></h6>
                                </div>
                            </Card>
                        </Col>
                    </Row>
            </ModalBody>
        </Modal>
    )
}
export default DetailsModal