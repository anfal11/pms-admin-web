import { Fragment, useState, useEffect, useRef } from 'react'
import {
    ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical,
    Edit, Archive, Trash, Search, ChevronLeft, Eye, XCircle, Facebook, Globe, Instagram, Twitter
} from 'react-feather'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, UncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, Progress, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import { Error, Success, ErrorMessage } from '../../viewhelper'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors, transformInToFormObject } from '@utils'

const EditModal = ({ modal, toggleModal, subUserInfo, setsubUserInfo, setReset, resetData }) => {
    // const BusinessList = JSON.parse(localStorage.getItem('customerBusinesses'))
    const [addUserloading, setaddUserloading] = useState(false)
    // const [subUserInfo, setsubUserInfo] = useState({
    //     mobile: '',
    //     email: '',
    //     firstname: '',
    //     lastname: '',
    //     business_id: BusinessList[0].id
    // })
    const [error, seterror] = useState({
        email: false
    })

    const handleChange = (e) => {
        const chkEmail = /\S+@\S+\.\S+/.test(e.target.value)
        // Email Validator
        if (e.target.name === 'email' && chkEmail) {
            seterror({ ...error, email: false })
        }
        if (e.target.name === 'email' && !chkEmail) {
            seterror({ ...error, email: true })
        }
        setsubUserInfo({ ...subUserInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const { mobileno, email, firstname, lastname, userstatus } = subUserInfo
        const chkEmail = /\S+@\S+\.\S+/.test(email)

        if (!chkEmail) {
            return 0
        }
        console.log({ mobile: mobileno, email, firstname, lastname, subusertype: 12, userstatus })
        setaddUserloading(true)
        useJwt.editSubUserVendor({ mobile: mobileno, email, firstname, lastname, subusertype: 12, userstatus }).then(res => {
            setReset(!resetData)
            setaddUserloading(false)
            console.log(res)
            toggleModal()
            Success(res)
        }).catch(err => {
            setaddUserloading(false)
            Error(err)
            console.log(err)
        })
    }
    return (
        <Modal isOpen={modal} toggle={toggleModal} className='modal-dialog-centered'>
            <ModalHeader toggle={toggleModal}>Edit subUser</ModalHeader>
            <ModalBody>
                <Form className="row" style={{ width: '100%' }} onSubmit={onSubmit} autoComplete="off">
                    {/* {BusinessList.length > 1 && <Col sm="6" >
                        <FormGroup>
                            <Label for="Business">Select a Business</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={BusinessList.map(x => { return { value: x.id, label: x.businessname } })[0]}
                                onChange={(selected) => {
                                    setsubUserInfo({ ...subUserInfo, business_id: selected.value })
                                }}
                                options={BusinessList.map(x => { return { value: x.id, label: x.businessname } })}
                            />
                        </FormGroup>
                    </Col>} */}
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="firstname">Firstname</Label>
                            <Input type="text"
                                name="firstname"
                                id='firstname'
                                value={subUserInfo.firstname}
                                onChange={handleChange}
                                required
                                placeholder="Jhon "
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="lastname">Lastname</Label>
                            <Input type="text"
                                name="lastname"
                                id='lastname'
                                value={subUserInfo.lastname}
                                onChange={handleChange}
                                required
                                placeholder="Doe"
                            />
                        </FormGroup>
                    </Col>

                    <Col sm="6" >
                        <FormGroup>
                            <Label for="mobileno">Mobile Number </Label>
                            <Input type="text"
                                disabled
                                minLength={10}
                                maxLength={10}
                                name="mobileno"
                                id='mobileno'
                                value={subUserInfo.mobileno}
                                onChange={handleChange}
                                required
                                placeholder="123 4567"
                            />
                        </FormGroup>
                    </Col>

                    <Col sm="6" >
                        <FormGroup>
                            <Label for="Email">Email</Label>
                            <Input type="email"
                                name="email"
                                id='Email'
                                value={subUserInfo.email}
                                onChange={handleChange}
                                required
                                placeholder="Example@gmail.com"
                            />
                            {error.email && subUserInfo.email && <span style={{ color: 'red', fontSize: '11px' }}>Please Enter a valid Email</span>}
                        </FormGroup>
                    </Col>
                    <Col sm="6" >
                        <FormGroup>
                            <Label for="Business">Status</Label>
                            <Select
                                theme={selectThemeColors}
                                maxMenuHeight={200}
                                className='react-select'
                                classNamePrefix='select'
                                value={{ value: subUserInfo.userstatus, label: subUserInfo.userstatus ? 'Active' : 'Inactive' }}
                                onChange={(selected) => {
                                    setsubUserInfo({ ...subUserInfo, userstatus: selected.value })
                                }}
                                options={[{ value: 0, label: 'Inactive' }, { value: 1, label: 'Active' }]}
                            />
                        </FormGroup>
                    </Col>

                    <Col sm="12" className='text-center'>
                        {
                            addUserloading ? <Button.Ripple color='primary' className='mr-1' disabled style={{ marginTop: '25px' }}>
                                <Spinner color='white' size='sm' />
                                <span className='ml-50'>Loading...</span>
                            </Button.Ripple> : <Button.Ripple className='ml-2' color='primary' type="submit" style={{ marginTop: '25px' }}>
                                <span >Submit</span>
                            </Button.Ripple>
                        }
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
    )
}
export default EditModal