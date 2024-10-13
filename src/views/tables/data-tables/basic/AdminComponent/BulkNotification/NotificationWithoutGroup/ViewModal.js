import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { formatReadableDate } from '../../../../../../helper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const ViewModal = ({ modal, toggleModal, notificationInfo}) => {
    // channel_info: {id: '11', fb_page_post: false, sms: false, push_notification: true, email: true, …}
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal}>Notification Details</ModalHeader>
            <ModalBody>
                    <Card>
                        <CardBody>
                                <h2 className='mb-2'><b>{notificationInfo.title}</b></h2>
                                <h6>{notificationInfo.body}</h6>
                        </CardBody>
                    </Card>
                    <Card>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Email</h6>
                            <h6 style={{margin:'0'}}><b>{notificationInfo.email}</b></h6>
                        </div>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Created By</h6>
                            <h6 style={{margin:'0'}}><b>{notificationInfo.created_by_name}</b></h6>
                        </div>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Created At</h6>
                            <h6 style={{margin:'0'}}><b>{ notificationInfo.created_at ? formatReadableDate(notificationInfo.created_at) : 'N?A' }</b></h6>
                        </div>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Approved By</h6>
                            <h6 style={{margin:'0'}}><b>{notificationInfo.approved_by}</b></h6>
                        </div>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Approved At</h6>
                            <h6 style={{margin:'0'}}><b>{ notificationInfo.approved_at ? formatReadableDate(notificationInfo.approved_at) : 'N/A' }</b></h6>
                        </div>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>MSISDN</h6>
                            <h6 style={{margin:'0'}}><b>{ notificationInfo.msisdn }</b></h6>
                        </div>
                    </Card>
                    <Card>
                        <CardBody>
                            <h6>Notification Image</h6>
                            <img className='mb-1' width={'60%'} src={notificationInfo.image_url}/>
                        </CardBody>
                    </Card>
            </ModalBody>
        </Modal>
    )
}
export default ViewModal