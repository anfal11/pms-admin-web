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

const EditModal = ({ modal, toggleModal, complainInfo, setComplainInfo, setReset, resetData }) => {
    const [editPointRuleloading, seteditPointRuleloading] = useState(false)

    const handleChange = (e) => {
        setComplainInfo({ ...complainInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        seteditPointRuleloading(true)
        useJwt.editComplain(complainInfo).then(res => {
            setReset(!resetData)
            seteditPointRuleloading(false)
            toggleModal()
            console.log(res)
            Success(res)
        }).catch(err => {
            seteditPointRuleloading(false)
            Error(err)
            console.log(err)
        })
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal}>Edit Complain</ModalHeader>
            <ModalBody>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    <Col sm="6" >
                            <FormGroup>
                                <Label for="assign_to">Assign To</Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: complainInfo.assign_to, label: complainInfo.assign_to ? complainInfo.assign_to : 'select a name'}}
                                    onChange={(selected) => {
                                        setComplainInfo({ ...complainInfo, assign_to: selected.value })
                                    }}
                                    options={[{value: 'Jabed', label: 'Jabed'}, {value: 'Mohit', label: 'Mohit'}, {value: 'Onkit', label: 'Onkit'}]}
                                />
                            </FormGroup>
                        </Col> 
                    <Col sm="6" >
                            <FormGroup>
                                <Label for="status">Status</Label>
                                <Select
                                    theme={selectThemeColors}
                                    maxMenuHeight={200}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={{ value: complainInfo.status, label: complainInfo.status ? complainInfo.status : 'select a status'}}
                                    onChange={(selected) => {
                                        setComplainInfo({ ...complainInfo, status: selected.value })
                                    }}
                                    options={[{value: 'pending', label: 'Pending'}, {value: 'in_progress', label: 'In Progress'}, {value: 'solved', label: 'Solved'}]}
                                />
                            </FormGroup>
                        </Col> 
                    <Col sm="12" className='text-center'>
                        {
                            editPointRuleloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Update</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
    )
}
export default EditModal