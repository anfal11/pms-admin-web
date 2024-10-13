import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../../../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const ViewModal = ({ modal1, toggleModal1, complainInfo}) => {

    return (
        <Modal isOpen={modal1} toggle={toggleModal1} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal1}>Complain Details</ModalHeader>
            <ModalBody>
                    <Card>
                        <CardBody>
                                <h2 className='mb-2'><b>{complainInfo.complain_title}</b></h2>
                                <h6>{complainInfo.complain_description}</h6>
                        </CardBody>
                    </Card>
                    <Card>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Category</h6>
                            <h6 style={{margin:'0'}}><b>{complainInfo.category}</b></h6>
                        </div>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Priority</h6>
                            <h6 style={{margin:'0'}}><b>{complainInfo.complain_priority}</b></h6>
                        </div>
                        <div className='d-flex justify-content-between border-bottom p-1'>
                            <h6 style={{margin:'0'}}>Assign To</h6>
                            <h6 style={{margin:'0'}}><b>{complainInfo.assign_to ? complainInfo.assign_to : 'Not assigned'}</b></h6>
                        </div>
                        <div className='d-flex justify-content-between p-1'>
                            <h6 style={{margin:'0'}}>Status</h6>
                            <h6 style={{margin:'0'}}><b>{complainInfo.status}</b></h6>
                        </div>
                    </Card>
                    <Card>
                        <CardBody>
                            <h6>Complain Image</h6>
                            <img className='mb-1' width={'60%'} src={complainInfo.image_url}/>
                        </CardBody>
                    </Card>
            </ModalBody>
        </Modal>
    )
}
export default ViewModal